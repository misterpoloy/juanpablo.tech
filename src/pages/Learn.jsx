import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { LEARN_ENTRIES } from "../learn/registry.js";
import { useDocumentMeta } from "../hooks/useDocumentMeta.js";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "interactive", label: "Interactive" },
  { id: "pdf", label: "PDFs" },
];

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

function TypeBadge({ type }) {
  const isInteractive = type === "interactive";
  return (
    <span
      style={{
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: 1.2,
        textTransform: "uppercase",
        padding: "3px 8px",
        borderRadius: 999,
        color: isInteractive ? "var(--accent)" : "var(--ink3)",
        background: isInteractive ? "var(--tint)" : "var(--bg)",
        border: `1px solid ${isInteractive ? "var(--tintb)" : "var(--line)"}`,
        whiteSpace: "nowrap",
      }}
    >
      {isInteractive ? "Interactive" : "PDF"}
    </span>
  );
}

function FilterChip({ active, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        fontSize: 12,
        fontFamily: "monospace",
        fontWeight: 700,
        padding: "7px 14px",
        borderRadius: 999,
        cursor: "pointer",
        color: active ? "var(--accent)" : "var(--ink4)",
        background: active ? "var(--tint)" : "var(--surface)",
        border: `1px solid ${active ? "var(--tintb)" : "var(--line)"}`,
        transition: "color 0.15s, background 0.15s, border-color 0.15s",
      }}
      onMouseEnter={e => {
        if (!active) e.currentTarget.style.color = "var(--ink2)";
      }}
      onMouseLeave={e => {
        if (!active) e.currentTarget.style.color = "var(--ink4)";
      }}
    >
      {label}
    </button>
  );
}

function ActionButton({ entry, fullWidth = false }) {
  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    minWidth: fullWidth ? "100%" : 132,
    width: fullWidth ? "100%" : "auto",
    padding: "9px 14px",
    borderRadius: 8,
    border: "1px solid var(--line2)",
    background: "var(--surface)",
    color: "var(--ink2)",
    fontSize: 12,
    fontFamily: "monospace",
    fontWeight: 700,
    cursor: "pointer",
    textDecoration: "none",
    transition: "background 0.15s, border-color 0.15s, color 0.15s",
  };

  const hoverIn = e => {
    e.currentTarget.style.background = "var(--tint)";
    e.currentTarget.style.borderColor = "var(--tintb)";
    e.currentTarget.style.color = "var(--accent)";
  };
  const hoverOut = e => {
    e.currentTarget.style.background = "var(--surface)";
    e.currentTarget.style.borderColor = "var(--line2)";
    e.currentTarget.style.color = "var(--ink2)";
  };

  return (
    <Link to={`/learn/${entry.id}`} style={base} onMouseEnter={hoverIn} onMouseLeave={hoverOut}>
      {entry.type === "interactive" ? "Open →" : "View →"}
    </Link>
  );
}

function EntryRow({ entry, index, compact }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: compact ? "1fr" : "minmax(0, 1.4fr) minmax(0, 2fr) auto",
        gap: compact ? 14 : 20,
        alignItems: compact ? "start" : "center",
        padding: compact ? "18px 16px" : "18px 22px",
        borderTop: index === 0 ? "none" : "1px solid var(--line)",
      }}
    >
      <div style={{ minWidth: 0, display: "grid", gap: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <TypeBadge type={entry.type} />
          <span style={{ fontSize: 11, color: "var(--ink4)", fontFamily: "monospace" }}>
            {entry.category}
          </span>
        </div>
        <div style={{ fontSize: compact ? 13 : 14, fontWeight: 700, color: "var(--ink1)", lineHeight: 1.45 }}>
          {entry.title}
        </div>
      </div>

      <div style={{ minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 12, color: "var(--ink4)", lineHeight: 1.8, overflowWrap: "anywhere" }}>
          {entry.description}
        </p>
      </div>

      <div style={{ justifySelf: compact ? "stretch" : "end", width: compact ? "100%" : "auto" }}>
        <ActionButton entry={entry} fullWidth={compact} />
      </div>
    </div>
  );
}

export default function Learn() {
  const isMobile = useMediaQuery("(max-width: 700px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");
  const isCompact = isTablet;

  useDocumentMeta({
    title: "Learn & Downloads | Juan Pablo Ortiz (@wildpasco)",
    description:
      "Technical learning resources, interactive explainers, and PDFs by Juan Pablo Ortiz (@wildpasco) on AWS, cloud architecture, and engineering topics.",
    path: "/learn",
  });

  const [filter, setFilter] = useState("all");

  const entries = useMemo(() => {
    if (filter === "all") return LEARN_ENTRIES;
    return LEARN_ENTRIES.filter(entry => entry.type === filter);
  }, [filter]);

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "monospace", color: "var(--ink2)" }}>
      <header style={{ borderBottom: "1px solid var(--line)", padding: isMobile ? "24px 18px 20px" : isTablet ? "28px 24px 24px" : "28px 40px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <span style={{
            fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2,
            color: "var(--accent)", background: "var(--tint)", border: "1px solid var(--tintb)25",
            padding: "3px 9px", borderRadius: 20,
          }}>Learn</span>
        </div>
        <h1 style={{ fontSize: isMobile ? 22 : 25, fontWeight: 700, color: "var(--ink1)", margin: "0 0 6px", lineHeight: 1.2 }}>
          Learn
        </h1>
        <p style={{ fontSize: 12, color: "var(--ink4)", margin: 0, maxWidth: 640, lineHeight: 1.8 }}>
          A growing library of interactive explainers and downloadable cheat sheets covering data
          structures, Kubernetes, cloud engineering, and the topics that come up most in interviews
          and day-to-day work.
        </p>

        <div style={{ display: "flex", gap: 8, marginTop: 18, flexWrap: "wrap" }}>
          {FILTERS.map(({ id, label }) => (
            <FilterChip
              key={id}
              active={filter === id}
              label={label}
              onClick={() => setFilter(id)}
            />
          ))}
        </div>
      </header>

      <section style={{ padding: isMobile ? "20px 18px 28px" : isTablet ? "28px 24px 36px" : "36px 40px 56px" }}>
        <div style={{
          maxWidth: 1120,
          margin: "0 auto",
          background: "var(--surface)",
          border: "1px solid var(--line)",
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 18px 40px rgba(0, 0, 0, 0.14)",
        }}>
          {!isCompact && (
            <div style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 2fr) auto",
              gap: 20,
              padding: "16px 22px",
              background: "linear-gradient(180deg, var(--surface2) 0%, var(--surface) 100%)",
              borderBottom: "1px solid var(--line)",
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink5)", textTransform: "uppercase", letterSpacing: 1.5 }}>
                Resource
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink5)", textTransform: "uppercase", letterSpacing: 1.5 }}>
                Description
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink5)", textTransform: "uppercase", letterSpacing: 1.5, textAlign: "right" }}>
                Action
              </div>
            </div>
          )}

          {entries.length === 0 ? (
            <div style={{ padding: isCompact ? "22px 16px" : "28px 22px", fontSize: 12, color: "var(--ink4)" }}>
              No entries match this filter yet.
            </div>
          ) : (
            entries.map((entry, index) => (
              <EntryRow key={entry.id} entry={entry} index={index} compact={isCompact} />
            ))
          )}
        </div>
      </section>
    </main>
  );
}
