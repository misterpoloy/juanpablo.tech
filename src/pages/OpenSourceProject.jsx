import { useEffect, useState } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { getProject } from "../projects/registry.js";
import { TagList, StatusBadge, ProjectIcon, GitHubButton, Bullet, useIsDesktop } from "../components/ProjectUI.jsx";

function Container({ children, style = {} }) {
  return (
    <div style={{
      maxWidth: 1100, margin: "0 auto", padding: "0 24px",
      width: "100%", boxSizing: "border-box", ...style,
    }}>
      {children}
    </div>
  );
}

function SectionBlock({ section, color }) {
  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 12,
      padding: "24px 28px", display: "flex", flexDirection: "column", gap: 16,
    }}>
      <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--ink1)", margin: 0, fontFamily: "monospace" }}>
        <span style={{ color, marginRight: 8 }}>§</span>{section.heading}
      </h2>
      <p style={{ fontSize: 12, color: "var(--ink4)", lineHeight: 1.9, margin: 0, fontFamily: "monospace" }}>
        {section.body}
      </p>
      <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
        {section.bullets.map((b, i) => <Bullet key={i} text={b} color={color} />)}
      </ul>
    </div>
  );
}

function DemoVideo({ videoId, color, name }) {
  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 12, overflow: "hidden" }}>
      <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 12, color, fontWeight: 700 }}>▶</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: "var(--ink1)", fontFamily: "monospace" }}>Demo</span>
      </div>
      <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title={`${name} demo`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
        />
      </div>
    </div>
  );
}

