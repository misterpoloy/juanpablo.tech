import { useEffect, useState } from "react";

const PROFILE_PHOTO = "/img/profile.jpg";
const COMPANY_LINK_STYLE = {
  color: "inherit",
  textDecorationColor: "var(--line2)",
  textUnderlineOffset: "2px",
};

const BIO = [
  (
    <>
      Juan Pablo Ortiz, known online as{" "}
      <strong style={{ color: "var(--ink2)" }}>@wildpasco</strong>, is a Guatemalan software engineer, entrepreneur,
      and technical educator based in Mexico City. He specializes in cloud architecture, DevOps, and Site Reliability
      Engineering, with a focus on scalable distributed systems, platform infrastructure, and developer tooling.
    </>
  ),
  (
    <>
      Ortiz began programming at the age of 16 and is largely self-taught, later attending{" "}
      <strong style={{ color: "var(--ink2)" }}>Universidad Galileo</strong> in Guatemala before dropping out to
      pursue engineering work full-time. Over a career spanning{" "}
      <strong style={{ color: "var(--ink2)" }}>more than 10 years</strong>, he has held engineering positions at{" "}
      <a href="https://www.thomsonreuters.com/en" target="_blank" rel="noopener noreferrer" style={COMPANY_LINK_STYLE}>
        <strong style={{ color: "var(--ink2)" }}>Thomson Reuters</strong>
      </a>,{" "}
      <a href="https://www.audible.com/" target="_blank" rel="noopener noreferrer" style={COMPANY_LINK_STYLE}>
        <strong style={{ color: "var(--ink2)" }}>Audible (Amazon)</strong>
      </a>,{" "}
      <a href="https://www.oracle.com/" target="_blank" rel="noopener noreferrer" style={COMPANY_LINK_STYLE}>
        <strong style={{ color: "var(--ink2)" }}>Oracle</strong>
      </a>,{" "}
      <a href="https://www.angi.com/" target="_blank" rel="noopener noreferrer" style={COMPANY_LINK_STYLE}>
        <strong style={{ color: "var(--ink2)" }}>Angi</strong>
      </a>,{" "}
      <a href="https://belonghome.com/" target="_blank" rel="noopener noreferrer" style={COMPANY_LINK_STYLE}>
        <strong style={{ color: "var(--ink2)" }}>BelongHome</strong>
      </a>, and{" "}
      <a href="https://www.sofiasalud.com/" target="_blank" rel="noopener noreferrer" style={COMPANY_LINK_STYLE}>
        <strong style={{ color: "var(--ink2)" }}>Sofia Salud</strong>
      </a>, where he was among the first three engineers on the team. His work has centered on AWS
      architecture, Kubernetes, CI/CD automation, observability, and backend modernization for systems operating at
      global scale.
    </>
  ),
  (
    <>
      He is the founder of <strong style={{ color: "var(--ink2)" }}>SmartQuiz</strong>, an AI-powered cloud
      certification preparation platform available on iOS with an active subscriber base. He also co-developed{" "}
      <strong style={{ color: "var(--ink2)" }}>AVI</strong>, an artificial intelligence accessibility project that
      received recognition from <strong style={{ color: "var(--ink2)" }}>Microsoft</strong> and{" "}
      <strong style={{ color: "var(--ink2)" }}>Forbes</strong>.
    </>
  ),
  (
    <>
      As a technical educator, Ortiz produces Spanish-language content on artificial intelligence, Kubernetes, and
      cloud engineering across YouTube and short-form platforms, reaching an audience of{" "}
      <strong style={{ color: "var(--ink2)" }}>more than 35,000 followers</strong>. He holds the{" "}
      <strong style={{ color: "var(--ink2)" }}>AWS Solutions Architect Associate</strong> and{" "}
      <strong style={{ color: "var(--ink2)" }}>AWS Cloud Practitioner</strong> certifications.
    </>
  ),
];

