import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import App from "./App.jsx";
import content from "./config/site.json" with { type: "json" };
import { getBaseHeadTags, getPageSeo } from "./seo.js";

export function renderPage(pathname, bundles, options = {}) {
    const seo = getPageSeo(pathname, options);
    const head = [...getBaseHeadTags(), ...seo.tags].map((definition, index) => {
        const props = { ...definition.attrs, key: `${definition.tag}-${index}` };
        if (definition.tag === "script") {
            return createElement(definition.tag, { ...props, dangerouslySetInnerHTML: { __html: definition.children } });
        }
        return createElement(definition.tag, props, definition.children);
    });
    const document = createElement("html", { lang: content.seo.language },
        createElement("head", null, ...head, ...bundles.styles.map(href => createElement("link", { key: href, rel: "stylesheet", href }))),
        createElement("body", null,
            createElement("div", { id: "root" }, createElement(StaticRouter, { location: pathname }, createElement(App))),
            createElement("script", { type: "module", src: bundles.script })));
    return "<!doctype html>" + renderToString(document);
}