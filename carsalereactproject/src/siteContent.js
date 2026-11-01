import { BusFront, MapPin, Megaphone, Presentation, RectangleHorizontal, Rocket, Search, TrainFront } from "lucide-react";
import content from "./config/site.json" with { type: "json" };
import assetManifest from "../public/Assets/manifest.json" with { type: "json" };

const icons = { BusFront, MapPin, Megaphone, Presentation, RectangleHorizontal, Rocket, Search, TrainFront };

export const siteContent = content;
export const brand = content.brand;

export const contactDetails = {
    ...content.contact,
    email: import.meta.env.VITE_ENQUIRY_EMAIL?.trim() || content.contact.email,
    phoneHref: `tel:${content.contact.telephone}`,
    location: [content.contact.city, content.contact.region, content.contact.country].join(", "),
};

export const advertisingServices = content.services.map(service => ({ ...service, icon: icons[service.icon] }));
export const mediaAssets = Object.fromEntries(Object.entries(assetManifest.images).map(([key, image]) => [key, { ...image, src: `/Assets/${image.file}` }]));
export const mediaFormats = content.mediaFormats.map(format => ({ ...format, image: mediaAssets[format.asset] }));
export const placeholderImage = `/Assets/${assetManifest.icons.placeholder}`;
export const serviceOptions = [content.enquiry.defaultService, ...new Set([...mediaFormats.map(format => format.name), ...advertisingServices.map(service => service.title)])];