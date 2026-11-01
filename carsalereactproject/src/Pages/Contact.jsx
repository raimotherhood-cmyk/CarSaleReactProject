import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowUpRight, Check, CheckCircle2, Download, Mail, MapPin, Pencil, Phone } from "lucide-react";
import { brand, contactDetails, serviceOptions, siteContent } from "../siteContent";
import "./Contact.css";

const { enquiry } = siteContent;
const { fields, summary, document: briefDocument } = enquiry;
const enquiryEmail = contactDetails.email;
const emailConfigured = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enquiryEmail);

function CampaignForm({ initialCity, initialService }) {
    const [brief, setBrief] = useState(null);
    const summaryRef = useRef(null);
    const formRef = useRef(null);

    useEffect(() => {
        if (brief) summaryRef.current?.focus();
    }, [brief]);

    const prepareBrief = (event) => {
        event.preventDefault();
        const values = Object.fromEntries(new FormData(event.currentTarget));
        const message = values.message.trim();
        if (!message) {
            const messageField = event.currentTarget.elements.namedItem("message");
            messageField.setCustomValidity(enquiry.validation);
            messageField.reportValidity();
            return;
        }
        setBrief(Object.fromEntries(Object.entries(values).map(([field, value]) => [field, value.trim()])));
    };

    const briefText = brief ? [
        `${brand.name} - ${briefDocument.title}`,
        brand.tagline,
        "",
        ...["fullName", "company", "email", "phone", "city", "service", "budget", "startDate"].map(field => `${fields[field].label}: ${brief[field] || (field === "startDate" ? briefDocument.flexible : briefDocument.notProvided)}`),
        "",
        `${fields.message.label}:`,
        brief.message,
        "",
        briefDocument.consent,
    ].join("\n") : "";

    return (
        <div className="ooh-contact-form-area">
            <div hidden={Boolean(brief)}>
                <h2>{enquiry.formHeading}</h2>
                <p className="ooh-form-intro">{enquiry.introduction}</p>
                <form className="ooh-contact-form" ref={formRef} onSubmit={prepareBrief}>
                    <div className="ooh-form-grid">
                        <div className="ooh-field"><label htmlFor="fullName">{fields.fullName.label} *</label><input id="fullName" name="fullName" autoComplete="name" required maxLength={80} pattern={".*\\S.*"} placeholder={fields.fullName.placeholder} /></div>
                        <div className="ooh-field"><label htmlFor="company">{fields.company.label} *</label><input id="company" name="company" autoComplete="organization" required maxLength={100} pattern={".*\\S.*"} placeholder={fields.company.placeholder} /></div>
                        <div className="ooh-field"><label htmlFor="email">{fields.email.label} *</label><input id="email" name="email" type="email" autoComplete="email" required maxLength={120} placeholder={fields.email.placeholder} /></div>
                        <div className="ooh-field"><label htmlFor="phone">{fields.phone.label} <span>{enquiry.optional}</span></label><input id="phone" name="phone" type="tel" autoComplete="tel" maxLength={24} placeholder={fields.phone.placeholder} /></div>
                        <div className="ooh-field ooh-field-wide"><label htmlFor="city">{fields.city.label} *</label><input id="city" name="city" defaultValue={initialCity} required maxLength={120} pattern={".*\\S.*"} placeholder={fields.city.placeholder} /></div>
                        <div className="ooh-field ooh-field-wide"><label htmlFor="service">{fields.service.label} *</label><select id="service" name="service" defaultValue={initialService} required>{serviceOptions.map(service => <option key={service}>{service}</option>)}</select></div>
                        <div className="ooh-field"><label htmlFor="budget">{fields.budget.label} *</label><select id="budget" name="budget" defaultValue="" required><option value="" disabled>{enquiry.budgetPrompt}</option>{enquiry.budgets.map(budget => <option key={budget}>{budget}</option>)}</select></div>
                        <div className="ooh-field"><label htmlFor="startDate">{fields.startDate.label} <span>{enquiry.optional}</span></label><input id="startDate" name="startDate" type="date" min={new Date().toLocaleDateString("en-CA")} /></div>
                        <div className="ooh-field ooh-field-wide"><label htmlFor="message">{fields.message.label} *</label><textarea id="message" name="message" required rows={4} maxLength={800} onInput={event => event.currentTarget.setCustomValidity("")} placeholder={fields.message.placeholder} /></div>
                    </div>
                    <label className="ooh-consent"><input type="checkbox" name="consent" required /><span>{enquiry.consent} *</span></label>
                    <button className="ooh-button ooh-button-dark" type="submit" disabled={typeof window === "undefined"}>{enquiry.prepare} <ArrowUpRight size={18} aria-hidden="true" /></button>
                    {typeof window === "undefined" && <p className="ooh-form-note">{enquiry.noScript}</p>}
                    <p className="ooh-form-note">{enquiry.privacy}</p>
                </form>
            </div>
            {brief && (
                <section className="ooh-brief-summary" ref={summaryRef} tabIndex={-1} aria-labelledby="brief-heading">
                    <CheckCircle2 className="ooh-brief-check" size={40} strokeWidth={1.5} aria-hidden="true" />
                    <p className="ooh-eyebrow">{summary.eyebrow}</p>
                    <h2 id="brief-heading">{summary.heading}</h2>
                    <p>{summary.description}</p>
                    <dl><div><dt>{summary.brand}</dt><dd>{brief.company}</dd></div><div><dt>{summary.markets}</dt><dd>{brief.city}</dd></div><div><dt>{summary.service}</dt><dd>{brief.service}</dd></div><div><dt>{summary.budget}</dt><dd>{brief.budget}</dd></div></dl>
                    <div className="ooh-brief-actions">
                        <a className="ooh-button ooh-button-dark" href={`data:text/plain;charset=utf-8,${encodeURIComponent(briefText)}`} download={briefDocument.filename}>{summary.download} <Download size={18} aria-hidden="true" /></a>
                        {emailConfigured && <a className="ooh-button ooh-button-lime" href={`mailto:${encodeURIComponent(enquiryEmail)}?subject=${encodeURIComponent(`${briefDocument.subject} - ${brief.company}`)}&body=${encodeURIComponent(briefText)}`}>{summary.email} <Mail size={18} aria-hidden="true" /></a>}
                    </div>
                    <button className="ooh-text-link ooh-edit-brief" type="button" onClick={() => {
                        setBrief(null);
                        requestAnimationFrame(() => formRef.current?.elements.namedItem("fullName")?.focus());
                    }}><Pencil size={15} aria-hidden="true" /> {summary.edit}</button>
                </section>
            )}
        </div>
    );
}

