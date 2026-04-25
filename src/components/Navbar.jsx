import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../hooks/useTheme.js";

export const NAVBAR_HEIGHT = 56;

const NAV_LINKS = [
  { label: "About", to: "/about" },
  { label: "Talks", to: "/talks" },
  { label: "Projects", to: "/open-source" },
  { label: "Architecture Diagrams", to: "/architecture" },
  { label: "Blog & Downloads", to: "/learn" },
];

const YOUTUBE_URL = "https://www.youtube.com/@wildpasco";

function useMediaQuery(query) {
  const getMatches = () => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  };

  const [matches, setMatches] = useState(getMatches);

  useEffect(() => {
    const media = window.matchMedia(query);
    const handleChange = (event) => setMatches(event.matches);
    setMatches(media.matches);
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, [query]);

  return matches;
}

function ThemeToggle({ theme, toggle }) {
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggle}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 32,
        height: 32,
        borderRadius: 8,
        cursor: "pointer",
        background: "var(--surface)",
        border: "1px solid var(--line)",
        color: "var(--ink3)",
        fontSize: 17,
        transition: "background 0.15s, border-color 0.15s, color 0.15s",
        flexShrink: 0,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = "var(--line)";
        e.currentTarget.style.borderColor = "var(--line2)";
        e.currentTarget.style.color = "var(--ink1)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = "var(--surface)";
        e.currentTarget.style.borderColor = "var(--line)";
        e.currentTarget.style.color = "var(--ink3)";
      }}
    >
      {isDark ? "☀" : "☾"}
    </button>
  );
}

function YouTubeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.5 6.2a2.98 2.98 0 0 0-2.1-2.11C19.54 3.6 12 3.6 12 3.6s-7.54 0-9.4.49A2.98 2.98 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 2.98 2.98 0 0 0 2.1 2.11c1.86.49 9.4.49 9.4.49s7.54 0 9.4-.49a2.98 2.98 0 0 0 2.1-2.11A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.8M9.6 15.6V8.4l6.25 3.6z" />
    </svg>
  );
}

function YouTubeLink() {
  return (
    <a
      href={YOUTUBE_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Open YouTube channel @wildpasco"
      title="YouTube"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 32,
        height: 32,
        borderRadius: 8,
        cursor: "pointer",
        background: "var(--surface)",
        border: "1px solid var(--line)",
        color: "var(--ink3)",
        transition: "background 0.15s, border-color 0.15s, color 0.15s",
        flexShrink: 0,
        textDecoration: "none",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = "var(--line)";
        e.currentTarget.style.borderColor = "var(--line2)";
        e.currentTarget.style.color = "var(--ink1)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = "var(--surface)";
        e.currentTarget.style.borderColor = "var(--line)";
        e.currentTarget.style.color = "var(--ink3)";
      }}
    >
      <YouTubeIcon />
    </a>
  );
}

