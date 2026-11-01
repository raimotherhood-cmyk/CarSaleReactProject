# Website Assets

This is the single output directory for original website illustrations, local replacement photos, bundled icons, and PDF fonts.

## Preparation

`npm run dev` and `npm run build` prepare assets through [../../scripts/prepare-assets.mjs](../../scripts/prepare-assets.mjs). Original bitmap scenes are drawn by [../../scripts/artwork.mjs](../../scripts/artwork.mjs) using the local canvas renderer. Icons use the installed Lucide package. No image service, remote photo, or image-download fallback is used.

[manifest.json](manifest.json) records each visual's unique descriptive filename, dimensions, alternative text, and either an `artwork` scene key or a local `source`. Replacement image sources must be under `src/assets` or `public/Assets` and stay inside the project.

The current set contains 21 PNG files: three hero/social compositions, a stylized portrait, 15 distinct media/marketing scenes, a product image illustration, and the brand emblem. The emblem is rasterized locally at 128 x 128 pixels. Billboards, digital screens, buses, shelters, kiosks, railway stations, search/maps, social calendars, launches, and research each have contextual artwork. The portrait is a stylized placeholder, not Sudhakar Rai's actual likeness.

Filenames use lowercase kebab-case and name the subject and role, for example `railway-station-advertising-artwork.png` and `vision-advertising-aperture-emblem-icon.png`. Asset keys remain stable. Numbered legacy source photos and obsolete cached SVGs are left untouched and are not published. Normal inline interface icons remain scalable components; the artwork files in this manifest are PNGs.

PNG artwork is not ignored by Git. In a local checkout, run `npm run prebuild` to create the actual files here and include the files when publishing your project. VS Code's virtual GitHub view cannot receive binary writes from the current editing tools; PNGs generated in a separate local checkout do not automatically appear in that virtual repository.

## Updating Artwork

Edit the palette or scene composition in [../../scripts/artwork.mjs](../../scripts/artwork.mjs) to change the illustrations. The `.artwork-cache.json` record tracks the renderer version and generated file hashes. Unmodified generated files refresh when the drawing code changes; manually changed or untracked files are preserved. To regenerate a preserved file, remove that generated file deliberately and run preparation again.

For genuine photography, add an authorized local image and replace the corresponding entry with a `source` instead of `artwork`. Entries in `images` override `placeholders` with the same key, without changing page code. Set `isPlaceholder` to false to remove the concept-artwork label.

For example, after adding an authorized portrait at `src/assets/sudhakar-rai-marketing-head-portrait.jpg`, add this entry inside `images` in [manifest.json](manifest.json):

```json
"sudhakarRai": {
	"file": "sudhakar-rai-marketing-head-portrait.jpg",
	"source": "src/assets/sudhakar-rai-marketing-head-portrait.jpg",
	"alt": "Sudhakar Rai, Marketing Head at Vision Advertising",
	"width": 480,
	"height": 600,
	"isPlaceholder": false
}
```

Use the actual image dimensions. No About-page code changes are required. The same process works for media keys such as `billboards`, `train-branding`, or `meta-ads`. Replacing the `hero`, `heroSmall`, and `social` entries updates those image positions. Only the active asset files are published, so an overridden placeholder is not shipped.

PDF font preparation is separate. The standard Latin PDF font and locally cached Noto Sans Devanagari regular/bold fallbacks are retained. Missing Noto fonts can still be retrieved from the existing approved source; their SHA-256 fingerprints and license are pinned in the manifest. `.cache.json` applies to these font files, not to project images.

## Licensing

The project owner must confirm publication rights for images supplied with the project. Being present in the repository does not itself establish a copyright license. Images are illustrative and are not represented as Vision Advertising's client portfolio or inventory. Customer-supplied images also require authorization.

The bitmap illustrations are original local drawing compositions. The canvas renderer's MIT notice is retained in `CANVAS-LICENSE.txt`; Lucide's ISC notice is retained in `LUCIDE-LICENSE.txt` for the brand emblem and interface icons. The generated `credits.html` records these sources. No external image content is used.

The Noto fonts use the SIL Open Font License 1.1, which permits embedding and redistribution. The full copyright and license notice is retained in `noto-fonts-license.txt`; that license does not impose restrictions on the generated campaign PDF.

Only configured image/font files and the required icon, license, and credit files are copied to production. Old downloaded stock files or unused images that remain in a local cache are not published.