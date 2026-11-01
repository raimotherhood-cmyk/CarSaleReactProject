import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { advertisingServices, brand, mediaAssets, mediaFormats, siteContent } from "../siteContent";
import "./Home.css";

const Home = () => {
    const { home } = siteContent;
    const [category, setCategory] = useState(null);
    const [city, setCity] = useState(home.markets.cities[0]);
    const categories = [...new Set(mediaFormats.map(format => format.category))];
    const visibleFormats = mediaFormats.filter(format => category === null || format.category === category);

    return (
        <div className="ooh-home">
            <section className="ooh-hero" aria-labelledby="hero-heading">
                <img className="ooh-hero-image" src={mediaAssets.hero.src} srcSet={mediaAssets.heroSmall.src !== mediaAssets.hero.src && mediaAssets.heroSmall.width < mediaAssets.hero.width ? `${mediaAssets.heroSmall.src} ${mediaAssets.heroSmall.width}w, ${mediaAssets.hero.src} ${mediaAssets.hero.width}w` : undefined} sizes="100vw" alt={mediaAssets.hero.alt} width={mediaAssets.hero.width} height={mediaAssets.hero.height} fetchPriority="high" />
                <div className="ooh-hero-shade" />
                <div className="ooh-shell ooh-hero-content">
                    <p className="ooh-eyebrow"><span className="ooh-status-dot" /> {home.hero.eyebrow}</p>
                    <h1 id="hero-heading">{brand.wordmark[0]}<br /><span>{brand.wordmark[1]}</span></h1>
                    <p className="ooh-hero-tagline">{brand.tagline}</p>
                    <p className="ooh-hero-copy">{brand.theme}</p>
                    <div className="ooh-actions">
                        <Link className="ooh-button ooh-button-lime" to="/contact">{home.hero.action} <ArrowUpRight size={18} aria-hidden="true" /></Link>
                        <a className="ooh-text-link ooh-text-link-light" href="#media">{home.hero.explore} <ArrowDown size={16} aria-hidden="true" /></a>
                    </div>
                </div>
                <div className="ooh-hero-caption"><span>{home.hero.caption}</span><span>{mediaAssets.hero.isPlaceholder ? home.media.placeholderLabel : home.hero.channels}</span></div>
            </section>

            <div className="ooh-intro-strip">
                <div className="ooh-shell ooh-intro-inner">
                    <p>{home.introduction.heading}<br /><strong>{home.introduction.accent}</strong></p>
                    {home.introduction.items.map(item => <span key={item}>{item}</span>)}
                </div>
            </div>

            <section className="ooh-positioning ooh-shell" aria-label={home.positioning.label}>
                <p className="ooh-eyebrow">{home.positioning.eyebrow}</p>
                <p>{home.positioning.description}</p>
            </section>

            <section id="media" className="ooh-section ooh-shell" aria-labelledby="media-heading">
                <div className="ooh-section-heading">
                    <div><p className="ooh-eyebrow">{home.media.eyebrow}</p><h2 id="media-heading">{home.media.heading}<br /><span className="ooh-serif">{home.media.accent}</span></h2></div>
                    <p>{home.media.description}</p>
                </div>
                <div className="ooh-media-toolbar">
                    <div className="ooh-filter" role="group" aria-label={home.media.filterLabel}>
                        <button type="button" aria-pressed={category === null} onClick={() => setCategory(null)}>{home.media.all}</button>
                        {categories.map(option => <button key={option} type="button" aria-pressed={category === option} onClick={() => setCategory(option)}>{option}</button>)}
                    </div>
                    <span className="ooh-format-count" aria-live="polite">{visibleFormats.length} {visibleFormats.length === 1 ? home.media.singular : home.media.plural}</span>
                </div>
                <ul className="ooh-media-grid">
                    {visibleFormats.map(format => (
                        <li key={format.id} className="ooh-media-card">
                            <Link to={`/contact?format=${encodeURIComponent(format.name)}`} className="ooh-media-link">
                                <div className={`ooh-media-image-wrap${format.image ? "" : " ooh-media-icon-wrap"}`}>
                                    {format.image ? <img src={format.image.src} alt={format.image.alt} loading="lazy" decoding="async" width={format.image.width} height={format.image.height} /> : <format.icon size={76} strokeWidth={1.3} aria-hidden="true" />}
                                    <span className={`ooh-media-tag ooh-tag-${format.id}`}>{format.category}</span>
                                    {format.image?.isPlaceholder && <span className="ooh-image-placeholder-label">{home.media.placeholderLabel}</span>}
                                    <span className="ooh-media-image-caption">{format.label}</span>
                                </div>
                                <div className="ooh-media-title"><h3>{format.name}</h3><ArrowUpRight size={22} aria-hidden="true" /></div>
                                <p>{format.description}</p>
                                <span className="ooh-card-link">{home.media.action} <ArrowRight size={16} aria-hidden="true" /></span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </section>

            <section id="solutions" className="ooh-solutions-section" aria-labelledby="solutions-heading">
                <div className="ooh-shell">
                    <div className="ooh-section-heading">
                        <div><p className="ooh-eyebrow">{home.expertise.eyebrow}</p><h2 id="solutions-heading">{home.expertise.heading}<br /><span className="ooh-serif">{home.expertise.accent}</span></h2></div>
                        <p>{home.expertise.description}</p>
                        <span className="ooh-360" aria-label="360 degrees">360<span aria-hidden="true">&deg;</span></span>
                    </div>
                    <ul className="ooh-solutions-grid">
                        {advertisingServices.map(solution => (
                            <li key={solution.title}>
                                <solution.icon size={28} strokeWidth={1.5} aria-hidden="true" />
                                <h3>{solution.title}</h3>
                                <p>{solution.description}</p>
                                <Link className="ooh-text-link" to={`/contact?format=${encodeURIComponent(solution.title)}`}>{home.expertise.action} <ArrowUpRight size={16} aria-hidden="true" /></Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            <section id="locations" className="ooh-market-section" aria-labelledby="market-heading">
                <div className="ooh-shell ooh-market-layout">
                    <div className="ooh-market-copy"><p className="ooh-eyebrow">{home.markets.eyebrow}</p><h2 id="market-heading">{home.markets.heading}<br /><span className="ooh-serif">{home.markets.accent}</span></h2><p>{home.markets.description}</p><Link className="ooh-text-link" to="/contact">{home.markets.otherLocation} <ArrowUpRight size={16} aria-hidden="true" /></Link></div>
                    <div className="ooh-market-planner">
                        <p className="ooh-eyebrow">{home.markets.prompt}</p>
                        <div className="ooh-city-grid" role="group" aria-label={home.markets.label}>{home.markets.cities.map(market => <button type="button" key={market} aria-pressed={city === market} onClick={() => setCity(market)}>{market}{city === market ? <Check size={18} aria-hidden="true" /> : <ArrowUpRight size={18} aria-hidden="true" />}</button>)}</div>
                        <div className="ooh-market-selection"><p>{home.markets.selection}<br /><strong aria-live="polite">{city}</strong></p><Link className="ooh-button ooh-button-dark" to={`/contact?city=${encodeURIComponent(city)}`}>{home.markets.action} <ArrowUpRight size={17} aria-hidden="true" /></Link></div>
                        <p className="ooh-small-note">{home.markets.availability}</p>
                    </div>
                </div>
            </section>

            <section className="ooh-cta-band" aria-labelledby="cta-heading"><div className="ooh-shell ooh-cta-inner"><div><p className="ooh-eyebrow">{home.closing.eyebrow}</p><h2 id="cta-heading">{home.closing.heading}<br /><span className="ooh-serif">{home.closing.accent}</span></h2></div><Link className="ooh-button ooh-button-dark" to="/contact">{home.closing.action} <ArrowUpRight size={18} aria-hidden="true" /></Link></div></section>
        </div>
    );
};

export default Home;