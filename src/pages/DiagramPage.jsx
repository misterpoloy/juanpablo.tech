import { useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import ArchitectureViewer from "../components/ArchitectureViewer.jsx";
import { getDiagram } from "../diagrams/registry.js";
import { NAVBAR_HEIGHT } from "../components/Navbar.jsx";

export default function DiagramPage() {
  const { slug } = useParams();
  const entry = getDiagram(slug);
  const [sourceOpen, setSourceOpen] = useState(false);

  if (!entry) return <Navigate to="/" replace />;

  return (
    <div style={{
      width: "100vw",
      height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
      display: "flex",
      flexDirection: "column",
      position: "relative",
      background: "var(--bg)",
    }}>
      <ArchitectureViewer
        architecture={entry.architecture}
        iconMap={entry.iconMap}
        groupMeta={entry.groupMeta}
      />

      {entry.source && (
        <div style={{ position: "absolute", top: 64, left: 12, zIndex: 70, fontFamily: "monospace" }}>

          {/* Toggle pill */}
          <button
            onClick={() => setSourceOpen(o => !o)}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "var(--overlay)", border: `1px solid ${entry.color}44`,
              borderRadius: 8, padding: "5px 10px", cursor: "pointer",
              backdropFilter: "blur(10px)", color: entry.color,
              fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.2,
              transition: "border-color 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = entry.color + "88"}
            onMouseLeave={e => e.currentTarget.style.borderColor = entry.color + "44"}
          >
            Original Source
            <span style={{ fontSize: 11, opacity: 0.7 }}>{sourceOpen ? "▲" : "▼"}</span>
          </button>

          {/* Expandable card */}
          {sourceOpen && (
            <a
              href={entry.source.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none", color: "inherit", display: "block", marginTop: 6, width: 280 }}
            >
              <div style={{
                background: "var(--overlay)", border: `1px solid ${entry.color}44`,
                borderRadius: 10, padding: "12px 14px",
                boxShadow: `0 0 28px ${entry.color}12`,
                backdropFilter: "blur(10px)",
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "var(--ink1)", lineHeight: 1.45 }}>
                      {entry.source.title}
                    </div>
                    <div style={{ fontSize: 13, color: "var(--ink3)", marginTop: 6 }}>
                      {entry.source.label}
                    </div>
                  </div>
                  <div style={{
                    flexShrink: 0, width: 28, height: 28, borderRadius: 8,
                    border: `1px solid ${entry.color}33`, color: entry.color,
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17,
                  }}>
                    ↗
                  </div>
                </div>
              </div>
            </a>
          )}
        </div>
      )}
    </div>
  );
}
