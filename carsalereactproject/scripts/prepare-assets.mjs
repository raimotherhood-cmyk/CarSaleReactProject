import { createHash } from "node:crypto";
import { copyFile, readFile, writeFile, mkdir } from "node:fs/promises";
import { constants } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import * as tls from "node:tls";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Aperture, BusFront, Image, MapPin, Megaphone, Presentation, RectangleHorizontal, Rocket, Search, TrainFront, UserRound } from "lucide-react";
import { renderArtwork } from "./artwork.mjs";
import { createCanvas, loadImage } from "@napi-rs/canvas";

const directory = fileURLToPath(new URL("../public/Assets/", import.meta.url));
const projectRoot = fileURLToPath(new URL("../", import.meta.url));
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
const placeholderIcons = { BusFront, MapPin, Megaphone, Presentation, RectangleHorizontal, Rocket, Search, TrainFront, UserRound };
const artworkCachePath = join(directory, ".artwork-cache.json");
const artworkCache = await readFile(artworkCachePath, "utf8").then(JSON.parse).catch(error => {
    if (error.code === "ENOENT") return {};
    throw error;
});
const artworkVersion = digest(await readFile(new URL("./artwork.mjs", import.meta.url)));

async function prepareArtwork(asset) {
    if (!/^[a-z0-9-]+\.png$/.test(asset.file)) throw new Error(`Artwork must use a descriptive PNG filename: ${asset.file}`);
    const destination = join(directory, asset.file);
    const signature = digest(JSON.stringify({ renderer: artworkVersion, scene: asset.artwork, width: asset.width, height: asset.height }));
    const existing = await readFile(destination).catch(error => {
        if (error.code === "ENOENT") return null;
        throw error;
    });
    if (existing) {
        const record = artworkCache[asset.file];
        if (!record || record.sha256 !== digest(existing)) {
            console.log(`Preserved customized local artwork: ${asset.file}`);
            return;
        }
        if (record.signature === signature) return;
    }
    const image = renderArtwork(asset.artwork, asset.width, asset.height);
    await writeFile(destination, image);
    artworkCache[asset.file] = { signature, sha256: digest(image), scene: asset.artwork, width: asset.width, height: asset.height };
    await writeFile(artworkCachePath, JSON.stringify(artworkCache, null, 2) + "\n");
    console.log(`Created original artwork: ${asset.file}`);
}

async function preserveSvg(filename, markup, previousFilename) {
    if (!/^[a-z0-9-]+\.svg$/.test(filename)) throw new Error(`Invalid SVG filename: ${filename}`);
    if (previousFilename) {
        if (!/^[a-z0-9-]+\.svg$/.test(previousFilename)) throw new Error(`Invalid previous SVG filename: ${previousFilename}`);
        await copyFile(join(directory, previousFilename), join(directory, filename), constants.COPYFILE_EXCL).catch(error => {
            if (!["ENOENT", "EEXIST"].includes(error.code)) throw error;
        });
    }
    await writeFile(join(directory, filename), markup, { flag: "wx" }).catch(error => {
        if (error.code !== "EEXIST") throw error;
    });
}

const visualNames = [
    ...Object.values({ ...manifest.placeholders, ...manifest.images }).map(image => image.file),
    manifest.icons.brand,
    manifest.icons.placeholder,
];
if (new Set(visualNames.map(name => name.toLowerCase())).size !== visualNames.length) {
    throw new Error("Every served image and icon must have a unique filename.");
}

await mkdir(directory, { recursive: true });
for (const [key, placeholder] of Object.entries(manifest.placeholders || {})) {
    if (Object.hasOwn(manifest.images, key)) continue;
    if (placeholder.artwork) {
        await prepareArtwork(placeholder);
        continue;
    }
    if (!/^[a-z0-9-]+\.svg$/.test(placeholder.file) || !Object.hasOwn(placeholderIcons, placeholder.icon)) {
        throw new Error(`Invalid local placeholder: ${key}`);
    }
    if (![placeholder.width, placeholder.height].every(value => Number.isInteger(value) && value > 0 && value <= 2400)) {
        throw new Error(`Invalid placeholder dimensions: ${key}`);
    }
    const markup = renderToStaticMarkup(createElement(placeholderIcons[placeholder.icon], {
        xmlns: "http://www.w3.org/2000/svg",
        width: placeholder.width,
        height: placeholder.height,
        viewBox: "-8 -8 40 40",
        strokeWidth: 1.1,
        color: "#335764",
        style: { backgroundColor: "#e8eff2" },
        "aria-label": placeholder.alt,
    }));
    await preserveSvg(placeholder.file, markup, placeholder.previousFile);
}

for (const image of new Map(Object.values(manifest.images).map(image => [image.file, image])).values()) {
    if (image.artwork) {
        await prepareArtwork(image);
        continue;
    }
    if (!/^[a-z0-9-]+\.(webp|png|jpe?g)$/.test(image.file)) throw new Error(`Invalid project image filename: ${image.file}`);
    if (typeof image.source !== "string" || !/^(src\/assets|public\/Assets)\//.test(image.source)) {
        throw new Error(`Image ${image.file} must reference an existing project file, not an internet URL.`);
    }
    const source = resolve(projectRoot, image.source);
    if (!source.startsWith(resolve(projectRoot) + sep)) throw new Error(`Image source is outside the project: ${image.source}`);
    const buffer = await readFile(source).catch(error => {
        if (error.code === "ENOENT") throw new Error(`Missing project image: ${image.source}. No image will be downloaded.`);
        throw error;
    });
    const jpeg = buffer[0] === 0xff && buffer[1] === 0xd8;
    const png = buffer.length > 8 && buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
    if (!jpeg && !png && !isWebp(buffer)) throw new Error(`Invalid project image: ${image.source}`);
    const destination = join(directory, image.file);
    if (source !== destination) await writeFile(destination, buffer);
    console.log(`Copied project image: ${image.source}`);
}

