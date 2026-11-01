import assert from "node:assert/strict";
import test from "node:test";
import content from "../src/config/site.json" with { type: "json" };
import { getCampaignDetails, getCampaignEmail, getCampaignText } from "../src/campaignBrief.js";

const brief = {
    fullName: "Preview Visitor",
    company: "Brand & Co.",
    email: "visitor@example.com",
    phone: "",
    city: "Mumbai",
    service: "Train Branding and Railway Advertising",
    budget: "INR 1-5 lakh",
    startDate: "",
    message: "Launch a campaign.\nFocus on commuters & local awareness.",
};

test("email draft targets the configured recipient and contains the full brief", () => {
    const email = new URL(getCampaignEmail(brief, content.contact.email, content));
    assert.equal(email.protocol, "mailto:");
    assert.equal(decodeURIComponent(email.pathname), content.contact.email);
    assert.equal(email.searchParams.get("subject"), `${content.enquiry.document.subject} - Brand & Co.`);
    assert.equal(email.searchParams.get("body"), getCampaignText(brief, content));
    for (const value of [brief.fullName, brief.company, brief.email, brief.city, brief.service, brief.budget, brief.message]) {
        assert.ok(email.searchParams.get("body").includes(value));
    }
    assert.equal(email.searchParams.size, 2);
});

test("optional fields use the configured fallbacks", () => {
    const details = getCampaignDetails(brief, content.enquiry);
    assert.equal(details.length, 8);
    assert.equal(details.find(detail => detail.field === "phone").value, content.enquiry.document.notProvided);
    assert.equal(details.find(detail => detail.field === "startDate").value, content.enquiry.document.flexible);
});

test("visitor text cannot add email recipients or headers", () => {
    const email = new URL(getCampaignEmail({ ...brief, company: "Brand\r\nBcc: other@example.com", message: "&cc=other@example.com" }, content.contact.email, content));
    assert.equal(email.searchParams.has("cc"), false);
    assert.equal(email.searchParams.has("bcc"), false);
    assert.ok(!email.searchParams.get("subject").includes("\n"));
    for (const invalid of ["", "wrong-address", "person@example.com?bcc=other", "person@example.com\r\nBcc: other"]) {
        assert.throws(() => getCampaignEmail(brief, invalid, content));
    }
});