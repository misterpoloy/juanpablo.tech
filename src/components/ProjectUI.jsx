/** Shared UI primitives for open-source project pages. */
import { useState, useEffect } from "react";

/** Returns true when the viewport is ≥ 1024 px wide. Re-renders on resize. */
export function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 1024);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const handler = (e) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isDesktop;
}

export function TagList({ tags, color }) {
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {tags.map(t => (
        <span key={t} style={{
          fontSize: 12, padding: "2px 8px", borderRadius: 4, fontFamily: "monospace",
          background: color + "15", color: color + "cc", border: `1px solid ${color}30`,
        }}>{t}</span>
      ))}
    </div>
  );
}

const STATUS_COLORS = {
  "MIT Open Source": "#3fb950",
  "In Development":  "#D97706",
  "Mobile Application": "#378ADD",
};

export function StatusBadge({ status }) {
  const color = STATUS_COLORS[status] ?? "#D97706";
  return (
    <span style={{
      fontSize: 12, padding: "3px 9px", borderRadius: 20, fontFamily: "monospace",
      background: color + "18", color: color + "cc", border: `1px solid ${color}30`,
      letterSpacing: "0.5px", textTransform: "uppercase", fontWeight: 700, whiteSpace: "nowrap",
    }}>
      {status}
    </span>
  );
}

export function ProjectIcon({ icon, color, size = 36 }) {
  return (
    <span style={{
      fontSize: size * 0.55, width: size, height: size, borderRadius: 8, flexShrink: 0,
      background: color + "18", border: `1px solid ${color}30`,
      display: "flex", alignItems: "center", justifyContent: "center", color,
    }}>
      {icon}
    </span>
  );
}

const GH_ICON = (
  <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
  </svg>
);

export function GitHubButton({ href, label, inactiveLabel, icon = GH_ICON }) {
  const active = !!href;
  return (
    <a
      href={href ?? "#"}
      target="_blank"
      rel="noopener noreferrer"
      aria-disabled={!active}
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        fontSize: 13, fontFamily: "monospace", padding: "6px 16px", borderRadius: 7,
        textDecoration: "none", transition: "background 0.15s, border-color 0.15s",
        ...(active
          ? { background: "var(--surface)", color: "var(--ink2)", border: "1px solid var(--line2)", cursor: "pointer" }
          : { background: "transparent", color: "var(--ink5)", border: "1px solid var(--line)", cursor: "default", pointerEvents: "none" }
        ),
      }}
    >
      {icon}
      {active ? (label ?? "View on GitHub") : (inactiveLabel ?? "Repo coming soon")}
    </a>
  );
}

export function Bullet({ text, color }) {
  return (
    <li style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
      <span style={{ color, fontSize: 13, marginTop: 3, flexShrink: 0 }}>→</span>
      <span style={{ fontSize: 12, color: "var(--ink4)", lineHeight: 1.8, fontFamily: "monospace" }}>{text}</span>
    </li>
  );
}
