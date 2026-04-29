import { useState, useRef, useCallback, useEffect } from "react";

const NW = 90, NH = 70;
function ctr(n) { return { x: n.x + NW / 2, y: n.y + NH / 2 }; }

const DEFAULT_GROUP_META = {
  external:      { color: "#6B7280", label: "External" },
  auth:          { color: "#DD344C", label: "Auth" },
  security:      { color: "#DD344C", label: "Security" },
  networking:    { color: "#8C4FFF", label: "Networking" },
  order:         { color: "#3B82F6", label: "Order Service" },
  config:        { color: "#D97706", label: "Config Service" },
  data:          { color: "#2563EB", label: "Data Store" },
  observability: { color: "#D97706", label: "Observability" },
  eventing:      { color: "#DD344C", label: "Event-Driven" },
  edge:          { color: "#378ADD", label: "Edge / Ingress" },
  mesh:          { color: "#1D9E75", label: "Service Mesh" },
  core:          { color: "#7F77DD", label: "Core Services" },
  settlement:    { color: "#D85A30", label: "Settlement" },
};

function Boundary({ b, isSelected, onClick }) {
  const clickable = !!b.detail;
  return (
    <g onClick={clickable ? (e) => { e.stopPropagation(); onClick(b); } : undefined} style={{ cursor: clickable ? "pointer" : "default" }}>
      <rect x={b.x} y={b.y} width={b.w} height={b.h} rx={6}
        fill={isSelected ? b.color + "10" : b.color + "06"} stroke={isSelected ? b.color : b.color + "66"} strokeWidth={isSelected ? 2.2 : 1.5}
        strokeDasharray={b.style === "dashed" ? "8 4" : "none"} />
      {/* Label pill — fill via style so CSS var works in SVG */}
      <rect x={b.x + 8} y={b.y - 7} width={b.label.length * 5.8 + 16} height={14} rx={3}
        style={{ fill: "var(--bg)" }} stroke={isSelected ? b.color + "88" : b.color + "44"} strokeWidth={0.5} />
      <text x={b.x + 16} y={b.y + 3} fontSize={8.5} fontWeight="600" fill={b.color}
        style={{ fontFamily: "monospace" }}>{b.label}</text>
      {isSelected && (
        <rect x={b.x - 4} y={b.y - 4} width={b.w + 8} height={b.h + 8} rx={9}
          fill="none" stroke={b.color} strokeWidth={1} strokeDasharray="6 3" opacity={0.55}>
          <animate attributeName="stroke-dashoffset" from="0" to="-18" dur="1.8s" repeatCount="indefinite" />
        </rect>
      )}
    </g>
  );
}

function Arrow({ flow, nodes, highlight, highlightStep, groupMeta, allFlows, onSelectStep }) {
  const f = nodes.find(n => n.id === flow.from);
  const t = nodes.find(n => n.id === flow.to);
  if (!f || !t) return null;
  const a = ctr(f), b = ctr(t);
  const dx = b.x - a.x, dy = b.y - a.y;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len === 0) return null;
  const ux = dx / len, uy = dy / len;
  const px = -uy, py = ux;

  const hasReverse = allFlows.some(fl => fl.from === flow.to && fl.to === flow.from);
  const lineOffset = hasReverse ? 7 : 0;
  const ox = px * lineOffset, oy = py * lineOffset;

  const sx = a.x + ux * (NW / 2 + 5) + ox;
  const sy = a.y + uy * (NH / 2 + 3) + oy;
  const ex = b.x - ux * (NW / 2 + 5) + ox;
  const ey = b.y - uy * (NH / 2 + 3) + oy;

  const bx = sx + (ex - sx) * 0.35, by = sy + (ey - sy) * 0.35;
  const lx = sx + (ex - sx) * 0.62, ly = sy + (ey - sy) * 0.62;
  const isHi = highlightStep
    ? flow.step === highlightStep
    : (highlight && flow.step > 0);
  const opacity = highlightStep
    ? (isHi ? 1 : 0.12)
    : (highlight ? (isHi ? 1 : 0.12) : 0.55);
  const col = isHi ? "#58a6ff" : (groupMeta[f.group]?.color || "#666");
  const mid = `a${flow.from}${flow.to}`;
  const hasBadge = flow.step > 0;
  const hasLabel = !!flow.label;
  const labelOffsetX = px * 10, labelOffsetY = py * 10;

  return (
    <g
      style={{ opacity, transition: "opacity 0.3s", cursor: flow.step > 0 && onSelectStep ? "pointer" : "default" }}
      onClick={flow.step > 0 && onSelectStep ? (e) => {
        e.stopPropagation();
        onSelectStep(flow.step);
      } : undefined}
    >
      <defs>
        <marker id={mid} viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="7" markerHeight="5" orient="auto-start-reverse">
          <polygon points="0 0, 10 3.5, 0 7" fill={col} />
        </marker>
      </defs>
      <line x1={sx} y1={sy} x2={ex} y2={ey} stroke={col} strokeWidth={isHi ? 2.2 : 1.2}
        strokeDasharray={flow.style === "dashed" ? "6 3" : "none"} markerEnd={`url(#${mid})`} />

      {hasBadge && (
        <g>
          {/* style={{ fill }} so CSS var works */}
          <circle cx={bx} cy={by} r={9} style={{ fill: "var(--bg)" }} stroke={isHi ? "#58a6ff" : col} strokeWidth={isHi ? 1.8 : 1.2} />
          <text x={bx} y={by + 4} textAnchor="middle" fontSize={8.5}
            style={{ fill: isHi ? "var(--accent)" : "var(--ink1)", fontFamily: "monospace", pointerEvents: "none" }}
            fontWeight="700">{flow.step}</text>
        </g>
      )}

      {hasLabel && (
        <g>
          <rect
            x={lx + labelOffsetX - flow.label.length * 2.8 - 4}
            y={ly + labelOffsetY - 7}
            width={flow.label.length * 5.6 + 8}
            height={14}
            rx={3}
            style={{ fill: "var(--bg)" }}
            fillOpacity={0.92}
          />
          <text
            x={lx + labelOffsetX} y={ly + labelOffsetY + 3}
            textAnchor="middle" fontSize={7} fill={col}
            fontWeight={isHi ? "700" : "500"}
            style={{ fontFamily: "monospace" }}
          >
            {flow.label}
          </text>
        </g>
      )}
    </g>
  );
}

