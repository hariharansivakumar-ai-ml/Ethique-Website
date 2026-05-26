import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiSearch, FiMenu, FiX, FiChevronDown, FiMail, FiMapPin } from "react-icons/fi";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import { MdOutlineDoubleArrow } from "react-icons/md";
import logo from "../../assets/Ethique_Hospital_Logo-bg.png";
import "./Navbar.css";

const NAV_LINKS = [
  { label: "Home", path: "/", hasDropdown: false },
  {
    label: "About",
    path: "/about",
    hasDropdown: true,
    children: [
      { label: "Our Story", path: "/about#story" },
      { label: "Our Team", path: "/about#team" },
      { label: "Awards & Recognition", path: "/about#awards" },
    ],
  },
  {
    label: "Services",
    path: "/services",
    hasDropdown: true,
    children: [
      { label: "General Medicine", path: "/services#general" },
      { label: "Cardiology", path: "/services#cardiology" },
      { label: "Orthopaedics", path: "/services#ortho" },
      { label: "Diagnostics", path: "/services#diagnostics" },
    ],
  },
  { label: "Facilities", path: "/facilities", hasDropdown: false },
  { label: "Gallery", path: "/gallery", hasDropdown: false },
  { label: "Contact", path: "/contact", hasDropdown: false },
];

const SOCIALS = [
  { icon: <FaFacebookF />, href: "https://www.facebook.com/sriponnimedicalcentre", label: "Facebook" },
  { icon: <FaTwitter />,   href: "#", label: "Twitter" },
  { icon: <FaInstagram />, href: "https://www.instagram.com/sriponnimedicalcentre/", label: "Instagram" },
  { icon: <FaYoutube />,   href: "#", label: "YouTube" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen]     = useState(false);
  const [searchOpen, setSearchOpen]     = useState(false);
  const [searchQuery, setSearchQuery]   = useState("");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [scrolled, setScrolled]         = useState(false);
  const location  = useLocation();
  const searchRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
  }, [location]);

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  return (
    <header className={`navbar${scrolled ? " navbar--scrolled" : ""}`}>

      {/* ══ TOP BAR ══════════════════════════════ */}
      <div className="topbar">
        <div className="topbar__container">
          {/* Left — contact info */}
          <div className="topbar__left">
            <a href="mailto:xxxxxxxxxx" className="topbar__item">
              <FiMail className="topbar__icon" />
              xxxxxxxxxx
            </a>
            <span className="topbar__divider" />
            <span className="topbar__item">
              <FiMapPin className="topbar__icon" />
              xxxxxxxxxx
            </span>
          </div>

          {/* Right — social icons */}
          <div className="topbar__right">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                className="topbar__social"
                aria-label={s.label}
                target="_blank"
                rel="noopener noreferrer"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ══ MAIN NAVBAR ══════════════════════════ */}
      <div className="navbar__main">
        <div className="navbar__container">

          {/* Logo */}
          <Link to="/" className="navbar__logo">
            <img src={logo} alt="Ethique Hospital" className="navbar__logo-img" />
          </Link>

          {/* Center Nav */}
          <nav className="navbar__nav" aria-label="Main navigation">
            <ul className="navbar__nav-list">
              {NAV_LINKS.map((link) => (
                <li
                  key={link.label}
                  className="navbar__nav-item"
                  onMouseEnter={() => link.hasDropdown && setActiveDropdown(link.label)}
                  onMouseLeave={() => link.hasDropdown && setActiveDropdown(null)}
                >
                  <Link
                    to={link.path}
                    className={`navbar__nav-link${location.pathname === link.path ? " navbar__nav-link--active" : ""}`}
                  >
                    {link.label}
                    {link.hasDropdown && (
                      <FiChevronDown
                        className={`navbar__nav-arrow${activeDropdown === link.label ? " navbar__nav-arrow--open" : ""}`}
                      />
                    )}
                  </Link>

                  {link.hasDropdown && link.children && (
                    <div className={`navbar__dropdown${activeDropdown === link.label ? " navbar__dropdown--open" : ""}`}>
                      <ul className="navbar__dropdown-list">
                        {link.children.map((child) => (
                          <li key={child.label}>
                            <Link to={child.path} className="navbar__dropdown-link">
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Right actions */}
          <div className="navbar__actions">

            {/* Search */}
            <div className={`navbar__search-wrap${searchOpen ? " navbar__search-wrap--open" : ""}`}>
              <input
                ref={searchRef}
                type="text"
                className="navbar__search-input"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onBlur={() => { if (!searchQuery) setSearchOpen(false); }}
              />
              <button
                className="navbar__search-btn"
                aria-label="Search"
                onClick={() => setSearchOpen((v) => !v)}
              >
                <FiSearch />
              </button>
            </div>

            {/* Contact CTA */}
            <Link to="/contact" className="navbar__cta">
              Contact Now
              <span className="navbar__cta-arrows">&raquo;</span>
            </Link>

            {/* Hamburger (mobile) */}
            <button
              className="navbar__hamburger"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>
      </div>

      {/* ══ MOBILE MENU ══════════════════════════ */}
      <div className={`navbar__mobile${mobileOpen ? " navbar__mobile--open" : ""}`}>
        <ul className="navbar__mobile-list">
          {NAV_LINKS.map((link) => (
            <li key={link.label} className="navbar__mobile-item">
              <div className="navbar__mobile-row">
                <Link to={link.path} className="navbar__mobile-link">
                  {link.label}
                </Link>
                {link.hasDropdown && (
                  <button
                    className="navbar__mobile-arrow-btn"
                    onClick={() => setActiveDropdown((p) => (p === link.label ? null : link.label))}
                  >
                    <FiChevronDown className={`navbar__nav-arrow${activeDropdown === link.label ? " navbar__nav-arrow--open" : ""}`} />
                  </button>
                )}
              </div>
              {link.hasDropdown && link.children && activeDropdown === link.label && (
                <ul className="navbar__mobile-sub">
                  {link.children.map((child) => (
                    <li key={child.label}>
                      <Link to={child.path} className="navbar__mobile-sub-link">{child.label}</Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
          <li>
            <Link to="/contact" className="navbar__cta navbar__cta--mobile">
              Contact Now <span className="navbar__cta-arrows">&raquo;</span>
            </Link>
          </li>
        </ul>
      </div>

    </header>
  );
}
