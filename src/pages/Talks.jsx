import { Link } from "react-router-dom";
import { TALKS } from "../talks/registry.js";

const SPEAKER_AVATAR = "/img/profile.jpg";

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

function TalkCard({ talk: t }) {
  const locationLine = [t.city, t.country].filter(Boolean).join(", ");
  const eventMeta = [locationLine, t.date].filter(Boolean).join(" · ");

  return (
    <Link to={`/speaker/${t.id}`} style={{ textDecoration: "none" }}>
      <article
        style={{
          background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 14,
          overflow: "hidden", display: "flex", flexDirection: "column",
          transition: "border-color 0.2s, box-shadow 0.2s, transform 0.2s", cursor: "pointer",
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
          <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 7", overflow: "hidden", background: "var(--bg)" }}>
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

        <div style={{ padding: "24px 26px", display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>

          {/* Top: conference + status */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 22 }}>{t.flag}</span>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: t.color, fontFamily: "monospace", letterSpacing: 0.5 }}>
                  {t.conference} {t.edition}
                </div>
                {eventMeta && (
                  <div style={{ fontSize: 11, color: "var(--ink4)", fontFamily: "monospace" }}>
                    {eventMeta}
                  </div>
                )}
              </div>
            </div>
            <StatusPill status={t.status} color={t.color} />
          </div>

          {/* Talk title */}
          <h2 style={{
            fontSize: 18, fontWeight: 700, color: "var(--ink1)", margin: 0,
            fontFamily: "monospace", lineHeight: 1.4,
          }}>
            {t.title}
          </h2>

          {/* Abstract preview */}
          <p style={{ fontSize: 12, color: "var(--ink4)", lineHeight: 1.85, margin: 0, fontFamily: "monospace" }}>
            {t.abstract.slice(0, 180)}…
          </p>

          {/* Footer: speaker + time */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexWrap: "wrap", gap: 10, paddingTop: 12, borderTop: "1px solid var(--line)",
            marginTop: "auto",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
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
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink2)", fontFamily: "monospace" }}>{t.speaker.name}</div>
                {t.speaker.company && (
                  <div style={{ fontSize: 10, color: "var(--ink4)", fontFamily: "monospace" }}>{t.speaker.company}</div>
                )}
              </div>
            </div>
            {t.time && (
              <div style={{ fontSize: 11, color: "var(--ink4)", fontFamily: "monospace" }}>
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
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "monospace", color: "var(--ink2)" }}>

      <header style={{ borderBottom: "1px solid var(--line)", padding: "28px 40px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <span style={{
            fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2,
            color: "var(--accent)", background: "var(--tint)", border: "1px solid var(--tintb)25",
            padding: "3px 9px", borderRadius: 20,
          }}>Speaking</span>
        </div>
        <h1 style={{ fontSize: 25, fontWeight: 700, color: "var(--ink1)", margin: "0 0 6px" }}>
          Talks & Conferences
        </h1>
        <p style={{ fontSize: 12, color: "var(--ink4)", margin: 0, maxWidth: 540, lineHeight: 1.85 }}>
          A record of public talks, conference sessions, and community appearances —
          covering JavaScript performance, cloud architecture, and engineering practices.
        </p>
      </header>

      <section style={{ padding: "36px 40px" }}>
        {/* Cards grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(420px, 1fr))", gap: 20 }}>
          {TALKS.map(t => <TalkCard key={t.id} talk={t} />)}
        </div>
      </section>

    </main>
  );
}
