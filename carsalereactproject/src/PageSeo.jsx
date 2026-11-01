import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getPageSeo } from "./seo";
import { siteContent } from "./siteContent";

export default function PageSeo() {
    const { pathname } = useLocation();

    useEffect(() => {
        const seo = getPageSeo(pathname);
        document.documentElement.lang = siteContent.seo.language;
        document.head.querySelectorAll("[data-site-seo]").forEach(element => element.remove());
        for (const tag of seo.tags) {
            const element = document.createElement(tag.tag);
            for (const [name, value] of Object.entries(tag.attrs)) element.setAttribute(name, value);
            if (tag.children) element.textContent = tag.children;
            document.head.append(element);
        }
    }, [pathname]);

    return null;
}