const QUICK_FACTS = [
  ["Occupation", "Senior DevOps & SRE engineer"],
  ["Also known as", "@wildpasco (YouTube, TikTok, Twitch, Instagram)"],
  ["Focus areas", "AWS infrastructure, CI/CD, observability, backend modernization"],
  ["Location", "Mexico City, Mexico"],
  ["Origin", "Guatemala"],
  ["Experience", "10+ years"],
  ["Known for", "Cloud reliability, AWS architecture, developer tooling, technical education"],
  ["Website", "juanpablo.tech"],
];

const FEATURED_PRESS = {
  source: "Forbes",
  title: "The Avi App Gives Sight To The Blind And Was Built By A Teenager",
  url: "https://www.forbes.com/sites/sethporges/2016/08/04/the-avi-app-gives-sight-to-the-blind-and-was-built-by-a-teenager/",
  published: "August 4, 2016",
  summary:
    "A Forbes profile on AVI, the accessibility app Juan Pablo Ortiz co-developed to help blind and visually impaired users identify objects, read text, and better navigate everyday life.",
};

const JOB_HISTORY = [
  {
    company: "Thomson Reuters",
    companyUrl: "https://www.thomsonreuters.com/en",
    title: "DevOps Engineer T8",
    period: "September 2024 to present",
    location: "Mexico City, Mexico",
    summary:
      "Works on large-scale platform modernization across AWS and Azure environments, with an emphasis on release engineering, Kubernetes adoption, observability, and production reliability for multi-environment enterprise systems.",
    highlights: [
      "Modernized Dev, QA, Sandbox, and Production AWS stacks using CloudFormation and CDK, improving deployment consistency and reducing release cycle time.",
      "Migrated containerized microservices from Amazon ECS to Kubernetes EKS with Helm and Argo CD, reducing deployment lead time and enabling self-service rollouts.",
      "Implemented observability with Datadog, Prometheus, and Grafana, and supported backend modernization work including .NET 8 upgrades, Lambda-based workloads, and stronger SSL/TLS enforcement.",
    ],
  },
  {
    company: "Amazon Audible",
    companyUrl: "https://www.audible.com/",
    title: "Software Support Engineer L5",
    period: "July 2023 to September 2024",
    location: "Mexico City, Mexico",
    summary:
      "Supported finance and backend engineering initiatives at Audible, connecting frontend and backend systems while improving service security, testing coverage, and operational reliability for internal workflows.",
    highlights: [
      "Extended finance tooling by integrating React interfaces with Java Spring Boot services using AWS SWF, SQS, and Lambda.",
      "Replaced a bypass authorization mechanism with a secure OAuth 2.0 Java Spring client to close a critical security gap.",
      "Implemented Selenium-based functional testing in AWS and participated in 30+ interview loops spanning coding, system design, and hiring evaluation.",
    ],
  },
  {
    company: "Angi",
    companyUrl: "https://www.angi.com/",
    title: "DevOps Engineer",
    period: "June 2022 to June 2023",
    location: "Mexico City, Mexico",
    summary:
      "Contributed to a large migration effort from on-premise infrastructure to AWS, standardizing provisioning, deployment automation, and service containerization for a multi-phase modernization program.",
    highlights: [
      "Migrated more than 15 service repositories from Angi data centers to AWS using Terraform, cutting provisioning time and reducing manual setup.",
      "Containerized legacy services with Docker and standardized machine configuration through Ansible.",
      "Rewrote deployment scripts from Bash to Ansible, reducing environment drift and improving incident response during the migration.",
    ],
  },
  {
    company: "BelongHome",
    companyUrl: "https://belonghome.com/",
    title: "DevOps Engineer",
    period: "February 2022 to July 2022",
    location: "San Mateo, California (Remote)",
    summary:
      "Focused on AWS cost optimization, database resilience, and the introduction of foundational SRE practices for a growing engineering organization.",
    highlights: [
      "Reduced AWS infrastructure costs by more than 25 percent through Cost Explorer analysis, Glacier archiving, and application resource optimization.",
      "Introduced RDS read replicas and improved resilience patterns across AWS Elastic Beanstalk deployments.",
      "Rolled out Datadog to EC2 infrastructure and established documentation, on-call rotation, and postmortem practices to strengthen reliability culture.",
    ],
  },
  {
    company: "Oracle",
    companyUrl: "https://www.oracle.com/",
    title: "Site Reliability Engineer",
    period: "January 2021 to February 2022",
    location: "Guadalajara, Mexico",
    summary:
      "Worked on internal tooling and operational support for Oracle's global cloud support organization, with responsibilities spanning Java services, observability, Kubernetes operations, and SLA support.",
    highlights: [
      "Developed and maintained internal Java tooling, including Jira and Atlassian integrations used by global business units.",
      "Monitored cluster services through Prometheus and Grafana dashboards while supporting SLAs through on-call rotations and ticket-driven operations.",
      "Provisioned Oracle Container Engine environments for custom projects, including compliance and approval workflows.",
    ],
  },
  {
    company: "Sofia Salud",
    companyUrl: "https://www.sofiasalud.com/",
    title: "Software Engineer",
    period: "February 2019 to January 2021",
    location: "Mexico City, Mexico",
    summary:
      "Joined as one of the earliest engineers and helped scale the product and engineering organization during a period of rapid growth, contributing across DevOps, mobile delivery, frontend systems, and backend product development.",
    highlights: [
      "Helped scale the engineering team from 3 to 20 developers while contributing to hiring and engineering culture.",
      "Led DevOps work behind a free insurance app experience launched during COVID-19, supporting more than 2,500 weekly medical video consults across Mexico.",
      "Automated Android and iOS releases with Travis CI, CircleCI, and AppCenter, and built product features with React, Redux, Apollo, GraphQL, Django, and WebRTC tooling.",
    ],
  },
];

