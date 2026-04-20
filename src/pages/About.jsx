export default function About() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "monospace", color: "var(--ink2)" }}>
      <header style={{ borderBottom: "1px solid var(--line)", padding: "28px 40px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <span style={{
            fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2,
            color: "var(--accent)", background: "var(--tint)", border: "1px solid var(--tintb)25",
            padding: "3px 9px", borderRadius: 20,
          }}>About</span>
        </div>
        <h1 style={{ fontSize: 25, fontWeight: 700, color: "var(--ink1)", margin: "0 0 6px" }}>
          Juan Pablo
        </h1>
        <p style={{ fontSize: 12, color: "var(--ink4)", margin: 0, maxWidth: 520, lineHeight: 1.8 }}>
          Software engineer, builder, and open source contributor.
        </p>
      </header>

      <section style={{ padding: "60px 40px", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <span style={{ fontSize: 35 }}>👤</span>
        <p style={{ fontSize: 15, color: "var(--ink5)", margin: 0 }}>Coming soon</p>
      </section>
    </main>
  );
}
