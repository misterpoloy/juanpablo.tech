import { Link } from "react-router-dom";
import { DIAGRAMS } from "../diagrams/registry.js";
import ContentCard from "../components/ContentCard.jsx";

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "monospace", color: "var(--ink2)" }}>
      <div style={{ borderBottom: "1px solid var(--line)", padding: "28px 40px 24px" }}>
        <h1 style={{ fontSize: 23, fontWeight: 700, color: "var(--ink1)", margin: 0 }}>AWS Architecture Viewer</h1>
        <p style={{ fontSize: 12, color: "var(--ink4)", margin: "4px 0 0" }}>Interactive diagrams for cloud system design</p>
        <p style={{ fontSize: 12, color: "var(--ink4)", margin: "10px 0 0", maxWidth: 560, lineHeight: 1.8 }}>
          A curated set of interactive cloud architecture diagrams focused on modern AWS system design.
          Explore production-style patterns for networking, service-to-service communication, configuration,
          event-driven workflows, and managed infrastructure components.
        </p>
      </div>

      <div style={{ padding: "32px 40px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
        {DIAGRAMS.map(d => (
          <Link key={d.slug} to={`/diagram/${d.slug}`} style={{ textDecoration: "none" }}>
            <ContentCard
              title={d.title}
              subtitle={d.cardSubtitle}
              description={d.description}
              tags={d.tags}
              color={d.color}
              icon={d.icon}
              badge={d.badge}
              image={d.banner}
              imageAlt={d.bannerAlt ?? `${d.title} preview`}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
