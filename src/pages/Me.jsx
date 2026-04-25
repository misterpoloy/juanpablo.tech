import { useDocumentMeta } from "../hooks/useDocumentMeta.js";

const PROFILE_PHOTO = "/img/profile.jpg";

const SOCIAL_LINKS = [
  {
    href: "https://www.linkedin.com/in/juan-pablo-ortiz/",
    label: "linkedin.com/in/juan-pablo-ortiz",
    icon: <LinkedInIcon />,
  },
  {
    href: "https://github.com/misterpoloy",
    label: "github.com/misterpoloy",
    icon: <GitHubIcon />,
  },
  {
    href: "https://www.tiktok.com/@wildpasco/",
    label: "tiktok.com/@wildpasco",
    icon: <TikTokIcon />,
  },
  {
    href: "https://www.twitch.tv/wildpasco",
    label: "twitch.tv/wildpasco",
    icon: <TwitchIcon />,
  },
  {
    href: "https://www.youtube.com/@wildpasco",
    label: "youtube.com/@wildpasco",
    icon: <YouTubeIcon />,
  },
];

function IconFrame({ children }) {
  return (
    <span
      aria-hidden="true"
      style={{
        width: 24,
        height: 24,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {children}
    </span>
  );
}

function LinkedInIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6.94 8.5H3.56V20h3.38zm.22-3.68C7.16 3.75 6.3 3 5.27 3S3.38 3.75 3.38 4.82c0 1.05.84 1.82 1.86 1.82h.02c1.05 0 1.9-.77 1.9-1.82M20.62 20h-3.38v-6.12c0-1.54-.55-2.58-1.93-2.58-1.05 0-1.68.71-1.95 1.39-.1.25-.12.61-.12.97V20H9.86s.05-10.45 0-11.5h3.38v1.63c.45-.7 1.25-1.7 3.04-1.7 2.22 0 3.89 1.45 3.89 4.56z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M14.67 3h2.65c.2 1.7 1.17 3.26 2.68 4.16 1.01.61 2.18.92 3.36.92v2.81a9.5 9.5 0 01-5.03-1.43v6.14a6.6 6.6 0 11-6.6-6.6c.33 0 .67.03.99.08v2.89a3.8 3.8 0 00-.99-.13 3.72 3.72 0 103.72 3.72V3z" />
    </svg>
  );
}

function TwitchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4 2 2 7v13h4v2h2l2-2h3l5-5V2H4zm12 12-3 3h-3l-2 2v-2H5V4h11z" />
      <path d="M9 7h2v5H9zm5 0h2v5h-2z" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.5 6.2a2.98 2.98 0 0 0-2.1-2.11C19.54 3.6 12 3.6 12 3.6s-7.54 0-9.4.49A2.98 2.98 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 2.98 2.98 0 0 0 2.1 2.11c1.86.49 9.4.49 9.4.49s7.54 0 9.4-.49a2.98 2.98 0 0 0 2.1-2.11A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.8M9.6 15.6V8.4l6.25 3.6z" />
    </svg>
  );
}

function SocialLink({ href, label, icon }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        width: "100%",
        minHeight: 64,
        padding: "0 18px",
        borderRadius: 14,
        textDecoration: "none",
        color: "var(--ink2)",
        background: "var(--surface)",
        border: "1px solid var(--line)",
        boxShadow: "0 0 0 transparent",
        transition: "border-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease, color 0.15s ease",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-1px)";
        e.currentTarget.style.borderColor = "var(--line2)";
        e.currentTarget.style.boxShadow = "0 10px 28px rgba(31, 111, 235, 0.08)";
        e.currentTarget.style.color = "var(--ink1)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translate(0, 0)";
        e.currentTarget.style.borderColor = "var(--line)";
        e.currentTarget.style.boxShadow = "0 0 0 transparent";
        e.currentTarget.style.color = "var(--ink2)";
      }}
    >
      <IconFrame>{icon}</IconFrame>
      <span style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.4, wordBreak: "break-word" }}>{label}</span>
    </a>
  );
}

export default function Me() {
  useDocumentMeta({
    title: "@wildpasco | Juan Pablo Ortiz social links",
    description:
      "Social links for Juan Pablo Ortiz (@wildpasco): LinkedIn, GitHub, YouTube, TikTok, Twitch, and Instagram. Spanish-language content on AWS, cloud engineering, and Kubernetes.",
    path: "/me",
  });

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        padding: "44px 20px 72px",
      }}
    >
      <div
        style={{
          maxWidth: 420,
          margin: "0 auto",
          borderRadius: 20,
          border: "1px solid var(--line)",
          background: "linear-gradient(180deg, var(--surface) 0%, color-mix(in srgb, var(--surface) 84%, var(--accent) 16%) 100%)",
          padding: "32px 20px 24px",
          boxShadow: "0 24px 60px rgba(0, 0, 0, 0.22)",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          <img
            src={PROFILE_PHOTO}
            alt="Juan Pablo Ortiz (@wildpasco)"
            style={{
              width: 92,
              height: 92,
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid var(--line2)",
              marginBottom: 16,
            }}
          />
          <h1 style={{ fontSize: 26, color: "var(--ink1)", margin: 0, lineHeight: 1.15 }}>
            Juan Pablo Ortiz
          </h1>
          <p style={{ fontSize: 14, color: "var(--accent)", margin: "4px 0 0", fontWeight: 600 }}>@wildpasco</p>
          <p style={{ fontSize: 12, color: "var(--ink4)", margin: "8px 0 0", lineHeight: 1.7, maxWidth: 280 }}>
            Guatemalan software engineer based in Mexico City, building cloud systems, developer tools, and Spanish-language
            content around code, AWS, and performance.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 28 }}>
          {SOCIAL_LINKS.map(link => (
            <SocialLink key={link.href} href={link.href} label={link.label} icon={link.icon} />
          ))}
        </div>
      </div>
    </main>
  );
}
