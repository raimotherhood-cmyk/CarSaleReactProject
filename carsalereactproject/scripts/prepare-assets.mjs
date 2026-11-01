import { createHash } from "node:crypto";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as tls from "node:tls";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Aperture, Image } from "lucide-react";

const directory = fileURLToPath(new URL("../public/Assets/", import.meta.url));
const manifest = JSON.parse(await readFile(join(directory, "manifest.json"), "utf8"));
const site = JSON.parse(await readFile(new URL("../src/config/site.json", import.meta.url), "utf8"));
if (tls.setDefaultCACertificates && tls.getCACertificates) {
    tls.setDefaultCACertificates([...new Set([...tls.getCACertificates("default"), ...tls.getCACertificates("system")])]);
}
const cachePath = join(directory, ".cache.json");
const cache = await readFile(cachePath, "utf8").then(JSON.parse).catch(error => {
    if (error.code === "ENOENT") return {};
    throw error;
});
const digest = buffer => createHash("sha256").update(buffer).digest("hex");
const isWebp = buffer => buffer.length > 12 && buffer.subarray(0, 4).toString() === "RIFF" && buffer.subarray(8, 12).toString() === "WEBP";
const isFont = buffer => buffer.length > 12 && (buffer.readUInt32BE(0) === 0x00010000 || buffer.subarray(0, 4).toString() === "OTTO");
const downloads = [...Object.values(manifest.images), ...Object.values(manifest.fonts || {})];

await mkdir(directory, { recursive: true });
for (const image of downloads) {
    if (!/^[a-z0-9-]+\.(webp|ttf|txt)$/.test(image.file)) throw new Error(`Invalid asset filename: ${image.file}`);
    const photo = image.file.endsWith(".webp");
    const font = image.file.endsWith(".ttf");
    const validAsset = photo ? isWebp : font ? isFont : buffer => buffer.toString("utf8").includes("SIL OPEN FONT LICENSE");
    const url = new URL(image.url);
    const approved = photo ? url.hostname === "images.unsplash.com" : url.hostname === "raw.githubusercontent.com" && url.pathname.startsWith("/notofonts/noto-fonts/");
    if (url.protocol !== "https:" || !approved) throw new Error(`Unapproved asset host: ${url.hostname}`);
    const destination = join(directory, image.file);
    const expectedDigest = manifest.integrity?.[image.file];
    const existing = await readFile(destination).catch(error => {
        if (error.code === "ENOENT") return null;
        throw error;
    });
    if (existing && validAsset(existing) && cache[image.file]?.url === image.url && cache[image.file].sha256 === digest(existing) && (!expectedDigest || expectedDigest === cache[image.file].sha256)) continue;

    const response = await fetch(url, { signal: AbortSignal.timeout(30000), headers: { Accept: photo ? "image/webp" : "*/*" } });
    if (!response.ok) throw new Error(`Cannot prepare ${image.file}: HTTP ${response.status}. Retry later; existing assets were kept.`);
    if (Number(response.headers.get("content-length")) > 5000000) throw new Error(`Asset exceeds size limit: ${image.file}`);
    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.length > 5000000 || !validAsset(buffer)) throw new Error(`Invalid asset: ${image.file}`);
    const sha256 = digest(buffer);
    if (expectedDigest && expectedDigest !== sha256) throw new Error(`Asset integrity mismatch: ${image.file}`);
    await writeFile(destination, buffer);
    cache[image.file] = { url: image.url, sha256, bytes: buffer.length };
    await writeFile(cachePath, JSON.stringify(cache, null, 2) + "\n");
    console.log(`Prepared ${image.file} (${Math.round(buffer.length / 1024)} KB)`);
}

await writeFile(join(directory, manifest.icons.brand), renderToStaticMarkup(createElement(Aperture, { xmlns: "http://www.w3.org/2000/svg", width: 48, height: 48, color: "#202720", style: { background: "#d7fa64", padding: 6 }, "aria-label": site.brand.name })));
await writeFile(join(directory, manifest.icons.placeholder), renderToStaticMarkup(createElement(Image, { xmlns: "http://www.w3.org/2000/svg", width: 640, height: 360, color: "#72816a", strokeWidth: 1, style: { background: "#eef0e9", padding: 90 }, "aria-label": "Image unavailable" })));

const require = createRequire(import.meta.url);
const iconLicense = await readFile(join(dirname(require.resolve("lucide-react/package.json")), "LICENSE"), "utf8");
await writeFile(join(directory, "LUCIDE-LICENSE.txt"), iconLicense);
const sources = [...new Map(Object.values(manifest.images).map(image => [image.source, image])).values()];
const credits = createElement("html", { lang: "en" },
    createElement("head", null,
        createElement("meta", { charSet: "utf-8" }),
        createElement("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }),
        createElement("meta", { name: "robots", content: "noindex,follow" }),
        createElement("title", null, `${site.footer.imageCredits} | ${site.brand.name}`)),
    createElement("body", { style: { fontFamily: "sans-serif", maxWidth: 760, margin: "40px auto", padding: "0 20px", lineHeight: 1.8, overflowWrap: "anywhere" } },
        createElement("main", null,
            createElement("h1", null, "Image Sources and Licenses"),
            createElement("p", null, manifest.license.notice),
            createElement("p", null, manifest.license.terms),
            createElement("a", { href: manifest.license.url }, manifest.license.name),
            createElement("ul", null, ...sources.map(image => createElement("li", { key: image.source }, createElement("a", { href: image.source }, image.alt)))),
            createElement("p", null, "Photos are resized and cropped for display. Source URLs and SHA-256 fingerprints are retained with the local assets."),
            createElement("p", null, "Icons: ", createElement("a", { href: "LUCIDE-LICENSE.txt" }, "Lucide, ISC License")),
            createElement("p", null, "PDF fonts: ", createElement("a", { href: "noto-fonts-license.txt" }, "Noto Sans Devanagari, SIL Open Font License 1.1")),
            createElement("a", { href: "/" }, site.notFound.action))));
await writeFile(join(directory, "credits.html"), "<!doctype html>" + renderToStaticMarkup(credits));
console.log("Local assets and license records are ready in public/Assets.");