function HamburgerButton({ open, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={open ? "Close navigation menu" : "Open navigation menu"}
      aria-expanded={open}
      aria-controls="mobile-navigation"
      style={{
        width: 36,
        height: 36,
        borderRadius: 10,
        border: "1px solid var(--line)",
        background: "var(--surface)",
        color: "var(--ink2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        flexShrink: 0,
        transition: "background 0.15s, border-color 0.15s, color 0.15s",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = "var(--line)";
        e.currentTarget.style.borderColor = "var(--line2)";
        e.currentTarget.style.color = "var(--ink1)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = "var(--surface)";
        e.currentTarget.style.borderColor = "var(--line)";
        e.currentTarget.style.color = "var(--ink2)";
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: 16,
          height: 14,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {[0, 1, 2].map(index => (
          <span
            key={index}
            style={{
              display: "block",
              height: 2,
              borderRadius: 999,
              background: "currentColor",
              transform:
                open && index === 0 ? "translateY(6px) rotate(45deg)"
                : open && index === 1 ? "scaleX(0)"
                : open && index === 2 ? "translateY(-6px) rotate(-45deg)"
                : "none",
              opacity: open && index === 1 ? 0 : 1,
              transition: "transform 0.18s ease, opacity 0.18s ease",
            }}
          />
        ))}
      </span>
    </button>
  );
}

function NavPill({ label, to, active, compact = false, onNavigate }) {
  return (
    <Link to={to} style={{ textDecoration: "none" }} onClick={onNavigate}>
      <span
        style={{
          fontSize: compact ? 11 : 12,
          padding: compact ? "5px 10px" : "6px 12px",
          borderRadius: 8,
          color: active ? "var(--accent)" : "var(--ink4)",
          background: active ? "var(--tint)" : "transparent",
          border: active ? "1px solid var(--tintb)" : "1px solid transparent",
          transition: "color 0.15s, background 0.15s, border-color 0.15s",
          display: "inline-block",
          whiteSpace: "nowrap",
        }}
        onMouseEnter={e => {
          if (!active) e.currentTarget.style.color = "var(--ink2)";
        }}
        onMouseLeave={e => {
          if (!active) e.currentTarget.style.color = "var(--ink4)";
        }}
      >
        {label}
      </span>
    </Link>
  );
}

function MobileNavLink({ label, to, active, onNavigate }) {
  return (
    <Link
      to={to}
      onClick={onNavigate}
      style={{
        textDecoration: "none",
        color: active ? "var(--accent)" : "var(--ink2)",
        background: active ? "var(--tint)" : "var(--surface)",
        border: active ? "1px solid var(--tintb)" : "1px solid var(--line)",
        borderRadius: 12,
        padding: "12px 14px",
        fontSize: 13,
        fontWeight: 700,
        lineHeight: 1.3,
        transition: "border-color 0.15s, background 0.15s, color 0.15s",
      }}
    >
      {label}
    </Link>
  );
}

export default function Navbar() {
  const { pathname } = useLocation();
  const { theme, toggle } = useTheme();
  const isMobile = useMediaQuery("(max-width: 760px)");
  const isTablet = useMediaQuery("(max-width: 1080px)");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname, isMobile]);

  useEffect(() => {
    if (!mobileOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setMobileOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen]);

  const compactDesktop = isTablet && !isMobile;

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: NAVBAR_HEIGHT,
          zIndex: 1000,
          background: "var(--overlay)",
          borderBottom: "1px solid var(--line)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: isMobile ? "0 14px" : compactDesktop ? "0 18px" : "0 24px",
          gap: 12,
          fontFamily: "monospace",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 10 : 8, minWidth: 0 }}>
          <Link to="/" style={{ textDecoration: "none", flexShrink: 0 }}>
            <span style={{ fontSize: isMobile ? 15 : 16, fontWeight: 700, color: "var(--ink1)", letterSpacing: "-0.3px" }}>
              juanpablo<span style={{ color: "var(--accent)" }}>.tech</span>
            </span>
          </Link>

          {!isMobile && (
            <>
              <span style={{ color: "var(--line)", fontSize: 19, userSelect: "none" }}>·</span>

              <div style={{ display: "flex", gap: compactDesktop ? 2 : 4, alignItems: "center", minWidth: 0 }}>
                {NAV_LINKS.map(({ label, to }) => {
                  const active = pathname === to || (to !== "/" && pathname.startsWith(to));
                  return (
                    <NavPill
                      key={label}
                      label={label}
                      to={to}
                      active={active}
                      compact={compactDesktop}
                    />
                  );
                })}
              </div>
            </>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 8 : 14, flexShrink: 0 }}>
          <YouTubeLink />
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {!isMobile && (
              <span style={{ fontSize: compactDesktop ? 12 : 13, color: "var(--ink4)" }}>
                {compactDesktop ? "Theme" : "Toggle theme"}
              </span>
            )}
            <ThemeToggle theme={theme} toggle={toggle} />
          </div>
          {isMobile && <HamburgerButton open={mobileOpen} onClick={() => setMobileOpen(open => !open)} />}
        </div>
      </nav>

      {isMobile && mobileOpen && (
        <div
          style={{
            position: "fixed",
            top: NAVBAR_HEIGHT,
            left: 0,
            right: 0,
            zIndex: 999,
            padding: "12px 14px 18px",
            background: "var(--overlay)",
            borderBottom: "1px solid var(--line)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
        >
          <div
            id="mobile-navigation"
            style={{
              display: "grid",
              gap: 10,
            }}
          >
            {NAV_LINKS.map(({ label, to }) => {
              const active = pathname === to || (to !== "/" && pathname.startsWith(to));
              return (
                <MobileNavLink
                  key={label}
                  label={label}
                  to={to}
                  active={active}
                  onNavigate={() => setMobileOpen(false)}
                />
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
