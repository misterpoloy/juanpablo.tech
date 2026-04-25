import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { TALKS } from "../talks/registry.js";
import { useDocumentMeta } from "../hooks/useDocumentMeta.js";

const SPEAKER_AVATAR = "/img/profile.jpg";

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

function StatusPill({ status, color }) {
  const isDelivered = status === "Delivered";
  return (
    <span style={{
      fontSize: 10, padding: "3px 10px", borderRadius: 20, fontFamily: "monospace",
      fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase", whiteSpace: "nowrap",
      background: (isDelivered ? "#3fb950" : "#D97706") + "18",
      color: (isDelivered ? "#3fb950" : "#D97706") + "cc",
      border: `1px solid ${(isDelivered ? "#3fb950" : "#D97706")}30`,
    }}>
      {status}
    </span>
  );
}

function TalkCard({ talk: t, compact }) {
  const locationLine = [t.city, t.country].filter(Boolean).join(", ");
  const eventMeta = [locationLine, t.date].filter(Boolean).join(" · ");

  return (
    <Link to={`/speaker/${t.id}`} style={{ textDecoration: "none", display: "block", minWidth: 0 }}>
      <article
        style={{
          background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 14,
          overflow: "hidden", display: "flex", flexDirection: "column",
          transition: "border-color 0.2s, box-shadow 0.2s, transform 0.2s", cursor: "pointer",
          minWidth: 0,
          height: "100%",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = t.color + "66";
          e.currentTarget.style.boxShadow = `0 8px 32px ${t.color}14`;
          e.currentTarget.style.transform = "translateY(-2px)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = "var(--line)";
          e.currentTarget.style.boxShadow = "none";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        {t.featureImage && (
          <div
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: compact ? "16 / 9" : "16 / 7",
              overflow: "hidden",
              background: "var(--bg)",
            }}
          >
            <img
              src={t.featureImage}
              alt={`${t.conference} ${t.edition} feature`}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top, var(--surface) 0%, var(--fade) 40%, transparent 100%)",
                pointerEvents: "none",
              }}
            />
          </div>
        )}

        {/* Color accent bar */}
        <div style={{ height: 3, background: `linear-gradient(90deg, ${t.color}, ${t.color}44)` }} />

        <div style={{ padding: compact ? "18px" : "24px 26px", display: "flex", flexDirection: "column", gap: 16, flex: 1, minWidth: 0 }}>

          {/* Top: conference + status */}
          <div style={{ display: "flex", alignItems: compact ? "flex-start" : "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0, flex: "1 1 220px" }}>
              <span style={{ fontSize: compact ? 20 : 22, flexShrink: 0 }}>{t.flag}</span>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: t.color, fontFamily: "monospace", letterSpacing: 0.5, lineHeight: 1.5 }}>
                  {t.conference} {t.edition}
                </div>
                {eventMeta && (
                  <div style={{ fontSize: 11, color: "var(--ink4)", fontFamily: "monospace", lineHeight: 1.6, overflowWrap: "anywhere" }}>
                    {eventMeta}
                  </div>
                )}
              </div>
            </div>
            <StatusPill status={t.status} color={t.color} />
          </div>

          {/* Talk title */}
          <h2 style={{
            fontSize: compact ? 16 : 18, fontWeight: 700, color: "var(--ink1)", margin: 0,
            fontFamily: "monospace", lineHeight: 1.4,
          }}>
            {t.title}
          </h2>

          {/* Abstract preview */}
          <p
            style={{
              fontSize: 12,
              color: "var(--ink4)",
              lineHeight: 1.85,
              margin: 0,
              fontFamily: "monospace",
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: compact ? 5 : 4,
              overflow: "hidden",
            }}
          >
            {t.abstract.slice(0, 180)}…
          </p>

          {/* Footer: speaker + time */}
          <div style={{
            display: "flex", alignItems: compact ? "flex-start" : "center", justifyContent: "space-between",
            flexWrap: "wrap", gap: 10, paddingTop: 12, borderTop: "1px solid var(--line)",
            marginTop: "auto",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0, flex: "1 1 200px" }}>
              <img
                src={SPEAKER_AVATAR}
                alt={t.speaker.name}
                style={{
                width: 28, height: 28, borderRadius: "50%",
                objectFit: "cover",
                border: `1px solid ${t.color}44`,
                flexShrink: 0,
              }}
              />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink2)", fontFamily: "monospace", overflowWrap: "anywhere" }}>{t.speaker.name}</div>
                {t.speaker.company && (
                  <div style={{ fontSize: 10, color: "var(--ink4)", fontFamily: "monospace", overflowWrap: "anywhere" }}>{t.speaker.company}</div>
                )}
              </div>
            </div>
            {t.time && (
              <div style={{ fontSize: 11, color: "var(--ink4)", fontFamily: "monospace", whiteSpace: "nowrap" }}>
                🕐 {t.time}
              </div>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}

export default function Talks() {
  const isMobile = useMediaQuery("(max-width: 700px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");

  useDocumentMeta({
    title: "Talks by Juan Pablo Ortiz (@wildpasco)",
    description:
      "Conference talks and speaking engagements by Juan Pablo Ortiz (@wildpasco) on AWS, cloud architecture, Kubernetes, and developer tooling.",
    path: "/talks",
  });

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "monospace", color: "var(--ink2)" }}>

      <header style={{ borderBottom: "1px solid var(--line)", padding: isMobile ? "24px 18px 20px" : isTablet ? "28px 24px 24px" : "28px 40px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <span style={{
            fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2,
            color: "var(--accent)", background: "var(--tint)", border: "1px solid var(--tintb)25",
            padding: "3px 9px", borderRadius: 20,
          }}>Speaking</span>
        </div>
        <h1 style={{ fontSize: isMobile ? 22 : 25, fontWeight: 700, color: "var(--ink1)", margin: "0 0 6px", lineHeight: 1.2 }}>
          Talks & Conferences
        </h1>
        <p style={{ fontSize: 12, color: "var(--ink4)", margin: 0, maxWidth: 540, lineHeight: 1.85 }}>
          A record of public talks, conference sessions, and community appearances
          covering JavaScript performance, cloud architecture, and engineering practices.
        </p>
      </header>

      <section style={{ padding: isMobile ? "20px 18px 28px" : isTablet ? "28px 24px 36px" : "36px 40px" }}>
        {/* Cards grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))", gap: isMobile ? 16 : 20 }}>
          {TALKS.map(t => <TalkCard key={t.id} talk={t} compact={isMobile} />)}
        </div>
      </section>

    </main>
  );
}
