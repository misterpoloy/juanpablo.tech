const GUIDES = [
  {
    title: "Data Structures Cheat Sheet",
    description: "Core data structure patterns, complexity notes, and quick reminders for interviews and day-to-day problem solving.",
  },
  {
    title: "Kubernetes Interview Cheat Sheet Code",
    description: "A focused prep sheet covering common Kubernetes interview topics, architecture concepts, and practical examples.",
  },
  {
    title: "Kubernetes commands Cheat Sheat",
    description: "A fast reference for the `kubectl` commands you reach for most when inspecting, deploying, and debugging clusters.",
  },
  {
    title: "Docker commands Cheat Sheet",
    description: "Useful Docker commands for images, containers, networks, volumes, and local development workflows.",
  },
  {
    title: "Javascript interview guide",
    description: "A concise study guide for JavaScript interviews, including language fundamentals, async behavior, and common edge cases.",
  },
];

function DownloadButton() {
  return (
    <button
      type="button"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        minWidth: 132,
        padding: "9px 14px",
        borderRadius: 8,
        border: "1px solid var(--line2)",
        background: "var(--surface)",
        color: "var(--ink2)",
        fontSize: 12,
        fontFamily: "monospace",
        fontWeight: 700,
        cursor: "pointer",
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
      Download PDF
    </button>
  );
}

function GuideRow({ guide, index }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 2fr) auto",
        gap: 20,
        alignItems: "center",
        padding: "18px 22px",
        borderTop: index === 0 ? "none" : "1px solid var(--line)",
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--ink1)", lineHeight: 1.5 }}>
          {guide.title}
        </div>
      </div>

      <div style={{ minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 12, color: "var(--ink4)", lineHeight: 1.8 }}>
          {guide.description}
        </p>
      </div>

      <div style={{ justifySelf: "end" }}>
        <DownloadButton />
      </div>
    </div>
  );
}

export default function DownloadGuides() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "monospace", color: "var(--ink2)" }}>
      <header style={{ borderBottom: "1px solid var(--line)", padding: "28px 40px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <span style={{
            fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2,
            color: "var(--accent)", background: "var(--tint)", border: "1px solid var(--tintb)25",
            padding: "3px 9px", borderRadius: 20,
          }}>Guides</span>
        </div>
        <h1 style={{ fontSize: 25, fontWeight: 700, color: "var(--ink1)", margin: "0 0 6px" }}>
          Download Guides
        </h1>
        <p style={{ fontSize: 12, color: "var(--ink4)", margin: 0, maxWidth: 600, lineHeight: 1.8 }}>
          A growing library of quick-reference PDFs for interviews, cloud tooling, and day-to-day engineering work.
          The download actions are styled and ready; we can wire them to the real files next.
        </p>
      </header>

      <section style={{ padding: "36px 40px 56px" }}>
        <div style={{
          maxWidth: 1120,
          margin: "0 auto",
          background: "var(--surface)",
          border: "1px solid var(--line)",
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 18px 40px rgba(0, 0, 0, 0.14)",
        }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 2fr) auto",
            gap: 20,
            padding: "16px 22px",
            background: "linear-gradient(180deg, var(--surface2) 0%, var(--surface) 100%)",
            borderBottom: "1px solid var(--line)",
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink5)", textTransform: "uppercase", letterSpacing: 1.5 }}>
              Title
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink5)", textTransform: "uppercase", letterSpacing: 1.5 }}>
              Description
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink5)", textTransform: "uppercase", letterSpacing: 1.5, textAlign: "right" }}>
              Action
            </div>
          </div>

          {GUIDES.map((guide, index) => (
            <GuideRow key={guide.title} guide={guide} index={index} />
          ))}
        </div>
      </section>
    </main>
  );
}
