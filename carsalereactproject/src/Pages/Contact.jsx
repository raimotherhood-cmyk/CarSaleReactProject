import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowUpRight, Check, CheckCircle2, Download, FileText, LoaderCircle, Mail, MapPin, Pencil, Phone, ShieldCheck } from "lucide-react";
import { contactDetails, serviceOptions, siteContent } from "../siteContent";
import { getCampaignEmail } from "../campaignBrief";
import "./Contact.css";

const { enquiry } = siteContent;
const { fields, summary, document: briefDocument } = enquiry;
const enquiryEmail = contactDetails.email;
const emailConfigured = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enquiryEmail);

function activateLink(href, filename) {
    const link = document.createElement("a");
    link.href = href;
    link.hidden = true;
    link.rel = "noopener noreferrer";
    if (filename) link.download = filename;
    document.body.append(link);
    try {
        link.click();
    } finally {
        link.remove();
    }
}

function CampaignForm({ initialCity, initialService }) {
    const [brief, setBrief] = useState(null);
    const [pdfState, setPdfState] = useState("idle");
    const [pdfError, setPdfError] = useState("");
    const summaryRef = useRef(null);
    const formRef = useRef(null);
    const pdfRequest = useRef(0);

    useEffect(() => () => { pdfRequest.current += 1; }, []);

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
        const prepared = {
            ...Object.fromEntries(Object.entries(values).map(([field, value]) => [field, value.trim()])),
            preparedAt: new Date().toISOString(),
        };
        setBrief(prepared);
        setPdfError("");
        if (emailConfigured) activateLink(getCampaignEmail(prepared, enquiryEmail, siteContent));
    };

    const downloadPdf = async () => {
        const request = ++pdfRequest.current;
        setPdfState("loading");
        setPdfError("");
        try {
            const [{ default: CampaignBriefPdf }, { pdf }] = await Promise.all([
                import("../CampaignBriefPdf.jsx"),
                import("@react-pdf/renderer"),
            ]);
            const blob = await pdf(<CampaignBriefPdf brief={brief} content={siteContent} recipient={enquiryEmail} />).toBlob();
            if (request !== pdfRequest.current) return;
            const url = URL.createObjectURL(blob);
            try {
                activateLink(url, briefDocument.filename);
            } finally {
                window.setTimeout(() => URL.revokeObjectURL(url), 10000);
            }
        } catch {
            if (request === pdfRequest.current) setPdfError(summary.downloadError);
        } finally {
            if (request === pdfRequest.current) setPdfState("idle");
        }
    };

    return (
        <div className="ooh-contact-form-area">
            <div hidden={Boolean(brief)}>
                <div className="ooh-brief-header">
                    <span className="ooh-brief-symbol"><FileText size={25} aria-hidden="true" /></span>
                    <div><p className="ooh-eyebrow">{enquiry.formEyebrow}</p><h2>{enquiry.formHeading}</h2></div>
                </div>
                <div className="ooh-brief-introduction"><p className="ooh-form-intro">{enquiry.introduction}</p><span>{enquiry.requiredNote}</span></div>
                <form className="ooh-contact-form" ref={formRef} onSubmit={prepareBrief}>
                    <fieldset className="ooh-form-section">
                        <legend><span>01</span>{enquiry.sections.contact}</legend>
                        <div className="ooh-form-grid">
                        <div className="ooh-field"><label htmlFor="fullName">{fields.fullName.label} *</label><input id="fullName" name="fullName" autoComplete="name" required maxLength={80} pattern={".*\\S.*"} placeholder={fields.fullName.placeholder} /></div>
                        <div className="ooh-field"><label htmlFor="company">{fields.company.label} *</label><input id="company" name="company" autoComplete="organization" required maxLength={100} pattern={".*\\S.*"} placeholder={fields.company.placeholder} /></div>
                        <div className="ooh-field"><label htmlFor="email">{fields.email.label} *</label><input id="email" name="email" type="email" autoComplete="email" required maxLength={120} placeholder={fields.email.placeholder} /></div>
                        <div className="ooh-field"><label htmlFor="phone">{fields.phone.label} <span>{enquiry.optional}</span></label><input id="phone" name="phone" type="tel" autoComplete="tel" maxLength={24} placeholder={fields.phone.placeholder} /></div>
                        </div>
                    </fieldset>
                    <fieldset className="ooh-form-section">
                        <legend><span>02</span>{enquiry.sections.campaign}</legend>
                        <div className="ooh-form-grid">
                        <div className="ooh-field ooh-field-wide"><label htmlFor="city">{fields.city.label} *</label><input id="city" name="city" defaultValue={initialCity} required maxLength={120} pattern={".*\\S.*"} placeholder={fields.city.placeholder} /></div>
                        <div className="ooh-field ooh-field-wide"><label htmlFor="service">{fields.service.label} *</label><select id="service" name="service" defaultValue={initialService} required>{serviceOptions.map(service => <option key={service}>{service}</option>)}</select></div>
                        <div className="ooh-field"><label htmlFor="budget">{fields.budget.label} *</label><select id="budget" name="budget" defaultValue="" required><option value="" disabled>{enquiry.budgetPrompt}</option>{enquiry.budgets.map(budget => <option key={budget}>{budget}</option>)}</select></div>
                        <div className="ooh-field"><label htmlFor="startDate">{fields.startDate.label} <span>{enquiry.optional}</span></label><input id="startDate" name="startDate" type="date" min={new Date().toLocaleDateString("en-CA")} /></div>
                        </div>
                    </fieldset>
                    <fieldset className="ooh-form-section">
                        <legend><span>03</span>{enquiry.sections.goals}</legend>
                        <div className="ooh-field ooh-field-wide"><label htmlFor="message">{fields.message.label} *</label><textarea id="message" name="message" required rows={4} maxLength={800} onInput={event => event.currentTarget.setCustomValidity("")} placeholder={fields.message.placeholder} /></div>
                    </fieldset>
                    <div className="ooh-brief-recipient"><Mail size={18} aria-hidden="true" /><div><span>{enquiry.recipientLabel}</span><strong>{enquiryEmail}</strong></div></div>
                    <label className="ooh-consent"><input type="checkbox" name="consent" required /><span>{enquiry.consent} *</span></label>
                    <button className="ooh-button ooh-button-dark" type="submit" disabled={typeof window === "undefined" || !emailConfigured}>{enquiry.prepare} <ArrowUpRight size={18} aria-hidden="true" /></button>
                    {typeof window === "undefined" && <p className="ooh-form-note">{enquiry.noScript}</p>}
                    <p className="ooh-form-note ooh-privacy-note"><ShieldCheck size={16} aria-hidden="true" /><span>{enquiry.privacy}</span></p>
                </form>
            </div>
            {brief && (
                <section className="ooh-brief-summary" ref={summaryRef} tabIndex={-1} aria-labelledby="brief-heading">
                    <CheckCircle2 className="ooh-brief-check" size={40} strokeWidth={1.5} aria-hidden="true" />
                    <p className="ooh-eyebrow">{summary.eyebrow}</p>
                    <h2 id="brief-heading">{summary.heading}</h2>
                    <p>{summary.description}</p>
                    <div className="ooh-brief-recipient"><Mail size={18} aria-hidden="true" /><div><span>{enquiry.recipientLabel}</span><strong>{enquiryEmail}</strong></div></div>
                    <dl><div><dt>{summary.brand}</dt><dd>{brief.company}</dd></div><div><dt>{summary.markets}</dt><dd>{brief.city}</dd></div><div><dt>{summary.service}</dt><dd>{brief.service}</dd></div><div><dt>{summary.budget}</dt><dd>{brief.budget}</dd></div></dl>
                    <div className="ooh-brief-actions" aria-busy={pdfState === "loading"}>
                        <button className="ooh-button ooh-button-dark" type="button" disabled={pdfState === "loading"} onClick={downloadPdf}>{pdfState === "loading" ? summary.downloading : summary.download}{pdfState === "loading" ? <LoaderCircle className="ooh-pdf-spinner" size={18} aria-hidden="true" /> : <Download size={18} aria-hidden="true" />}</button>
                        {emailConfigured && <a className="ooh-button ooh-button-lime" href={getCampaignEmail(brief, enquiryEmail, siteContent)}>{summary.email} <Mail size={18} aria-hidden="true" /></a>}
                    </div>
                    {pdfError && <p className="ooh-pdf-error" role="alert">{pdfError}</p>}
                    <p className="ooh-form-note">{summary.notice}</p>
                    <button className="ooh-text-link ooh-edit-brief" type="button" disabled={pdfState === "loading"} onClick={() => {
                        pdfRequest.current += 1;
                        setBrief(null);
                        setPdfError("");
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