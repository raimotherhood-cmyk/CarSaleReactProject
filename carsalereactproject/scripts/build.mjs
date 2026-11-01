import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { build, loadEnv } from "vite";
import content from "../src/config/site.json" with { type: "json" };
import { createRobots, resolveSiteUrl } from "../src/seo.js";

const root = fileURLToPath(new URL("../", import.meta.url));
const output = join(root, "dist");
const mode = "production";
const env = loadEnv(mode, root, "VITE_");
const siteUrl = resolveSiteUrl(env.VITE_SITE_URL?.trim() || content.seo.siteUrl);
const allowedPaths = new Set(["/", "/about", "/contact"]);
if (content.seo.pages.some(page => !allowedPaths.has(page.path))) throw new Error("SEO pages must match the supported public routes.");
if (new Set(content.seo.pages.map(page => page.path)).size !== 3) throw new Error("Configure all three public pages exactly once.");

await build({ root, mode });
const manifest = JSON.parse(await readFile(join(output, ".vite/manifest.json"), "utf8"));
const entry = manifest["index.html"];
if (!entry?.file) throw new Error("Missing production entry in the Vite manifest.");
const styles = new Set();
const visited = new Set();
function collectStyles(key) {
    if (visited.has(key)) return;
    visited.add(key);
    for (const stylesheet of manifest[key]?.css || []) styles.add(`/${stylesheet}`);
    for (const dependency of manifest[key]?.imports || []) collectStyles(dependency);
}
collectStyles("index.html");

const serverOutput = join(root, "dist-ssr");
await build({ root, mode, build: { ssr: "src/entry-server.js", outDir: serverOutput, manifest: false, copyPublicDir: false, rollupOptions: { output: { entryFileNames: "entry-server.mjs" } } } });
try {
    const { renderPage } = await import(pathToFileURL(join(serverOutput, "entry-server.mjs")).href);
    const bundles = { script: `/${entry.file}`, styles: [...styles] };
    const options = { siteUrl, email: env.VITE_ENQUIRY_EMAIL || content.contact.email };
    for (const page of content.seo.pages) {
        const directory = page.path === "/" ? output : join(output, page.path.slice(1));
        await mkdir(directory, { recursive: true });
        const html = renderPage(page.path, bundles, options);
        await writeFile(join(directory, "index.html"), html);
        if (page.path !== "/") await writeFile(join(output, `${page.path.slice(1)}.html`), html);
    }
    await writeFile(join(output, "404.html"), renderPage("/404", bundles, options));
    for (const pathname of ["/login", "/register"]) {
        const directory = join(output, pathname.slice(1));
        await mkdir(directory, { recursive: true });
        const html = renderPage(pathname, bundles, options);
        await writeFile(join(directory, "index.html"), html);
        await writeFile(join(output, `${pathname.slice(1)}.html`), html);
    }
} finally {
    await rm(serverOutput, { recursive: true, force: true });
}

await cp(join(root, "public/Assets"), join(output, "Assets"), { recursive: true });
await rm(join(output, "Assets/.cache.json"), { force: true });
await rm(join(output, ".vite"), { recursive: true, force: true });
await writeFile(join(output, "robots.txt"), createRobots(siteUrl));
const urls = siteUrl ? content.seo.pages.map(page => createElement("url", { key: page.path }, createElement("loc", null, `${siteUrl}${page.path}`))) : [];
await writeFile(join(output, "sitemap.xml"), '<?xml version="1.0" encoding="UTF-8"?>\n' + renderToStaticMarkup(createElement("urlset", { xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9" }, ...urls)) + "\n");
console.log(`Pre-rendered ${content.seo.pages.length} public pages, private noindex pages, 404, robots.txt, and sitemap.xml.`);
if (!siteUrl) console.log("Indexing is disabled. Set VITE_SITE_URL to the production origin before publishing.");