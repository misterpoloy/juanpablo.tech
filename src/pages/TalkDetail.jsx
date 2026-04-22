import { useEffect, useState } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { getTalk } from "../talks/registry.js";
import { useIsDesktop } from "../components/ProjectUI.jsx";

const SPEAKER_AVATAR = "/img/profile.jpg";

/* ── Container ───────────────────────────────────────────────────────────── */
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

/* ── Social icon map ─────────────────────────────────────────────────────── */
const GITHUB_ICON = (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
  </svg>
);

function SocialLink({ href, label, icon }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{
      display: "inline-flex", alignItems: "center", gap: 7,
      fontSize: 12, fontFamily: "monospace", padding: "7px 14px", borderRadius: 8,
      textDecoration: "none", color: "var(--ink2)",
      background: "var(--bg)", border: "1px solid var(--line)",
      transition: "border-color 0.15s, color 0.15s",
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--line2)"; e.currentTarget.style.color = "var(--ink1)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--line)"; e.currentTarget.style.color = "var(--ink2)"; }}
    >
      {icon} {label}
    </a>
  );
}

function ImageLightbox({ images, activeIndex, onClose, title }) {
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
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          color: "var(--ink2)",
          fontSize: 12,
          fontFamily: "monospace",
        }}>
          <span>{title} preview</span>
          <span>{activeIndex + 1} / {images.length}</span>
        </div>

        <div style={{
          borderRadius: 16,
          overflow: "hidden",
          border: "1px solid var(--line)",
          background: "rgba(12, 17, 24, 0.95)",
          boxShadow: "0 20px 80px rgba(0, 0, 0, 0.45)",
        }}>
          <img
            src={images[activeIndex]}
            alt={`${title} image ${activeIndex + 1}`}
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

