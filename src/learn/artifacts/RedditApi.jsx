import { useState } from "react";
import "./reddit-api.css";

// ── Entity Relationship Diagram ───────────────────────────────────────────────
function FlowDots({ pathId, color, dur, count = 3, offset = 0 }) {
  const gap = dur / count;
  return Array.from({ length: count }, (_, i) => (
    <circle key={i} r="4" fill={color} opacity="0.9">
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
  const LINE2 = "var(--line2)";
  const SURF  = "var(--surface)";
  const BG    = "var(--bg)";
  const INK1  = "var(--ink1)";
  const INK3  = "var(--ink3)";
  const INK4  = "var(--ink4)";
  const INK5  = "var(--ink5)";

  const paths = {
    "rd-p-user-sub":     "M 60,118 L 168,58",
    "rd-p-sub-post":     "M 283,58 L 348,120",
    "rd-p-user-post":    "M 110,148 H 348",
    "rd-p-post-comment": "M 463,148 H 535",
    "rd-p-self-comment": "M 650,138 C 730,138 730,90 592,118",
    "rd-p-user-vote":    "M 75,178 L 348,240",
    "rd-p-vote-post":    "M 405,220 L 405,178",
  };

  return (
    <svg viewBox="0 0 820 300" xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block", width: "100%", minHeight: 200 }}>
      <defs>
        <marker id="rd-arr" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill={LINE2} />
        </marker>
        <marker id="rd-arr-hot" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="var(--hot)" />
        </marker>
        {Object.entries(paths).map(([id, d]) => (
          <path key={id} id={id} d={d} />
        ))}
      </defs>

      {/* ── Static arrows ── */}
      <path d={paths["rd-p-user-sub"]}     fill="none" stroke={LINE2} strokeWidth="1.5" markerEnd="url(#rd-arr)" strokeDasharray="4 3" />
      <path d={paths["rd-p-sub-post"]}     fill="none" stroke={LINE2} strokeWidth="1.5" markerEnd="url(#rd-arr)" strokeDasharray="4 3" />
      <path d={paths["rd-p-user-post"]}    fill="none" stroke={LINE2} strokeWidth="1.5" markerEnd="url(#rd-arr)" />
      <path d={paths["rd-p-post-comment"]} fill="none" stroke={LINE2} strokeWidth="1.5" markerEnd="url(#rd-arr)" />
      <path d={paths["rd-p-self-comment"]} fill="none" stroke="var(--accent)" strokeWidth="1.2" markerEnd="url(#rd-arr)" strokeDasharray="3 2" />
      <path d={paths["rd-p-user-vote"]}    fill="none" stroke="var(--hot)" strokeWidth="1.5" markerEnd="url(#rd-arr-hot)" />
      <path d={paths["rd-p-vote-post"]}    fill="none" stroke="var(--hot)" strokeWidth="1.5" markerEnd="url(#rd-arr-hot)" />

      {/* ── Edge labels ── */}
      <text x={135} y={120} textAnchor="middle" fill={INK5} fontSize="8.5" fontWeight="700">creates</text>
      <text x={305} y={100} textAnchor="middle" fill={INK5} fontSize="8.5" fontWeight="700" transform="rotate(35,305,100)">on</text>
      <text x={498} y={140} textAnchor="middle" fill={INK5} fontSize="8.5" fontWeight="700">has</text>
      <text x={700} y={90}  textAnchor="middle" fill="var(--accent)" fontSize="8.5" fontWeight="700">parentId ↺</text>
      <text x={198} y={202} textAnchor="middle" fill="var(--hot)" fontSize="8.5" fontWeight="700" transform="rotate(20,198,202)">casts</text>
      <text x={420} y={202} textAnchor="middle" fill="var(--hot)" fontSize="8.5" fontWeight="700">targets</text>

      {/* ── Animated flow dots ── */}
      {/* Browse flow (accent) */}
      <FlowDots pathId="rd-p-user-post"    color="var(--accent)" dur={1.4} count={3} offset={0}   />
      <FlowDots pathId="rd-p-post-comment" color="var(--accent)" dur={1.0} count={3} offset={0.4} />
      {/* Sub membership (green) */}
      <FlowDots pathId="rd-p-user-sub"     color="var(--ok)"     dur={2.2} count={2} offset={0.6} />
      <FlowDots pathId="rd-p-sub-post"     color="var(--ok)"     dur={1.6} count={2} offset={0.8} />
      {/* Vote flow (hot) */}
      <FlowDots pathId="rd-p-user-vote"    color="var(--hot)"    dur={1.5} count={2} offset={0.2} />
      <FlowDots pathId="rd-p-vote-post"    color="var(--hot)"    dur={0.9} count={2} offset={0.5} />
      {/* Reply self-loop (warn) */}
      <FlowDots pathId="rd-p-self-comment" color="var(--warn)"   dur={2.0} count={1} offset={0.0} />

      {/* ── User ── */}
      <rect x={10} y={118} width={100} height={60} rx={10} fill={SURF} stroke="var(--accent)" strokeWidth="1.5" />
      <text x={60} y={138} textAnchor="middle" fill={INK4} fontSize="9" fontWeight="700" letterSpacing="0.8">USER</text>
      <text x={60} y={152} textAnchor="middle" fill={INK5} fontSize="8.5">userId: string</text>
      <text x={60} y={169} textAnchor="middle" fontSize="16">👤</text>

      {/* ── SubReddit ── */}
      <rect x={168} y={30} width={115} height={55} rx={10} fill={SURF} stroke="var(--ok)" strokeWidth="1.5" />
      <text x={225} y={50} textAnchor="middle" fill={INK4} fontSize="9" fontWeight="700" letterSpacing="0.8">SUBREDDIT</text>
      <text x={225} y={64} textAnchor="middle" fill={INK5} fontSize="8.5">subredditId: string</text>
      <text x={225} y={78} textAnchor="middle" fontSize="14">🏛️</text>

      {/* ── Post ── */}
      <rect x={348} y={118} width={115} height={60} rx={10} fill={SURF} stroke="var(--warn)" strokeWidth="1.5" />
      <text x={405} y={138} textAnchor="middle" fill={INK4} fontSize="9" fontWeight="700" letterSpacing="0.8">POST</text>
      <text x={405} y={152} textAnchor="middle" fill={INK5} fontSize="8.5">postId · subredditId</text>
      <text x={405} y={169} textAnchor="middle" fontSize="16">📄</text>

      {/* ── Comment ── */}
      <rect x={535} y={118} width={115} height={60} rx={10} fill={SURF} stroke="var(--accent)" strokeWidth="1.5" />
      <text x={592} y={138} textAnchor="middle" fill={INK4} fontSize="9" fontWeight="700" letterSpacing="0.8">COMMENT</text>
      <text x={592} y={152} textAnchor="middle" fill={INK5} fontSize="8.5">parentId? (nested)</text>
      <text x={592} y={169} textAnchor="middle" fontSize="16">💬</text>

      {/* ── Vote ── */}
      <rect x={348} y={220} width={115} height={55} rx={10} fill={SURF} stroke="var(--hot)" strokeWidth="1.5" />
      <text x={405} y={240} textAnchor="middle" fill={INK4} fontSize="9" fontWeight="700" letterSpacing="0.8">VOTE</text>
      <text x={405} y={254} textAnchor="middle" fill={INK5} fontSize="8.5">type: UP | DOWN</text>
      <text x={405} y={268} textAnchor="middle" fontSize="14">⬆️⬇️</text>

      {/* ── Vote also targets Comment note ── */}
      <text x={480} y={280} textAnchor="middle" fill={INK5} fontSize="8.5" fontStyle="italic">
        Vote also targets Comments via targetId
      </text>

      {/* ── Given entities note ── */}
      <text x={758} y={250} textAnchor="middle" fill={INK5} fontSize="8.5" fontWeight="700">AWARD</text>
      <rect x={700} y={255} width={100} height={38} rx={8} fill={SURF} stroke="var(--warn)" strokeWidth="1" strokeDasharray="3 2" />
      <text x={750} y={271} textAnchor="middle" fill={INK5} fontSize="8">type: enum</text>
      <text x={750} y={284} textAnchor="middle" fill={INK5} fontSize="8">targetId: string</text>
      <path d="M 463,247 L 700,270" fill="none" stroke="var(--warn)" strokeWidth="1" strokeDasharray="3 2" markerEnd="url(#rd-arr)" />

      {/* bottom caption */}
      <text x={410} y={298} textAnchor="middle" fill={INK5} fontSize="8.5" letterSpacing="0.4">
        Votes are separate entities — not embedded fields — enabling clean EditVote and DeleteVote operations
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
            Browse flow (User → Post → Comment)
          </div>
          <div className="sd-legend-item">
            <div className="sd-legend-dot" style={{ background: "var(--ok)" }} />
            Membership (User → SubReddit → Post)
          </div>
          <div className="sd-legend-item">
            <div className="sd-legend-dot" style={{ background: "var(--hot)" }} />
            Vote flow (User → Vote → Post/Comment)
          </div>
          <div className="sd-legend-item">
            <div className="sd-legend-dot" style={{ background: "var(--warn)" }} />
            Reply nesting (Comment → Comment via parentId)
          </div>
        </div>
      </div>

      <div className="sd-diagram-insights">
        {[
          {
            n: "01", title: "5 primary entities",
            body: <>Given: <code>User</code>, <code>SubReddit</code>. You define: <code>Post</code>, <code>Comment</code>, <code>Vote</code>, <code>Award</code>. Everything else is CRUD on these.</>,
          },
          {
            n: "02", title: "Votes are siblings, not fields",
            body: "Votes live as separate entities (with voteId) rather than embedded arrays on Posts/Comments. This makes EditVote and DeleteVote trivial O(1) operations.",
          },
          {
            n: "03", title: "Comments form a tree",
            body: <>The optional <code>parentId</code> on Comment points to a parent comment or post. The UI reconstructs the indented reply tree client-side from these IDs.</>,
          },
          {
            n: "04", title: "targetId is polymorphic",
            body: <>Vote's <code>targetId</code> points to either a Post or a Comment. This avoids having separate PostVote and CommentVote tables — one Vote entity covers both.</>,
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
      {/* Left: question + functional */}
      <div>
        {/* The Question */}
        <div className="sd-req-section" style={{ marginBottom: 18 }}>
          <div className="sd-req-section-header">
            <span className="sd-req-tag" style={{ color: "var(--warn)", borderColor: "var(--warn)" }}>Prompt</span>
            <span className="sd-req-section-title">The interview question</span>
          </div>
          <div style={{ padding: "16px 20px 18px" }}>
            <div style={{ fontSize: 13, color: "var(--ink1)", fontWeight: 700, marginBottom: 10, lineHeight: 1.4 }}>
              Design an API for Reddit subreddits.
            </div>
            <div style={{ fontSize: 12, color: "var(--ink3)", lineHeight: 1.8, marginBottom: 14 }}>
              The API includes two given entities:
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
              {[
                { name: "User", fields: "userId: string, …" },
                { name: "SubReddit", fields: "subredditId: string, …" },
              ].map(e => (
                <div key={e.name} style={{
                  background: "var(--bg)", border: "1px solid var(--line)", borderRadius: 8,
                  padding: "10px 14px", flex: "1 1 180px",
                }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "var(--ink1)", marginBottom: 3 }}>{e.name}</div>
                  <div style={{ fontSize: 11, color: "var(--accent)" }}>{e.fields}</div>
                </div>
              ))}
            </div>
            <div className="sd-tip" style={{ margin: 0 }}>
              <span className="sd-tip-icon">💡</span>
              <span>
                <strong>First move in the interview:</strong> ask clarifying questions.
                What operations must the API support? Can comments be nested?
                Are awards purchasable or just given? Establish scope before writing a single endpoint.
              </span>
            </div>
          </div>
        </div>

        {/* Functional requirements */}
        <div className="sd-req-section">
          <div className="sd-req-section-header">
            <span className="sd-req-tag" style={{ color: "var(--accent)", borderColor: "var(--accent)" }}>Functional</span>
            <span className="sd-req-section-title">What the API must support</span>
          </div>
          <div className="sd-req-list">
            {[
              <>Users can <strong>create, edit, delete, and read posts</strong> on subreddits</>,
              <>Users can <strong>comment on posts</strong> and <strong>reply to comments</strong> (nested threading)</>,
              <>Users can <strong>upvote or downvote</strong> posts and comments (separate Vote entity)</>,
              <>Users can <strong>give awards</strong> to posts and comments (purchasable or given)</>,
              <>Posts and comments that are removed show a <strong>deleted state</strong> (not wiped)</>,
              <>Post and comment lists are <strong>paginated</strong> (cursor-based, not offset)</>,
            ].map((text, i) => (
              <div key={i} className="sd-req-item" style={{ animationDelay: `${i * 0.07}s` }}>
                <span className="sd-req-arrow" style={{ color: "var(--accent)" }}>→</span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: design constraints + entities */}
      <div>
        <div className="sd-req-section" style={{ marginBottom: 18 }}>
          <div className="sd-req-section-header">
            <span className="sd-req-tag" style={{ color: "var(--ok)", borderColor: "var(--ok)" }}>Constraints</span>
            <span className="sd-req-section-title">Design requirements</span>
          </div>
          <div className="sd-req-list">
            {[
              <>All write operations include <code>userId</code> for <strong>ACL checks</strong> — only creators can edit/delete their own content</>,
              <>Vote counts (<code>votesCount</code>, <code>commentsCount</code>) are <strong>computed by a background service</strong>, not in the API call itself</>,
              <>Pagination uses <strong>opaque cursor tokens</strong> (<code>pageToken</code>) — consistent under concurrent inserts, unlike offset</>,
              <><code>currentVote</code> on Post/Comment is <strong>populated server-side</strong> by joining the Vote table for the requesting user</>,
              <><code>deletedAt</code> enables <strong>soft delete</strong> — UI renders "[deleted]" while preserving the reply tree structure</>,
            ].map((text, i) => (
              <div key={i} className="sd-req-item" style={{ animationDelay: `${(i + 6) * 0.07}s` }}>
                <span className="sd-req-arrow" style={{ color: "var(--ok)" }}>→</span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 3 entities to define */}
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink4)", letterSpacing: "1.2px", textTransform: "uppercase", marginBottom: 12 }}>
          Entities you need to define
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { name: "Post",    icon: "📄", color: "var(--warn)",   fields: "postId, creatorId, subredditId, title, description, createdAt, votesCount, commentsCount, awardsCount, deletedAt?, currentVote?" },
            { name: "Comment", icon: "💬", color: "var(--accent)", fields: "commentId, creatorId, postId, content, createdAt, votesCount, awardsCount, parentId?, deletedAt?, currentVote?" },
            { name: "Vote",    icon: "⬆️", color: "var(--hot)",    fields: "voteId, creatorId, targetId, type (UP | DOWN), createdAt" },
            { name: "Award",   icon: "🏆", color: "var(--warn)",   fields: "awardId, creatorId, targetId, type (enum), createdAt" },
          ].map(e => (
            <div key={e.name} style={{
              background: "var(--surface)", border: "1px solid var(--line)",
              borderRadius: 10, padding: "11px 14px",
              borderLeft: `3px solid ${e.color}`,
              animation: "sd-slideIn 0.28s ease both",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                <span style={{ fontSize: 14 }}>{e.icon}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--ink1)" }}>{e.name}</span>
              </div>
              <div style={{ fontSize: 11, color: "var(--ink4)", lineHeight: 1.7 }}>{e.fields}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── API Design Tab ────────────────────────────────────────────────────────────
const OP_CLASS = { Create: "post", Get: "get", List: "list", Edit: "put", Delete: "delete" };

function RpcMethod({ op, name, params, returnType, returnExample, notes, delay = 0, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const cls = OP_CLASS[op] || "get";
  return (
    <div className="sd-endpoint" style={{ animationDelay: `${delay}s` }}>
      <div className="sd-endpoint-header" onClick={() => setOpen(o => !o)}>
        <span className={`sd-method ${cls}`}>{op}</span>
        <span className="sd-endpoint-path">{name}</span>
        <span className={`sd-endpoint-chevron${open ? " open" : ""}`}>▼</span>
      </div>
      {open && (
        <div className="sd-endpoint-body">
          <div className="sd-body-col">
            <div className="sd-body-col-label">Parameters</div>
            <table className="sd-params">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Required</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {params.map(([pname, ptype, req, desc]) => (
                  <tr key={pname}>
                    <td><span className="pname">{pname}</span></td>
                    <td><span className="ptype">{ptype}</span></td>
                    <td>{req ? "✓" : <span className="popt">optional</span>}</td>
                    <td><span className="pdesc">{desc}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {notes && (
              <div className="sd-tip" style={{ marginTop: 12 }}>
                <span className="sd-tip-icon">💡</span>
                <span>{notes}</span>
              </div>
            )}
          </div>
          <div className="sd-body-col">
            <div className="sd-body-col-label">Returns → {returnType}</div>
            <pre className="sd-code-block">{returnExample}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

function ResourceGroup({ icon, name, color, desc, methods, groupDelay = 0 }) {
  return (
    <div className="sd-rg" style={{ animationDelay: `${groupDelay}s` }}>
      <div className="sd-rg-header">
        <span className="sd-rg-icon">{icon}</span>
        <div className="sd-rg-dot" style={{ background: color }} />
        <span className="sd-rg-name" style={{ color }}>{name}</span>
        <span style={{ color: "var(--ink5)", fontSize: 11 }}>—</span>
        <span className="sd-rg-desc">{desc}</span>
      </div>
      {methods.map((m, i) => (
        <RpcMethod key={m.name} {...m} delay={groupDelay + i * 0.05} defaultOpen={i === 0 && groupDelay === 0} />
      ))}
    </div>
  );
}

const POST_EX = (
  <>
    {"{"}{"\n"}
    {"  "}<span className="key">"postId"</span>:{"       "}<span className="str">"post_abc123"</span>,{"\n"}
    {"  "}<span className="key">"creatorId"</span>:{"     "}<span className="str">"user_xyz"</span>,{"\n"}
    {"  "}<span className="key">"subredditId"</span>:{"   "}<span className="str">"sr_programming"</span>,{"\n"}
    {"  "}<span className="key">"title"</span>:{"         "}<span className="str">"Ask HN: best algo resources?"</span>,{"\n"}
    {"  "}<span className="key">"description"</span>:{"   "}<span className="str">"Looking for..."</span>,{"\n"}
    {"  "}<span className="key">"createdAt"</span>:{"     "}<span className="str">"2026-04-28T09:00:00Z"</span>,{"\n"}
    {"  "}<span className="key">"votesCount"</span>:{"    "}<span className="num">142</span>,{"\n"}
    {"  "}<span className="key">"commentsCount"</span>:{" "}<span className="num">37</span>,{"\n"}
    {"  "}<span className="key">"awardsCount"</span>:{"   "}<span className="num">3</span>,{"\n"}
    {"  "}<span className="key">"deletedAt"</span>:{"     "}<span className="kw">null</span>,{"\n"}
    {"  "}<span className="key">"currentVote"</span>:{"   "}<span className="str">"UP"</span>{"       "}<span className="cm">// populated for requesting user</span>{"\n"}
    {"}"}
  </>
);

const LIST_POSTS_EX = (
  <>
    {"{"}{"\n"}
    {"  "}<span className="key">"posts"</span>: [<span className="cm">/* Post[] */</span>],{"\n"}
    {"  "}<span className="key">"nextPageToken"</span>: <span className="str">"cursor_opaque_abc"</span>{"\n"}
    <span className="cm">// null when no more pages</span>{"\n"}
    {"}"}
  </>
);

const COMMENT_EX = (
  <>
    {"{"}{"\n"}
    {"  "}<span className="key">"commentId"</span>:{"  "}<span className="str">"cmt_789"</span>,{"\n"}
    {"  "}<span className="key">"creatorId"</span>:{"  "}<span className="str">"user_xyz"</span>,{"\n"}
    {"  "}<span className="key">"postId"</span>:{"     "}<span className="str">"post_abc123"</span>,{"\n"}
    {"  "}<span className="key">"content"</span>:{"    "}<span className="str">"Great question! Try..."</span>,{"\n"}
    {"  "}<span className="key">"createdAt"</span>:{"  "}<span className="str">"2026-04-28T09:05:00Z"</span>,{"\n"}
    {"  "}<span className="key">"votesCount"</span>:{"  "}<span className="num">28</span>,{"\n"}
    {"  "}<span className="key">"awardsCount"</span>:{"  "}<span className="num">1</span>,{"\n"}
    {"  "}<span className="key">"parentId"</span>:{"   "}<span className="kw">null</span>{"  "}<span className="cm">// top-level comment</span>{"\n"}
    {"  "}<span className="key">"deletedAt"</span>:{"  "}<span className="kw">null</span>,{"\n"}
    {"  "}<span className="key">"currentVote"</span>:{"  "}<span className="kw">null</span>{"\n"}
    {"}"}
  </>
);

const VOTE_EX = (
  <>
    {"{"}{"\n"}
    {"  "}<span className="key">"voteId"</span>:{"    "}<span className="str">"vote_111"</span>,{"\n"}
    {"  "}<span className="key">"creatorId"</span>:{"  "}<span className="str">"user_xyz"</span>,{"\n"}
    {"  "}<span className="key">"targetId"</span>:{"   "}<span className="str">"post_abc123"</span>{"  "}<span className="cm">// or commentId</span>{"\n"}
    {"  "}<span className="key">"type"</span>:{"       "}<span className="str">"UP"</span>,{"\n"}
    {"  "}<span className="key">"createdAt"</span>:{"  "}<span className="str">"2026-04-28T09:10:00Z"</span>{"\n"}
    {"}"}
  </>
);

const AWARD_EX = (
  <>
    {"{"}{"\n"}
    {"  "}<span className="key">"awardId"</span>:{"    "}<span className="str">"award_555"</span>,{"\n"}
    {"  "}<span className="key">"creatorId"</span>:{"  "}<span className="str">"user_xyz"</span>,{"\n"}
    {"  "}<span className="key">"targetId"</span>:{"   "}<span className="str">"post_abc123"</span>,{"\n"}
    {"  "}<span className="key">"type"</span>:{"       "}<span className="str">"GOLD"</span>{"  "}<span className="cm">// SILVER | GOLD | PLATINUM</span>{"\n"}
    {"  "}<span className="key">"createdAt"</span>:{"  "}<span className="str">"2026-04-28T09:12:00Z"</span>{"\n"}
    {"}"}
  </>
);

const RESOURCE_GROUPS = [
  {
    icon: "📄", name: "Posts", color: "var(--warn)", groupDelay: 0,
    desc: "CRUD + paginated listing for subreddit posts",
    methods: [
      {
        op: "Create", name: "CreatePost",
        params: [
          ["userId",      "string", true,  "Creator — also used for ACL"],
          ["subredditId", "string", true,  "Target subreddit"],
          ["title",       "string", true,  "Post headline"],
          ["description", "string", true,  "Post body text"],
        ],
        returnType: "Post",
        returnExample: POST_EX,
      },
      {
        op: "Edit", name: "EditPost",
        params: [
          ["userId",      "string", true, "Must match creatorId (ACL check)"],
          ["postId",      "string", true, "Post to edit"],
          ["title",       "string", true, "Updated title"],
          ["description", "string", true, "Updated body"],
        ],
        returnType: "Post",
        returnExample: POST_EX,
        notes: "Only the creator can edit. Backend validates userId === post.creatorId before applying.",
      },
      {
        op: "Get", name: "GetPost",
        params: [
          ["userId", "string", true,  "Used to populate currentVote field"],
          ["postId", "string", true,  "Post to fetch"],
        ],
        returnType: "Post",
        returnExample: POST_EX,
      },
      {
        op: "Delete", name: "DeletePost",
        params: [
          ["userId", "string", true, "Must match creatorId"],
          ["postId", "string", true, "Post to soft-delete"],
        ],
        returnType: "Post (with deletedAt set)",
        returnExample: (
          <>
            {"{"}{"\n"}
            {"  "}<span className="key">"postId"</span>:{"    "}<span className="str">"post_abc123"</span>,{"\n"}
            {"  "}...,{"\n"}
            {"  "}<span className="key">"deletedAt"</span>: <span className="str">"2026-04-28T10:00:00Z"</span>{"\n"}
            <span className="cm">// UI shows "[deleted]" but post struct is preserved</span>{"\n"}
            {"}"}
          </>
        ),
        notes: "Soft delete — sets deletedAt instead of removing. Preserves the reply tree for comment threads.",
      },
      {
        op: "List", name: "ListPosts",
        params: [
          ["userId",      "string", true,  "Populates currentVote on each post"],
          ["subredditId", "string", true,  "Which subreddit to list"],
          ["pageSize",    "int",    false, "Max items per page (default 25)"],
          ["pageToken",   "string", false, "Cursor from previous response"],
        ],
        returnType: "Post[] + nextPageToken?",
        returnExample: LIST_POSTS_EX,
        notes: "Cursor pagination (pageToken) is consistent under concurrent inserts. Offset pagination would skip/duplicate posts when new ones are added.",
      },
    ],
  },
  {
    icon: "💬", name: "Comments", color: "var(--accent)", groupDelay: 0.1,
    desc: "Nested comments on posts with optional parentId for reply threading",
    methods: [
      {
        op: "Create", name: "CreateComment",
        params: [
          ["userId",   "string", true,  "Creator"],
          ["postId",   "string", true,  "Post being commented on"],
          ["content",  "string", true,  "Comment body"],
          ["parentId", "string", false, "Parent commentId — null for top-level"],
        ],
        returnType: "Comment",
        returnExample: COMMENT_EX,
        notes: "parentId links a reply to its parent comment. UI uses these to reconstruct the indented tree client-side.",
      },
      {
        op: "Edit", name: "EditComment",
        params: [
          ["userId",     "string", true, "Must match creatorId"],
          ["commentId",  "string", true, "Comment to edit"],
          ["content",    "string", true, "New body text"],
        ],
        returnType: "Comment",
        returnExample: COMMENT_EX,
      },
      {
        op: "Get", name: "GetComment",
        params: [
          ["userId",    "string", true, "Used to populate currentVote"],
          ["commentId", "string", true, "Comment to fetch"],
        ],
        returnType: "Comment",
        returnExample: COMMENT_EX,
      },
      {
        op: "Delete", name: "DeleteComment",
        params: [
          ["userId",    "string", true, "Must match creatorId"],
          ["commentId", "string", true, "Comment to soft-delete"],
        ],
        returnType: "Comment (with deletedAt set)",
        returnExample: (
          <>
            {"{"}{" "}<span className="key">"commentId"</span>: <span className="str">"cmt_789"</span>, ...,{"\n"}
            {"  "}<span className="key">"deletedAt"</span>: <span className="str">"2026-04-28T11:00:00Z"</span>,{"\n"}
            {"  "}<span className="key">"content"</span>: <span className="str">"[deleted]"</span>{"  "}<span className="cm">// or kept for mod review</span>{"\n"}
            {"}"}
          </>
        ),
      },
      {
        op: "List", name: "ListComments",
        params: [
          ["userId",    "string", true,  "Populates currentVote on each comment"],
          ["postId",    "string", true,  "Fetch all comments for this post"],
          ["pageSize",  "int",    false, "Max items (default 25)"],
          ["pageToken", "string", false, "Cursor for next page"],
        ],
        returnType: "Comment[] + nextPageToken?",
        returnExample: (
          <>
            {"{"}{"\n"}
            {"  "}<span className="key">"comments"</span>: [<span className="cm">/* Comment[] flat list */</span>],{"\n"}
            {"  "}<span className="key">"nextPageToken"</span>: <span className="str">"cursor_opaque_xyz"</span>{"\n"}
            <span className="cm">// UI builds the tree using parentId links</span>{"\n"}
            {"}"}
          </>
        ),
        notes: "Returns a flat list sorted by createdAt. The client reconstructs the tree using parentId references. Sorting by votesCount within a thread is also valid.",
      },
    ],
  },
  {
    icon: "⬆️", name: "Votes", color: "var(--hot)", groupDelay: 0.2,
    desc: "Upvote / downvote targeting posts or comments — stored as separate entities",
    methods: [
      {
        op: "Create", name: "CreateVote",
        params: [
          ["userId",   "string",     true, "Voter — also used for ACL"],
          ["targetId", "string",     true, "postId or commentId being voted on"],
          ["type",     "UP | DOWN",  true, "Vote direction"],
        ],
        returnType: "Vote",
        returnExample: VOTE_EX,
        notes: "Called when a user casts a brand-new vote. A background job increments votesCount on the target Post or Comment.",
      },
      {
        op: "Edit", name: "EditVote",
        params: [
          ["userId", "string",    true, "Must match creatorId of the vote"],
          ["voteId", "string",    true, "The existing vote to flip"],
          ["type",   "UP | DOWN", true, "New direction (opposite of current)"],
        ],
        returnType: "Vote",
        returnExample: VOTE_EX,
        notes: "Called when a user has already voted and casts the opposite vote on the same target. Simpler than embedding votes in the post — just find and update the Vote entity.",
      },
      {
        op: "Delete", name: "DeleteVote",
        params: [
          ["userId", "string", true, "Must match creatorId"],
          ["voteId", "string", true, "Vote to remove"],
        ],
        returnType: "Vote (the deleted vote)",
        returnExample: (
          <>
            {"{ "}<span className="key">"voteId"</span>: <span className="str">"vote_111"</span>, <span className="key">"type"</span>: <span className="str">"UP"</span>,{" "}<span className="key">"targetId"</span>: <span className="str">"post_abc"</span>{" }"}{"\n"}
            <span className="cm">// votesCount on target decremented async</span>
          </>
        ),
        notes: "Called when a user removes an existing vote (clicks the same direction again). Returns the deleted vote for optimistic UI updates.",
      },
    ],
  },
  {
    icon: "🏆", name: "Awards", color: "var(--warn)", groupDelay: 0.3,
    desc: "Award giving — purchasable recognitions on posts and comments",
    methods: [
      {
        op: "Create", name: "CreateAward",
        params: [
          ["userId",   "string",               true, "Giver — must have purchased the award"],
          ["targetId", "string",               true, "postId or commentId receiving the award"],
          ["type",     "SILVER | GOLD | PLATINUM", true, "Award tier"],
        ],
        returnType: "Award",
        returnExample: AWARD_EX,
        notes: "No GetAward or ListAwards needed for the core flow — awardsCount on the Post/Comment is sufficient for display. Awards are one-directional and can't be revoked.",
      },
    ],
  },
];

function ApiTab() {
  return (
    <div className="sd-api-wrap" style={{ paddingBottom: 40 }}>
      <div className="sd-tip">
        <span className="sd-tip-icon">💡</span>
        <span>
          <strong>Interview tip:</strong> This is an <strong>API design</strong> question, not a systems design.
          The interviewer wants to see clean entity modeling, proper CRUD coverage, and deliberate
          trade-offs (votes as separate entities, soft delete, cursor pagination) — not infrastructure.
        </span>
      </div>
      {RESOURCE_GROUPS.map(g => (
        <ResourceGroup key={g.name} {...g} />
      ))}
    </div>
  );
}

// ── Schema Tab ────────────────────────────────────────────────────────────────
const TABLES = [
  {
    name: "Post",
    desc: "Core post entity — one per user submission to a subreddit",
    pills: [{ label: "Primary table", color: "var(--warn)" }],
    rows: [
      [<><span className="sd-field-name">postId</span><span className="sd-badge pk">PK</span></>, <span className="sd-field-type">string</span>, "UNIQUE NOT NULL", <span className="sd-field-example">post_abc123</span>, ""],
      [<><span className="sd-field-name">creatorId</span><span className="sd-badge fk">FK</span></>, <span className="sd-field-type">string</span>, "references users", <span className="sd-field-example">user_xyz</span>, "ACL — only creator edits/deletes"],
      [<><span className="sd-field-name">subredditId</span><span className="sd-badge fk">FK</span></>, <span className="sd-field-type">string</span>, "references subreddits", <span className="sd-field-example">sr_programming</span>, ""],
      [<span className="sd-field-name">title</span>, <span className="sd-field-type">string</span>, "NOT NULL", <span className="sd-field-example">Ask HN: best resources?</span>, ""],
      [<span className="sd-field-name">description</span>, <span className="sd-field-type">text</span>, "NOT NULL", <span className="sd-field-example">Looking for...</span>, "Post body"],
      [<span className="sd-field-name">createdAt</span>, <span className="sd-field-type">timestamp</span>, "NOT NULL DEFAULT now()", <span className="sd-field-example">2026-04-28T09:00Z</span>, ""],
      [<span className="sd-field-name">votesCount</span>, <span className="sd-field-type">int</span>, "DEFAULT 0", <span className="sd-field-example">142</span>, "Updated async by background service"],
      [<span className="sd-field-name">commentsCount</span>, <span className="sd-field-type">int</span>, "DEFAULT 0", <span className="sd-field-example">37</span>, "Same — not computed in-call"],
      [<span className="sd-field-name">awardsCount</span>, <span className="sd-field-type">int</span>, "DEFAULT 0", <span className="sd-field-example">3</span>, ""],
      [<><span className="sd-field-name">deletedAt</span><span className="sd-badge null">NULL</span></>, <span className="sd-field-type">timestamp</span>, "nullable", <span className="sd-field-example">null</span>, "Soft delete — UI shows [deleted]"],
      [<><span className="sd-field-name">currentVote</span><span className="sd-badge null">VIRTUAL</span></>, <span className="sd-field-type">UP | DOWN | null</span>, "not persisted", <span className="sd-field-example">UP</span>, "Joined from Vote table per request"],
    ],
  },
  {
    name: "Comment",
    desc: "Comment on a post — supports nested replies via parentId",
    pills: [{ label: "Tree structure", color: "var(--accent)" }],
    rows: [
      [<><span className="sd-field-name">commentId</span><span className="sd-badge pk">PK</span></>, <span className="sd-field-type">string</span>, "UNIQUE NOT NULL", <span className="sd-field-example">cmt_789</span>, ""],
      [<><span className="sd-field-name">creatorId</span><span className="sd-badge fk">FK</span></>, <span className="sd-field-type">string</span>, "references users", <span className="sd-field-example">user_xyz</span>, "ACL check on edit/delete"],
      [<><span className="sd-field-name">postId</span><span className="sd-badge fk">FK</span></>, <span className="sd-field-type">string</span>, "references posts", <span className="sd-field-example">post_abc123</span>, ""],
      [<span className="sd-field-name">content</span>, <span className="sd-field-type">text</span>, "NOT NULL", <span className="sd-field-example">Great question! Try...</span>, ""],
      [<span className="sd-field-name">createdAt</span>, <span className="sd-field-type">timestamp</span>, "NOT NULL DEFAULT now()", <span className="sd-field-example">2026-04-28T09:05Z</span>, ""],
      [<span className="sd-field-name">votesCount</span>, <span className="sd-field-type">int</span>, "DEFAULT 0", <span className="sd-field-example">28</span>, "Updated async"],
      [<span className="sd-field-name">awardsCount</span>, <span className="sd-field-type">int</span>, "DEFAULT 0", <span className="sd-field-example">1</span>, ""],
      [<><span className="sd-field-name">parentId</span><span className="sd-badge null">NULL</span></>, <span className="sd-field-type">string</span>, "self-FK nullable", <span className="sd-field-example">cmt_456</span>, "null = top-level; set = reply"],
      [<><span className="sd-field-name">deletedAt</span><span className="sd-badge null">NULL</span></>, <span className="sd-field-type">timestamp</span>, "nullable", <span className="sd-field-example">null</span>, "Soft delete preserves reply tree"],
      [<><span className="sd-field-name">currentVote</span><span className="sd-badge null">VIRTUAL</span></>, <span className="sd-field-type">UP | DOWN | null</span>, "not persisted", <span className="sd-field-example">null</span>, "Joined from Vote table"],
    ],
  },
  {
    name: "Vote",
    desc: "Separate entity — enables clean EditVote and DeleteVote without array mutation",
    pills: [{ label: "Key design decision", color: "var(--hot)" }],
    rows: [
      [<><span className="sd-field-name">voteId</span><span className="sd-badge pk">PK</span></>, <span className="sd-field-type">string</span>, "UNIQUE NOT NULL", <span className="sd-field-example">vote_111</span>, ""],
      [<><span className="sd-field-name">creatorId</span><span className="sd-badge fk">FK</span></>, <span className="sd-field-type">string</span>, "references users", <span className="sd-field-example">user_xyz</span>, ""],
      [<><span className="sd-field-name">targetId</span><span className="sd-badge idx">IDX</span></>, <span className="sd-field-type">string</span>, "postId or commentId", <span className="sd-field-example">post_abc123</span>, "Polymorphic — indexed for lookups"],
      [<span className="sd-field-name">type</span>, <span className="sd-field-type">enum UP | DOWN</span>, "NOT NULL", <span className="sd-field-example">UP</span>, ""],
      [<span className="sd-field-name">createdAt</span>, <span className="sd-field-type">timestamp</span>, "DEFAULT now()", <span className="sd-field-example">2026-04-28T09:10Z</span>, ""],
    ],
  },
  {
    name: "Award",
    desc: "Purchasable recognition given to posts or comments",
    pills: [{ label: "Append-only", color: "var(--warn)" }],
    rows: [
      [<><span className="sd-field-name">awardId</span><span className="sd-badge pk">PK</span></>, <span className="sd-field-type">string</span>, "UNIQUE NOT NULL", <span className="sd-field-example">award_555</span>, ""],
      [<><span className="sd-field-name">creatorId</span><span className="sd-badge fk">FK</span></>, <span className="sd-field-type">string</span>, "references users (giver)", <span className="sd-field-example">user_xyz</span>, ""],
      [<><span className="sd-field-name">targetId</span><span className="sd-badge idx">IDX</span></>, <span className="sd-field-type">string</span>, "postId or commentId", <span className="sd-field-example">post_abc123</span>, "Polymorphic like Vote.targetId"],
      [<span className="sd-field-name">type</span>, <span className="sd-field-type">enum</span>, "NOT NULL", <span className="sd-field-example">GOLD</span>, "SILVER | GOLD | PLATINUM"],
      [<span className="sd-field-name">createdAt</span>, <span className="sd-field-type">timestamp</span>, "DEFAULT now()", <span className="sd-field-example">2026-04-28T09:12Z</span>, "Awards can't be revoked"],
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
                <span key={p.label} className="sd-pill"
                  style={{ color: p.color, borderColor: p.color, background: "transparent" }}>
                  {p.label}
                </span>
              ))}
            </div>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table>
              <thead>
                <tr>
                  {["Field", "Type", "Constraints", "Example", "Notes"].map(c => (
                    <th key={c}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {t.rows.map((row, ri) => (
                  <tr key={ri}>{row.map((cell, ci) => <td key={ci}>{cell}</td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
      <div className="sd-tip">
        <span className="sd-tip-icon">💡</span>
        <span>
          <strong>Interview tip:</strong> Start with <code>Post</code> — it's the anchor entity.
          Only introduce <code>Vote</code> after you've explained <em>why</em> it's a separate entity.
          The interviewer will likely ask; make sure you can defend the decision before they do.
        </span>
      </div>
    </div>
  );
}

// ── Key Decisions Tab ─────────────────────────────────────────────────────────
const DECISIONS = [
  {
    num: "01",
    title: "Votes as separate entities — not embedded fields",
    options: [
      { label: "chosen", name: "Separate Vote entity",    detail: "voteId, creatorId, targetId, type. EditVote and DeleteVote are simple lookups — no array mutation on Post/Comment." },
      { label: "avoid",  name: "Embed votes[] on Post",   detail: "Editing or removing a user's vote requires scanning and mutating an array inside the Post document. Scales poorly." },
      { label: "",       name: "votesCount only (no log)", detail: "Simpler but you can't let a user change or retract their vote — you've lost the per-user record." },
    ],
    verdict: <>Storing Votes as their own entity with a <strong>voteId</strong> is the key insight the question tests. It makes EditVote and DeleteVote trivial and enables the <code>currentVote</code> field via a simple join.</>,
    tip: "If the interviewer asks 'what if the same user votes twice?' — your CreateVote should first check if a Vote already exists for (creatorId, targetId). If yes, return a conflict or call EditVote instead.",
  },
  {
    num: "02",
    title: "Soft delete with deletedAt — not hard delete",
    options: [
      { label: "chosen", name: "Soft delete (deletedAt)", detail: "Set deletedAt timestamp. Record stays in DB. UI renders '[deleted]' for the content while replies remain visible and correctly threaded." },
      { label: "avoid",  name: "Hard delete",              detail: "Removes the row. Any comments with parentId pointing to it lose their anchor — the reply tree breaks or requires costly re-parenting." },
      { label: "",       name: "Replace content only",     detail: "Overwrite content with '[deleted]'. Simpler than deletedAt but you lose the audit trail and timestamp of when it was removed." },
    ],
    verdict: <><strong>deletedAt</strong> is the right call for nested content. Reddit itself shows "[removed by moderator]" while keeping the comment struct intact — this is why.</>,
    tip: "Mention that deletedAt also lets you support 'undo delete' (grace period) and enables mod audit logs. Hard delete is irreversible and breaks comment trees.",
  },
  {
    num: "03",
    title: "Cursor pagination (pageToken) vs offset",
    options: [
      { label: "chosen", name: "Cursor / pageToken",   detail: "Opaque token encodes the last-seen item. Consistent when items are inserted — new posts don't shift pages." },
      { label: "avoid",  name: "Offset pagination",    detail: "page=2&size=25 skips or duplicates items if new posts are created between requests. Common bug in Reddit-style feeds." },
      { label: "",       name: "Keyset pagination",     detail: "Explicit sort key (e.g. createdAt + id). Slightly more transparent than opaque tokens, but exposes your sort implementation." },
    ],
    verdict: <>Return an opaque <strong>nextPageToken</strong> from every List call. The client feeds it back verbatim to get the next page. When null, there are no more results.</>,
    tip: "In an interview, mentioning cursor pagination unprompted is a strong signal. Interviewers often expect candidates to default to offset and ask why that breaks — skip straight to the right answer.",
  },
  {
    num: "04",
    title: "currentVote — server-side join, not client fetch",
    options: [
      { label: "chosen", name: "Server-side join on fetch", detail: "GetPost / ListPosts joins the Vote table for the requesting userId and populates currentVote. One round-trip from the client." },
      { label: "avoid",  name: "Client fetches votes separately", detail: "Client calls ListPosts, then GetVote for each post. N+1 problem — catastrophic at scale." },
      { label: "",       name: "Batch vote lookup",          detail: "Client calls ListPosts, then BatchGetVotes([postIds]). Better than N+1 but still 2 round-trips and a more complex client." },
    ],
    verdict: <>The server populates <code>currentVote</code> when building the Post or Comment response. It's a single JOIN on the Vote table — cheap, transparent, and no extra client round-trips.</>,
    tip: "This is a 'null means no vote' convention. Make sure to document it: null ≠ DOWN. null means the user hasn't voted; DOWN is an explicit downvote.",
  },
  {
    num: "05",
    title: "parentId for comment threading",
    options: [
      { label: "chosen", name: "Flat list + parentId",    detail: "ListComments returns all comments flat. Each has an optional parentId. Client reconstructs the tree from these links." },
      { label: "",       name: "Nested response from API", detail: "API returns a tree of Comment objects. Simpler for the client but expensive to build server-side and hard to paginate." },
      { label: "avoid",  name: "Path encoding (e.g. 1/2/5)", detail: "Encode ancestry as a path string. Fast ancestry queries but brittle, hard to move threads, and non-standard." },
    ],
    verdict: <>Return a <strong>flat list</strong> with <code>parentId</code> on each Comment. The client builds the visual tree. This keeps the API simple, pagination straightforward, and avoids nested response depth limits.</>,
    tip: "If asked about sorting: within a reply thread, sort by votesCount descending (best comments first) or createdAt ascending (chronological). Both are valid — state your assumption.",
  },
];

function DecisionsTab() {
  return (
    <div className="sd-decisions-wrap">
      {DECISIONS.map((d, i) => (
        <div key={d.num} className="sd-decision-card" style={{ animationDelay: `${i * 0.07}s` }}>
          <div className="sd-decision-header">
            <span className="sd-decision-num">{d.num}</span>
            <span className="sd-decision-title">{d.title}</span>
          </div>
          <div className="sd-decision-body">
            <div className="sd-options-row">
              {d.options.map(o => (
                <div key={o.name} className={`sd-option ${o.label}`}>
                  <div className="sd-option-badge">
                    {o.label === "chosen" ? "✓ Use this" : o.label === "avoid" ? "✗ Avoid" : "Alternative"}
                  </div>
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
  { id: "diagram",      label: "Entity Diagram"  },
  { id: "requirements", label: "Requirements"    },
  { id: "api",          label: "API Design"       },
  { id: "schema",       label: "Schema"           },
  { id: "decisions",    label: "Key Decisions"    },
];

export default function RedditApi() {
  const [activeTab, setActiveTab] = useState("diagram");
  const [panelKey, setPanelKey] = useState(0);

  const handleTab = (id) => {
    if (id === activeTab) return;
    setActiveTab(id);
    setPanelKey(k => k + 1);
  };

  return (
    <div className="sd-artifact">
      <div className="sd-header">
        <div>
          <h2 className="sd-title">Reddit API <em>Design</em></h2>
          <p className="sd-subtitle">// posts · comments · votes · awards — entity modeling &amp; CRUD</p>
        </div>
        <div className="sd-meta-pills">
          <span className="sd-pill">API Design</span>
          <span className="sd-pill accent">4 entities</span>
          <span className="sd-pill ok">cursor pagination</span>
        </div>
      </div>

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