function NodeBox({ node, isSelected, onClick, iconMap, groupMeta }) {
  const gc = groupMeta[node.group]?.color || "#666";
  const iconUrl = node.iconType === "aws" ? iconMap[node.awsIcon] : null;
  return (
    <g onClick={(e) => { e.stopPropagation(); onClick(node); }} style={{ cursor: "pointer" }}>
      <rect x={node.x} y={node.y} width={NW} height={NH} rx={8}
        style={{ fill: isSelected ? gc + "1a" : "var(--bg)" }}
        stroke={isSelected ? gc : gc + "55"} strokeWidth={isSelected ? 2.5 : 1} />
      {iconUrl ? (
        <image href={iconUrl} x={node.x + NW / 2 - 15} y={node.y + 5} width={30} height={30} style={{ pointerEvents: "none" }} />
      ) : (
        <text x={node.x + NW / 2} y={node.y + 26} textAnchor="middle" fontSize={22} style={{ pointerEvents: "none" }}>{node.customIcon}</text>
      )}
      <text x={node.x + NW / 2} y={node.y + 46} textAnchor="middle" fontSize={7}
        style={{ fill: "var(--ink2)", fontFamily: "monospace", pointerEvents: "none" }}
        fontWeight="500">{node.label.length > 18 ? node.label.slice(0, 16) + "…" : node.label}</text>
      {node.label.length > 18 && (
        <text x={node.x + NW / 2} y={node.y + 57} textAnchor="middle" fontSize={7}
          style={{ fill: "var(--ink2)", fontFamily: "monospace", pointerEvents: "none" }}
          fontWeight="500">{node.label.slice(16).trim()}</text>
      )}
      {isSelected && (
        <rect x={node.x - 3} y={node.y - 3} width={NW + 6} height={NH + 6} rx={10}
          fill="none" stroke={gc} strokeWidth={1} strokeDasharray="4 2" opacity={0.6}>
          <animate attributeName="stroke-dashoffset" from="0" to="-12" dur="1.5s" repeatCount="indefinite" />
        </rect>
      )}
    </g>
  );
}

