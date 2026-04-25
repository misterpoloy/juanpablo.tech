import { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { getLearnEntry } from "../learn/registry.js";

const backLink = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  fontSize: 12,
  color: "var(--ink4)",
  textDecoration: "none",
  marginBottom: 14,
};

function CategoryBadge({ category, type }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
      <span style={{
        fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5,
        color: "var(--accent)", background: "var(--tint)", border: "1px solid var(--tintb)",
        padding: "3px 9px", borderRadius: 20,
      }}>{category}</span>
      <span style={{ fontSize: 11, color: "var(--ink5)" }}>
        {type === "interactive" ? "Interactive" : "PDF Download"}
      </span>
    </div>
  );
}

function PdfLandingPage({ entry }) {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "monospace", color: "var(--ink2)" }}>
      <header style={{ borderBottom: "1px solid var(--line)", padding: "28px 40px 22px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <Link to="/learn" style={backLink}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--ink2)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--ink4)")}
          >
            ← Back to Blog & Downloads
          </Link>
          <CategoryBadge category={entry.category} type={entry.type} />
          <h1 style={{ fontSize: 26, fontWeight: 700, color: "var(--ink1)", margin: "0 0 10px", lineHeight: 1.2 }}>
            {entry.title}
          </h1>
          <p style={{ fontSize: 13, color: "var(--ink4)", margin: 0, maxWidth: 620, lineHeight: 1.85 }}>
            {entry.description}
          </p>
        </div>
      </header>

      <section style={{ padding: "36px 40px 64px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", display: "grid", gap: 24 }}>
          {entry.topics && entry.topics.length > 0 && (
            <div style={{
              background: "var(--surface)",
              border: "1px solid var(--line)",
              borderRadius: 16,
              padding: "26px 28px",
            }}>
              <h2 style={{ fontSize: 14, fontWeight: 700, color: "var(--ink1)", margin: "0 0 18px" }}>
                What's inside
              </h2>
              <ul style={{ margin: 0, padding: 0, display: "grid", gap: 10 }}>
                {entry.topics.map(topic => (
                  <li key={topic} style={{ listStyle: "none", display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{ color: "var(--accent)", marginTop: 1, flexShrink: 0 }}>→</span>
                    <span style={{ fontSize: 13, color: "var(--ink3)", lineHeight: 1.7 }}>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div style={{
            background: "var(--surface)",
            border: "1px solid var(--line)",
            borderRadius: 16,
            padding: "26px 28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 20,
            flexWrap: "wrap",
          }}>
            <div>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "var(--ink1)" }}>
                Ready to download
              </p>
              <p style={{ margin: "4px 0 0", fontSize: 12, color: "var(--ink4)" }}>
                Free PDF, no sign-up required.
              </p>
            </div>
            <a
              href={entry.file}
              download
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "11px 22px",
                borderRadius: 10,
                background: "var(--accent)",
                color: "#fff",
                fontSize: 13,
                fontFamily: "monospace",
                fontWeight: 700,
                textDecoration: "none",
                border: "1px solid transparent",
                transition: "opacity 0.15s",
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >
              Download PDF ↓
            </a>
          </div>

          {entry.tags && entry.tags.length > 0 && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {entry.tags.map(tag => (
                <span key={tag} style={{
                  fontSize: 11, color: "var(--ink4)", background: "var(--surface)",
                  border: "1px solid var(--line)", borderRadius: 999, padding: "3px 10px",
                }}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default function LearnDetail() {
  const { id } = useParams();
  const entry = getLearnEntry(id);

  useEffect(() => {
    if (!entry) return;
    const previousTitle = document.title;
    document.title = `${entry.title} | Learn`;
    return () => { document.title = previousTitle; };
  }, [entry]);

  if (!entry) return <Navigate to="/learn" replace />;
  if (entry.type === "pdf") return <PdfLandingPage entry={entry} />;
  if (!entry.component) return <Navigate to="/learn" replace />;

  const ArtifactComponent = entry.component;

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "monospace", color: "var(--ink2)" }}>
      <header style={{ borderBottom: "1px solid var(--line)", padding: "28px 40px 22px" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <Link to="/learn" style={backLink}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--ink2)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--ink4)")}
          >
            ← Back to Blog & Downloads
          </Link>
          <CategoryBadge category={entry.category} type={entry.type} />
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--ink1)", margin: "0 0 8px", lineHeight: 1.25 }}>
            {entry.title}
          </h1>
          <p style={{ fontSize: 12, color: "var(--ink4)", margin: 0, maxWidth: 720, lineHeight: 1.8 }}>
            {entry.description}
          </p>
        </div>
      </header>

      <section style={{ padding: "28px 40px 56px" }}>
        <div style={{
          maxWidth: 1120,
          margin: "0 auto",
          background: "var(--surface)",
          border: "1px solid var(--line)",
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 18px 40px rgba(0, 0, 0, 0.14)",
        }}>
          <ArtifactComponent />
        </div>
      </section>
    </main>
  );
}
