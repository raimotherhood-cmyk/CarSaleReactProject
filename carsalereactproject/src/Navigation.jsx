import { useState, useEffect, useRef } from "react";
import { Routes, Route, Link, Navigate, useLocation } from "react-router-dom";
import { Aperture, ArrowUp, ArrowUpRight, LogOut, Mail, MapPin, Menu, Phone, X } from "lucide-react";
import { brand, contactDetails, siteContent } from "./siteContent";
import "./Navigation.css";
import Login from "./Pages/Login.jsx";
import Register from "./Pages/Register.jsx";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import Product from "./Pages/Product";
import ProductList from "./Pages/ProductList";
import PrivateRoute from "./Pages/PrivateRoute.jsx";
import { useIdleTimer } from "react-idle-timer";

function BrandLink({ onClick }) {
    return <Link className="ooh-brand" to="/" aria-label={`${brand.name} ${siteContent.navigation.home}`} onClick={onClick}><span className="ooh-brand-mark"><Aperture size={28} strokeWidth={1.8} aria-hidden="true" /></span><span className="ooh-wordmark">{brand.wordmark[0]}{" "}<small>{brand.wordmark[1]}</small></span></Link>;
}

function Navigation() {
    const { navigation, footer, notFound } = siteContent;
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuButton = useRef(null);
    const location = useLocation();

    const login = (username) => {
        setIsAuthenticated(true);
        setUser(username);
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
    };

    useIdleTimer({
        timeout: 1000 * 60,
        onIdle: logout,
        debounce: 500,
    });

    useEffect(() => {
        if (location.hash) {
            document.getElementById(location.hash.slice(1))?.scrollIntoView({ block: "start" });
        } else {
            window.scrollTo({ top: 0, behavior: "instant" });
        }
    }, [location.pathname, location.hash, location.key]);

    return (
        <>
            <a className="ooh-skip-link" href="#main-content">{navigation.skip}</a>
            <header className="ooh-header" onKeyDown={event => {
                if (event.key === "Escape" && menuOpen) {
                    setMenuOpen(false);
                    menuButton.current?.focus();
                }
            }}>
                <div className="ooh-shell ooh-header-inner">
                    <BrandLink onClick={() => setMenuOpen(false)} />
                    <nav id="primary-navigation" className={`ooh-navigation${menuOpen ? " is-open" : ""}`} aria-label={navigation.label}>
                        {navigation.links.map(item => <Link key={item.href} to={item.href} aria-current={location.pathname === item.href ? "page" : undefined} onClick={() => setMenuOpen(false)}>{item.label}</Link>)}
                        {isAuthenticated && <Link to="/productlist" onClick={() => setMenuOpen(false)}>{navigation.account}</Link>}
                        <Link className="ooh-button ooh-button-dark" to="/contact" onClick={() => setMenuOpen(false)}>{navigation.contact} <ArrowUpRight size={17} aria-hidden="true" /></Link>
                        {user && <button className="ooh-icon-button" type="button" title={`${navigation.logout} ${user}`} aria-label={`${navigation.logout} ${user}`} onClick={logout}><LogOut size={20} aria-hidden="true" /></button>}
                    </nav>
                    <button className="ooh-menu-button ooh-icon-button" type="button" ref={menuButton} aria-controls="primary-navigation" aria-expanded={menuOpen} aria-label={menuOpen ? navigation.close : navigation.open} title={menuOpen ? navigation.close : navigation.open} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={23} aria-hidden="true" /> : <Menu size={23} aria-hidden="true" />}</button>
                </div>
            </header>

            <main id="main-content" tabIndex={-1}>
                <Routes>
                    {[...siteContent.seo.pages.map(page => page.path), "/login", "/register"].flatMap(pathname => (pathname === "/" ? ["/index.html"] : [`${pathname}.html`, `${pathname}/index.html`]).map(alias => <Route key={alias} path={alias} element={<Navigate to={pathname} replace />} />))}
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
                        <Route path="/productlist" element={<ProductList logout={logout} />} />
                        <Route path="/product/:id" element={<Product logout={logout} />} />
                    </Route>
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/login" element={<Login login={login} />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="*" element={<section className="ooh-shell ooh-not-found"><p className="ooh-eyebrow">{notFound.eyebrow}</p><h1>{notFound.heading}</h1><Link className="ooh-button ooh-button-dark" to="/">{notFound.action} <ArrowUpRight size={18} aria-hidden="true" /></Link></section>} />
                </Routes>
            </main>

            <footer className="ooh-footer">
                <div className="ooh-shell">
                    <div className="ooh-footer-top">
                        <div className="ooh-footer-brand"><BrandLink /><span className="ooh-footer-location"><MapPin size={14} aria-hidden="true" /> {contactDetails.location}</span></div>
                        <div className="ooh-footer-links"><h2>{footer.explore}</h2>{navigation.links.map(item => <Link key={item.href} to={item.href}>{item.label}</Link>)}</div>
                        <div className="ooh-footer-links"><h2>{footer.connect}</h2><a href={contactDetails.phoneHref}><Phone size={14} aria-hidden="true" /> {contactDetails.phone}</a><a href={`mailto:${contactDetails.email}`}><Mail size={14} aria-hidden="true" /> {contactDetails.email}</a><Link to="/contact">{footer.campaign} <ArrowUpRight size={14} aria-hidden="true" /></Link><Link to={isAuthenticated ? "/productlist" : "/login"}>{isAuthenticated ? navigation.account : navigation.login}</Link></div>
                    </div>
                    <div className="ooh-footer-bottom"><p>&copy; {new Date().getFullYear()} {brand.name}</p><p>{footer.notice} <a href="/Assets/credits.html">{footer.imageCredits}</a></p><button className="ooh-icon-button" type="button" aria-label={footer.backToTop} title={footer.backToTop} onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" })}><ArrowUp size={18} aria-hidden="true" /></button></div>
                </div>
            </footer>
        </>
    );
}

export default Navigation;