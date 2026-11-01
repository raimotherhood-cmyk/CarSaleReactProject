const detailFields = ["fullName", "company", "email", "phone", "city", "service", "budget", "startDate"];

export function getCampaignDetails(brief, enquiry) {
    return detailFields.map(field => ({
        field,
        label: enquiry.fields[field].label,
        value: String(brief[field] ?? "").trim() || (field === "startDate" ? enquiry.document.flexible : enquiry.document.notProvided),
    }));
}

export function getCampaignText(brief, { brand, enquiry }) {
    return [
        `${brand.name} - ${enquiry.document.title}`,
        brand.tagline,
        "",
        ...getCampaignDetails(brief, enquiry).map(detail => `${detail.label}: ${detail.value}`),
        "",
        `${enquiry.fields.message.label}:`,
        String(brief.message ?? "").trim(),
        "",
        enquiry.document.consent,
    ].join("\r\n");
}

export function getCampaignEmail(brief, recipient, content) {
    const address = String(recipient).trim();
    if (!/^[^\s@?&#]+@[^\s@?&#]+\.[^\s@?&#]+$/.test(address)) {
        throw new TypeError("A valid campaign recipient is required.");
    }
    const company = String(brief.company ?? "").replace(/[\r\n]+/g, " ").trim();
    const subject = `${content.enquiry.document.subject} - ${company}`;
    return `mailto:${encodeURIComponent(address)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(getCampaignText(brief, content))}`;
}