const SEO_TITLE = "About Juan Pablo Ortiz (@wildpasco), Cloud Engineer";
const SEO_DESCRIPTION =
  "About Juan Pablo Ortiz, also known online as @wildpasco. Guatemalan Senior Software Engineer in Mexico City with 10+ years in DevOps, SRE, AWS cloud architecture, CI/CD, and observability. Thomson Reuters, Audible, Oracle, Angi, Sofia Salud.";

function ensureMeta(selector, attributes) {
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
}

function ensureLink(selector, attributes) {
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement("link");
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
}

function useSeo() {
  useEffect(() => {
    const title = SEO_TITLE;
    document.title = title;

    ensureMeta('meta[name="description"]', {
      name: "description",
      content: SEO_DESCRIPTION,
    });

    ensureMeta('meta[property="og:title"]', {
      property: "og:title",
      content: title,
    });

    ensureMeta('meta[property="og:description"]', {
      property: "og:description",
      content: SEO_DESCRIPTION,
    });

    ensureMeta('meta[property="og:type"]', {
      property: "og:type",
      content: "profile",
    });

    ensureMeta('meta[name="twitter:card"]', {
      name: "twitter:card",
      content: "summary",
    });

    ensureLink('link[rel="canonical"]', {
      rel: "canonical",
      href: typeof window !== "undefined" ? window.location.href : "/about",
    });
  }, []);
}

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

function SectionTitle({ children }) {
  return (
    <h2
      style={{
        fontSize: 17,
        fontWeight: 700,
        color: "var(--ink1)",
        margin: 0,
        lineHeight: 1.3,
      }}
    >
      {children}
    </h2>
  );
}

