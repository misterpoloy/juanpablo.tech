import { useEffect, useRef, useState } from "react";
import "./url-shortener.css";

// ── Animated counter ──────────────────────────────────────────────────────────
function Counter({ to, decimals = 0 }) {
  const [val, setVal] = useState(0);
  const rafRef = useRef(null);
  useEffect(() => {
    let frame = 0;
    const total = 55;
    const tick = () => {
      frame++;
      const eased = 1 - Math.pow(1 - Math.min(frame / total, 1), 3);
      setVal(parseFloat((to * eased).toFixed(decimals)));
      if (frame < total) rafRef.current = requestAnimationFrame(tick);
      else setVal(to);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [to, decimals]);
  return <>{decimals > 0 ? val.toFixed(decimals) : val.toLocaleString()}</>;
}

// ── SVG Diagram ───────────────────────────────────────────────────────────────
function FlowDots({ pathId, color, dur, count = 3, offset = 0 }) {
  const gap = dur / count;
  return Array.from({ length: count }, (_, i) => (
    <circle key={i} r="4.5" fill={color} opacity="0.9">
      <animateMotion
        dur={`${dur}s`}
        repeatCount="indefinite"
        begin={`${(offset + i * gap).toFixed(2)}s`}
      >
        <mpath href={`#${pathId}`} />
      </animateMotion>
    </circle>
  ));
}

function DiagramSvg() {
  const arrowPaths = {
    "sd-p-cl-lb":    "M 108,150 H 168",
    "sd-p-lb-app":   "M 279,150 H 338",
    "sd-p-app-redis": "M 458,126 L 521,109",
    "sd-p-app-db":   "M 458,174 L 521,224",
    "sd-p-db-rep":   "M 623,227 H 682",
  };

  const INK4 = "var(--ink4)";
  const INK5 = "var(--ink5)";
  const LINE = "var(--line)";
  const LINE2 = "var(--line2)";
  const SURF = "var(--surface)";
  const BG = "var(--bg)";

  return (
    <svg viewBox="0 0 800 295" xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block", width: "100%", minHeight: 200 }}>
      <defs>
        <marker id="sd-arr" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill={LINE2} />
        </marker>
        {Object.entries(arrowPaths).map(([id, d]) => (
          <path key={id} id={id} d={d} />
        ))}
      </defs>

      {/* ── Arrow lines ── */}
      {Object.values(arrowPaths).map((d, i) => (
        <path key={i} d={d} fill="none" stroke={LINE2} strokeWidth="1.5"
          markerEnd="url(#sd-arr)" />
      ))}

      {/* ── Flow labels ── */}
      <text x={138} y={140} textAnchor="middle" fill="var(--accent)" fontSize="8.5" fontWeight="700">GET · POST</text>
      <text x={487} y={105} textAnchor="middle" fill="var(--accent)" fontSize="8" fontWeight="700"
        transform="rotate(-15,487,105)">cache hit</text>
      <text x={487} y={195} textAnchor="middle" fill="var(--ok)" fontSize="8" fontWeight="700"
        transform="rotate(15,487,195)">write/miss</text>
      <text x={652} y={216} textAnchor="middle" fill="var(--warn)" fontSize="8" fontWeight="700">replicate</text>

      {/* ── Animated dots ── */}
      {/* READ path (blue) */}
      <FlowDots pathId="sd-p-cl-lb"     color="var(--accent)" dur={1.4} count={3} offset={0} />
      <FlowDots pathId="sd-p-lb-app"    color="var(--accent)" dur={1.0} count={3} offset={0.3} />
      <FlowDots pathId="sd-p-app-redis" color="var(--accent)" dur={0.75} count={4} offset={0.5} />
      {/* WRITE path (green) */}
      <FlowDots pathId="sd-p-app-db"    color="var(--ok)"     dur={1.2} count={2} offset={0.2} />
      {/* REPLICATION (amber) */}
      <FlowDots pathId="sd-p-db-rep"    color="var(--warn)"   dur={2.2} count={2} offset={0.7} />

      {/* ── Client ── */}
      <rect x={8} y={120} width={100} height={60} rx={10}
        fill={SURF} stroke="var(--accent)" strokeWidth="1.5" />
      <text x={58} y={141} textAnchor="middle" fill={INK4} fontSize="9" fontWeight="700" letterSpacing="0.8">CLIENT</text>
      <text x={58} y={166} textAnchor="middle" fontSize="19">🌐</text>

      {/* ── Load Balancer ── */}
      <rect x={168} y={120} width={111} height={60} rx={10}
        fill={SURF} stroke={LINE2} strokeWidth="1.5" />
      <text x={223} y={141} textAnchor="middle" fill={INK4} fontSize="9" fontWeight="700" letterSpacing="0.8">LOAD BALANCER</text>
      <text x={223} y={166} textAnchor="middle" fontSize="18">⚖️</text>

      {/* ── App Servers cluster ── */}
      <rect x={337} y={97} width={122} height={106} rx={10}
        fill={SURF} stroke={LINE2} strokeWidth="1.5" />
      <text x={398} y={115} textAnchor="middle" fill={INK4} fontSize="9" fontWeight="700" letterSpacing="0.8">APP SERVERS</text>
      {/* server 1 */}
      <rect x={347} y={121} width={102} height={26} rx={6} fill={BG} stroke={LINE} strokeWidth="1" />
      <text x={398} y={138} textAnchor="middle" fill="var(--ink3)" fontSize="10.5" fontWeight="600">server-1</text>
      {/* server 2 */}
      <rect x={347} y={155} width={102} height={26} rx={6} fill={BG} stroke={LINE} strokeWidth="1" />
      <text x={398} y={172} textAnchor="middle" fill="var(--ink3)" fontSize="10.5" fontWeight="600">server-2</text>

      {/* ── Redis Cache ── */}
      <rect x={521} y={82} width={102} height={55} rx={10}
        fill={SURF} stroke="var(--hot)" strokeWidth="1.5" />
      <text x={572} y={101} textAnchor="middle" fill={INK4} fontSize="9" fontWeight="700" letterSpacing="0.8">REDIS CACHE</text>
      <text x={556} y={124} textAnchor="middle" fill="var(--hot)" fontSize="13">⚡</text>
      <text x={592} y={124} textAnchor="middle" fill={INK5} fontSize="9">LRU · &lt;1ms</text>

      {/* ── PostgreSQL Primary ── */}
      <rect x={521} y={200} width={102} height={55} rx={10}
        fill={SURF} stroke="var(--ok)" strokeWidth="1.5" />
      <text x={572} y={219} textAnchor="middle" fill={INK4} fontSize="9" fontWeight="700" letterSpacing="0.8">POSTGRESQL</text>
      <text x={554} y={241} textAnchor="middle" fill={INK5} fontSize="8.5">Primary</text>
      <text x={593} y={241} textAnchor="middle" fontSize="13">🗄️</text>

      {/* ── Read Replica ── */}
      <rect x={682} y={200} width={106} height={55} rx={10}
        fill={SURF} stroke="var(--warn)" strokeWidth="1.5" />
      <text x={735} y={219} textAnchor="middle" fill={INK4} fontSize="9" fontWeight="700" letterSpacing="0.8">READ REPLICA</text>
      <text x={717} y={241} textAnchor="middle" fill={INK5} fontSize="8.5">reads only</text>
      <text x={757} y={241} textAnchor="middle" fontSize="13">📖</text>

      {/* ── Section labels ── */}
      <text x={398} y={277} textAnchor="middle" fill={INK5} fontSize="9" letterSpacing="0.5">
        Cache-aside pattern: check Redis → hit? return · miss? → DB → populate cache → return
      </text>
    </svg>
  );
}

function DiagramTab() {
  return (
    <div className="sd-diagram-wrap">
      <div className="sd-diagram-svg-wrap">
        <DiagramSvg />
        <div className="sd-flow-legend">
          <div className="sd-legend-item">
            <div className="sd-legend-dot" style={{ background: "var(--accent)" }} />
            GET redirect (cache hit path — 90% of traffic)
          </div>
          <div className="sd-legend-item">
            <div className="sd-legend-dot" style={{ background: "var(--ok)" }} />
            POST shorten / cache miss (writes to DB)
          </div>
          <div className="sd-legend-item">
            <div className="sd-legend-dot" style={{ background: "var(--warn)" }} />
            Async replication (primary → replica)
          </div>
        </div>
      </div>

      <div className="sd-diagram-insights">
        {[
          {
            n: "01", title: "Redis is the hot path",
            body: <>90% of traffic is reads. Redis serves <code>slug → URL</code> in &lt;1ms.
              Cache misses and new writes are the only times PostgreSQL is touched.</>,
          },
          {
            n: "02", title: "Stateless app servers",
            body: "No session data on servers. The LB can freely route any request to any instance — horizontal scaling is trivial. Add servers without config changes.",
          },
          {
            n: "03", title: "Read Replica for misses",
            body: "Cache misses hit the read replica, not the primary. Primary only handles writes (POST /shorten). This isolates write throughput from read spikes.",
          },
          {
            n: "04", title: "Analytics is async",
            body: "Click events are fire-and-forget. The 302 response goes to the client immediately; analytics are written to Kafka → Cassandra entirely off the critical path.",
          },
        ].map(c => (
          <div key={c.n} className="sd-insight">
            <div className="sd-insight-num">{c.n}</div>
            <div className="sd-insight-title">{c.title}</div>
            <div className="sd-insight-body">{c.body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Requirements Tab ──────────────────────────────────────────────────────────
function RequirementsTab() {
  return (
    <div className="sd-req-wrap">
      {/* Left column: requirement lists */}
      <div>
        <div className="sd-req-section" style={{ marginBottom: 18 }}>
          <div className="sd-req-section-header">
            <span className="sd-req-tag" style={{ color: "var(--accent)", borderColor: "var(--accent)" }}>Functional</span>
            <span className="sd-req-section-title">What the system must do</span>
          </div>
          <div className="sd-req-list">
            {[
              <>User submits a long URL → receives a <strong>short URL</strong> (e.g. <code>jpo.ly/xK92p</code>)</>,
              <>Visiting the short URL issues a <strong>302 redirect</strong> to the original long URL</>,
              <>Links can optionally <strong>expire</strong> after a configurable TTL</>,
              <><strong>Custom aliases</strong> allowed if the slug isn't taken (e.g. <code>jpo.ly/launch</code>)</>,
              <>(Optional) <strong>Analytics</strong> per link: total clicks, geo, referrer</>,
            ].map((text, i) => (
              <div key={i} className="sd-req-item" style={{ animationDelay: `${i * 0.07}s` }}>
                <span className="sd-req-arrow" style={{ color: "var(--accent)" }}>→</span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="sd-req-section">
          <div className="sd-req-section-header">
            <span className="sd-req-tag" style={{ color: "var(--ok)", borderColor: "var(--ok)" }}>Non-Functional</span>
            <span className="sd-req-section-title">Performance &amp; reliability</span>
          </div>
          <div className="sd-req-list">
            {[
              <><strong>10B redirects/month</strong> (~3,858 RPS avg, ~12K peak)</>,
              <><strong>&lt;10ms P99 latency</strong> for redirect — Redis must absorb 90%+ of reads</>,
              <><strong>99.99% availability</strong> for reads — 52 min max downtime/year</>,
              <>Eventual consistency OK for analytics — click data can lag seconds</>,
              <>URLs live <strong>forever</strong> unless an explicit expiry is set</>,
            ].map((text, i) => (
              <div key={i} className="sd-req-item" style={{ animationDelay: `${(i + 5) * 0.07}s` }}>
                <span className="sd-req-arrow" style={{ color: "var(--ok)" }}>→</span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right column: capacity + ratio */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink4)", letterSpacing: "1.2px", textTransform: "uppercase", marginBottom: 14 }}>
          Capacity Estimates
        </div>
        <div className="sd-scale-grid">
          {[
            { val: 10,    suf: "B",    label: "Redirects / month",        color: "var(--accent)",  dec: 0 },
            { val: 3858,  suf: "",     label: "Avg reads / sec (RPS)",    color: "var(--ok)",      dec: 0 },
            { val: 500,   suf: " GB",  label: "Storage (1B URLs × 500B)", color: "var(--warn)",    dec: 0 },
            { val: 99.99, suf: "%",    label: "Target availability",      color: "var(--ok)",      dec: 2 },
          ].map((c, i) => (
            <div key={i} className="sd-scale-card" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="sd-scale-val" style={{ color: c.color }}>
                <Counter to={c.val} decimals={c.dec} />
                <span className="sd-scale-unit">{c.suf}</span>
              </div>
              <div className="sd-scale-label">{c.label}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 22 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink4)", letterSpacing: "1.2px", textTransform: "uppercase", marginBottom: 12 }}>
            Read / Write Split
          </div>
          <div style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 12, padding: "16px 18px" }}>
            <div className="sd-rw-bar">
              <div className="sd-rw-read" style={{ width: "90%" }}>90% reads</div>
              <div className="sd-rw-write" style={{ width: "10%" }}>10%</div>
            </div>
            <div style={{ fontSize: 12, color: "var(--ink4)", lineHeight: 1.7 }}>
              Without Redis, PostgreSQL handles ~3,858 RPS. With a <strong style={{ color: "var(--ink2)" }}>95% cache hit rate</strong>,
              {" "}the DB only sees ~193 RPS — a 20× reduction. This is why the cache tier is non-negotiable.
            </div>
          </div>
        </div>

        <div style={{ marginTop: 18 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink4)", letterSpacing: "1.2px", textTransform: "uppercase", marginBottom: 12 }}>
            Storage Math
          </div>
          <div style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 12, overflow: "hidden" }}>
            {[
              ["slug",         "8 chars",   "8 B"],
              ["original_url", "avg URL",   "~200 B"],
              ["metadata",     "timestamps", "~50 B"],
              ["indexes",      "slug + uid", "~240 B"],
              ["Total / row",  "—",          "~500 B"],
            ].map(([field, note, size], i) => (
              <div key={i} style={{
                display: "flex", justifyContent: "space-between", padding: "8px 16px",
                borderBottom: i < 4 ? "1px solid var(--line)" : "none",
                fontSize: 12, color: "var(--ink3)",
                background: i === 4 ? "var(--bg)" : "transparent",
              }}>
                <span style={{ fontWeight: i === 4 ? 700 : 400, color: i === 4 ? "var(--ink1)" : undefined }}>{field}</span>
                <span style={{ color: "var(--ink5)", fontSize: 11 }}>{note}</span>
                <span style={{ fontWeight: 700, color: i === 4 ? "var(--warn)" : "var(--accent)" }}>{size}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="sd-tip" style={{ marginTop: 18 }}>
          <span className="sd-tip-icon">💡</span>
          <span>
            <strong>Interview tip:</strong> Always derive RPS first. 10B/month ÷ 30 days ÷ 86,400 sec = 3,858 RPS.
            State it confidently — it anchors every infrastructure decision you make next.
          </span>
        </div>
      </div>
    </div>
  );
}

// ── API Tab ───────────────────────────────────────────────────────────────────
const ENDPOINTS = [
  {
    method: "POST", path: "/api/v1/shorten",
    desc: "Create a short URL",
    statuses: [["201 Created", "s2"], ["400 Bad Request", "s4"], ["409 Conflict", "s4"]],
    request: (
      <>
        {"{"}{"\n"}
        {"  "}<span className="key">"url"</span>:{"        "}<span className="str">"https://very-long-url.com/some/path?ref=..."</span>,{"\n"}
        {"  "}<span className="key">"alias"</span>:{"      "}<span className="str">"my-brand"</span>,{"      "}<span className="cm">// optional custom slug</span>{"\n"}
        {"  "}<span className="key">"expires_in"</span>: <span className="num">86400</span>{"            "}<span className="cm">// seconds, optional</span>{"\n"}
        {"}"}
      </>
    ),
    response: (
      <>
        <span className="cm">// 201 Created</span>{"\n"}
        {"{"}{"\n"}
        {"  "}<span className="key">"short_url"</span>:  <span className="str">"https://jpo.ly/my-brand"</span>,{"\n"}
        {"  "}<span className="key">"slug"</span>:{"       "}<span className="str">"my-brand"</span>,{"\n"}
        {"  "}<span className="key">"created_at"</span>: <span className="str">"2026-04-27T12:00:00Z"</span>,{"\n"}
        {"  "}<span className="key">"expires_at"</span>: <span className="str">"2026-04-28T12:00:00Z"</span>{"\n"}
        {"}"}{"\n\n"}
        <span className="cm">// 409 Conflict</span>{"\n"}
        {"{ "}<span className="key">"error"</span>: <span className="str">"Alias already taken"</span>{" }"}
      </>
    ),
  },
  {
    method: "GET", path: "/{slug}",
    desc: "Redirect to original URL",
    statuses: [["302 Found", "s3"], ["404 Not Found", "s4"], ["410 Gone", "s4"]],
    request: (
      <>
        <span className="cm">// No body — slug is the path param</span>{"\n"}
        <span className="cm">// GET /xK92p</span>{"\n"}
        <span className="cm">// GET /my-brand</span>{"\n\n"}
        <span className="cm">// No auth required (public endpoint)</span>
      </>
    ),
    response: (
      <>
        <span className="cm">// 302 Found (temporary redirect)</span>{"\n"}
        <span className="acc">HTTP/1.1 302 Found</span>{"\n"}
        <span className="key">Location</span>: <span className="str">https://very-long-url.com/some/path?ref=...</span>{"\n"}
        <span className="key">Cache-Control</span>: <span className="str">no-store</span>{"\n\n"}
        <span className="cm">// 410 Gone (expired)</span>{"\n"}
        {"{ "}<span className="key">"error"</span>: <span className="str">"This link has expired"</span>{" }"}
      </>
    ),
  },
  {
    method: "GET", path: "/api/v1/stats/{slug}",
    desc: "Analytics for a short URL",
    statuses: [["200 OK", "s2"], ["403 Forbidden", "s4"], ["404 Not Found", "s4"]],
    request: (
      <>
        <span className="cm">// No body — auth header required</span>{"\n"}
        <span className="key">Authorization</span>: <span className="str">Bearer sk_live_abc123...</span>
      </>
    ),
    response: (
      <>
        <span className="cm">// 200 OK</span>{"\n"}
        {"{"}{"\n"}
        {"  "}<span className="key">"slug"</span>:{"          "}<span className="str">"xK92p"</span>,{"\n"}
        {"  "}<span className="key">"clicks"</span>:{"        "}<span className="num">14203</span>,{"\n"}
        {"  "}<span className="key">"created_at"</span>:{"    "}<span className="str">"2026-04-20T08:00:00Z"</span>,{"\n"}
        {"  "}<span className="key">"last_clicked"</span>:{"  "}<span className="str">"2026-04-27T11:58:22Z"</span>,{"\n"}
        {"  "}<span className="key">"top_countries"</span>: [{"\n"}
        {"    { "}<span className="key">"code"</span>: <span className="str">"US"</span>, <span className="key">"count"</span>: <span className="num">8100</span>{" },"}{"\n"}
        {"    { "}<span className="key">"code"</span>: <span className="str">"GB"</span>, <span className="key">"count"</span>: <span className="num">2300</span>{" }"}{"\n"}
        {"  ]"}{"\n"}
        {"}"}
      </>
    ),
  },
  {
    method: "DELETE", path: "/api/v1/shorten/{slug}",
    desc: "Deactivate a short URL",
    statuses: [["204 No Content", "s2"], ["403 Forbidden", "s4"], ["404 Not Found", "s4"]],
    request: (
      <>
        <span className="cm">// No body — auth header required</span>{"\n"}
        <span className="key">Authorization</span>: <span className="str">Bearer sk_live_abc123...</span>
      </>
    ),
    response: (
      <>
        <span className="cm">// 204 No Content (success, no body)</span>{"\n\n"}
        <span className="cm">// 403 Forbidden</span>{"\n"}
        {"{ "}<span className="key">"error"</span>: <span className="str">"You don't own this link"</span>{" }"}
      </>
    ),
  },
];

function Endpoint({ ep, defaultOpen, delay }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="sd-endpoint" style={{ animationDelay: `${delay}s` }}>
      <div className="sd-endpoint-header" onClick={() => setOpen(o => !o)}>
        <span className={`sd-method ${ep.method.toLowerCase()}`}>{ep.method}</span>
        <span className="sd-endpoint-path">{ep.path}</span>
        <span className="sd-endpoint-desc">{ep.desc}</span>
        <span className={`sd-endpoint-chevron${open ? " open" : ""}`}>▼</span>
      </div>
      {open && (
        <div className="sd-endpoint-body">
          <div className="sd-body-col">
            <div className="sd-body-col-label">Request body</div>
            <pre className="sd-code-block">{ep.request}</pre>
          </div>
          <div className="sd-body-col">
            <div className="sd-body-col-label">Response</div>
            <pre className="sd-code-block">{ep.response}</pre>
            <div className="sd-status-chips">
              {ep.statuses.map(([label, cls]) => (
                <span key={label} className={`sd-status ${cls}`}>{label}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ApiTab() {
  return (
    <div className="sd-api-wrap">
      <div className="sd-tip">
        <span className="sd-tip-icon">💡</span>
        <span>
          <strong>Interview tip:</strong> Always define your endpoints before picking infrastructure.
          Knowing the read/write shape — one hot GET, one infrequent POST — drives every caching and
          database decision. Use <strong>302</strong> (not 301) so every redirect is tracked for analytics.
        </span>
      </div>
      {ENDPOINTS.map((ep, i) => (
        <Endpoint key={ep.path} ep={ep} defaultOpen={i === 0} delay={i * 0.07} />
      ))}
    </div>
  );
}

// ── Schema Tab ────────────────────────────────────────────────────────────────
const TABLES = [
  {
    name: "urls",
    desc: "Core URL store — primary lookup table",
    pills: [{ label: "PostgreSQL", color: "var(--ok)" }, { label: "~500 B / row", color: "var(--ink4)" }],
    cols: ["Field", "Type", "Constraints", "Example", "Notes"],
    rows: [
      [<><span className="sd-field-name">id</span><span className="sd-badge pk">PK</span></>, <span className="sd-field-type">bigint</span>, "auto-increment", <span className="sd-field-example">1</span>, <span className="sd-field-notes">Snowflake ID for distributed gen</span>],
      [<><span className="sd-field-name">slug</span><span className="sd-badge idx">IDX</span></>, <span className="sd-field-type">varchar(8)</span>, "UNIQUE NOT NULL", <span className="sd-field-example">xK92p</span>, <span className="sd-field-notes">Base62 encoded, B-tree index</span>],
      [<span className="sd-field-name">original_url</span>, <span className="sd-field-type">text</span>, "NOT NULL", <span className="sd-field-example">https://very-long...</span>, <span className="sd-field-notes">No max length — text col</span>],
      [<><span className="sd-field-name">user_id</span><span className="sd-badge fk">FK</span><span className="sd-badge null">NULL</span></>, <span className="sd-field-type">bigint</span>, "references users(id)", <span className="sd-field-example">42</span>, <span className="sd-field-notes">Null = anonymous link</span>],
      [<span className="sd-field-name">created_at</span>, <span className="sd-field-type">timestamptz</span>, "NOT NULL DEFAULT now()", <span className="sd-field-example">2026-04-27T12:00Z</span>, ""],
      [<><span className="sd-field-name">expires_at</span><span className="sd-badge null">NULL</span></>, <span className="sd-field-type">timestamptz</span>, "nullable", <span className="sd-field-example">null</span>, <span className="sd-field-notes">Null = never expires</span>],
      [<span className="sd-field-name">is_active</span>, <span className="sd-field-type">boolean</span>, "NOT NULL DEFAULT true", <span className="sd-field-example">true</span>, <span className="sd-field-notes">Soft-delete on DELETE endpoint</span>],
    ],
  },
  {
    name: "clicks",
    desc: "Analytics click log — append-only, write-heavy",
    pills: [{ label: "Cassandra", color: "var(--hot)" }, { label: "High write throughput", color: "var(--ink4)" }],
    cols: ["Field", "Type", "Constraints", "Example", "Notes"],
    rows: [
      [<><span className="sd-field-name">id</span><span className="sd-badge pk">PK</span></>, <span className="sd-field-type">uuid</span>, "auto-generated", <span className="sd-field-example">550e8400-e29b...</span>, <span className="sd-field-notes">TimeUUID for ordering</span>],
      [<><span className="sd-field-name">slug_id</span><span className="sd-badge fk">FK</span></>, <span className="sd-field-type">bigint</span>, "partition key", <span className="sd-field-example">5</span>, <span className="sd-field-notes">Cassandra partition = fast range reads</span>],
      [<span className="sd-field-name">clicked_at</span>, <span className="sd-field-type">timestamptz</span>, "clustering key DESC", <span className="sd-field-example">2026-04-27T11:58Z</span>, <span className="sd-field-notes">Sorted newest-first per slug</span>],
      [<span className="sd-field-name">ip_hash</span>, <span className="sd-field-type">varchar(64)</span>, "—", <span className="sd-field-example">sha256:abc...</span>, <span className="sd-field-notes">Never store raw IPs (GDPR)</span>],
      [<span className="sd-field-name">country_code</span>, <span className="sd-field-type">char(2)</span>, "—", <span className="sd-field-example">US</span>, <span className="sd-field-notes">From MaxMind GeoIP lookup</span>],
      [<><span className="sd-field-name">referrer</span><span className="sd-badge null">NULL</span></>, <span className="sd-field-type">text</span>, "nullable", <span className="sd-field-example">google.com</span>, ""],
    ],
  },
  {
    name: "users",
    desc: "Account store for authenticated API access",
    pills: [{ label: "PostgreSQL", color: "var(--ok)" }],
    cols: ["Field", "Type", "Constraints", "Example", "Notes"],
    rows: [
      [<><span className="sd-field-name">id</span><span className="sd-badge pk">PK</span></>, <span className="sd-field-type">bigint</span>, "auto-increment", <span className="sd-field-example">42</span>, ""],
      [<span className="sd-field-name">email</span>, <span className="sd-field-type">varchar(255)</span>, "UNIQUE NOT NULL", <span className="sd-field-example">user@example.com</span>, ""],
      [<><span className="sd-field-name">api_key</span><span className="sd-badge idx">IDX</span></>, <span className="sd-field-type">varchar(64)</span>, "UNIQUE NOT NULL", <span className="sd-field-example">sk_live_abc...</span>, <span className="sd-field-notes">B-tree index for auth lookup</span>],
      [<span className="sd-field-name">created_at</span>, <span className="sd-field-type">timestamptz</span>, "DEFAULT now()", <span className="sd-field-example">2026-01-01T...</span>, ""],
      [<span className="sd-field-name">plan</span>, <span className="sd-field-type">varchar(20)</span>, "DEFAULT 'free'", <span className="sd-field-example">pro</span>, <span className="sd-field-notes">Rate-limit tier</span>],
    ],
  },
];

function SchemaTab() {
  return (
    <div className="sd-schema-wrap">
      {TABLES.map((t, ti) => (
        <div key={t.name} className="sd-table-card" style={{ animationDelay: `${ti * 0.1}s` }}>
          <div className="sd-table-header">
            <div>
              <span className="sd-table-name">{t.name}</span>
              <span style={{ fontSize: 12, color: "var(--ink5)", marginLeft: 12 }}>{t.desc}</span>
            </div>
            <div className="sd-table-pills">
              {t.pills.map(p => (
                <span key={p.label} className="sd-pill" style={{ color: p.color, borderColor: p.color, background: "transparent" }}>
                  {p.label}
                </span>
              ))}
            </div>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table>
              <thead>
                <tr>{t.cols.map(c => <th key={c}>{c}</th>)}</tr>
              </thead>
              <tbody>
                {t.rows.map((row, ri) => (
                  <tr key={ri}>
                    {row.map((cell, ci) => <td key={ci}>{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      <div className="sd-tip">
        <span className="sd-tip-icon">💡</span>
        <span>
          <strong>Interview tip:</strong> In interviews, start with the <code>urls</code> table —
          it's the only one you need to answer the core question. Only introduce <code>clicks</code>
          and <code>users</code> after the interviewer asks about analytics or auth. Don't over-design.
        </span>
      </div>
    </div>
  );
}

// ── Decisions Tab ─────────────────────────────────────────────────────────────
const DECISIONS = [
  {
    num: "01",
    title: "Slug generation strategy",
    options: [
      { label: "chosen", name: "Snowflake ID → Base62", detail: "Distributed counter, no collision, unique across services, encodes to 7–8 char slug." },
      { label: "avoid",  name: "MD5(URL)[:7]",          detail: "Deterministic but collision-prone. Same URL → same slug breaks custom aliases." },
      { label: "",       name: "Random Base62 + retry",  detail: "Simple but requires a DB round-trip per write to check uniqueness. Fine at low scale." },
    ],
    verdict: <>Use a <strong>Snowflake ID</strong> (64-bit timestamp + machine ID + sequence). Convert to Base62 — 62⁷ gives 3.5 trillion unique slugs with zero collision risk and no DB check needed.</>,
    tip: "Mention that Base62 uses a-z, A-Z, 0-9 (avoids +/ which are URL-unsafe). 62⁷ ≈ 3.5T is a number worth memorizing.",
  },
  {
    num: "02",
    title: "301 vs 302 redirect",
    options: [
      { label: "avoid",  name: "301 Permanent",   detail: "Browser caches the redirect — server never sees repeat clicks. Analytics break silently." },
      { label: "chosen", name: "302 Temporary",   detail: "No browser caching — every click hits your server. Analytics capture every visit." },
      { label: "",       name: "CDN-level 301",   detail: "Use 301 only if you need CDN offload and don't care about per-click analytics." },
    ],
    verdict: <>Use <strong>302 Found</strong> if analytics matter (they do). The tradeoff: you lose browser-side caching — mitigate with Redis so every redirect still returns in &lt;10ms.</>,
    tip: "This is a favourite follow-up. Know that Bit.ly and TinyURL use 301 by default (CDN offload). Most modern systems use 302 for analytics.",
  },
  {
    num: "03",
    title: "Cache strategy (cache-aside)",
    options: [
      { label: "chosen", name: "Cache-aside (lazy)", detail: "On miss, app fetches from DB and populates cache. Cache only holds what's actually read." },
      { label: "",       name: "Write-through",      detail: "Writes to cache and DB simultaneously. Better hit rate but more writes to cache." },
      { label: "avoid",  name: "No cache",            detail: "PostgreSQL cannot sustain ~3,858 RPS reads under 10ms without extreme vertical scaling." },
    ],
    verdict: <>Use <strong>cache-aside with LRU eviction</strong>. Set a 24h TTL (or URL expiry, whichever is shorter). 20% of URLs receive 80% of traffic — a modest Redis instance handles the load.</>,
    tip: "State the expected hit rate: ~95%. At 3,858 RPS reads, DB only sees ~193 RPS. That's a 20× reduction from a single cache layer.",
  },
  {
    num: "04",
    title: "Database selection",
    options: [
      { label: "chosen", name: "PostgreSQL (URLs)",     detail: "ACID, UNIQUE constraint on slug, B-tree index for O(log n) slug lookup. Small dataset (~500 GB)." },
      { label: "chosen", name: "Cassandra (analytics)", detail: "Write-heavy append log. Partition by slug_id, cluster by time. Scales horizontally." },
      { label: "avoid",  name: "Single DB for both",    detail: "Analytics writes (10B+/month) would saturate the URL store's read replica and degrade latency." },
    ],
    verdict: <>Split the workload: <strong>PostgreSQL</strong> for the URL store (read-heavy, relational, needs UNIQUE constraints), <strong>Cassandra</strong> for click events (write-heavy, time-series, append-only).</>,
    tip: "Hybrid databases are a senior-level answer. Explain that you'd add a Kafka queue so analytics writes are async and never block the 302 response.",
  },
  {
    num: "05",
    title: "URL validation &amp; deduplication",
    options: [
      { label: "",       name: "Strict validation",   detail: "Validate URL format server-side. Reject malformed inputs with 400 to avoid storing junk." },
      { label: "chosen", name: "Normalized dedup",    detail: "Canonicalize URL (lowercase scheme, strip trailing slash) before hashing. Optional: return existing slug for same URL." },
      { label: "",       name: "No dedup",            detail: "Simpler — same long URL creates multiple slugs. Acceptable if analytics-per-link matters." },
    ],
    verdict: <>Validate strictly (reject malformed URLs). <strong>Deduplication is optional</strong> — skip it unless the interviewer specifically asks, since it adds a read before every write.</>,
    tip: "If you do dedup, hash the normalized URL and store it in an auxiliary index. Only return the same slug if the same user owns it — otherwise you'd leak someone else's link.",
  },
];

function DecisionsTab() {
  return (
    <div className="sd-decisions-wrap">
      {DECISIONS.map((d, i) => (
        <div key={d.num} className="sd-decision-card" style={{ animationDelay: `${i * 0.07}s` }}>
          <div className="sd-decision-header">
            <span className="sd-decision-num">{d.num}</span>
            <span className="sd-decision-title" dangerouslySetInnerHTML={{ __html: d.title }} />
          </div>
          <div className="sd-decision-body">
            <div className="sd-options-row">
              {d.options.map(o => (
                <div key={o.name} className={`sd-option ${o.label}`}>
                  {o.label && <div className="sd-option-badge">{o.label === "chosen" ? "✓ Use this" : "✗ Avoid"}</div>}
                  {!o.label && <div className="sd-option-badge" style={{ color: "var(--ink5)" }}>Alternative</div>}
                  <div className="sd-option-name">{o.name}</div>
                  <div className="sd-option-detail">{o.detail}</div>
                </div>
              ))}
            </div>
            <div className="sd-verdict">
              <span style={{ fontSize: 15, flexShrink: 0 }}>✓</span>
              <span>{d.verdict}</span>
            </div>
            <div className="sd-tip">
              <span className="sd-tip-icon">💡</span>
              <span><strong>Interview tip:</strong> {d.tip}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Root Component ────────────────────────────────────────────────────────────
const TABS = [
  { id: "diagram",      label: "System Diagram" },
  { id: "requirements", label: "Requirements"   },
  { id: "api",          label: "API Design"      },
  { id: "schema",       label: "Schema"          },
  { id: "decisions",    label: "Key Decisions"   },
];

export default function UrlShortener() {
  const [activeTab, setActiveTab] = useState("diagram");
  const [panelKey, setPanelKey] = useState(0);

  const handleTab = (id) => {
    if (id === activeTab) return;
    setActiveTab(id);
    setPanelKey(k => k + 1);
  };

  return (
    <div className="sd-artifact">
      {/* Header */}
      <div className="sd-header">
        <div>
          <h2 className="sd-title">URL Shortener <em>System Design</em></h2>
          <p className="sd-subtitle">// interview-ready breakdown · diagram · API · schema · trade-offs</p>
        </div>
        <div className="sd-meta-pills">
          <span className="sd-pill">10B req/month</span>
          <span className="sd-pill accent">90% reads</span>
          <span className="sd-pill ok">Redis + PostgreSQL</span>
        </div>
      </div>

      {/* Tabs */}
      <nav className="sd-tabs">
        {TABS.map(t => (
          <button
            key={t.id}
            className={`sd-tab${activeTab === t.id ? " active" : ""}`}
            onClick={() => handleTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {/* Content */}
      <div className="sd-panel" key={panelKey}>
        {activeTab === "diagram"      && <DiagramTab />}
        {activeTab === "requirements" && <RequirementsTab />}
        {activeTab === "api"          && <ApiTab />}
        {activeTab === "schema"       && <SchemaTab />}
        {activeTab === "decisions"    && <DecisionsTab />}
      </div>
    </div>
  );
}
