# Website Assets

This is the single directory for the website's rendered image files and PDF fonts, including WebP photographs, responsive hero variants, the social preview, favicon, and product placeholder.

## Preparation

`npm run dev` and `npm run build` prepare assets automatically through [../../scripts/prepare-assets.mjs](../../scripts/prepare-assets.mjs). The first run needs internet access; subsequent runs reuse validated cached files. Generated binaries are ignored by Git so virtual GitHub workspaces can retain the configuration without attempting binary edits.

[manifest.json](manifest.json) records each filename, source, dimensions, alternative text, and expected SHA-256 checksum. `.cache.json` records the exact downloaded URL, checksum, and byte count. An unexpected file or checksum mismatch stops preparation rather than silently publishing a changed image.

To replace imagery, use an authorized source, update its manifest entry and reviewed checksum, and rebuild. Keep every deployed image under this directory. The current automatic downloader accepts HTTPS WebP sources from `images.unsplash.com`; do not add unverified sample-image links to components.

PDF generation uses the standard Latin PDF font with locally stored Noto Sans Devanagari regular/bold fallbacks. The preparation script accepts those TTF files and the license notice only from the Noto project's approved GitHub path. Their SHA-256 fingerprints are pinned in the manifest.

## Licensing

The Unsplash License at https://unsplash.com/license was checked on 1 November 2026. It allows commercial and non-commercial copying, modification, distribution, and use. It does not permit selling substantially unmodified copies or compiling a competing image service. Attribution is appreciated, though not required by that license.

Source URLs are retained for the original photographs. The images are resized and cropped for display. They illustrate media formats and are not represented as Vision Advertising's client portfolio or inventory.

Separate permissions may apply to people, trademarks, or artwork depicted in photographs. Confirm these for the intended campaign use. Customer-supplied images require the customer's authorization.

The generated SVG icons use Lucide. Its full ISC notice is retained in `LUCIDE-LICENSE.txt`. The generated `credits.html` provides a public source-and-license page linked from the footer.

The Noto fonts use the SIL Open Font License 1.1, which permits embedding and redistribution. The full copyright and license notice is retained in `noto-fonts-license.txt`; that license does not impose restrictions on the generated campaign PDF.

Only this assets directory is copied to production. The older, unused source images and the old root-level logo are retained in the repository but are not shipped by the website build.