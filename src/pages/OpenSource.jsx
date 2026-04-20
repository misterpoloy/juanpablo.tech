import { Link } from "react-router-dom";
import { PROJECTS } from "../projects/registry.js";
import { StatusBadge, GitHubButton } from "../components/ProjectUI.jsx";
import ContentCard from "../components/ContentCard.jsx";

const MAX_DESC = 400;
function truncate(text) {
  if (!text || text.length <= MAX_DESC) return text;
  return text.slice(0, text.lastIndexOf(" ", MAX_DESC)) + "…";
}

function ProjectCard({ project: p }) {
  return (
    <Link to={`/open-source/${p.id}`} style={{ textDecoration: "none" }}>
      <ContentCard
        title={p.name}
        subtitle={p.tagline}
        description={truncate(p.description)}
        tags={p.tags}
        color={p.color}
        icon={p.icon}
        badge={<StatusBadge status={p.status} />}
        image={p.banner}
        imageAlt={`${p.name} preview`}
        footerAction={
          <div onClick={e => e.stopPropagation()}>
            <GitHubButton href={p.github} label={p.linkLabel} />
          </div>
        }
      />
    </Link>
  );
}

export default function OpenSource() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "monospace", color: "var(--ink2)" }}>
      <header style={{ borderBottom: "1px solid var(--line)", padding: "28px 40px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <span style={{
            fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2,
            color: "var(--accent)", background: "var(--tint)", border: "1px solid var(--tintb)25",
            padding: "3px 9px", borderRadius: 20,
          }}>Open Source</span>
        </div>
        <h1 style={{ fontSize: 25, fontWeight: 700, color: "var(--ink1)", margin: "0 0 6px" }}>
          Side projects & tools
        </h1>
        <p style={{ fontSize: 12, color: "var(--ink4)", margin: 0, maxWidth: 520, lineHeight: 1.8 }}>
          Personal projects built to scratch my own itches — shipped as open source so they're useful to others too.
          Focused on developer tooling, browser extensions, and AI-augmented workflows.
        </p>
      </header>

      <section
        aria-label="Open source projects"
        style={{ padding: "32px 40px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: 20 }}
      >
        {PROJECTS.map(p => <ProjectCard key={p.id} project={p} />)}
      </section>
    </main>
  );
}
