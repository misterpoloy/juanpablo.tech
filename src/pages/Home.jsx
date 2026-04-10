import { Link } from "react-router-dom";

const DIAGRAMS = [
  {
    slug: "multi-tenant-config",
    title: "Multi-Tenant Config Service",
    description: "ECS Fargate microservices · gRPC · DynamoDB/SSM strategy pattern · EventBridge-driven refresh",
    tags: ["ECS", "Fargate", "gRPC", "DynamoDB", "EventBridge"],
    color: "#D97706",
  },
];

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", background: "#0d1117", fontFamily: "monospace", color: "#c9d1d9" }}>
      {/* Header */}
      <div style={{ borderBottom: "1px solid #21262d", padding: "24px 40px" }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#e6edf3", margin: 0 }}>AWS Architecture Viewer</h1>
        <p style={{ fontSize: 11, color: "#6b7280", margin: "4px 0 0" }}>Interactive diagrams for cloud system design</p>
      </div>

      {/* Grid */}
      <div style={{ padding: "32px 40px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
        {DIAGRAMS.map(d => (
          <Link key={d.slug} to={`/diagram/${d.slug}`} style={{ textDecoration: "none" }}>
            <div style={{
              background: "#161b22", border: "1px solid #21262d", borderRadius: 12, padding: "20px 22px",
              cursor: "pointer", transition: "border-color 0.2s, box-shadow 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = d.color + "66"; e.currentTarget.style.boxShadow = `0 0 20px ${d.color}10`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#21262d"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: d.color, flexShrink: 0 }} />
                <h2 style={{ fontSize: 13, fontWeight: 700, color: "#e6edf3", margin: 0 }}>{d.title}</h2>
              </div>
              <p style={{ fontSize: 10, color: "#6b7280", lineHeight: 1.7, margin: "0 0 14px" }}>{d.description}</p>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {d.tags.map(t => (
                  <span key={t} style={{ fontSize: 9, background: "#21262d", color: "#8b949e", padding: "2px 7px", borderRadius: 4 }}>{t}</span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