function DetailPanel({ item, onClose, flows, iconMap, groupMeta, position, onDragStart, isDragging }) {
  if (!item) return null;
  const m = groupMeta[item.group] || { color: item.color || "#666", label: item.type === "boundary" ? "Boundary" : "Component" };
  const inb = item.type === "node" ? flows.filter(f => f.to === item.id && f.label) : [];
  const outb = item.type === "node" ? flows.filter(f => f.from === item.id && f.label) : [];
  const iconUrl = item.iconType === "aws" ? iconMap[item.awsIcon] : null;
  return (
    <div style={{
      position: "absolute", top: position.y, left: position.x, width: 330, maxHeight: "calc(100vh - 80px)", overflowY: "auto",
      background: "var(--bg)", border: `1px solid ${m.color}33`, borderRadius: 14, padding: "18px 20px", zIndex: 100,
      boxShadow: `0 0 40px ${m.color}10, 0 12px 40px rgba(0,0,0,0.3)`, fontFamily: "monospace",
    }}>
      <div
        onPointerDown={onDragStart}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          margin: "-18px -20px 0",
          padding: "14px 20px 10px",
          borderBottom: "1px solid var(--line)",
          cursor: isDragging ? "grabbing" : "grab",
          userSelect: "none",
        }}
        title="Drag to move"
      >
        <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5,
          color: m.color, background: m.color + "15", padding: "3px 8px", borderRadius: 4 }}>{m.label}</span>
        <button onPointerDown={e => e.stopPropagation()} onClick={onClose} style={{ background: "none", border: "none", color: "var(--ink4)", cursor: "pointer", fontSize: 19, padding: 0 }}>✕</button>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "14px 0 8px" }}>
        {iconUrl ? <img src={iconUrl} width={40} height={40} alt="" /> : <span style={{ fontSize: 35 }}>{item.customIcon || "⬚"}</span>}
        <h3 style={{ margin: 0, fontSize: 17, color: "var(--ink1)", lineHeight: 1.3 }}>{item.label}</h3>
      </div>
      <p style={{ fontSize: 12, lineHeight: 1.8, color: "var(--ink3)", margin: "10px 0 0" }}>{item.detail}</p>
      {(inb.length > 0 || outb.length > 0) && (
        <div style={{ marginTop: 14, paddingTop: 10, borderTop: "1px solid var(--line)" }}>
          <span style={{ fontSize: 12, color: "var(--ink4)", textTransform: "uppercase", letterSpacing: 1 }}>Connections</span>
          <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 3 }}>
            {inb.map((f, i) => <div key={`i${i}`} style={{ fontSize: 13, color: "#58a6ff" }}>← {f.label} <span style={{ color: "var(--ink5)" }}>from {f.from}</span></div>)}
            {outb.map((f, i) => <div key={`o${i}`} style={{ fontSize: 13, color: "#3fb950" }}>→ {f.label} <span style={{ color: "var(--ink5)" }}>to {f.to}</span></div>)}
          </div>
        </div>
      )}
      <div style={{ marginTop: 10, paddingTop: 8, borderTop: "1px solid var(--line)", display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: 11, color: "var(--ink5)" }}>id: {item.id}</span>
        <span style={{ fontSize: 11, color: "var(--ink5)" }}>group: {item.group || "n/a"}</span>
      </div>
    </div>
  );
}

function Minimap({ canvasW, canvasH, transform, dims, nodes, boundaries, groupMeta }) {
  const mw = 160, mh = 95;
  const sx = mw / canvasW, sy = mh / canvasH;
  const vx = (-transform.x / transform.scale) * sx, vy = (-transform.y / transform.scale) * sy;
  const vw = (dims.w / transform.scale) * sx, vh = (dims.h / transform.scale) * sy;
  return (
    <div style={{ position: "absolute", bottom: 12, left: 12, width: mw, height: mh, background: "var(--surface2)", border: "1px solid var(--line)", borderRadius: 8, overflow: "hidden" }}>
      <svg viewBox={`0 0 ${mw} ${mh}`} width={mw} height={mh}>
        {boundaries.slice(0, 3).map(b => <rect key={b.id} x={b.x * sx} y={b.y * sy} width={b.w * sx} height={b.h * sy} fill={b.color + "15"} stroke={b.color + "44"} strokeWidth={0.5} rx={1} />)}
        {nodes.map(n => <circle key={n.id} cx={(n.x + NW / 2) * sx} cy={(n.y + NH / 2) * sy} r={1.5} fill={groupMeta[n.group]?.color || "#666"} />)}
        <rect x={vx} y={vy} width={Math.max(vw, 8)} height={Math.max(vh, 5)} fill="none" stroke="var(--accent)" strokeWidth={1.5} rx={1} />
      </svg>
    </div>
  );
}

function applySpread(architecture, spread) {
  const s = spread;
  const nodes = architecture.nodes.map(n => ({ ...n, x: n.x * s, y: n.y * s }));
  const boundaries = architecture.boundaries.map(b => ({
    ...b, x: b.x * s, y: b.y * s, w: b.w * s, h: b.h * s,
  }));
  return { ...architecture, nodes, boundaries };
}

const SPREAD_PRESETS = [
  { label: "Compact", value: 0.75 },
  { label: "Default", value: 1.0 },
  { label: "Loose",   value: 1.3 },
  { label: "Wide",    value: 1.65 },
];