function TimelineItem({ role }) {
  return (
    <li
      style={{
        listStyle: "none",
        display: "grid",
        gridTemplateColumns: "18px 1fr",
        gap: 14,
      }}
    >
      <div style={{ display: "flex", justifyContent: "center" }}>
        <span
          aria-hidden="true"
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "var(--accent)",
            marginTop: 8,
            boxShadow: "0 0 0 4px var(--tint)",
          }}
        />
      </div>

      <article
        style={{
          background: "var(--surface)",
          border: "1px solid var(--line)",
          borderRadius: 14,
          padding: "18px 18px 16px",
        }}
      >
        <header style={{ display: "flex", justifyContent: "space-between", gap: 14, flexWrap: "wrap" }}>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--ink1)", margin: 0 }}>
              <a
                href={role.companyUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "var(--ink1)",
                  textDecorationColor: "var(--line2)",
                  textUnderlineOffset: "3px",
                }}
              >
                {role.title}
              </a>
            </h3>
            <p style={{ fontSize: 12, color: "var(--accent)", margin: "4px 0 0", fontWeight: 700 }}>
              <a
                href={role.companyUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "var(--accent)",
                  textDecorationColor: "color-mix(in srgb, var(--accent) 45%, transparent)",
                  textUnderlineOffset: "3px",
                }}
              >
                {role.company}
              </a>
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: 11, color: "var(--ink3)", margin: 0, fontWeight: 700 }}>{role.period}</p>
            <p style={{ fontSize: 11, color: "var(--ink4)", margin: "4px 0 0" }}>{role.location}</p>
          </div>
        </header>

        <p style={{ fontSize: 12, color: "var(--ink3)", lineHeight: 1.85, margin: "14px 0 0" }}>{role.summary}</p>

        <ul style={{ margin: "14px 0 0", padding: 0, display: "grid", gap: 8 }}>
          {role.highlights.map(item => (
            <li key={item} style={{ listStyle: "none", display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span aria-hidden="true" style={{ color: "var(--accent)", marginTop: 1 }}>→</span>
              <span style={{ fontSize: 12, color: "var(--ink4)", lineHeight: 1.8 }}>{item}</span>
            </li>
          ))}
        </ul>
      </article>
    </li>
  );
}

