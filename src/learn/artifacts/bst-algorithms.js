/**
 * BST traversal algorithms, layout, and canvas painters.
 * Framework-agnostic — used by BstInorder.jsx.
 */

export const TREES = [
  // 0: Balanced
  {
    val: 4, left: {
      val: 2, left: { val: 1, left: null, right: null },
      right: { val: 3, left: null, right: null },
    },
    right: {
      val: 6, left: { val: 5, left: null, right: null },
      right: { val: 7, left: null, right: null },
    },
  },
  // 1: Skewed Left
  {
    val: 5, left: {
      val: 4, left: {
        val: 3, left: { val: 2, left: { val: 1, left: null, right: null }, right: null },
        right: null,
      }, right: null,
    }, right: null,
  },
  // 2: Skewed Right
  {
    val: 1, left: null, right: {
      val: 2, left: null, right: {
        val: 3, left: null, right: {
          val: 4, left: null, right: { val: 5, left: null, right: null },
        },
      },
    },
  },
  // 3: Complex
  {
    val: 8, left: {
      val: 4, left: {
        val: 2, left: { val: 1, left: null, right: null },
        right: { val: 3, left: null, right: null },
      },
      right: { val: 6, left: { val: 5, left: null, right: null }, right: { val: 7, left: null, right: null } },
    },
    right: {
      val: 12, left: { val: 10, left: { val: 9, left: null, right: null }, right: { val: 11, left: null, right: null } },
      right: { val: 14, left: { val: 13, left: null, right: null }, right: { val: 15, left: null, right: null } },
    },
  },
];

export function findNode(root, val) {
  if (!root) return null;
  if (root.val === val) return root;
  return findNode(root.left, val) || findNode(root.right, val);
}

export function getLevels(root) {
  if (!root) return [];
  const levels = [];
  const queue = [{ node: root, level: 0 }];
  while (queue.length) {
    const { node, level } = queue.shift();
    if (!levels[level]) levels[level] = [];
    levels[level].push(node.val);
    if (node.left) queue.push({ node: node.left, level: level + 1 });
    if (node.right) queue.push({ node: node.right, level: level + 1 });
  }
  return levels;
}

export function inorderFlat(root) {
  const out = [];
  (function walk(n) {
    if (!n) return;
    walk(n.left);
    out.push(n.val);
    walk(n.right);
  })(root);
  return out;
}

// ─── Step generators ────────────────────────────────────────────────
export function* recSteps(node, callDepth = 0) {
  if (!node) return;
  yield { type: "call", val: node.val, depth: callDepth };
  yield* recSteps(node.left, callDepth + 1);
  yield { type: "visit", val: node.val, depth: callDepth };
  yield* recSteps(node.right, callDepth + 1);
  yield { type: "return", val: node.val, depth: callDepth };
}

export function* iterSteps(root) {
  const stack = [];
  let current = root;
  while (current !== null || stack.length > 0) {
    while (current !== null) {
      stack.push(current.val);
      yield { type: "push", current: current.val, stack: [...stack] };
      current = current.left;
    }
    const top = stack.pop();
    current = findNode(root, top);
    yield { type: "visit", current: top, stack: [...stack] };
    current = current ? current.right : null;
  }
}

export function* bfsRecSteps(root) {
  if (!root) return;
  let currentLevelNodes = [root];
  let depth = 0;
  while (currentLevelNodes.length > 0) {
    const nextLevel = [];
    for (const node of currentLevelNodes) {
      if (node.left) nextLevel.push(node.left);
      if (node.right) nextLevel.push(node.right);
      yield {
        val: node.val,
        depth,
        levelNodes: currentLevelNodes.map(n => n.val),
        nextQueue: nextLevel.map(n => n.val),
      };
    }
    currentLevelNodes = nextLevel;
    depth++;
  }
}

