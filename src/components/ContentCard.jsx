export default function ContentCard({
  title,
  subtitle,
  description,
  tags = [],
  color,
  icon,
  badge,
  image,
  imageAlt,
  footerAction,
}) {
  return (
    <article
      style={{
        background: "var(--surface)",
        border: "1px solid var(--line)",
        borderRadius: 12,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "border-color 0.2s, box-shadow 0.2s",
        cursor: "pointer",
        height: "100%",
        minWidth: 0,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = color + "55";
        e.currentTarget.style.boxShadow = `0 0 28px ${color}0d`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = "var(--line)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {image && (
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "16/6",
            overflow: "hidden",
            background: "var(--bg)",
            flexShrink: 0,
          }}
        >
          <img
            src={image}
            alt={imageAlt ?? `${title} preview`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              transition: "transform 0.4s ease",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "scale(1.04)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "scale(1)";
            }}
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

      <div style={{ padding: "16px 20px 20px", display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
        <header>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8, gap: 12, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
              {icon && (
                <span
                  style={{
                    fontSize: 15,
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    flexShrink: 0,
                    background: color + "18",
                    border: `1px solid ${color}30`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color,
                  }}
                >
                  {icon}
                </span>
              )}
                <h2
                  style={{
                    fontSize: 17,
                    fontWeight: 700,
                    color: "var(--ink1)",
                    margin: 0,
                    fontFamily: "monospace",
                    overflowWrap: "anywhere",
                  }}
                >
                  {title}
                </h2>
              </div>
            {badge}
          </div>
          {subtitle && (
            <p
              style={{
                fontSize: 12,
                color: "var(--ink3)",
                margin: 0,
                fontFamily: "monospace",
                fontStyle: "italic",
                lineHeight: 1.7,
                overflowWrap: "anywhere",
              }}
            >
              {subtitle}
            </p>
          )}
        </header>

        {description && (
          <p style={{ fontSize: 12, color: "var(--ink4)", lineHeight: 1.8, margin: 0, fontFamily: "monospace", overflowWrap: "anywhere" }}>
            {description}
          </p>
        )}

        {(tags.length > 0 || footerAction) && (
          <footer
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 10,
              marginTop: "auto",
            }}
          >
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {tags.map(tag => (
                <span
                  key={tag}
                  style={{
                    fontSize: 12,
                    padding: "2px 8px",
                    borderRadius: 4,
                    fontFamily: "monospace",
                    background: color + "15",
                    color: color + "cc",
                    border: `1px solid ${color}30`,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
            {footerAction}
          </footer>
        )}
      </div>
    </article>
  );
}