/* ── Page ────────────────────────────────────────────────────────────────── */
export default function TalkDetail() {
  const { talkId } = useParams();
  const t = getTalk(talkId);
  const isDesktop = useIsDesktop();
  const [activeImageIndex, setActiveImageIndex] = useState(null);

  if (!t) return <Navigate to="/talks" replace />;

  const isDelivered = t.status === "Delivered";
  const statusColor = isDelivered ? "#3fb950" : "#D97706";
  const primaryLink = t.videoUrl || t.conferenceUrl;
  const primaryLinkLabel = t.externalLabel || "Open link";
  const galleryImages = [t.featureImage, ...(t.eventImages ?? [])].filter(Boolean);
  const heroMeta = [
    t.date ? { icon: "📅", text: t.date } : null,
    t.time ? { icon: "🕐", text: t.time } : null,
    (t.city || t.country) ? { icon: "📍", text: [t.city, t.country].filter(Boolean).join(", ") } : null,
  ].filter(Boolean);

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "monospace", color: "var(--ink2)" }}>

      {/* Breadcrumb */}
      <Container style={{ paddingTop: 20, paddingBottom: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Link to="/talks" style={{
            fontSize: 12, color: "var(--ink4)", textDecoration: "none", transition: "color 0.15s",
          }}
            onMouseEnter={e => e.currentTarget.style.color = "var(--ink2)"}
            onMouseLeave={e => e.currentTarget.style.color = "var(--ink4)"}
          >
            Talks & Conferences
          </Link>
          <span style={{ color: "var(--line2)", fontSize: 12 }}>/</span>
          <span style={{ fontSize: 12, color: "var(--ink5)" }}>{t.conference} {t.edition}</span>
        </div>
      </Container>

      {/* Hero */}
      <div style={{ borderBottom: "1px solid var(--line)", marginTop: 20 }}>
        <Container style={{ paddingBottom: 32 }}>

          {/* Conference badge row */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: t.color + "12", border: `1px solid ${t.color}30`,
              borderRadius: 10, padding: "8px 14px",
            }}>
              <span style={{ fontSize: 20 }}>{t.flag}</span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: t.color, letterSpacing: 0.3 }}>
                  {t.conference} {t.edition}
                </div>
                <div style={{ fontSize: 11, color: "var(--ink4)" }}>
                  {t.city}, {t.country}
                </div>
              </div>
            </div>

            <span style={{
              fontSize: 10, padding: "4px 12px", borderRadius: 20, fontWeight: 700,
              textTransform: "uppercase", letterSpacing: 0.5, whiteSpace: "nowrap",
              background: statusColor + "18", color: statusColor + "dd",
              border: `1px solid ${statusColor}30`,
            }}>
              {t.status}
            </span>
          </div>

          {/* Title */}
          <h1 style={{
            fontSize: isDesktop ? 32 : 22, fontWeight: 700, color: "var(--ink1)",
            margin: "0 0 16px", lineHeight: 1.3, maxWidth: 780,
          }}>
            {t.title}
          </h1>

          {/* Meta row */}
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap", alignItems: "center" }}>
            {heroMeta.map(m => (
              <div key={m.text} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 13 }}>{m.icon}</span>
                <span style={{ fontSize: 12, color: "var(--ink3)" }}>{m.text}</span>
              </div>
            ))}

            {primaryLink && (
              <a
                href={primaryLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  fontSize: 11, color: "var(--accent)", textDecoration: "none",
                  transition: "opacity 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.7"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >
                {primaryLinkLabel} ↗
              </a>
            )}
          </div>
        </Container>
      </div>

      {/* Body */}
      <Container style={{ paddingTop: 36, paddingBottom: 56 }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: isDesktop ? "minmax(0, 3fr) minmax(0, 2fr)" : "1fr",
          gap: 24,
          alignItems: "start",
        }}>

          {/* LEFT: Abstract + Topics */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {t.videoUrl && (
              <div style={{
                background: "var(--surface)",
                border: "1px solid var(--line)",
                borderRadius: 14,
                overflow: "hidden",
              }}>
                <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 12, color: t.color, fontWeight: 700 }}>▶</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "var(--ink1)", fontFamily: "monospace" }}>Talk Video</span>
                </div>
                <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${new URL(t.videoUrl).searchParams.get("v")}`}
                    title={`${t.title} video`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
                  />
                </div>
              </div>
            )}

            {t.featureImage && (
              <div style={{
                background: "var(--surface)",
                border: "1px solid var(--line)",
                borderRadius: 14,
                overflow: "hidden",
              }}>
                <button
                  type="button"
                  onClick={() => setActiveImageIndex(0)}
                  style={{
                    border: "none",
                    padding: 0,
                    margin: 0,
                    background: "transparent",
                    cursor: "zoom-in",
                    width: "100%",
                    textAlign: "left",
                  }}
                >
                  <img
                    src={t.featureImage}
                    alt={`${t.conference} ${t.edition} feature`}
                    style={{
                      width: "100%",
                      display: "block",
                      objectFit: "cover",
                      maxHeight: isDesktop ? 420 : 280,
                    }}
                  />
                </button>
              </div>
            )}

            {t.eventImages?.length > 0 && (
              <div style={{
                background: "var(--surface)",
                border: "1px solid var(--line)",
                borderRadius: 14,
                overflow: "hidden",
              }}>
                <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 12, color: t.color, fontWeight: 700 }}>◉</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "var(--ink1)", fontFamily: "monospace" }}>Event Gallery</span>
                </div>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: isDesktop ? "repeat(2, minmax(0, 1fr))" : "1fr",
                  gap: 2,
                  background: "var(--bg)",
                }}>
                  {t.eventImages.map((src, index) => (
                    <button
                      key={src}
                      style={{
                        border: "none",
                        padding: 0,
                        margin: 0,
                        background: "transparent",
                        cursor: "zoom-in",
                        textAlign: "left",
                      }}
                      type="button"
                      onClick={() => setActiveImageIndex((t.featureImage ? 1 : 0) + index)}
                    >
                      <img
                        src={src}
                        alt={`${t.conference} ${t.edition} gallery ${index + 1}`}
                        style={{
                          width: "100%",
                          height: isDesktop ? 220 : "auto",
                          display: "block",
                          objectFit: "cover",
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Abstract */}
            <div style={{
              background: `linear-gradient(135deg, ${t.color}0a 0%, transparent 60%)`,
              border: `1px solid ${t.color}22`, borderRadius: 14, padding: "26px 28px",
            }}>
              <h2 style={{
                fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5,
                color: t.color, margin: "0 0 14px",
              }}>Abstract</h2>
              <p style={{ fontSize: 14, color: "var(--ink2)", lineHeight: 2, margin: 0 }}>
                {t.abstract}
              </p>
            </div>

            {/* Topics covered */}
            <div style={{
              background: "var(--surface)", border: "1px solid var(--line)",
              borderRadius: 14, padding: "26px 28px",
            }}>
              <h2 style={{
                fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5,
                color: "var(--ink3)", margin: "0 0 18px",
              }}>
                <span style={{ color: t.color, marginRight: 8 }}>§</span>Topics Covered
              </h2>
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
                {t.topics.map((topic, i) => (
                  <li key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <span style={{
                      flexShrink: 0, width: 20, height: 20, borderRadius: 5,
                      background: t.color + "18", border: `1px solid ${t.color}30`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 9, fontWeight: 700, color: t.color, marginTop: 2,
                    }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span style={{ fontSize: 13, color: "var(--ink3)", lineHeight: 1.7 }}>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* RIGHT: Speaker card */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20, position: isDesktop ? "sticky" : "static", top: 80 }}>

            {/* Speaker */}
            <div style={{
              background: "var(--surface)", border: "1px solid var(--line)",
              borderRadius: 14, overflow: "hidden",
            }}>
              {/* Header accent */}
              <div style={{ height: 4, background: `linear-gradient(90deg, ${t.color}, ${t.color}44)` }} />

              <div style={{ padding: "24px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: "var(--ink4)", marginBottom: 16 }}>
                  Speaker
                </div>

                {/* Avatar + name */}
                <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 16 }}>
                  <img
                    src={SPEAKER_AVATAR}
                    alt={t.speaker.name}
                    style={{
                    width: 52, height: 52, borderRadius: "50%", flexShrink: 0,
                    objectFit: "cover",
                    border: `2px solid ${t.color}44`,
                  }}
                  />
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "var(--ink1)", lineHeight: 1.3 }}>
                      {t.speaker.name}
                    </div>
                    {t.speaker.company && (
                      <div style={{ fontSize: 12, color: "var(--ink3)", marginTop: 2 }}>
                        {t.speaker.company}
                      </div>
                    )}
                    <div style={{ fontSize: 11, color: "var(--ink4)", marginTop: 2 }}>
                      📍 {t.speaker.location}
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <p style={{
                  fontSize: 12, color: "var(--ink4)", lineHeight: 1.85, margin: "0 0 20px",
                  paddingTop: 16, borderTop: "1px solid var(--line)",
                }}>
                  {t.speaker.bio}
                </p>

                {/* Social links */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {t.speaker.social.github && (
                    <SocialLink href={t.speaker.social.github} label="misterpoloy" icon={GITHUB_ICON} />
                  )}
                  {t.speaker.social.linkedin && (
                    <SocialLink href={t.speaker.social.linkedin} label="juan-pablo-ortiz" icon="💼" />
                  )}
                  {t.speaker.social.instagram && (
                    <SocialLink href={t.speaker.social.instagram} label="@wildpasco" icon="📸" />
                  )}
                </div>
              </div>
            </div>

            {/* Conference quick-info */}
            <div style={{
              background: "var(--surface)", border: "1px solid var(--line)",
              borderRadius: 14, padding: "20px 24px",
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: "var(--ink4)", marginBottom: 14 }}>
                Event Info
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { label: "Conference", value: `${t.conference} ${t.edition}` },
                  t.date ? { label: "Date", value: t.date } : null,
                  t.time ? { label: "Time", value: t.time } : null,
                  { label: "Location", value: `${[t.city, t.country].filter(Boolean).join(", ")} ${t.flag}`.trim() },
                  { label: "Status", value: t.status },
                ].filter(Boolean).map(row => (
                  <div key={row.label} style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
                    <span style={{ fontSize: 11, color: "var(--ink4)", flexShrink: 0 }}>{row.label}</span>
                    <span style={{ fontSize: 12, color: "var(--ink2)", fontWeight: 600, textAlign: "right" }}>{row.value}</span>
                  </div>
                ))}
              </div>

              {primaryLink && (
                <a
                  href={primaryLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    marginTop: 18, padding: "10px", borderRadius: 8, textDecoration: "none",
                    background: t.color + "15", border: `1px solid ${t.color}33`,
                    color: t.color, fontSize: 12, fontWeight: 700,
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = t.color + "25"}
                  onMouseLeave={e => e.currentTarget.style.background = t.color + "15"}
                >
                  {primaryLinkLabel} ↗
                </a>
              )}
            </div>

          </div>
        </div>
      </Container>

      <ImageLightbox
        images={galleryImages}
        activeIndex={activeImageIndex}
        onClose={() => setActiveImageIndex(null)}
        title={`${t.conference} ${t.edition}`}
      />
    </main>
  );
}