export function* bfsIterSteps(root) {
  if (!root) return;
  const queue = [{ node: root, level: 0 }];
  while (queue.length) {
    const levelSize = queue.length;
    for (let i = 0; i < levelSize; i++) {
      const { node, level } = queue.shift();
      if (node.left) queue.push({ node: node.left, level: level + 1 });
      if (node.right) queue.push({ node: node.right, level: level + 1 });
      yield { val: node.val, level, queueVals: queue.map(q => q.node.val) };
    }
  }
}

// ─── Canvas layout & paint ──────────────────────────────────────────
export function layoutTree(node, x, y, spread, positions = new Map(), id = "root") {
  if (!node) return positions;
  positions.set(id, { node, x, y });
  layoutTree(node.left, x - spread, y + 55, spread * 0.5, positions, id + "L");
  layoutTree(node.right, x + spread, y + 55, spread * 0.5, positions, id + "R");
  return positions;
}

function cssVar(name) {
  if (typeof document === "undefined") return "";
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function canvasColors() {
  return {
    edge:        cssVar("--line2"),
    nodeFill:    cssVar("--surface"),
    nodeStroke:  cssVar("--line2"),
    nodeText:    cssVar("--ink3"),

    visitFill:   cssVar("--ok-tint"),
    visitStroke: cssVar("--ok"),
    visitText:   cssVar("--ok"),

    stackFill:   cssVar("--tint"),
    stackStroke: cssVar("--tintb"),
    stackText:   cssVar("--accent"),

    queueFill:   cssVar("--warn-tint"),
    queueStroke: cssVar("--warn"),
    queueText:   cssVar("--warn"),

    curFill:   cssVar("--hot-tint"),
    curStroke: cssVar("--hot"),
    curText:   cssVar("--hot"),
  };
}

const MONO_FONT = 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace';

function paintTree(canvas, tree, highlightVal, visitedVals, bucketedVals, bucketKind) {
  if (!canvas || !tree) return;
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const width = canvas.offsetWidth || 500;
  canvas.width = width * dpr;
  canvas.height = 220 * dpr;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, width, 220);

  const c = canvasColors();
  const positions = layoutTree(tree, width / 2, 30, width / 4);

  ctx.strokeStyle = c.edge;
  ctx.lineWidth = 1.5;
  for (const [id, { node, x, y }] of positions) {
    if (node.left) {
      const ch = positions.get(id + "L");
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(ch.x, ch.y); ctx.stroke();
    }
    if (node.right) {
      const ch = positions.get(id + "R");
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(ch.x, ch.y); ctx.stroke();
    }
  }

  for (const [, { node, x, y }] of positions) {
    const isCurrent = node.val === highlightVal;
    const isVisited = visitedVals.includes(node.val);
    const inBucket = bucketedVals.includes(node.val);

    let fill = c.nodeFill;
    let stroke = c.nodeStroke;
    let textColor = c.nodeText;
    let r = 18;

    if (isVisited) { fill = c.visitFill; stroke = c.visitStroke; textColor = c.visitText; }
    if (inBucket) {
      if (bucketKind === "queue") { fill = c.queueFill; stroke = c.queueStroke; textColor = c.queueText; }
      else { fill = c.stackFill; stroke = c.stackStroke; textColor = c.stackText; }
    }
    if (isCurrent) { fill = c.curFill; stroke = c.curStroke; textColor = c.curText; r = 22; }

    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.strokeStyle = stroke;
    ctx.lineWidth = isCurrent ? 2.5 : 1.5;
    ctx.stroke();

    ctx.fillStyle = textColor;
    ctx.font = `${isCurrent ? "bold " : "700 "}${r > 18 ? 13 : 12}px ${MONO_FONT}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(node.val), x, y);
  }
}

export function drawTreeCanvas(canvas, tree, { highlight = null, visited = [], stack = [] } = {}) {
  paintTree(canvas, tree, highlight, visited, stack, "stack");
}

export function drawBfsCanvas(canvas, tree, { highlight = null, visited = [], queue = [] } = {}) {
  paintTree(canvas, tree, highlight, visited, queue, "queue");
}
