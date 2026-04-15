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
  // payment arch groups
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
      <rect x={b.x + 8} y={b.y - 7} width={b.label.length * 5.8 + 16} height={14} rx={3}
        fill="#0d1117" stroke={isSelected ? b.color + "88" : b.color + "44"} strokeWidth={0.5} />
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

function Arrow({ flow, nodes, highlight, groupMeta, allFlows }) {
  const f = nodes.find(n => n.id === flow.from);
  const t = nodes.find(n => n.id === flow.to);
  if (!f || !t) return null;
  const a = ctr(f), b = ctr(t);
  const dx = b.x - a.x, dy = b.y - a.y;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len === 0) return null;
  const ux = dx / len, uy = dy / len;

  // Perpendicular (points to the "right" of the direction vector)
  const px = -uy, py = ux;

  // Offset bidirectional arrows so they don't overlap:
  // If a reverse flow exists (to→from), offset this arrow to its "right" side.
  // The reverse arrow naturally offsets to its own "right" (opposite side).
  const hasReverse = allFlows.some(
    fl => fl.from === flow.to && fl.to === flow.from
  );
  const lineOffset = hasReverse ? 7 : 0;
  const ox = px * lineOffset, oy = py * lineOffset;

  const sx = a.x + ux * (NW / 2 + 5) + ox;
  const sy = a.y + uy * (NH / 2 + 3) + oy;
  const ex = b.x - ux * (NW / 2 + 5) + ox;
  const ey = b.y - uy * (NH / 2 + 3) + oy;

  // badge at 35% along arrow, label at 62%
  const bx = sx + (ex - sx) * 0.35, by = sy + (ey - sy) * 0.35;
  const lx = sx + (ex - sx) * 0.62, ly = sy + (ey - sy) * 0.62;
  const isHi = highlight && flow.step > 0;
  const opacity = highlight ? (isHi ? 1 : 0.12) : 0.55;
  const col = isHi ? "#58a6ff" : (groupMeta[f.group]?.color || "#666");
  const mid = `a${flow.from}${flow.to}`;
  const hasBadge = flow.step > 0;
  const hasLabel = !!flow.label;

  // Label offset perpendicular to the line (away from center-line)
  const labelOffsetX = px * 10, labelOffsetY = py * 10;

  return (
    <g style={{ opacity, transition: "opacity 0.3s" }}>
      <defs>
        <marker id={mid} viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="7" markerHeight="5" orient="auto-start-reverse">
          <polygon points="0 0, 10 3.5, 0 7" fill={col} />
        </marker>
      </defs>
      <line x1={sx} y1={sy} x2={ex} y2={ey} stroke={col} strokeWidth={isHi ? 2.2 : 1.2}
        strokeDasharray={flow.style === "dashed" ? "6 3" : "none"} markerEnd={`url(#${mid})`} />

      {/* Step badge — black filled circle with white number */}
      {hasBadge && (
        <g>
          <circle cx={bx} cy={by} r={9} fill="#0d1117" stroke={isHi ? "#58a6ff" : col} strokeWidth={isHi ? 1.8 : 1.2} />
          <text x={bx} y={by + 4} textAnchor="middle" fontSize={8.5} fill={isHi ? "#58a6ff" : "#e6edf3"}
            fontWeight="700" style={{ fontFamily: "monospace", pointerEvents: "none" }}>{flow.step}</text>
        </g>
      )}

      {/* Label — offset perpendicular so it floats beside the line */}
      {hasLabel && (
        <g>
          <rect
            x={lx + labelOffsetX - flow.label.length * 2.8 - 4}
            y={ly + labelOffsetY - 7}
            width={flow.label.length * 5.6 + 8}
            height={14}
            rx={3}
            fill="#0d1117"
            fillOpacity={0.92}
          />
          <text
            x={lx + labelOffsetX}
            y={ly + labelOffsetY + 3}
            textAnchor="middle"
            fontSize={7}
            fill={col}
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
        fill={isSelected ? gc + "1a" : "#0d1117"} stroke={isSelected ? gc : gc + "55"} strokeWidth={isSelected ? 2.5 : 1} />
      {iconUrl ? (
        <image href={iconUrl} x={node.x + NW / 2 - 15} y={node.y + 5} width={30} height={30} style={{ pointerEvents: "none" }} />
      ) : (
        <text x={node.x + NW / 2} y={node.y + 26} textAnchor="middle" fontSize={22} style={{ pointerEvents: "none" }}>{node.customIcon}</text>
      )}
      <text x={node.x + NW / 2} y={node.y + 46} textAnchor="middle" fontSize={7} fill="#c9d1d9" fontWeight="500"
        style={{ fontFamily: "monospace", pointerEvents: "none" }}>{node.label.length > 18 ? node.label.slice(0, 16) + "…" : node.label}</text>
      {node.label.length > 18 && (
        <text x={node.x + NW / 2} y={node.y + 57} textAnchor="middle" fontSize={7} fill="#c9d1d9" fontWeight="500"
          style={{ fontFamily: "monospace", pointerEvents: "none" }}>{node.label.slice(16).trim()}</text>
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

function DetailPanel({ item, onClose, flows, iconMap, groupMeta }) {
  if (!item) return null;
  const m = groupMeta[item.group] || { color: item.color || "#666", label: item.type === "boundary" ? "Boundary" : "Component" };
  const inb = item.type === "node" ? flows.filter(f => f.to === item.id && f.label) : [];
  const outb = item.type === "node" ? flows.filter(f => f.from === item.id && f.label) : [];
  const iconUrl = item.iconType === "aws" ? iconMap[item.awsIcon] : null;
  return (
    <div style={{
      position: "absolute", top: 64, right: 12, width: 330, maxHeight: "calc(100vh - 80px)", overflowY: "auto",
      background: "#0d1117", border: `1px solid ${m.color}33`, borderRadius: 14, padding: "18px 20px", zIndex: 100,
      boxShadow: `0 0 40px ${m.color}10, 0 12px 40px rgba(0,0,0,0.6)`, fontFamily: "monospace",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5,
          color: m.color, background: m.color + "15", padding: "3px 8px", borderRadius: 4 }}>{m.label}</span>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#6b7280", cursor: "pointer", fontSize: 16, padding: 0 }}>✕</button>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "14px 0 8px" }}>
        {iconUrl ? <img src={iconUrl} width={40} height={40} alt="" /> : <span style={{ fontSize: 32 }}>{item.customIcon || "⬚"}</span>}
        <h3 style={{ margin: 0, fontSize: 14, color: "#e6edf3", lineHeight: 1.3 }}>{item.label}</h3>
      </div>
      <p style={{ fontSize: 11, lineHeight: 1.8, color: "#8b949e", margin: "10px 0 0" }}>{item.detail}</p>
      {(inb.length > 0 || outb.length > 0) && (
        <div style={{ marginTop: 14, paddingTop: 10, borderTop: "1px solid #21262d" }}>
          <span style={{ fontSize: 9, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1 }}>Connections</span>
          <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 3 }}>
            {inb.map((f, i) => <div key={`i${i}`} style={{ fontSize: 10, color: "#58a6ff" }}>← {f.label} <span style={{ color: "#484f58" }}>from {f.from}</span></div>)}
            {outb.map((f, i) => <div key={`o${i}`} style={{ fontSize: 10, color: "#3fb950" }}>→ {f.label} <span style={{ color: "#484f58" }}>to {f.to}</span></div>)}
          </div>
        </div>
      )}
      <div style={{ marginTop: 10, paddingTop: 8, borderTop: "1px solid #21262d", display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: 8, color: "#484f58" }}>id: {item.id}</span>
        <span style={{ fontSize: 8, color: "#484f58" }}>group: {item.group || "n/a"}</span>
      </div>
    </div>
  );
}

function Minimap({ canvasW, canvasH, transform, dims, nodes, boundaries, groupMeta }) {
  const mw = 160, mh = 95;
  const sx = mw / canvasW, sy = mh / canvasH;
  const vx = (-transform.x / transform.scale) * sx, vy = (-transform.y / transform.scale) * sy;
  const vw = (dims.w / transform.scale) * sx, vh = ((dims.h - 52) / transform.scale) * sy;
  return (
    <div style={{ position: "absolute", bottom: 12, left: 12, width: mw, height: mh, background: "#161b22ee", border: "1px solid #21262d", borderRadius: 8, overflow: "hidden" }}>
      <svg viewBox={`0 0 ${mw} ${mh}`} width={mw} height={mh}>
        {boundaries.slice(0, 3).map(b => <rect key={b.id} x={b.x * sx} y={b.y * sy} width={b.w * sx} height={b.h * sy} fill={b.color + "15"} stroke={b.color + "44"} strokeWidth={0.5} rx={1} />)}
        {nodes.map(n => <circle key={n.id} cx={(n.x + NW / 2) * sx} cy={(n.y + NH / 2) * sy} r={1.5} fill={groupMeta[n.group]?.color || "#666"} />)}
        <rect x={vx} y={vy} width={Math.max(vw, 8)} height={Math.max(vh, 5)} fill="none" stroke="#58a6ff" strokeWidth={1.5} rx={1} />
      </svg>
    </div>
  );
}

// Scales all node positions and boundary positions/sizes by a spread multiplier
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
        position: "absolute", bottom: 118, left: 12, width: 210,
        background: "#161b22", border: "1px solid #21262d", borderRadius: 10,
        padding: "10px 14px", zIndex: 60, fontFamily: "monospace",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.2, color: "#6b7280" }}>
          Layout Spacing
        </span>
        <span style={{ fontSize: 10, color: "#58a6ff", fontWeight: 700 }}>{Math.round(spread * 100)}%</span>
      </div>

      {/* Slider */}
      <input
        type="range"
        min={0.6}
        max={1.8}
        step={0.05}
        value={spread}
        onChange={e => setSpread(parseFloat(e.target.value))}
        style={{ width: "100%", accentColor: "#58a6ff", cursor: "pointer", marginBottom: 8 }}
      />

      {/* Preset buttons */}
      <div style={{ display: "flex", gap: 4 }}>
        {SPREAD_PRESETS.map(p => (
          <button
            key={p.label}
            onClick={() => setSpread(p.value)}
            style={{
              flex: 1, fontSize: 8, padding: "3px 0", cursor: "pointer", borderRadius: 5,
              fontFamily: "monospace", transition: "background 0.15s, color 0.15s",
              background: Math.abs(spread - p.value) < 0.03 ? "#1f6feb33" : "#0d1117",
              border: `1px solid ${Math.abs(spread - p.value) < 0.03 ? "#1f6feb" : "#30363d"}`,
              color: Math.abs(spread - p.value) < 0.03 ? "#58a6ff" : "#6b7280",
            }}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ArchitectureViewer({ architecture, iconMap, groupMeta: groupMetaProp }) {
  const groupMeta = { ...DEFAULT_GROUP_META, ...(groupMetaProp || {}) };

  const [selected, setSelected] = useState(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [highlightFlow, setHighlightFlow] = useState(false);
  const [search, setSearch] = useState("");
  const [spread, setSpread] = useState(1.0);
  const ref = useRef(null);
  const [dims, setDims] = useState({ w: 900, h: 650 });

  const BASE_W = 1450, BASE_H = 810;
  const canvasW = BASE_W * spread;
  const canvasH = BASE_H * spread;

  // Spread-scaled copy of architecture (positions only, no data mutation)
  const scaledArch = applySpread(architecture, spread);

  useEffect(() => {
    const ro = new ResizeObserver(e => { for (const en of e) setDims({ w: en.contentRect.width, h: en.contentRect.height }); });
    if (ref.current) ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  const fitView = useCallback(() => {
    if (dims.w < 100) return;
    const s = Math.min(dims.w / canvasW, (dims.h - 52) / canvasH, 1.3) * 0.92;
    setTransform({ scale: s, x: (dims.w - canvasW * s) / 2, y: ((dims.h - 52) - canvasH * s) / 2 + 52 });
  }, [dims, canvasW, canvasH]);

  // Re-fit whenever spread changes
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
  const pM = (e) => { if (isPanning) setTransform(t => ({ ...t, x: e.clientX - panStart.x, y: e.clientY - panStart.y })); };
  const pU = () => setIsPanning(false);

  const dimmed = search
    ? new Set(architecture.nodes.filter(n =>
        !n.label.toLowerCase().includes(search.toLowerCase()) &&
        !n.id.includes(search.toLowerCase())
      ).map(n => n.id))
    : new Set();
  const pct = Math.round(transform.scale * 100);

  return (
    <div ref={ref} style={{ width: "100%", height: "100%", overflow: "hidden", position: "relative", background: "#0d1117", fontFamily: "monospace", color: "#c9d1d9", userSelect: "none" }}
      onPointerDown={pD} onPointerMove={pM} onPointerUp={pU} onPointerLeave={pU}>

      {/* Header */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 52, zIndex: 50, background: "#0d1117ee", borderBottom: "1px solid #21262d", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", backdropFilter: "blur(12px)" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ fontSize: 13, fontWeight: 700, margin: 0, color: "#e6edf3" }}>{architecture.title}</h1>
          <p style={{ fontSize: 9, color: "#6b7280", margin: 0, marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{architecture.description}</p>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center", marginLeft: 12 }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search..."
            onPointerDown={e => e.stopPropagation()}
            style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: 6, padding: "4px 10px", fontSize: 10, color: "#c9d1d9", width: 120, fontFamily: "inherit", outline: "none" }} />
          <button onClick={() => setHighlightFlow(h => !h)} style={{
            background: highlightFlow ? "#1f6feb22" : "#161b22", border: `1px solid ${highlightFlow ? "#1f6feb" : "#21262d"}`,
            color: highlightFlow ? "#58a6ff" : "#8b949e", borderRadius: 6, padding: "4px 10px", fontSize: 10, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
            {highlightFlow ? "✦ Flow On" : "☆ Flow"}
          </button>

          {/* Zoom controls */}
          <div style={{ display: "flex", gap: 4, alignItems: "center", borderLeft: "1px solid #21262d", paddingLeft: 8 }}>
            <span style={{ fontSize: 9, color: "#484f58" }}>Zoom</span>
            <span style={{ fontSize: 10, color: "#484f58", minWidth: 32, textAlign: "right" }}>{pct}%</span>
            {[{ l: "−", f: () => setTransform(t => ({ ...t, scale: Math.max(0.25, t.scale * 0.8) })) },
              { l: "Fit", f: fitView },
              { l: "+", f: () => setTransform(t => ({ ...t, scale: Math.min(3.5, t.scale * 1.25) })) }].map(b => (
              <button key={b.l} onClick={b.f} style={{ background: "#161b22", border: "1px solid #21262d", color: "#c9d1d9", borderRadius: 6, padding: "4px 10px", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>{b.l}</button>
            ))}
          </div>

          {/* Spacing quick controls */}
          <div style={{ display: "flex", gap: 4, alignItems: "center", borderLeft: "1px solid #21262d", paddingLeft: 8 }}>
            <span style={{ fontSize: 9, color: "#484f58" }}>Spacing</span>
            {[{ l: "−", f: () => setSpread(s => Math.max(0.6, parseFloat((s - 0.1).toFixed(2)))) },
              { l: "+", f: () => setSpread(s => Math.min(1.8, parseFloat((s + 0.1).toFixed(2)))) }].map(b => (
              <button key={b.l} onClick={b.f} onPointerDown={e => e.stopPropagation()} style={{ background: "#161b22", border: "1px solid #21262d", color: "#c9d1d9", borderRadius: 6, padding: "4px 8px", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>{b.l}</button>
            ))}
          </div>
        </div>
      </div>

      {/* SVG Canvas */}
      <svg width={dims.w} height={dims.h - 52} style={{ position: "absolute", top: 52, left: 0, cursor: isPanning ? "grabbing" : "grab" }}>
        <g transform={`translate(${transform.x}, ${transform.y - 52}) scale(${transform.scale})`}>
          {scaledArch.boundaries.map(b => (
            <Boundary
              key={b.id}
              b={b}
              isSelected={selected?.type === "boundary" && selected.id === b.id}
              onClick={(boundary) => setSelected({ ...boundary, type: "boundary" })}
            />
          ))}
          {scaledArch.flows.map((f, i) => <Arrow key={i} flow={f} nodes={scaledArch.nodes} highlight={highlightFlow} groupMeta={groupMeta} allFlows={scaledArch.flows} />)}
          {scaledArch.nodes.map(n => (
            <g key={n.id} style={{ opacity: dimmed.has(n.id) ? 0.12 : 1, transition: "opacity 0.25s" }}>
              <NodeBox
                node={n}
                isSelected={selected?.type === "node" && selected.id === n.id}
                onClick={(node) => setSelected({ ...node, type: "node" })}
                iconMap={iconMap}
                groupMeta={groupMeta}
              />
            </g>
          ))}
        </g>
      </svg>

      <DetailPanel item={selected} onClose={() => setSelected(null)} flows={architecture.flows} iconMap={iconMap} groupMeta={groupMeta} />
      <Minimap canvasW={canvasW} canvasH={canvasH} transform={{ ...transform, y: transform.y - 52 }} dims={dims} nodes={scaledArch.nodes} boundaries={scaledArch.boundaries} groupMeta={groupMeta} />

      {/* Layout spacing panel */}
      <LayoutPanel spread={spread} setSpread={(v) => setSpread(v)} onPointerDown={e => e.stopPropagation()} />

      {/* Legend */}
      <div style={{ position: "absolute", bottom: 12, right: 12, background: "#0d1117ee", border: "1px solid #21262d", borderRadius: 8, padding: "8px 14px", fontSize: 9, display: "flex", gap: 12, flexWrap: "wrap", backdropFilter: "blur(8px)" }}>
        {Object.entries(groupMeta).filter(([k]) => k !== "external").map(([k, v]) => (
          <div key={k} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 7, height: 7, borderRadius: 2, background: v.color }} />
            <span style={{ color: "#6b7280" }}>{v.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
