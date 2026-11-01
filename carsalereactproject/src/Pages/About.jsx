import { Link } from "react-router-dom";
import { ArrowUpRight, Check, Eye, MapPin, Target, UserRound } from "lucide-react";
import { contactDetails, mediaAssets, siteContent } from "../siteContent";
import "./About.css";

const About = () => {
    const { about } = siteContent;
    const { leadership, approach } = about;
    const portrait = mediaAssets[leadership.portraitAsset];

    return (
        <div className="ooh-about">
            <section className="ooh-shell ooh-about-intro">
                <p className="ooh-eyebrow">{about.eyebrow}</p>
                <div className="ooh-about-heading">
                    <div><h1>{about.heading}<br /><span className="ooh-serif">{about.headingAccent}</span></h1><p className="ooh-about-location"><MapPin size={17} aria-hidden="true" /> {contactDetails.location}</p></div>
                    <div className="ooh-about-description">
                        {about.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
                        <Link className="ooh-text-link" to="/#solutions">{about.servicesLink} <ArrowUpRight size={16} aria-hidden="true" /></Link>
                    </div>
                </div>
            </section>

            <section className="ooh-leadership" aria-labelledby="leadership-heading">
                <div className="ooh-shell ooh-leadership-inner">
                    <div className="ooh-leadership-identity">
                        <figure className="ooh-leadership-portrait">
                            {portrait ? <img src={portrait.src} alt={portrait.alt} width={portrait.width} height={portrait.height} loading="lazy" decoding="async" /> : <UserRound size={76} strokeWidth={1.2} aria-hidden="true" />}
                            {(!portrait || portrait.isPlaceholder) && <figcaption>{leadership.portraitPlaceholderLabel}</figcaption>}
                        </figure>
                        <div><p className="ooh-eyebrow">{leadership.eyebrow}</p><h2 id="leadership-heading">{leadership.name}</h2><p className="ooh-leadership-role">{leadership.role}</p></div>
                    </div>
                    <div className="ooh-leadership-experience"><ul>{leadership.specialisms.map(specialism => <li key={specialism}><Check size={17} aria-hidden="true" /> {specialism}</li>)}</ul></div>
                    <blockquote className="ooh-leadership-message">
                        {leadership.message.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
                        <p className="ooh-leadership-closing">{leadership.closing}</p>
                    </blockquote>
                </div>
            </section>

            <section className="ooh-shell ooh-purpose" aria-label={about.purposeLabel}>
                <div><Target size={28} strokeWidth={1.5} aria-hidden="true" /><h2>{about.mission.title}</h2><p>{about.mission.description}</p></div>
                <div><Eye size={28} strokeWidth={1.5} aria-hidden="true" /><h2>{about.vision.title}</h2><p>{about.vision.description}</p></div>
            </section>

            <section className="ooh-about-approach" aria-labelledby="approach-heading">
                <div className="ooh-shell ooh-about-approach-inner">
                    <div><p className="ooh-eyebrow">{approach.eyebrow}</p><h2 id="approach-heading">{approach.heading}<br /><span className="ooh-serif">{approach.headingAccent}</span></h2><Link className="ooh-button ooh-button-dark" to="/contact">{approach.action} <ArrowUpRight size={18} aria-hidden="true" /></Link></div>
                    <ol className="ooh-about-steps">
                        {approach.steps.map((step, index) => <li key={step.title}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{step.title}</h3><p>{step.description}</p></div></li>)}
                    </ol>
                </div>
            </section>
        </div>
    );
};

export default About;