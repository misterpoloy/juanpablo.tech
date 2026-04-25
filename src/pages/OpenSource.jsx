import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PROJECTS } from "../projects/registry.js";
import { StatusBadge, GitHubButton } from "../components/ProjectUI.jsx";
import ContentCard from "../components/ContentCard.jsx";
import { useDocumentMeta } from "../hooks/useDocumentMeta.js";

const MAX_DESC = 400;

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

function truncate(text) {
  if (!text || text.length <= MAX_DESC) return text;
  return text.slice(0, text.lastIndexOf(" ", MAX_DESC)) + "…";
}

function ProjectCard({ project: p }) {
  return (
    <Link to={`/open-source/${p.id}`} style={{ textDecoration: "none", display: "block", minWidth: 0 }}>
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
  const isMobile = useMediaQuery("(max-width: 700px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");

  useDocumentMeta({
    title: "Open Source | Juan Pablo Ortiz (@wildpasco)",
    description:
      "Open-source projects by Juan Pablo Ortiz (@wildpasco): YT Local, ShadowCursor, SmartQuiz, and other developer tools built around AWS and cloud engineering.",
    path: "/open-source",
  });

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "monospace", color: "var(--ink2)" }}>
      <header style={{ borderBottom: "1px solid var(--line)", padding: isMobile ? "24px 18px 20px" : isTablet ? "28px 24px 24px" : "28px 40px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <span style={{
            fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2,
            color: "var(--accent)", background: "var(--tint)", border: "1px solid var(--tintb)25",
            padding: "3px 9px", borderRadius: 20,
          }}>Open Source</span>
        </div>
        <h1 style={{ fontSize: isMobile ? 22 : 25, fontWeight: 700, color: "var(--ink1)", margin: "0 0 6px", lineHeight: 1.2 }}>
          Side projects & tools
        </h1>
        <p style={{ fontSize: 12, color: "var(--ink4)", margin: 0, maxWidth: 520, lineHeight: 1.8 }}>
          Personal projects built to scratch my own itches, shipped as open source so they're useful to others too.
          Focused on developer tooling, browser extensions, and AI-augmented workflows.
        </p>
      </header>

      <section
        aria-label="Open source projects"
        style={{
          padding: isMobile ? "20px 18px 28px" : isTablet ? "28px 24px 36px" : "32px 40px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
          gap: isMobile ? 16 : 20,
        }}
      >
        {PROJECTS.map(p => <ProjectCard key={p.id} project={p} />)}
      </section>
    </main>
  );
}
