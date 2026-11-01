import assert from "node:assert/strict";
import test from "node:test";
import { createRobots, getPageSeo, resolveSiteUrl } from "../src/seo.js";
import content from "../src/config/site.json" with { type: "json" };
import assets from "../public/Assets/manifest.json" with { type: "json" };

const siteUrl = "https://vision.example";

test("public routes have unique titles, descriptions and clean canonicals", () => {
    const pages = ["/", "/about", "/contact"].map(route => getPageSeo(route, { siteUrl }));
    assert.equal(new Set(pages.map(page => page.title)).size, 3);
    assert.equal(new Set(pages.map(page => page.description)).size, 3);
    assert.ok(pages.every(page => page.indexable));
    assert.equal(getPageSeo("/contact/?city=Pune#brief", { siteUrl }).canonical, `${siteUrl}/contact`);
});

test("preview and private pages are not indexable", () => {
    for (const route of ["/login", "/register", "/product/1", "/productlist", "/missing"]) {
        const page = getPageSeo(route, { siteUrl });
        assert.equal(page.indexable, false);
        assert.equal(page.canonical, "");
    }
    assert.equal(getPageSeo("/", { siteUrl: "" }).indexable, false);
    assert.equal(getPageSeo("/", { siteUrl: "http://localhost:5173" }).indexable, false);
    assert.equal(createRobots(""), "User-agent: *\nDisallow: /\n");
});

test("structured data and social images use configured local assets", () => {
    const page = getPageSeo("/about", { siteUrl });
    const schema = JSON.parse(page.tags.find(tag => tag.attrs.type === "application/ld+json").children);
    const organization = schema["@graph"].find(item => item["@type"] === "Organization");
    assert.equal(organization.address.addressLocality, content.contact.city);
    assert.equal(organization.telephone, content.contact.telephone);
    assert.equal(page.tags.find(tag => tag.attrs.property === "og:image").attrs.content, `${siteUrl}/Assets/${assets.images.social.file}`);
    assert.match(createRobots(siteUrl), /Sitemap: https:\/\/vision\.example\/sitemap\.xml/);
});

test("invalid deployment origins are rejected", () => {
    for (const value of ["javascript:alert(1)", "https://user:password@vision.example", "https://vision.example/path", "https://vision.example/?token=value"]) {
        assert.throws(() => resolveSiteUrl(value));
    }
});

test("empty email overrides retain the configured business email", () => {
    const page = getPageSeo("/", { siteUrl, email: "  " });
    const schema = JSON.parse(page.tags.find(tag => tag.attrs.type === "application/ld+json").children);
    assert.equal(schema["@graph"][0].email, content.contact.email);
});