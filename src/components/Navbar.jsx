import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../hooks/useTheme.js";

export const NAVBAR_HEIGHT = 48;

const NAV_LINKS = [
  { label: "Architecture Diagrams", to: "/" },
  { label: "Projects", to: "/open-source" },
  { label: "Talks", to: "/talks" },
  { label: "About", to: "/about" },
];

function ThemeToggle({ theme, toggle }) {
  const isDark = theme === "dark";
  return (
    <button
      onClick={toggle}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        width: 30, height: 30, borderRadius: 7, cursor: "pointer",
        background: "var(--surface)", border: "1px solid var(--line)",
        color: "var(--ink3)", fontSize: 17,
        transition: "background 0.15s, border-color 0.15s, color 0.15s",
        flexShrink: 0,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = "var(--line)";
        e.currentTarget.style.color = "var(--ink1)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = "var(--surface)";
        e.currentTarget.style.color = "var(--ink3)";
      }}
    >
      {isDark ? "☀" : "☾"}
    </button>
  );
}

export default function Navbar() {
  const { pathname } = useLocation();
  const { theme, toggle } = useTheme();

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, height: NAVBAR_HEIGHT, zIndex: 1000,
      background: "var(--overlay)", borderBottom: "1px solid var(--line)",
      backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 24px", fontFamily: "monospace",
    }}>
      {/* Left: brand + nav links */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
        <Link to="/" style={{ textDecoration: "none", flexShrink: 0 }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: "var(--ink1)", letterSpacing: "-0.3px" }}>
            juanpablo<span style={{ color: "var(--accent)" }}>.tech</span>
          </span>
        </Link>

        <span style={{ color: "var(--line)", fontSize: 19, userSelect: "none" }}>·</span>

        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          {NAV_LINKS.map(({ label, to }) => {
            const active = pathname === to || (to !== "/" && pathname.startsWith(to));
            return (
              <Link key={label} to={to} style={{ textDecoration: "none" }}>
                <span style={{
                  fontSize: 12, padding: "5px 12px", borderRadius: 6,
                  color: active ? "var(--accent)" : "var(--ink4)",
                  background: active ? "var(--tint)" : "transparent",
                  border: active ? "1px solid var(--tintb)" : "1px solid transparent",
                  transition: "color 0.15s, background 0.15s, border-color 0.15s",
                  display: "inline-block",
                }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.color = "var(--ink2)"; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.color = "var(--ink4)"; }}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Right: theme toggle */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        <span style={{ fontSize: 13, color: "var(--ink4)", fontFamily: "monospace" }}>Toggle theme</span>
        <ThemeToggle theme={theme} toggle={toggle} />
      </div>
    </nav>
  );
}
