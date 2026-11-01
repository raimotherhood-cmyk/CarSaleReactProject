import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { createHash } from "node:crypto";
import { renderArtwork } from "./artwork.mjs";
import { getBaseHeadTags } from "../src/seo.js";
import * as bundledIcons from "lucide-react";
import manifest from "../public/Assets/manifest.json" with { type: "json" };
import content from "../src/config/site.json" with { type: "json" };

const root = resolve(fileURLToPath(new URL("../", import.meta.url)));

test("website images are original local artwork or existing project files", async () => {
    for (const image of Object.values(manifest.images)) {
        assert.equal(image.url, undefined, `Remove the download URL for ${image.file}.`);
        if (image.artwork) {
            assert.match(image.artwork, /^[a-z]+(?:-[a-z]+)*$/);
            assert.equal(image.source, undefined);
        } else {
            assert.match(image.source, /^(src\/assets|public\/Assets)\//);
            const source = resolve(root, image.source);
            assert.ok(source.startsWith(root + sep));
            const bytes = await readFile(source);
            assert.ok(bytes.length > 0, `Missing image content: ${image.source}`);
        }
        assert.match(image.file, /^[a-z0-9-]+\.(png|jpe?g|webp)$/);
        assert.ok(image.alt && image.width > 0 && image.height > 0);
    }
});

test("media cards reference project images or bundled icon components", () => {
    const availableImages = { ...manifest.placeholders, ...manifest.images };
    for (const format of content.mediaFormats) {
        assert.ok(availableImages[format.asset || format.id], `Missing replaceable media image: ${format.id}`);
        assert.ok(bundledIcons[format.icon], `Unknown bundled icon: ${format.icon}`);
    }
    assert.match(manifest.icons.source, /^node_modules\//);
    assert.ok(bundledIcons.Aperture);
    assert.ok(bundledIcons.Image);
});

test("hero and social preview use the same project asset registry", () => {
    for (const key of ["hero", "heroSmall", "social"]) assert.ok(manifest.images[key]);
    assert.ok(!JSON.stringify(manifest.images).includes("https://"));
});

test("local placeholders cover the leadership portrait and each media type", () => {
    assert.ok(manifest.placeholders[content.about.leadership.portraitAsset]);
    const files = new Set();
    for (const placeholder of Object.values(manifest.placeholders)) {
        assert.equal(placeholder.url, undefined);
        assert.match(placeholder.file, placeholder.artwork ? /^[a-z0-9-]+\.png$/ : /^[a-z0-9-]+\.svg$/);
        assert.ok(bundledIcons[placeholder.icon]);
        assert.match(placeholder.alt, /placeholder|illustration/i);
        assert.ok(placeholder.width > 0 && placeholder.height > 0);
        assert.equal(files.has(placeholder.file), false, "Each placeholder should have its own replaceable file.");
        files.add(placeholder.file);
    }
});

test("served image and icon filenames are descriptive and unique", () => {
    const names = [
        ...Object.values({ ...manifest.placeholders, ...manifest.images }).map(image => image.file),
        manifest.icons.brand,
        manifest.icons.placeholder,
    ];
    assert.equal(new Set(names.map(name => name.toLowerCase())).size, names.length, "Every served image/icon must have its own filename.");
    for (const name of names) {
        assert.match(name, /^[a-z]+(?:-[a-z0-9]+){2,}\.(jpg|jpeg|png|webp|svg)$/, `Use a descriptive, lowercase kebab-case filename: ${name}`);
    }
});

test("every contextual artwork renders a valid distinct local PNG", () => {
    const definitions = [
        ...Object.values({ ...manifest.placeholders, ...manifest.images }),
        { ...manifest.icons.placeholderArtwork, file: manifest.icons.placeholder },
    ].filter(asset => asset.artwork);
    const fingerprints = new Set();
    for (const asset of definitions) {
        const bytes = renderArtwork(asset.artwork, asset.width, asset.height);
        assert.ok(bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])));
        assert.equal(bytes.readUInt32BE(16), asset.width);
        assert.equal(bytes.readUInt32BE(20), asset.height);
        assert.ok(bytes.length > 3000, `Artwork is unexpectedly empty: ${asset.file}`);
        const fingerprint = createHash("sha256").update(bytes).digest("hex");
        assert.equal(fingerprints.has(fingerprint), false, `Duplicate artwork: ${asset.file}`);
        fingerprints.add(fingerprint);
    }
    assert.equal(definitions.length, 20);
    assert.throws(() => renderArtwork("unknown", 900, 780));
});

test("all active artwork files and the favicon use PNG", () => {
    const files = [
        ...Object.values({ ...manifest.placeholders, ...manifest.images }).map(asset => asset.file),
        manifest.icons.brand,
        manifest.icons.placeholder,
    ];
    assert.equal(files.length, 21);
    assert.ok(files.every(file => file.endsWith(".png")));
    const favicon = getBaseHeadTags().find(tag => tag.attrs.rel === "icon");
    assert.equal(favicon.attrs.type, "image/png");
    assert.equal(favicon.attrs.href, `/Assets/${manifest.icons.brand}`);
});