import content from "./config/site.json" with { type: "json" };
import assets from "../public/Assets/manifest.json" with { type: "json" };

export function resolveSiteUrl(value = "") {
    if (!value.trim()) return "";
    const url = new URL(value);
    if (!["https:", "http:"].includes(url.protocol) || url.username || url.password || url.search || url.hash || url.pathname !== "/") {
        throw new Error("VITE_SITE_URL must be a website origin, such as https://your-domain.in, without a path, credentials, query, or fragment.");
    }
    if (["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)) return "";
    return url.origin;
}

export function getPageSeo(location, options = {}) {
    const pathname = location.split(/[?#]/)[0].replace(/\/index\.html$/, "/").replace(/\.html$/, "").replace(/\/+$/, "") || "/";
    const page = content.seo.pages.find(candidate => candidate.path === pathname);
    const origin = resolveSiteUrl(options.siteUrl ?? (import.meta.env?.VITE_SITE_URL?.trim() || content.seo.siteUrl));
    const email = (options.email ?? import.meta.env?.VITE_ENQUIRY_EMAIL ?? "").trim() || content.contact.email;
    const privatePage = /^\/(login|register|product|productlist)(\/|$)/.test(pathname);
    const title = page?.title ?? (privatePage ? content.seo.privateTitle : content.seo.notFoundTitle);
    const description = page?.description ?? content.seo.description;
    const canonical = page && origin ? `${origin}${page.path}` : "";
    const image = canonical ? `${origin}/Assets/${assets.images.social.file}` : "";
    const tags = [
        { tag: "title", children: title },
        { tag: "meta", attrs: { name: "description", content: description } },
        { tag: "meta", attrs: { name: "robots", content: canonical ? "index, follow, max-image-preview:large" : "noindex, nofollow" } },
        { tag: "meta", attrs: { property: "og:type", content: "website" } },
        { tag: "meta", attrs: { property: "og:site_name", content: content.brand.name } },
        { tag: "meta", attrs: { property: "og:locale", content: content.seo.locale } },
        { tag: "meta", attrs: { property: "og:title", content: title } },
        { tag: "meta", attrs: { property: "og:description", content: description } },
        { tag: "meta", attrs: { name: "twitter:card", content: image ? "summary_large_image" : "summary" } },
        { tag: "meta", attrs: { name: "twitter:title", content: title } },
        { tag: "meta", attrs: { name: "twitter:description", content: description } },
    ];

    if (canonical) {
        tags.push(
            { tag: "link", attrs: { rel: "canonical", href: canonical } },
            { tag: "meta", attrs: { property: "og:url", content: canonical } },
            { tag: "meta", attrs: { property: "og:image", content: image } },
            { tag: "meta", attrs: { property: "og:image:width", content: String(assets.images.social.width) } },
            { tag: "meta", attrs: { property: "og:image:height", content: String(assets.images.social.height) } },
            { tag: "meta", attrs: { property: "og:image:alt", content: assets.images.social.alt } },
            { tag: "meta", attrs: { name: "twitter:image", content: image } },
            { tag: "meta", attrs: { name: "twitter:image:alt", content: assets.images.social.alt } },
        );
        const organization = {
            "@type": "Organization",
            "@id": `${origin}/#organization`,
            name: content.brand.name,
            url: `${origin}/`,
            logo: `${origin}/Assets/${assets.icons.brand}`,
            description: content.seo.description,
            email,
            telephone: content.contact.telephone,
            address: { "@type": "PostalAddress", addressLocality: content.contact.city, addressRegion: content.contact.region, addressCountry: content.contact.countryCode },
            areaServed: { "@type": "Country", name: content.contact.country },
        };
        const breadcrumbs = [{ "@type": "ListItem", position: 1, name: content.seo.pages[0].name, item: `${origin}/` }];
        if (pathname !== "/") breadcrumbs.push({ "@type": "ListItem", position: 2, name: page.name, item: canonical });
        const schema = {
            "@context": "https://schema.org",
            "@graph": [
                organization,
                { "@type": "WebSite", "@id": `${origin}/#website`, url: `${origin}/`, name: content.brand.name, publisher: { "@id": organization["@id"] } },
                { "@type": "WebPage", "@id": `${canonical}#webpage`, url: canonical, name: title, description, inLanguage: content.seo.language, isPartOf: { "@id": `${origin}/#website` }, about: { "@id": organization["@id"] } },
                { "@type": "BreadcrumbList", itemListElement: breadcrumbs },
            ],
        };
        tags.push({ tag: "script", attrs: { type: "application/ld+json", id: "site-structured-data" }, children: JSON.stringify(schema).replace(/</g, "\\u003c") });
    }

    return { pathname, origin, canonical, title, description, indexable: Boolean(canonical), tags: tags.map(tag => ({ ...tag, attrs: { ...tag.attrs, "data-site-seo": "" } })) };
}

export function getBaseHeadTags() {
    return [
        { tag: "meta", attrs: { charSet: "UTF-8" } },
        { tag: "meta", attrs: { name: "viewport", content: "width=device-width, initial-scale=1.0" } },
        { tag: "meta", attrs: { name: "theme-color", content: "#202720" } },
        { tag: "link", attrs: { rel: "icon", type: "image/svg+xml", href: `/Assets/${assets.icons.brand}` } },
        { tag: "link", attrs: { rel: "preconnect", href: "https://fonts.googleapis.com" } },
        { tag: "link", attrs: { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" } },
        { tag: "link", attrs: { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Manrope:wght@400;500;600;700;800&display=swap" } },
    ];
}

export function createRobots(siteUrl) {
    const origin = resolveSiteUrl(siteUrl);
    return origin
        ? `User-agent: *\nAllow: /\nDisallow: /login\nDisallow: /register\nDisallow: /product\nDisallow: /productlist\n\nSitemap: ${origin}/sitemap.xml\n`
        : "User-agent: *\nDisallow: /\n";
}