function FeaturedPressCard() {
  return (
    <section
      aria-labelledby="about-featured-press"
      style={{
        background: "linear-gradient(180deg, color-mix(in srgb, var(--surface) 90%, var(--tint) 10%), var(--surface))",
        border: "1px solid color-mix(in srgb, var(--line) 78%, var(--accent) 22%)",
        borderRadius: 16,
        padding: "20px 22px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "grid", gap: 10, minWidth: 0 }}>
          <p
            style={{
              margin: 0,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 1.2,
              textTransform: "uppercase",
              color: "var(--accent)",
            }}
          >
            Featured press
          </p>
          <SectionTitle>
            <span id="about-featured-press">{FEATURED_PRESS.source}</span>
          </SectionTitle>
        </div>

        <p style={{ margin: 0, fontSize: 11, color: "var(--ink4)" }}>{FEATURED_PRESS.published}</p>
      </div>

      <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
        <a
          href={FEATURED_PRESS.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "var(--ink1)",
            fontSize: 15,
            fontWeight: 700,
            lineHeight: 1.5,
            textDecorationColor: "var(--line2)",
            textUnderlineOffset: "3px",
          }}
        >
          {FEATURED_PRESS.title}
        </a>

        <p style={{ margin: 0, fontSize: 12, color: "var(--ink3)", lineHeight: 1.8 }}>{FEATURED_PRESS.summary}</p>
      </div>
    </section>
  );
}

export default function About() {
  useSeo();
  const isWide = useMediaQuery("(min-width: 980px)");

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Juan Pablo Ortiz",
    jobTitle: "Software Engineer",
    description: SEO_DESCRIPTION,
    image: PROFILE_PHOTO,
    url: typeof window !== "undefined" ? window.location.href : "/about",
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Universidad Galileo",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Mexico City",
      addressCountry: "Mexico",
    },
    knowsAbout: [
      "Software engineering",
      "Cloud architecture",
      "AWS",
      "DevOps",
      "Site reliability engineering",
      "Observability",
      "Developer tooling",
    ],
  };

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--ink2)" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />

      <article
        style={{
          width: "100%",
          maxWidth: 1240,
          margin: "0 auto",
          padding: "34px 20px 72px",
        }}
      >
        <header style={{ marginBottom: 28 }}>
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 2,
              color: "var(--accent)",
              margin: 0,
            }}
          >
            About
          </p>
          <h1
            style={{
              fontSize: "clamp(32px, 5vw, 46px)",
              lineHeight: 1.08,
              color: "var(--ink1)",
              margin: "10px 0 12px",
              letterSpacing: "-0.04em",
            }}
          >
            Juan Pablo Ortiz
          </h1>
          <p
            style={{
              maxWidth: 760,
              fontSize: 14,
              color: "var(--ink3)",
              lineHeight: 1.9,
              margin: 0,
            }}
          >
            Senior Software Engineer with experience in DevOps and SRE, building scalable systems, mission-critical
            services, and cloud platforms with impact across millions
            of users.
          </p>
        </header>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isWide ? "minmax(280px, 0.95fr) minmax(0, 2.2fr)" : "minmax(0, 1fr)",
            gap: 24,
            alignItems: "start",
          }}
        >
          <aside
            aria-label="Profile summary"
            style={{
              width: "100%",
              minWidth: 0,
              gridColumn: isWide ? "1" : "auto",
              background: "var(--surface)",
              border: "1px solid var(--line)",
              borderRadius: 16,
              padding: 20,
              display: "grid",
              gap: 18,
              position: isWide ? "sticky" : "static",
              top: isWide ? 76 : "auto",
            }}
          >
            <figure style={{ margin: 0, display: "grid", gap: 14 }}>
              <img
                src={PROFILE_PHOTO}
                alt="Portrait of Juan Pablo Ortiz"
                style={{
                  width: "100%",
                  maxWidth: 260,
                  justifySelf: "center",
                  aspectRatio: "1 / 1",
                  objectFit: "cover",
                  borderRadius: 16,
                  border: "1px solid var(--line)",
                  background: "var(--bg)",
                }}
              />
            </figure>

            <section aria-labelledby="quick-facts">
              <SectionTitle>
                <span id="quick-facts">Quick facts</span>
              </SectionTitle>
              <dl style={{ margin: "16px 0 0", display: "grid", gap: 12 }}>
                {QUICK_FACTS.map(([term, description]) => (
                  <div key={term} style={{ display: "grid", gap: 4, paddingBottom: 12, borderBottom: "1px solid var(--line)" }}>
                    <dt style={{ fontSize: 11, color: "var(--ink4)", textTransform: "uppercase", letterSpacing: 0.8 }}>{term}</dt>
                    <dd style={{ margin: 0, fontSize: 12, color: "var(--ink2)", lineHeight: 1.7 }}>{description}</dd>
                  </div>
                ))}
              </dl>
            </section>

          </aside>

          <div style={{ display: "grid", gap: 24, width: "100%", minWidth: 0, gridColumn: isWide ? "2" : "auto" }}>
            <section
              aria-labelledby="about-biography"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--line)",
                borderRadius: 16,
                padding: "24px 22px",
              }}
            >
              <div style={{ marginBottom: 18 }}>
                <SectionTitle>
                  <span id="about-biography">Biography</span>
                </SectionTitle>
              </div>

              <div style={{ display: "grid", gap: 16 }}>
                {BIO.map((paragraph, index) => (
                  <p key={index} style={{ fontSize: 13, color: "var(--ink3)", lineHeight: 1.95, margin: 0 }}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>

            <section
              aria-labelledby="about-history"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--line)",
                borderRadius: 16,
                padding: "24px 22px",
              }}
            >
              <div style={{ marginBottom: 20 }}>
                <SectionTitle>
                  <span id="about-history">Employment history</span>
                </SectionTitle>
              </div>

              <ol
                style={{
                  margin: 0,
                  padding: 0,
                  display: "grid",
                  gap: 16,
                  position: "relative",
                }}
              >
                {JOB_HISTORY.map(role => (
                  <TimelineItem key={`${role.company}-${role.period}`} role={role} />
                ))}
              </ol>
            </section>

            <FeaturedPressCard />
          </div>
        </div>
      </article>
    </main>
  );
}
