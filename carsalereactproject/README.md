# VISION ADVERTISING

Your Brand. Our Vision. Greater Reach.

A React 19 and Vite website for a Mumbai-based advertising and marketing company, with outdoor media browsing, eight expertise areas, company leadership, mission and vision, and a campaign-brief workflow.

## Development

Use Node.js 22.12 or newer; Node.js 24 LTS is recommended. From this directory:

```sh
npm ci
npm run dev
```

The configured development port is 50984. Vite prints the actual address and selects another port if it is occupied.

Development starts and builds generate original contextual artwork in `public/Assets` using the local drawing code in [scripts/artwork.mjs](scripts/artwork.mjs). Images and icons are not downloaded: illustrations are drawn locally, and interface glyphs come from the installed Lucide package. Genuine replacement photos must already exist inside the project.

All 21 active artwork files, including the brand emblem, are PNGs. They are no longer excluded by Git and are physically created in the local checkout's `public/Assets` folder. Binary files generated in a local checkout are not automatically uploaded to a virtual GitHub workspace.

PDF fonts are handled separately: their existing preparation step can fetch the licensed Noto files if they are not cached locally. HTTPS certificate verification remains enabled; on older Node versions behind a corporate proxy, configure `NODE_EXTRA_CA_CERTS` with the trusted CA if needed.

```sh
npm run build
npm run preview
```

The build pre-renders complete HTML for Home, About, and Contact, so their content is available before JavaScript runs. It also creates private no-index pages, a 404 page, `robots.txt`, and `sitemap.xml`.

Deploy `dist` to a static host that serves `/about/index.html` and `/contact/index.html` for those routes. Serve the generated `404.html` with a 404 status for unknown public URLs. Do not rewrite the pre-rendered public routes to the home page. The existing account routes still need the original backend and appropriate host routing.

## Content

- [src/config/site.json](src/config/site.json) is the content configuration: branding, contact details, navigation, services, page copy, form labels, budgets, and SEO descriptions.
- [public/Assets/manifest.json](public/Assets/manifest.json) defines artwork scene keys or local replacement image paths, unique filenames, alternative text, the installed icon package, and PDF font records. Do not add image download URLs or CDN icon references.
- [src/siteContent.js](src/siteContent.js) adapts those data files for React. Components contain layout and behavior rather than marketing copy.

Edit the configuration and rebuild to publish changes. Keep service IDs and public route paths stable. Services are described on Home; About links to them and owns the company profile, personal message, mission, vision, and approach. Brand identification and essential navigation are intentionally shared.

## Search Engines

Set `VITE_SITE_URL` to the real production origin before publishing, for example `https://www.example.com` with your own domain substituted. It can also be set as `seo.siteUrl` in the content configuration. Do not include a path, query string, or fragment.

Without a production origin, pages and robots are deliberately set to no-index. Once configured, the build creates clean canonical URLs, a public-page sitemap, Open Graph and Twitter metadata, and Organization, WebSite, WebPage, and breadcrumb structured data. Private and unknown routes remain no-index. Metadata updates during client-side navigation too.

Page titles and descriptions are individually configurable under `seo.pages`. This supplies technical SEO foundations, not a guarantee of search rankings.

## Enquiries

The form groups contact details, campaign requirements, and objectives. On valid submission it opens the visitor's default email application with a complete draft addressed to maharastravision@gmail.com. The visitor must review it and press Send. React does not have a built-in email-sending service, and the website cannot confirm delivery or send silently without a mail service/backend. No email credentials or submission backend are used.

After preparing a brief, visitors can reopen the email draft, edit their details, or download a branded A4 PDF. The PDF includes all entered information, the preparation time, recipient, consent, page numbers, and an explicit unverified-delivery notice. It is created locally by a dynamically loaded `@react-pdf/renderer` module; form information is not uploaded. Long notes paginate automatically, and locally licensed Noto fonts support Devanagari alongside the standard Latin PDF font.

The PDF is a separate download; `mailto:` cannot attach it automatically. A configured email application or webmail handler is required for the handoff. Browser and mail-client URL limits can affect very long or heavily encoded drafts, so the PDF provides a complete copy independent of the email application.

The optional `VITE_ENQUIRY_EMAIL` build-time variable overrides the configured email address. See [.env.example](.env.example). Vite environment variables are public; do not put credentials in them. Without JavaScript, visitors can use the phone and email links; brief submission is disabled to avoid putting personal details into URL query strings.

The original account and product routes are retained and still depend on their original backend. This redesign does not replace or secure that backend.

## Checks

```sh
npm test
npm exec -- eslint src/App.jsx src/main.jsx src/Navigation.jsx src/siteContent.js src/PageSeo.jsx src/seo.js src/entry-server.js src/campaignBrief.js src/CampaignBriefPdf.jsx src/Pages/Home.jsx src/Pages/About.jsx src/Pages/Contact.jsx vite.config.js
npm run build
```

`npm run lint` checks the entire repository, including legacy account and product code.

The focused tests cover SEO configuration, email draft formatting, recipient/header safety, project-only sources, unique asset names, and valid, distinct output for all 20 artwork scenes.

## Photography

The website uses original, locally drawn illustrations for the hero, social preview, all 15 media types, the product placeholder, and a stylized portrait. Each scene reflects its subject rather than reusing a generic image. The portrait is explicitly illustrative, not an actual likeness of Sudhakar Rai; media scenes are concepts, not completed client campaigns.

To replace a placeholder, add the genuine file to the project and register it in the manifest's `images` section under the same key. Genuine image entries override placeholder entries and remove their temporary labels. The portrait key is `sudhakarRai`; media keys match the format IDs. See [public/Assets/README.md](public/Assets/README.md) for an example.

The build copies only active assets named by the manifest plus required license/credit files. Old placeholders, downloaded stock files, and unused source photos are not published. The artwork cache preserves manually replaced files, while unmodified generated images refresh when their drawing code changes. See [public/Assets/README.md](public/Assets/README.md).

An image's presence in the project does not prove publication rights. The project owner must confirm the rights to project-supplied and user-uploaded images before publishing. No stock-photo license is asserted for the original project library. Google Fonts remains an external font service; the local-only image/icon rule does not change font handling.