for (const image of Object.values(manifest.fonts || {})) {
    if (!/^[a-z0-9-]+\.(ttf|txt)$/.test(image.file)) throw new Error(`Invalid font filename: ${image.file}`);
    const font = image.file.endsWith(".ttf");
    const validAsset = font ? isFont : buffer => buffer.toString("utf8").includes("SIL OPEN FONT LICENSE");
    const url = new URL(image.url);
    const approved = url.hostname === "raw.githubusercontent.com" && url.pathname.startsWith("/notofonts/noto-fonts/");
    if (url.protocol !== "https:" || !approved) throw new Error(`Unapproved asset host: ${url.hostname}`);
    const destination = join(directory, image.file);
    const expectedDigest = manifest.integrity?.[image.file];
    const existing = await readFile(destination).catch(error => {
        if (error.code === "ENOENT") return null;
        throw error;
    });
    if (existing && validAsset(existing) && cache[image.file]?.url === image.url && cache[image.file].sha256 === digest(existing) && (!expectedDigest || expectedDigest === cache[image.file].sha256)) continue;

    const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
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

const brandIcon = createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: 64, height: 64, viewBox: "0 0 64 64", "aria-label": site.brand.name },
    createElement("rect", { width: 64, height: 64, rx: 6, fill: "#14232b" }),
    createElement(Aperture, { x: 10, y: 10, width: 44, height: 44, color: "#d7fa64", strokeWidth: 1.6 }));
if (manifest.icons.brand.endsWith(".png")) {
    if (!/^[a-z0-9-]+\.png$/.test(manifest.icons.brand)) throw new Error("Invalid PNG icon filename.");
    let artwork = Buffer.from(renderToStaticMarkup(brandIcon));
    if (manifest.icons.previousBrand) {
        if (!/^[a-z0-9-]+\.svg$/.test(manifest.icons.previousBrand)) throw new Error("Invalid local icon source filename.");
        artwork = await readFile(join(directory, manifest.icons.previousBrand)).catch(error => {
            if (error.code === "ENOENT") return artwork;
            throw error;
        });
    }
    const canvas = createCanvas(128, 128);
    canvas.getContext("2d").drawImage(await loadImage(artwork), 0, 0, 128, 128);
    await writeFile(join(directory, manifest.icons.brand), canvas.toBuffer("image/png"), { flag: "wx" }).catch(error => {
        if (error.code !== "EEXIST") throw error;
    });
} else {
    await preserveSvg(manifest.icons.brand, renderToStaticMarkup(brandIcon), manifest.icons.previousBrand);
}
if (manifest.icons.placeholderArtwork) {
    await prepareArtwork({ ...manifest.icons.placeholderArtwork, file: manifest.icons.placeholder });
} else {
    await preserveSvg(manifest.icons.placeholder, renderToStaticMarkup(createElement(Image, { xmlns: "http://www.w3.org/2000/svg", width: 640, height: 360, color: "#72816a", strokeWidth: 1, style: { background: "#eef0e9", padding: 90 }, "aria-label": "Image unavailable" })), manifest.icons.previousPlaceholder);
}

const require = createRequire(import.meta.url);
const iconLicense = await readFile(join(dirname(require.resolve("lucide-react/package.json")), "LICENSE"), "utf8");
await writeFile(join(directory, "LUCIDE-LICENSE.txt"), iconLicense);
const canvasLicense = await readFile(join(dirname(require.resolve("@napi-rs/canvas")), "LICENSE"), "utf8");
await writeFile(join(directory, "CANVAS-LICENSE.txt"), canvasLicense);
const sources = Object.values({ ...manifest.placeholders, ...manifest.images });
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
            createElement("p", null, manifest.license.name),
            createElement("ul", null, ...sources.map(image => createElement("li", { key: image.file }, createElement("a", { href: image.file }, image.alt), createElement("p", null, image.artwork ? `Original local illustration: ${image.artwork}` : `Project source: ${image.source}`)))),
            createElement("p", null, "Illustrations are drawn locally by the project's artwork code. No image service, stock-photo API, or remote image is used."),
            createElement("p", null, "Portrait artwork is stylized and is not an actual likeness. Campaign scenes are concepts, not photographs of completed client projects."),
            createElement("p", null, "Local bitmap renderer: ", createElement("a", { href: "CANVAS-LICENSE.txt" }, "@napi-rs/canvas, MIT License")),
            createElement("p", null, "Icons: ", createElement("a", { href: "LUCIDE-LICENSE.txt" }, "Lucide, ISC License")),
            createElement("p", null, "PDF fonts: ", createElement("a", { href: "noto-fonts-license.txt" }, "Noto Sans Devanagari, SIL Open Font License 1.1")),
            createElement("a", { href: "/" }, site.notFound.action))));
await writeFile(join(directory, "credits.html"), "<!doctype html>" + renderToStaticMarkup(credits));
console.log("Local assets and license records are ready in public/Assets.");