import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { LEARN_ENTRIES } from "../learn/registry.js";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "html", label: "Interactive" },
  { id: "pdf", label: "PDFs" },
];

function TypeBadge({ type }) {
  const isHtml = type === "html";
  return (
    <span
      style={{
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: 1.2,
        textTransform: "uppercase",
        padding: "3px 8px",
        borderRadius: 999,
        color: isHtml ? "var(--accent)" : "var(--ink3)",
        background: isHtml ? "var(--tint)" : "var(--bg)",
        border: `1px solid ${isHtml ? "var(--tintb)" : "var(--line)"}`,
        whiteSpace: "nowrap",
      }}
    >
      {isHtml ? "Interactive" : "PDF"}
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

function ActionButton({ entry }) {
  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    minWidth: 132,
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

  if (entry.type === "html") {
    return (
      <Link to={`/learn/${entry.id}`} style={base} onMouseEnter={hoverIn} onMouseLeave={hoverOut}>
        Open →
      </Link>
    );
  }

  return (
    <a href={entry.file} download style={base} onMouseEnter={hoverIn} onMouseLeave={hoverOut}>
      Download PDF
    </a>
  );
}

function EntryRow({ entry, index }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 2fr) auto",
        gap: 20,
        alignItems: "center",
        padding: "18px 22px",
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
        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--ink1)", lineHeight: 1.45 }}>
          {entry.title}
        </div>
      </div>

      <div style={{ minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 12, color: "var(--ink4)", lineHeight: 1.8 }}>
          {entry.description}
        </p>
      </div>

      <div style={{ justifySelf: "end" }}>
        <ActionButton entry={entry} />
      </div>
    </div>
  );
}

export default function Learn() {
  const [filter, setFilter] = useState("all");

  const entries = useMemo(() => {
    if (filter === "all") return LEARN_ENTRIES;
    return LEARN_ENTRIES.filter(entry => entry.type === filter);
  }, [filter]);

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "monospace", color: "var(--ink2)" }}>
      <header style={{ borderBottom: "1px solid var(--line)", padding: "28px 40px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <span style={{
            fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2,
            color: "var(--accent)", background: "var(--tint)", border: "1px solid var(--tintb)25",
            padding: "3px 9px", borderRadius: 20,
          }}>Learn</span>
        </div>
        <h1 style={{ fontSize: 25, fontWeight: 700, color: "var(--ink1)", margin: "0 0 6px" }}>
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

      <section style={{ padding: "36px 40px 56px" }}>
        <div style={{
          maxWidth: 1120,
          margin: "0 auto",
          background: "var(--surface)",
          border: "1px solid var(--line)",
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 18px 40px rgba(0, 0, 0, 0.14)",
        }}>
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

          {entries.length === 0 ? (
            <div style={{ padding: "28px 22px", fontSize: 12, color: "var(--ink4)" }}>
              No entries match this filter yet.
            </div>
          ) : (
            entries.map((entry, index) => (
              <EntryRow key={entry.id} entry={entry} index={index} />
            ))
          )}
        </div>
      </section>
    </main>
  );
}
