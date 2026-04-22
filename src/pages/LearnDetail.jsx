import { useEffect, useMemo, useRef } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { getLearnEntry } from "../learn/registry.js";
import { useTheme } from "../hooks/useTheme.js";

export default function LearnDetail() {
  const { id } = useParams();
  const entry = getLearnEntry(id);
  const { theme } = useTheme();
  const iframeRef = useRef(null);

  useEffect(() => {
    if (!entry) return;
    const previousTitle = document.title;
    document.title = `${entry.title} | Learn`;
    return () => {
      document.title = previousTitle;
    };
  }, [entry]);

  useEffect(() => {
    const frame = iframeRef.current;
    if (!frame || !frame.contentWindow) return;
    frame.contentWindow.postMessage({ type: "set-theme", theme }, "*");
  }, [theme]);

  const iframeSrc = useMemo(() => {
    if (!entry) return "";
    const sep = entry.file.includes("?") ? "&" : "?";
    return `${entry.file}${sep}theme=${theme}`;
  }, [entry, theme]);

  if (!entry) return <Navigate to="/learn" replace />;
  if (entry.type !== "html") return <Navigate to="/learn" replace />;

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "monospace", color: "var(--ink2)" }}>
      <header style={{ borderBottom: "1px solid var(--line)", padding: "28px 40px 22px" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <Link
            to="/learn"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              color: "var(--ink4)",
              textDecoration: "none",
              marginBottom: 14,
            }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--ink2)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--ink4)")}
          >
            ← Back to Learn
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <span style={{
              fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5,
              color: "var(--accent)", background: "var(--tint)", border: "1px solid var(--tintb)",
              padding: "3px 9px", borderRadius: 20,
            }}>{entry.category}</span>
            <span style={{ fontSize: 11, color: "var(--ink5)" }}>Interactive</span>
          </div>

          <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--ink1)", margin: "0 0 8px", lineHeight: 1.25 }}>
            {entry.title}
          </h1>
          <p style={{ fontSize: 12, color: "var(--ink4)", margin: 0, maxWidth: 720, lineHeight: 1.8 }}>
            {entry.description}
          </p>

          <div style={{ marginTop: 16 }}>
            <a
              href={entry.file}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 14px",
                borderRadius: 8,
                border: "1px solid var(--line2)",
                background: "var(--surface)",
                color: "var(--ink2)",
                fontSize: 12,
                fontWeight: 700,
                textDecoration: "none",
                transition: "background 0.15s, border-color 0.15s, color 0.15s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "var(--tint)";
                e.currentTarget.style.borderColor = "var(--tintb)";
                e.currentTarget.style.color = "var(--accent)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "var(--surface)";
                e.currentTarget.style.borderColor = "var(--line2)";
                e.currentTarget.style.color = "var(--ink2)";
              }}
            >
              Open in new tab ↗
            </a>
          </div>
        </div>
      </header>

      <section style={{ padding: "28px 40px 56px" }}>
        <div
          style={{
            maxWidth: 1120,
            margin: "0 auto",
            background: "var(--surface)",
            border: "1px solid var(--line)",
            borderRadius: 16,
            overflow: "hidden",
            boxShadow: "0 18px 40px rgba(0, 0, 0, 0.14)",
          }}
        >
          <iframe
            ref={iframeRef}
            title={entry.title}
            src={iframeSrc}
            style={{
              width: "100%",
              height: "min(1600px, 92vh)",
              border: "none",
              display: "block",
              background: "var(--bg)",
            }}
          />
        </div>
      </section>
    </main>
  );
}