function ImageLightbox({ images, activeIndex, onClose, projectName }) {
  useEffect(() => {
    if (activeIndex === null) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, onClose]);

  if (activeIndex === null) return null;

  const src = images[activeIndex];

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
        background: "rgba(5, 8, 12, 0.88)",
        backdropFilter: "blur(10px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <button
        type="button"
        onClick={onClose}
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          width: 40,
          height: 40,
          borderRadius: 999,
          border: "1px solid var(--line2)",
          background: "var(--surface2)",
          color: "var(--ink1)",
          fontSize: 22,
          cursor: "pointer",
          fontFamily: "monospace",
        }}
      >
        ×
      </button>

      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: "min(1200px, 100%)",
          maxHeight: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            color: "var(--ink2)",
            fontSize: 12,
            fontFamily: "monospace",
          }}
        >
          <span>{projectName} preview</span>
          <span>{activeIndex + 1} / {images.length}</span>
        </div>

        <div
          style={{
            borderRadius: 16,
            overflow: "hidden",
            border: "1px solid var(--line)",
            background: "rgba(12, 17, 24, 0.95)",
            boxShadow: "0 20px 80px rgba(0, 0, 0, 0.45)",
          }}
        >
          <img
            src={src}
            alt={`${projectName} screenshot ${activeIndex + 1}`}
            style={{
              width: "100%",
              maxHeight: "calc(100vh - 120px)",
              objectFit: "contain",
              display: "block",
              background: "var(--bg)",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default function OpenSourceProject() {
  const { projectId } = useParams();
  const p = getProject(projectId);
  const isDesktop = useIsDesktop();
  const [activeImageIndex, setActiveImageIndex] = useState(null);

  if (!p) return <Navigate to="/open-source" replace />;

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "monospace", color: "var(--ink2)" }}>

      {/* Breadcrumb */}
      <Container style={{ paddingTop: 20, paddingBottom: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Link to="/open-source" style={{
            fontSize: 13, color: "var(--ink4)", textDecoration: "none",
            display: "inline-flex", alignItems: "center", gap: 4, transition: "color 0.15s",
          }}
            onMouseEnter={e => e.currentTarget.style.color = "var(--ink2)"}
            onMouseLeave={e => e.currentTarget.style.color = "var(--ink4)"}
          >
            Open Source Projects
          </Link>
          <span style={{ color: "var(--line2)", fontSize: 13 }}>/</span>
          <span style={{ fontSize: 13, color: "var(--ink5)" }}>{p.name}</span>
        </div>
      </Container>

      {/* Hero */}
      <div style={{ borderBottom: "1px solid var(--line)" }}>
        <Container style={{ paddingTop: 24, paddingBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
            <div style={{ display: "flex", gap: 16, alignItems: "flex-start", flex: 1, minWidth: 0 }}>
              <ProjectIcon icon={p.icon} color={p.color} size={isDesktop ? 52 : 40} />
              <div style={{ minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
                  <h1 style={{ fontSize: isDesktop ? 22 : 18, fontWeight: 700, color: "var(--ink1)", margin: 0 }}>{p.name}</h1>
                  <StatusBadge status={p.status} />
                </div>
                <p style={{ fontSize: 15, color: "var(--ink3)", margin: "0 0 14px", fontStyle: "italic", maxWidth: 560 }}>
                  {p.tagline}
                </p>
                <TagList tags={p.tags} color={p.color} />
              </div>
            </div>
            <div style={{ flexShrink: 0, paddingTop: 4 }}>
              <GitHubButton href={p.github} label={p.linkLabel} />
            </div>
          </div>
        </Container>
      </div>

      {/* Body */}
      <Container style={{ paddingTop: 32, paddingBottom: 48 }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: isDesktop ? "minmax(0, 3fr) minmax(0, 2fr)" : "1fr",
          gap: 20,
        }}>
          {/* LEFT */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20, minWidth: 0 }}>
            <div style={{
              background: `linear-gradient(135deg, ${p.color}0a 0%, transparent 60%)`,
              border: `1px solid ${p.color}22`, borderRadius: 12, padding: "22px 26px",
            }}>
              <h2 style={{
                fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5,
                color: p.color, margin: "0 0 12px",
              }}>Overview</h2>
              <p style={{ fontSize: 15, color: "var(--ink2)", lineHeight: 2, margin: "0 0 18px" }}>
                {p.description}
              </p>
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                {p.detail.map((d, i) => <Bullet key={i} text={d} color={p.color} />)}
              </ul>
            </div>

            {p.screenshots?.length > 0 && (
              <div style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 12, overflow: "hidden" }}>
                <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 12, color: p.color, fontWeight: 700 }}>◉</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "var(--ink1)", fontFamily: "monospace" }}>Screenshots</span>
                  </div>
                  <span style={{ fontSize: 11, color: "var(--ink5)" }}>Tap or click any preview to expand</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 2, background: "var(--bg)" }}>
                  {p.screenshots.map((src, i) => (
                    <button
                      key={src}
                      type="button"
                      onClick={() => setActiveImageIndex(i)}
                      style={{
                        border: "none",
                        padding: 0,
                        margin: 0,
                        background: "transparent",
                        cursor: "zoom-in",
                        textAlign: "left",
                      }}
                    >
                      <img
                        src={src}
                        alt={`${p.name} screenshot ${i + 1}`}
                        style={{
                          width: "100%",
                          display: "block",
                          objectFit: "cover",
                          transition: "transform 0.18s ease, opacity 0.18s ease",
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.transform = "scale(1.01)";
                          e.currentTarget.style.opacity = "0.94";
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.transform = "scale(1)";
                          e.currentTarget.style.opacity = "1";
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {p.demoVideo && <DemoVideo videoId={p.demoVideo} color={p.color} name={p.name} />}
          </div>

          {/* RIGHT */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20, minWidth: 0 }}>
            {p.sections.map((s, i) => (
              <SectionBlock key={i} section={s} color={p.color} />
            ))}
          </div>
        </div>
      </Container>

      <ImageLightbox
        images={p.screenshots ?? []}
        activeIndex={activeImageIndex}
        onClose={() => setActiveImageIndex(null)}
        projectName={p.name}
      />
    </main>
  );
}