function LayoutPanel({ spread, setSpread, onPointerDown }) {
  return (
    <div
      onPointerDown={onPointerDown}
      style={{
        position: "absolute", bottom: 118, right: 12, width: 210,
        background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 10,
        padding: "10px 14px", zIndex: 60, fontFamily: "monospace",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.2, color: "var(--ink4)" }}>
          Layout Spacing
        </span>
        <span style={{ fontSize: 13, color: "var(--accent)", fontWeight: 700 }}>{Math.round(spread * 100)}%</span>
      </div>

      <input
        type="range" min={0.6} max={1.8} step={0.05} value={spread}
        onChange={e => setSpread(parseFloat(e.target.value))}
        style={{ width: "100%", accentColor: "var(--accent)", cursor: "pointer", marginBottom: 8 }}
      />

      <div style={{ display: "flex", gap: 4 }}>
        {SPREAD_PRESETS.map(p => {
          const active = Math.abs(spread - p.value) < 0.03;
          return (
            <button
              key={p.label}
              onClick={() => setSpread(p.value)}
              style={{
                flex: 1, fontSize: 11, padding: "3px 0", cursor: "pointer", borderRadius: 5,
                fontFamily: "monospace", transition: "background 0.15s, color 0.15s",
                background: active ? "var(--tint)" : "var(--bg)",
                border: `1px solid ${active ? "var(--tintb)" : "var(--line2)"}`,
                color: active ? "var(--accent)" : "var(--ink4)",
              }}
            >
              {p.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ExplanationPanel({ title, intro, sections, summary, openSections, setOpenSections, onClose }) {
  return (
    <div style={{
      position: "absolute", top: 64, left: 12, width: 360, maxHeight: "calc(100vh - 92px)", overflowY: "auto",
      background: "var(--bg)", border: "1px solid var(--line)", borderRadius: 14, zIndex: 95,
      boxShadow: "0 12px 40px rgba(0,0,0,0.25)", fontFamily: "monospace",
    }}>
      <div style={{ padding: "16px 18px 14px", borderBottom: "1px solid var(--line)" }}>
        <div style={{ display: "flex", alignItems: "start", justifyContent: "space-between", gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, color: "var(--ink5)", textTransform: "uppercase", letterSpacing: 1.2 }}>
              Architecture Notes
            </div>
            <h2 style={{ margin: "6px 0 0", fontSize: 17, lineHeight: 1.4, color: "var(--ink1)" }}>
              {title}
            </h2>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--ink4)", cursor: "pointer", fontSize: 18, padding: 0 }}>✕</button>
        </div>
        {intro && (
          <p style={{ margin: "10px 0 0", fontSize: 12, lineHeight: 1.8, color: "var(--ink3)" }}>
            {intro}
          </p>
        )}
      </div>

      <div style={{ padding: "10px 12px 14px" }}>
        {sections.map((section, idx) => {
          const isOpen = !!openSections[section.id];
          return (
            <div key={section.id} style={{ border: "1px solid var(--line)", borderRadius: 10, marginBottom: 10, overflow: "hidden" }}>
              <button
                onClick={() => setOpenSections(s => ({ ...s, [section.id]: !s[section.id] }))}
                style={{
                  width: "100%", background: isOpen ? "var(--surface2)" : "var(--surface)", border: "none",
                  padding: "12px 14px", textAlign: "left", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
                  fontFamily: "inherit",
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--ink1)", lineHeight: 1.4 }}>
                  {idx + 1}. {section.title}
                </span>
                <span style={{ fontSize: 12, color: "var(--ink5)" }}>{isOpen ? "−" : "+"}</span>
              </button>
              {isOpen && (
                <div style={{ padding: "12px 14px 14px", background: "var(--bg)", borderTop: "1px solid var(--line)" }}>
                  {section.technologies?.length > 0 && (
                    <div style={{ marginBottom: 10 }}>
                      <div style={{ fontSize: 11, color: "var(--ink5)", textTransform: "uppercase", letterSpacing: 1.1, marginBottom: 6 }}>
                        Technologies
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {section.technologies.map(tech => (
                          <span key={tech} style={{
                            fontSize: 11, padding: "2px 8px", borderRadius: 999, background: "var(--surface2)",
                            border: "1px solid var(--line)", color: "var(--ink3)",
                          }}>
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {section.services?.length > 0 && (
                    <div style={{ marginBottom: 10 }}>
                      <div style={{ fontSize: 11, color: "var(--ink5)", textTransform: "uppercase", letterSpacing: 1.1, marginBottom: 6 }}>
                        Services
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {section.services.map(service => (
                          <span key={service} style={{
                            fontSize: 11, padding: "2px 8px", borderRadius: 999, background: "var(--tint)",
                            border: "1px solid var(--tintb)", color: "var(--accent)",
                          }}>
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <p style={{ margin: 0, fontSize: 12, lineHeight: 1.8, color: "var(--ink3)" }}>
                    {section.explanation}
                  </p>
                  {section.decision && (
                    <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid var(--line)" }}>
                      <div style={{ fontSize: 11, color: "var(--ink5)", textTransform: "uppercase", letterSpacing: 1.1, marginBottom: 6 }}>
                        Decision
                      </div>
                      <p style={{ margin: 0, fontSize: 12, lineHeight: 1.8, color: "var(--ink2)" }}>
                        {section.decision}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {summary && (
          <div style={{ marginTop: 8, padding: "12px 14px", border: "1px solid var(--line)", borderRadius: 10, background: "var(--surface)" }}>
            <div style={{ fontSize: 11, color: "var(--ink5)", textTransform: "uppercase", letterSpacing: 1.1, marginBottom: 6 }}>
              Summary
            </div>
            <p style={{ margin: 0, fontSize: 12, lineHeight: 1.8, color: "var(--ink2)" }}>
              {summary}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function FlowGuideCard({ step, currentIndex, total, onPrev, onNext, onClose, position, onDragStart, isDragging }) {
  if (!step) return null;
  return (
    <div style={{
      position: "absolute", top: position.y, left: position.x, width: 320, zIndex: 90,
      background: "var(--bg)", border: `1px solid ${step.color || "#58a6ff"}44`,
      borderRadius: 14, padding: "16px 18px",
      boxShadow: "0 12px 40px rgba(0,0,0,0.25)", fontFamily: "monospace",
    }}>
      <div
        onPointerDown={onDragStart}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
          margin: "-16px -18px 0", padding: "12px 18px 10px",
          borderBottom: "1px solid var(--line)", cursor: isDragging ? "grabbing" : "grab",
          userSelect: "none",
        }}
        title="Drag to move"
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(2, 4px)", gap: 3,
            opacity: 0.7, flexShrink: 0,
          }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i} style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--ink5)" }} />
            ))}
          </div>
          <div>
            <div style={{ fontSize: 11, color: "var(--ink5)", textTransform: "uppercase", letterSpacing: 1.2 }}>
              Guided Flow
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: step.color || "var(--accent)", marginTop: 4 }}>
              Step {step.step}
            </div>
          </div>
        </div>
        <button onPointerDown={e => e.stopPropagation()} onClick={onClose} style={{ background: "none", border: "none", color: "var(--ink4)", cursor: "pointer", fontSize: 18, padding: 0 }}>✕</button>
      </div>

      <div style={{ marginTop: 12, fontSize: 14, color: "var(--ink1)", fontWeight: 700, lineHeight: 1.45 }}>
        {step.title}
      </div>
      <p style={{ margin: "10px 0 0", fontSize: 12, lineHeight: 1.8, color: "var(--ink3)" }}>
        {step.explanation}
      </p>

      <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
        <span style={{ fontSize: 11, color: "var(--ink5)" }}>
          {currentIndex + 1} / {total}
        </span>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={onPrev}
            disabled={currentIndex === 0}
            style={{
              background: currentIndex === 0 ? "var(--surface2)" : "var(--surface)",
              border: "1px solid var(--line)", color: currentIndex === 0 ? "var(--ink5)" : "var(--ink2)",
              borderRadius: 8, padding: "6px 12px", fontSize: 12, cursor: currentIndex === 0 ? "default" : "pointer", fontFamily: "inherit",
            }}
          >
            Back
          </button>
          <button
            onClick={onNext}
            disabled={currentIndex === total - 1}
            style={{
              background: currentIndex === total - 1 ? "var(--surface2)" : "var(--tint)",
              border: `1px solid ${currentIndex === total - 1 ? "var(--line)" : "var(--tintb)"}`,
              color: currentIndex === total - 1 ? "var(--ink5)" : "var(--accent)",
              borderRadius: 8, padding: "6px 12px", fontSize: 12, cursor: currentIndex === total - 1 ? "default" : "pointer", fontFamily: "inherit", fontWeight: 700,
            }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ArchitectureViewer({ architecture, iconMap, groupMeta: groupMetaProp }) {
  const groupMeta = { ...DEFAULT_GROUP_META, ...(groupMetaProp || {}) };
  const layerViews = architecture.layerViews || [];
  const hasLayerViews = layerViews.length > 0;
  const headerHeight = hasLayerViews ? 94 : 52;
  const explanation = architecture.explanation;
  const hasExplanation = !!(explanation?.sections?.length);

  const [selected, setSelected] = useState(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [highlightFlow, setHighlightFlow] = useState(false);
  const [search, setSearch] = useState("");
  const [spread, setSpread] = useState(architecture.defaultSpread || 1.0);
  const [activeLayer, setActiveLayer] = useState(architecture.defaultLayer || "all");
  const [flowStepIndex, setFlowStepIndex] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [openSections, setOpenSections] = useState(() => {
    const first = architecture.explanation?.sections?.[0]?.id;
    return first ? { [first]: true } : {};
  });
  const [flowCardPos, setFlowCardPos] = useState({ x: 12, y: 0 });
  const [draggingFlowCard, setDraggingFlowCard] = useState(false);
  const [flowCardDragOffset, setFlowCardDragOffset] = useState({ x: 0, y: 0 });
  const [detailPanelPos, setDetailPanelPos] = useState({ x: 0, y: 0 });
  const [draggingDetailPanel, setDraggingDetailPanel] = useState(false);
  const [detailPanelDragOffset, setDetailPanelDragOffset] = useState({ x: 0, y: 0 });
  const ref = useRef(null);
  const [dims, setDims] = useState({ w: 900, h: 650 });

  const BASE_W = architecture.canvasSize?.w ?? 1450;
  const BASE_H = architecture.canvasSize?.h ?? 810;
  const canvasW = BASE_W * spread;
  const canvasH = BASE_H * spread;
  const scaledArch = applySpread(architecture, spread);

  useEffect(() => {
    const ro = new ResizeObserver(e => { for (const en of e) setDims({ w: en.contentRect.width, h: en.contentRect.height }); });
    if (ref.current) ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const defaultY = Math.max(headerHeight + 12, dims.h - 200 - 220);
    setFlowCardPos(pos => {
      const maxX = Math.max(12, dims.w - 332);
      const maxY = Math.max(headerHeight + 12, dims.h - 260);
      const nextX = 12;
      const nextY = defaultY;
      return {
        x: Math.min(Math.max(pos.x ?? nextX, 12), maxX),
        y: Math.min(Math.max((pos.y === 0 ? nextY : pos.y), headerHeight + 12), maxY),
      };
    });
  }, [dims, headerHeight]);

  useEffect(() => {
    const defaultX = Math.max(12, dims.w - 342);
    const defaultY = headerHeight + 12;
    setDetailPanelPos(pos => {
      const maxX = Math.max(12, dims.w - 342);
      const maxY = Math.max(headerHeight + 12, dims.h - 220);
      return {
        x: Math.min(Math.max(pos.x === 0 ? defaultX : pos.x, 12), maxX),
        y: Math.min(Math.max(pos.y === 0 ? defaultY : pos.y, headerHeight + 12), maxY),
      };
    });
  }, [dims, headerHeight]);

  useEffect(() => {
    if (!selected) {
      setDraggingDetailPanel(false);
      return;
    }
    setDetailPanelPos(pos => {
      const maxX = Math.max(12, dims.w - 342);
      const maxY = Math.max(headerHeight + 12, dims.h - 220);
      const defaultX = Math.max(12, dims.w - 342);
      const defaultY = headerHeight + 12;
      return {
        x: Math.min(Math.max(pos.x || defaultX, 12), maxX),
        y: Math.min(Math.max(pos.y || defaultY, headerHeight + 12), maxY),
      };
    });
  }, [selected, dims, headerHeight]);

  const fitView = useCallback(() => {
    if (dims.w < 100) return;
    const viewportH = dims.h - headerHeight;
    const s = Math.min(dims.w / canvasW, viewportH / canvasH, 1.3) * 0.92;
    setTransform({ scale: s, x: (dims.w - canvasW * s) / 2, y: (viewportH - canvasH * s) / 2 + headerHeight });
  }, [dims, canvasW, canvasH, headerHeight]);

  useEffect(() => { fitView(); }, [fitView]);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const d = e.deltaY > 0 ? 0.92 : 1.08;
    setTransform(t => {
      const ns = Math.max(0.25, Math.min(3.5, t.scale * d));
      const r = ref.current.getBoundingClientRect();
      const mx = e.clientX - r.left, my = e.clientY - r.top;
      return { scale: ns, x: mx - (mx - t.x) * (ns / t.scale), y: my - (my - t.y) * (ns / t.scale) };
    });
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (el) el.addEventListener("wheel", handleWheel, { passive: false });
    return () => { if (el) el.removeEventListener("wheel", handleWheel); };
  }, [handleWheel]);

  const pD = (e) => { setIsPanning(true); setPanStart({ x: e.clientX - transform.x, y: e.clientY - transform.y }); };
  const pM = (e) => {
    if (draggingDetailPanel) {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      const maxX = Math.max(12, dims.w - 342);
      const maxY = Math.max(headerHeight + 12, dims.h - 220);
      const nextX = e.clientX - rect.left - detailPanelDragOffset.x;
      const nextY = e.clientY - rect.top - detailPanelDragOffset.y;
      setDetailPanelPos({
        x: Math.min(Math.max(nextX, 12), maxX),
        y: Math.min(Math.max(nextY, headerHeight + 12), maxY),
      });
      return;
    }
    if (draggingFlowCard) {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      const maxX = Math.max(12, dims.w - 332);
      const maxY = Math.max(headerHeight + 12, dims.h - 260);
      const nextX = e.clientX - rect.left - flowCardDragOffset.x;
      const nextY = e.clientY - rect.top - flowCardDragOffset.y;
      setFlowCardPos({
        x: Math.min(Math.max(nextX, 12), maxX),
        y: Math.min(Math.max(nextY, headerHeight + 12), maxY),
      });
      return;
    }
    if (isPanning) setTransform(t => ({ ...t, x: e.clientX - panStart.x, y: e.clientY - panStart.y }));
  };
  const pU = () => {
    setIsPanning(false);
    setDraggingFlowCard(false);
    setDraggingDetailPanel(false);
  };

  const dimmed = search
    ? new Set(architecture.nodes.filter(n =>
        !n.label.toLowerCase().includes(search.toLowerCase()) &&
        !n.id.includes(search.toLowerCase())
      ).map(n => n.id))
    : new Set();
  const pct = Math.round(transform.scale * 100);

  const matchesLayer = useCallback((item) => {
    if (!hasLayerViews || activeLayer === "all") return true;
    if (!item.layers || item.layers.length === 0) return true;
    return item.layers.includes(activeLayer);
  }, [activeLayer, hasLayerViews]);

  const visibleBoundaries = scaledArch.boundaries.filter(matchesLayer);
  const visibleNodes = scaledArch.nodes.filter(matchesLayer);
  const visibleNodeIds = new Set(visibleNodes.map(n => n.id));
  const visibleFlows = scaledArch.flows.filter((f) => {
    if (!visibleNodeIds.has(f.from) || !visibleNodeIds.has(f.to)) return false;
    return matchesLayer(f);
  });
  const flowGuides = architecture.flowGuides || {};
  const flowGuideKeys = Object.keys(flowGuides);
  const fallbackGuideKey = flowGuideKeys[0] || null;
  const activeGuideKey = hasLayerViews
    ? (flowGuides[activeLayer] ? activeLayer : null)
    : fallbackGuideKey;
  const activeGuide = activeGuideKey ? (flowGuides[activeGuideKey] || []) : [];
  const canShowGuide = highlightFlow && activeGuide.length > 0;
  const currentGuide = canShowGuide ? activeGuide[Math.min(flowStepIndex, activeGuide.length - 1)] : null;
  const currentHighlightStep = currentGuide?.step || null;

  useEffect(() => {
    setFlowStepIndex(0);
  }, [activeLayer, highlightFlow]);

  useEffect(() => {
    if (flowStepIndex >= activeGuide.length && activeGuide.length > 0) {
      setFlowStepIndex(activeGuide.length - 1);
    }
  }, [flowStepIndex, activeGuide]);

  const handleSelectFlowStep = useCallback((stepNumber) => {
    const guideIndex = activeGuide.findIndex(step => step.step === stepNumber);
    if (guideIndex === -1) return;
    setHighlightFlow(true);
    setFlowStepIndex(guideIndex);
  }, [activeGuide]);

  return (
    <div ref={ref} style={{ width: "100%", height: "100%", overflow: "hidden", position: "relative", background: "var(--bg)", fontFamily: "monospace", color: "var(--ink2)", userSelect: "none" }}
      onPointerDown={pD} onPointerMove={pM} onPointerUp={pU} onPointerLeave={pU}>

      {/* Header */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, minHeight: headerHeight, zIndex: 50, background: "var(--overlay)", borderBottom: "1px solid var(--line)", display: "flex", flexDirection: "column", justifyContent: "center", padding: "10px 16px 8px", backdropFilter: "blur(12px)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: "var(--ink1)" }}>{architecture.title}</h1>
            <p style={{ fontSize: 12, color: "var(--ink4)", margin: 0, marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{architecture.description}</p>
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center", marginLeft: 12, flexWrap: "wrap", justifyContent: "flex-end" }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search..."
              onPointerDown={e => e.stopPropagation()}
              style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 6, padding: "4px 10px", fontSize: 13, color: "var(--ink2)", width: 120, fontFamily: "inherit", outline: "none" }} />
            <button onClick={() => setHighlightFlow(h => !h)} style={{
              background: highlightFlow ? "var(--tint)" : "var(--surface)",
              border: `1px solid ${highlightFlow ? "var(--tintb)" : "var(--line)"}`,
              color: highlightFlow ? "var(--accent)" : "var(--ink3)",
              borderRadius: 6, padding: "4px 10px", fontSize: 13, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
              {highlightFlow ? "✦ Flow On" : "☆ Flow"}
            </button>
            {hasExplanation && (
              <button onClick={() => setShowExplanation(v => !v)} style={{
                background: showExplanation ? "var(--tint)" : "var(--surface)",
                border: `1px solid ${showExplanation ? "var(--tintb)" : "var(--line)"}`,
                color: showExplanation ? "var(--accent)" : "var(--ink3)",
                borderRadius: 6, padding: "4px 10px", fontSize: 13, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap"
              }}>
                {showExplanation ? "◧ Notes On" : "◨ Notes"}
              </button>
            )}

            <div style={{ display: "flex", gap: 4, alignItems: "center", borderLeft: "1px solid var(--line)", paddingLeft: 8 }}>
              <span style={{ fontSize: 12, color: "var(--ink5)" }}>Zoom</span>
              <span style={{ fontSize: 13, color: "var(--ink5)", minWidth: 32, textAlign: "right" }}>{pct}%</span>
              {[{ l: "−", f: () => setTransform(t => ({ ...t, scale: Math.max(0.25, t.scale * 0.8) })) },
                { l: "Fit", f: fitView },
                { l: "+", f: () => setTransform(t => ({ ...t, scale: Math.min(3.5, t.scale * 1.25) })) }].map(b => (
                <button key={b.l} onClick={b.f} style={{ background: "var(--surface)", border: "1px solid var(--line)", color: "var(--ink2)", borderRadius: 6, padding: "4px 10px", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>{b.l}</button>
              ))}
            </div>

            <div style={{ display: "flex", gap: 4, alignItems: "center", borderLeft: "1px solid var(--line)", paddingLeft: 8 }}>
              <span style={{ fontSize: 12, color: "var(--ink5)" }}>Spacing</span>
              {[{ l: "−", f: () => setSpread(s => Math.max(0.6, parseFloat((s - 0.1).toFixed(2)))) },
                { l: "+", f: () => setSpread(s => Math.min(1.8, parseFloat((s + 0.1).toFixed(2)))) }].map(b => (
                <button key={b.l} onClick={b.f} onPointerDown={e => e.stopPropagation()} style={{ background: "var(--surface)", border: "1px solid var(--line)", color: "var(--ink2)", borderRadius: 6, padding: "4px 8px", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>{b.l}</button>
              ))}
            </div>
          </div>
        </div>

        {hasLayerViews && (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginTop: 10,
            paddingTop: 10,
            borderTop: "1px solid var(--line)",
            flexWrap: "wrap",
          }}>
            <span style={{ fontSize: 11, color: "var(--ink5)", textTransform: "uppercase", letterSpacing: 1.1 }}>
              Views
            </span>
            {[{ id: "all", label: "All", color: "#58a6ff" }, ...layerViews].map(layer => {
              const active = activeLayer === layer.id;
              return (
                <button
                  key={layer.id}
                  onClick={() => setActiveLayer(layer.id)}
                  style={{
                    background: active ? `${layer.color}20` : "var(--surface)",
                    border: `1px solid ${active ? `${layer.color}88` : "var(--line)"}`,
                    color: active ? layer.color : "var(--ink3)",
                    borderRadius: 999,
                    padding: "6px 12px",
                    fontSize: 12,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    whiteSpace: "nowrap",
                    fontWeight: active ? 700 : 500,
                    transition: "background 0.15s, border-color 0.15s, color 0.15s",
                  }}
                >
                  {layer.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* SVG Canvas */}
      <svg width={dims.w} height={dims.h - headerHeight} style={{ position: "absolute", top: headerHeight, left: 0, cursor: isPanning ? "grabbing" : "grab" }}>
        <g transform={`translate(${transform.x}, ${transform.y - headerHeight}) scale(${transform.scale})`}>
          {visibleBoundaries.map(b => (
            <Boundary key={b.id} b={b}
              isSelected={selected?.type === "boundary" && selected.id === b.id}
              onClick={(boundary) => setSelected({ ...boundary, type: "boundary" })}
            />
          ))}
          {visibleFlows.map((f, i) => (
            <Arrow
              key={i}
              flow={f}
              nodes={visibleNodes}
              highlight={highlightFlow}
              highlightStep={currentHighlightStep}
              groupMeta={groupMeta}
              allFlows={visibleFlows}
              onSelectStep={handleSelectFlowStep}
            />
          ))}
          {visibleNodes.map(n => (
            <g key={n.id} style={{ opacity: dimmed.has(n.id) ? 0.12 : 1, transition: "opacity 0.25s" }}>
              <NodeBox node={n}
                isSelected={selected?.type === "node" && selected.id === n.id}
                onClick={(node) => setSelected({ ...node, type: "node" })}
                iconMap={iconMap} groupMeta={groupMeta}
              />
            </g>
          ))}
        </g>
      </svg>

      <DetailPanel
        item={selected}
        onClose={() => setSelected(null)}
        flows={visibleFlows}
        iconMap={iconMap}
        groupMeta={groupMeta}
        position={detailPanelPos}
        isDragging={draggingDetailPanel}
        onDragStart={(e) => {
          e.stopPropagation();
          const rect = ref.current?.getBoundingClientRect();
          if (!rect) return;
          setDraggingDetailPanel(true);
          setDetailPanelDragOffset({
            x: e.clientX - rect.left - detailPanelPos.x,
            y: e.clientY - rect.top - detailPanelPos.y,
          });
        }}
      />
      {hasExplanation && showExplanation && (
        <ExplanationPanel
          title={explanation.title}
          intro={explanation.intro}
          sections={explanation.sections}
          summary={explanation.summary}
          openSections={openSections}
          setOpenSections={setOpenSections}
          onClose={() => setShowExplanation(false)}
        />
      )}
      <FlowGuideCard
        step={currentGuide}
        currentIndex={flowStepIndex}
        total={activeGuide.length}
        onPrev={() => setFlowStepIndex(i => Math.max(0, i - 1))}
        onNext={() => setFlowStepIndex(i => Math.min(activeGuide.length - 1, i + 1))}
        onClose={() => setHighlightFlow(false)}
        position={flowCardPos}
        isDragging={draggingFlowCard}
        onDragStart={(e) => {
          e.stopPropagation();
          const rect = ref.current?.getBoundingClientRect();
          if (!rect) return;
          setDraggingFlowCard(true);
          setFlowCardDragOffset({
            x: e.clientX - rect.left - flowCardPos.x,
            y: e.clientY - rect.top - flowCardPos.y,
          });
        }}
      />
      <Minimap canvasW={canvasW} canvasH={canvasH} transform={{ ...transform, y: transform.y - headerHeight }} dims={{ ...dims, h: dims.h - headerHeight }} nodes={visibleNodes} boundaries={visibleBoundaries} groupMeta={groupMeta} />
      <LayoutPanel spread={spread} setSpread={(v) => setSpread(v)} onPointerDown={e => e.stopPropagation()} />

      {/* Legend */}
      <div style={{ position: "absolute", bottom: 12, right: 12, background: "var(--overlay)", border: "1px solid var(--line)", borderRadius: 8, padding: "8px 14px", fontSize: 12, display: "flex", gap: 12, flexWrap: "wrap", backdropFilter: "blur(8px)" }}>
        {Object.entries(groupMeta).filter(([k]) => k !== "external").map(([k, v]) => (
          <div key={k} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 7, height: 7, borderRadius: 2, background: v.color }} />
            <span style={{ color: "var(--ink4)" }}>{v.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