const Contact = () => {
    const [searchParams] = useSearchParams();
    const initialCity = (searchParams.get("city") || "").slice(0, 120);
    const requestedService = searchParams.get("format");
    const initialService = serviceOptions.includes(requestedService) ? requestedService : serviceOptions[0];

    return (
        <div className="ooh-shell ooh-contact-layout">
            <section className="ooh-contact-intro" aria-labelledby="contact-heading">
                <p className="ooh-eyebrow">{enquiry.eyebrow}</p>
                <h1 id="contact-heading">{enquiry.heading}<br /><span className="ooh-serif">{enquiry.accent}</span></h1>
                <p>{enquiry.description}</p>
                <ul className="ooh-contact-promises">{enquiry.promises.map(promise => <li key={promise}><Check size={17} aria-hidden="true" /> {promise}</li>)}</ul>
                <div className="ooh-contact-details"><a href={contactDetails.phoneHref}><Phone size={17} aria-hidden="true" /> {contactDetails.phone}</a>{emailConfigured && <a href={`mailto:${enquiryEmail}`}><Mail size={17} aria-hidden="true" /> {enquiryEmail}</a>}<p><MapPin size={17} aria-hidden="true" /> {contactDetails.location}</p></div>
            </section>
            <CampaignForm key={searchParams.toString()} initialCity={initialCity} initialService={initialService} />
        </div>
    );
};

export default Contact;