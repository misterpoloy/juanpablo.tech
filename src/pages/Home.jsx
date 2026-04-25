import { Link } from "react-router-dom";
import { DIAGRAMS } from "../diagrams/registry.js";
import ContentCard from "../components/ContentCard.jsx";
import { useDocumentMeta } from "../hooks/useDocumentMeta.js";

export default function Home() {
  useDocumentMeta({
    title: "AWS Architecture Diagrams",
    description:
      "Interactive AWS architecture diagrams covering real-world cloud system design patterns, ECS, Kubernetes, multi-tenant services, and infrastructure decisions.",
    path: "/architecture",
  });

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "monospace", color: "var(--ink2)" }}>
      <div style={{ borderBottom: "1px solid var(--line)", padding: "28px 40px 24px" }}>
        <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, color: "var(--accent)", margin: 0 }}>
          Architecture Diagrams
        </p>
        <h1 style={{ fontSize: 23, fontWeight: 700, color: "var(--ink1)", margin: "8px 0 0" }}>
          AWS Architecture Viewer
        </h1>
        <p style={{ fontSize: 12, color: "var(--ink4)", margin: "6px 0 0", maxWidth: 560, lineHeight: 1.8 }}>
          Interactive cloud architecture diagrams covering real-world AWS system design patterns. Each diagram
          is explorable, with node-level details on services, trade-offs, and infrastructure decisions.
        </p>
      </div>

      <div style={{ padding: "16px 40px 32px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
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
