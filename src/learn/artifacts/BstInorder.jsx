import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  TREES,
  findNode,
  getLevels,
  inorderFlat,
  recSteps,
  iterSteps,
  bfsRecSteps,
  bfsIterSteps,
  drawTreeCanvas,
  drawBfsCanvas,
} from "./bst-algorithms.js";
import "./bst-inorder.css";
import { useTheme } from "../../hooks/useTheme.js";

const TREE_LABELS = ["Balanced", "Skewed Left", "Skewed Right", "Complex"];

function useCanvasRedraw(drawFn) {
  const canvasRef = useRef(null);
  const drawRef = useRef(drawFn);
  drawRef.current = drawFn;

  useEffect(() => {
    const onResize = () => drawRef.current?.();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return canvasRef;
}

function RecursivePanel({ tree, themeTick }) {
  const [visited, setVisited] = useState([]);
  const [callStack, setCallStack] = useState([]);
  const [current, setCurrent] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(3);

  const genRef = useRef(null);
  const timerRef = useRef(null);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    drawTreeCanvas(canvas, tree, {
      highlight: current,
      visited,
      stack: callStack.map(f => f.val),
    });
  }, [tree, current, visited, callStack]);

  const canvasRef = useCanvasRedraw(redraw);

  useEffect(() => { redraw(); }, [redraw, themeTick]);

  const reset = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    setPlaying(false);
    genRef.current = recSteps(tree);
    setVisited([]); setCallStack([]); setCurrent(null);
  }, [tree]);

  useEffect(() => { reset(); }, [reset]);

  const step = useCallback(() => {
    if (!genRef.current) genRef.current = recSteps(tree);
    const { value, done } = genRef.current.next();
    if (done) { setCurrent(null); return false; }
    if (value.type === "call") {
      setCurrent(value.val);
      setCallStack(s => [...s, { val: value.val, depth: value.depth }]);
    } else if (value.type === "visit") {
      setCurrent(value.val);
      setVisited(v => [...v, value.val]);
    } else if (value.type === "return") {
      setCallStack(s => {
        const next = s.slice(0, -1);
        setCurrent(next.length ? next[next.length - 1].val : null);
        return next;
      });
    }
    return true;
  }, [tree]);

  const togglePlay = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current); timerRef.current = null;
      setPlaying(false);
      return;
    }
    if (!genRef.current) genRef.current = recSteps(tree);
    setPlaying(true);
    const ms = (6 - speed) * 200;
    timerRef.current = setInterval(() => {
      const cont = step();
      if (!cont) {
        clearInterval(timerRef.current); timerRef.current = null;
        setPlaying(false);
      }
    }, ms);
  };

  useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-tag tag-rec">Recursive</span>
        <span className="panel-title">Call Stack Approach</span>
        <span className="best-badge pick-yes"><span className="badge-star">★</span> pick this for DFS</span>
      </div>

      <div className="tree-wrap">
        <canvas ref={canvasRef} height="220" />
      </div>

      <div className="controls">
        <button className="ctl-btn" onClick={togglePlay}>{playing ? "⏸ Pause" : "▶ Play"}</button>
        <button className="ctl-btn outline" onClick={reset}>↺ Reset</button>
        <button className="ctl-btn outline" onClick={step}>Step →</button>
        <div className="speed-wrap">
          speed <input type="range" min="1" max="5" value={speed} onChange={e => setSpeed(Number(e.target.value))} />
        </div>
      </div>

      <div className="callstack-wrap">
        <div className="cs-label">// call stack (OS manages this)</div>
        <div className="cs-frames">
          {callStack.map((f, i) => (
            <div key={`${f.val}-${i}`} className={`cs-frame${i === callStack.length - 1 ? " top" : ""}`}>
              <span>inorder({f.val})</span>
              <span style={{ opacity: 0.7 }}>depth:{f.depth}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="state-row">
        <div className="state-box">
          <div className="state-label">current node</div>
          <div className="state-val">
            {current !== null
              ? <span className="chip chip-current">{current}</span>
              : <span className="dim">-</span>}
          </div>
        </div>
        <div className="state-box">
          <div className="state-label">visited (inorder)</div>
          <div className="state-val">
            {visited.map((v, i) => <span key={i} className="chip chip-visited">{v}</span>)}
          </div>
        </div>
      </div>

      <div className="output-box">
        <div className="output-label">// inorder output</div>
        <div className="output-vals">
          {visited.map((v, i) => (
            <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              {i > 0 && <span className="out-arrow">→</span>}
              <span className="out-num">{v}</span>
            </span>
          ))}
        </div>
      </div>

      <CodeEditor
        filename="inorder-recursive.ts"
        lineCount={21}
        code={
          <>
            <span className="cm">{"// TypeScript - Recursive"}</span>{"\n"}
            <span className="kw">interface</span> <span className="type">TreeNode</span> {"{"}{"\n"}
            {"  "}val:{"   "}<span className="type">number</span>;{"\n"}
            {"  "}left:{"  "}<span className="type">TreeNode</span> | <span className="type">null</span>;{"\n"}
            {"  "}right: <span className="type">TreeNode</span> | <span className="type">null</span>;{"\n"}
            {"}"}{"\n\n"}
            <span className="kw">function</span> <span className="fn">inorderRecursive</span>({"\n"}
            {"  "}node:{"   "}<span className="type">TreeNode</span> | <span className="type">null</span>,{"\n"}
            {"  "}result: <span className="type">number</span>[] = []{"\n"}
            ): <span className="type">number</span>[] {"{"}{"\n\n"}
            {"  "}<span className="kw">if</span> (node === <span className="type">null</span>) <span className="kw">return</span> result;{"\n\n"}
            {"  "}<span className="fn">inorderRecursive</span>(node.left,{"  "}result); <span className="cm">{"// ← go LEFT first"}</span>{"\n"}
            {"  "}result.<span className="fn">push</span>(node.val);{"                "}<span className="cm">{"// ← visit ROOT"}</span>{"\n"}
            {"  "}<span className="fn">inorderRecursive</span>(node.right, result); <span className="cm">{"// ← then RIGHT"}</span>{"\n\n"}
            {"  "}<span className="kw">return</span> result;{"\n"}
            {"}"}{"\n"}
          </>
        }
      />

      <div className="complexity">
        <div className="cx-box"><div className="cx-val">O(n)</div><div className="cx-label">Time</div></div>
        <div className="cx-box"><div className="cx-val">O(h)</div><div className="cx-label">Space (call stack)</div></div>
        <div className="cx-box"><div className="cx-val">h=log n</div><div className="cx-label">balanced tree</div></div>
      </div>
    </div>
  );
}

function IterativePanel({ tree, themeTick }) {
  const [visited, setVisited] = useState([]);
  const [stack, setStack] = useState([]);
  const [current, setCurrent] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(3);

  const genRef = useRef(null);
  const timerRef = useRef(null);

  const redraw = useCallback(() => {
    drawTreeCanvas(canvasRef.current, tree, { highlight: current, visited, stack });
  }, [tree, current, visited, stack]);

  const canvasRef = useCanvasRedraw(redraw);

  useEffect(() => { redraw(); }, [redraw, themeTick]);

  const reset = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    setPlaying(false);
    genRef.current = iterSteps(tree);
    setVisited([]); setStack([]); setCurrent(null);
  }, [tree]);

  useEffect(() => { reset(); }, [reset]);

  const step = useCallback(() => {
    if (!genRef.current) genRef.current = iterSteps(tree);
    const { value, done } = genRef.current.next();
    if (done) { setCurrent(null); return false; }
    if (value.type === "push") {
      setCurrent(value.current);
      setStack(value.stack);
    } else if (value.type === "visit") {
      setCurrent(value.current);
      setStack(value.stack);
      setVisited(v => [...v, value.current]);
    }
    return true;
  }, [tree]);

  const togglePlay = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current); timerRef.current = null;
      setPlaying(false);
      return;
    }
    if (!genRef.current) genRef.current = iterSteps(tree);
    setPlaying(true);
    const ms = (6 - speed) * 200;
    timerRef.current = setInterval(() => {
      const cont = step();
      if (!cont) {
        clearInterval(timerRef.current); timerRef.current = null;
        setPlaying(false);
      }
    }, ms);
  };

  useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-tag tag-iter">Iterative</span>
        <span className="panel-title">Explicit Stack Approach</span>
        <span className="best-badge pick-no">good to know</span>
      </div>

      <div className="tree-wrap">
        <canvas ref={canvasRef} height="220" />
      </div>

      <div className="controls">
        <button className="ctl-btn" onClick={togglePlay}>{playing ? "⏸ Pause" : "▶ Play"}</button>
        <button className="ctl-btn outline" onClick={reset}>↺ Reset</button>
        <button className="ctl-btn outline" onClick={step}>Step →</button>
        <div className="speed-wrap">
          speed <input type="range" min="1" max="5" value={speed} onChange={e => setSpeed(Number(e.target.value))} />
        </div>
      </div>

      <div className="state-row">
        <div className="state-box">
          <div className="state-label">stack []</div>
          <div className="state-val">
            {stack.length === 0
              ? <span className="dim">empty</span>
              : stack.map((v, i) => <span key={i} className="chip chip-stack">{v}</span>)}
          </div>
        </div>
        <div className="state-box">
          <div className="state-label">current node</div>
          <div className="state-val">
            {current !== null
              ? <span className="chip chip-current">{current}</span>
              : <span className="dim">-</span>}
          </div>
        </div>
      </div>

      <div className="output-box">
        <div className="output-label">// inorder output</div>
        <div className="output-vals">
          {visited.map((v, i) => (
            <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              {i > 0 && <span className="out-arrow">→</span>}
              <span className="out-num">{v}</span>
            </span>
          ))}
        </div>
      </div>

      <CodeEditor
        filename="inorder-iterative.ts"
        lineCount={24}
        code={
          <>
            <span className="cm">{"// TypeScript - Iterative (explicit stack)"}</span>{"\n"}
            <span className="kw">function</span> <span className="fn">inorderIterative</span>({"\n"}
            {"  "}root: <span className="type">TreeNode</span> | <span className="type">null</span>{"\n"}
            ): <span className="type">number</span>[] {"{"}{"\n\n"}
            {"  "}<span className="kw">const</span> result:{"  "}<span className="type">number</span>[]{"    "}= [];{"\n"}
            {"  "}<span className="kw">const</span> stack:{"   "}<span className="type">TreeNode</span>[] = []; <span className="cm">{"// ← we manage this!"}</span>{"\n"}
            {"  "}<span className="kw">let</span>{"   "}current{"              "}= root;{"\n\n"}
            {"  "}<span className="kw">while</span> (current !== <span className="type">null</span> || stack.length {">"} 0) {"{"}{"\n\n"}
            {"    "}<span className="cm">{"// push LEFT nodes until we hit null"}</span>{"\n"}
            {"    "}<span className="kw">while</span> (current !== <span className="type">null</span>) {"{"}{"\n"}
            {"      "}stack.<span className="fn">push</span>(current);{"\n"}
            {"      "}current = current.left;{"\n"}
            {"    "}{"}"}{"\n\n"}
            {"    "}current = stack.<span className="fn">pop</span>()!;{"        "}<span className="cm">{"// ← backtrack"}</span>{"\n"}
            {"    "}result.<span className="fn">push</span>(current.val);{"      "}<span className="cm">{"// ← visit node"}</span>{"\n"}
            {"    "}current = current.right;{"        "}<span className="cm">{"// ← go RIGHT"}</span>{"\n"}
            {"  "}{"}"}{"\n\n"}
            {"  "}<span className="kw">return</span> result;{"\n"}
            {"}"}{"\n"}
          </>
        }
      />

      <div className="complexity">
        <div className="cx-box"><div className="cx-val">O(n)</div><div className="cx-label">Time</div></div>
        <div className="cx-box"><div className="cx-val">O(h)</div><div className="cx-label">Space (explicit stack)</div></div>
        <div className="cx-box" style={{ borderColor: "var(--ok)" }}>
          <div className="cx-val" style={{ color: "var(--ok)" }}>✓ Safe</div>
          <div className="cx-label">no stack overflow</div>
        </div>
      </div>
    </div>
  );
}

function LevelBands({ tree, visited, current }) {
  const levels = useMemo(() => getLevels(tree), [tree]);
  return (
    <div className="level-bands" style={{ margin: "12px 0 8px" }}>
      {levels.map((nodes, i) => (
        <div key={i} className="level-band">
          <span className="level-label">L{i}</span>
          <div className="level-nodes">
            {nodes.map(v => {
              const cls = visited.includes(v) ? "done" : v === current ? "active" : "pending";
              return <span key={v} className={`level-chip ${cls}`}>{v}</span>;
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function BfsRecursivePanel({ tree, themeTick }) {
  const [visited, setVisited] = useState([]);
  const [queue, setQueue] = useState([]);
  const [current, setCurrent] = useState(null);
  const [depth, setDepth] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(3);

  const genRef = useRef(null);
  const timerRef = useRef(null);

  const redraw = useCallback(() => {
    drawBfsCanvas(canvasRef.current, tree, { highlight: current, visited, queue });
  }, [tree, current, visited, queue]);

  const canvasRef = useCanvasRedraw(redraw);

  useEffect(() => { redraw(); }, [redraw, themeTick]);

  const reset = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    setPlaying(false);
    genRef.current = bfsRecSteps(tree);
    setVisited([]); setQueue([]); setCurrent(null); setDepth(null);
  }, [tree]);

  useEffect(() => { reset(); }, [reset]);

  const step = useCallback(() => {
    if (!genRef.current) genRef.current = bfsRecSteps(tree);
    const { value, done } = genRef.current.next();
    if (done) { setCurrent(null); return false; }
    setCurrent(value.val);
    setDepth(value.depth);
    setQueue(value.nextQueue);
    setVisited(v => [...v, value.val]);
    return true;
  }, [tree]);

  const togglePlay = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current); timerRef.current = null;
      setPlaying(false);
      return;
    }
    if (!genRef.current) genRef.current = bfsRecSteps(tree);
    setPlaying(true);
    const ms = (6 - speed) * 200;
    timerRef.current = setInterval(() => {
      const cont = step();
      if (!cont) {
        clearInterval(timerRef.current); timerRef.current = null;
        setPlaying(false);
      }
    }, ms);
  };

  useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  return (
    <div className="panel bfs-panel">
      <div className="panel-header">
        <span className="panel-tag tag-bfs-rec">Recursive</span>
        <span className="panel-title">Level-by-Level Recursion</span>
        <span className="best-badge pick-no">avoid for BFS</span>
      </div>

      <div className="tree-wrap">
        <canvas ref={canvasRef} height="220" />
      </div>

      <div className="controls">
        <button className="ctl-btn" onClick={togglePlay}>{playing ? "⏸ Pause" : "▶ Play"}</button>
        <button className="ctl-btn outline" onClick={reset}>↺ Reset</button>
        <button className="ctl-btn outline" onClick={step}>Step →</button>
        <div className="speed-wrap">
          speed <input type="range" min="1" max="5" value={speed} onChange={e => setSpeed(Number(e.target.value))} />
        </div>
      </div>

      <LevelBands tree={tree} visited={visited} current={current} />

      <div className="state-row">
        <div className="state-box">
          <div className="state-label">current level</div>
          <div className="state-val">
            {depth !== null
              ? <span className="chip chip-current">Level {depth}</span>
              : <span className="dim">-</span>}
          </div>
        </div>
        <div className="state-box">
          <div className="state-label">call depth</div>
          <div className="state-val">
            {depth !== null
              ? <span className="chip chip-queue">depth {depth}</span>
              : <span className="dim">-</span>}
          </div>
        </div>
      </div>

      <div className="output-box" style={{ margin: "10px 0" }}>
        <div className="output-label">// level order output</div>
        <div className="output-vals">
          {visited.map((v, i) => (
            <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              {i > 0 && <span className="out-arrow">→</span>}
              <span className="out-num bfs">{v}</span>
            </span>
          ))}
        </div>
      </div>

      <CodeEditor
        filename="bfs-recursive.ts"
        lineCount={34}
        code={
          <>
            <span className="cm">{"// TypeScript - BFS Recursive"}</span>{"\n"}
            <span className="cm">{"// helper: collect one level's nodes"}</span>{"\n"}
            <span className="kw">function</span> <span className="fn">collectLevel</span>({"\n"}
            {"  "}nodes:{"  "}<span className="type">TreeNode</span>[],{"\n"}
            {"  "}result: <span className="type">number</span>[][],{"\n"}
            {"  "}depth:{"  "}<span className="type">number</span>{"\n"}
            ): <span className="type">void</span> {"{"}{"\n\n"}
            {"  "}<span className="kw">if</span> (nodes.length === 0) <span className="kw">return</span>; <span className="cm">{"// base case"}</span>{"\n\n"}
            {"  "}<span className="cm">{"// visit all nodes on this level"}</span>{"\n"}
            {"  "}result[depth] = nodes.<span className="fn">map</span>(n {"=>"} n.val);{"\n\n"}
            {"  "}<span className="cm">{"// gather ALL children for the next level"}</span>{"\n"}
            {"  "}<span className="kw">const</span> nextLevel: <span className="type">TreeNode</span>[] = [];{"\n"}
            {"  "}<span className="kw">for</span> (<span className="kw">const</span> node <span className="kw">of</span> nodes) {"{"}{"\n"}
            {"    "}<span className="kw">if</span> (node.left){"  "}nextLevel.<span className="fn">push</span>(node.left);{"\n"}
            {"    "}<span className="kw">if</span> (node.right) nextLevel.<span className="fn">push</span>(node.right);{"\n"}
            {"  "}{"}"}{"\n\n"}
            {"  "}<span className="cm">{"// recurse with next level's nodes"}</span>{"\n"}
            {"  "}<span className="fn">collectLevel</span>(nextLevel, result, depth + 1);{"\n"}
            {"}"}{"\n\n"}
            <span className="kw">function</span> <span className="fn">levelOrderRecursive</span>({"\n"}
            {"  "}root: <span className="type">TreeNode</span> | <span className="type">null</span>{"\n"}
            ): <span className="type">number</span>[][] {"{"}{"\n\n"}
            {"  "}<span className="kw">if</span> (!root) <span className="kw">return</span> [];{"\n\n"}
            {"  "}<span className="kw">const</span> result: <span className="type">number</span>[][] = [];{"\n"}
            {"  "}<span className="fn">collectLevel</span>([root], result, 0);{"\n"}
            {"  "}<span className="kw">return</span> result;{"\n"}
            {"}"}{"\n"}
          </>
        }
      />

      <div className="bfs-note">
        <span className="note-icon">⚠</span>
        <span>
          BFS is naturally iterative. The recursive version still passes <em>all nodes of a level</em> as an
          array; there's no single-node recursion like DFS. Stack overflow risk remains for very deep trees.
        </span>
      </div>

      <div className="complexity">
        <div className="cx-box"><div className="cx-val">O(n)</div><div className="cx-label">Time</div></div>
        <div className="cx-box"><div className="cx-val">O(w)</div><div className="cx-label">Space (level width)</div></div>
        <div className="cx-box" style={{ borderColor: "var(--hot)" }}>
          <div className="cx-val" style={{ color: "var(--hot)" }}>O(h)</div>
          <div className="cx-label">call stack depth</div>
        </div>
      </div>
    </div>
  );
}

function BfsIterativePanel({ tree, themeTick }) {
  const [visited, setVisited] = useState([]);
  const [queue, setQueue] = useState([]);
  const [current, setCurrent] = useState(null);
  const [level, setLevel] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(3);

  const genRef = useRef(null);
  const timerRef = useRef(null);

  const redraw = useCallback(() => {
    drawBfsCanvas(canvasRef.current, tree, { highlight: current, visited, queue });
  }, [tree, current, visited, queue]);

  const canvasRef = useCanvasRedraw(redraw);

  useEffect(() => { redraw(); }, [redraw, themeTick]);

  const reset = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    setPlaying(false);
    genRef.current = bfsIterSteps(tree);
    setVisited([]); setQueue([]); setCurrent(null); setLevel(null);
  }, [tree]);

  useEffect(() => { reset(); }, [reset]);

  const step = useCallback(() => {
    if (!genRef.current) genRef.current = bfsIterSteps(tree);
    const { value, done } = genRef.current.next();
    if (done) { setCurrent(null); return false; }
    setCurrent(value.val);
    setLevel(value.level);
    setQueue(value.queueVals);
    setVisited(v => [...v, value.val]);
    return true;
  }, [tree]);

  const togglePlay = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current); timerRef.current = null;
      setPlaying(false);
      return;
    }
    if (!genRef.current) genRef.current = bfsIterSteps(tree);
    setPlaying(true);
    const ms = (6 - speed) * 200;
    timerRef.current = setInterval(() => {
      const cont = step();
      if (!cont) {
        clearInterval(timerRef.current); timerRef.current = null;
        setPlaying(false);
      }
    }, ms);
  };

  useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  return (
    <div className="panel bfs-panel">
      <div className="panel-header">
        <span className="panel-tag tag-bfs-iter">Iterative</span>
        <span className="panel-title">Queue-Driven Approach</span>
        <span className="best-badge pick-yes"><span className="badge-star">★</span> pick this for BFS</span>
      </div>

      <div className="tree-wrap">
        <canvas ref={canvasRef} height="220" />
      </div>

      <div className="controls">
        <button className="ctl-btn" onClick={togglePlay}>{playing ? "⏸ Pause" : "▶ Play"}</button>
        <button className="ctl-btn outline" onClick={reset}>↺ Reset</button>
        <button className="ctl-btn outline" onClick={step}>Step →</button>
        <div className="speed-wrap">
          speed <input type="range" min="1" max="5" value={speed} onChange={e => setSpeed(Number(e.target.value))} />
        </div>
      </div>

      <LevelBands tree={tree} visited={visited} current={current} />

      <div className="state-row">
        <div className="state-box">
          <div className="state-label">
            queue [] <span style={{ fontSize: 9, color: "var(--ink4)" }}>(FIFO)</span>
          </div>
          <div className="state-val">
            {queue.length === 0
              ? <span className="dim">—</span>
              : queue.map((v, i) => <span key={i} className="chip chip-queue">{v}</span>)}
          </div>
        </div>
        <div className="state-box">
          <div className="state-label">current level</div>
          <div className="state-val">
            {level !== null
              ? <span className="chip chip-current">Level {level}</span>
              : <span className="dim">-</span>}
          </div>
        </div>
      </div>

      <div className="output-box" style={{ margin: "10px 0" }}>
        <div className="output-label">// level order output</div>
        <div className="output-vals">
          {visited.map((v, i) => (
            <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              {i > 0 && <span className="out-arrow">→</span>}
              <span className="out-num bfs">{v}</span>
            </span>
          ))}
        </div>
      </div>

      <CodeEditor
        filename="bfs-iterative.ts"
        lineCount={30}
        code={
          <>
            <span className="cm">{"// TypeScript - BFS Iterative (preferred)"}</span>{"\n"}
            <span className="kw">function</span> <span className="fn">levelOrderIterative</span>({"\n"}
            {"  "}root: <span className="type">TreeNode</span> | <span className="type">null</span>{"\n"}
            ): <span className="type">number</span>[][] {"{"}{"\n\n"}
            {"  "}<span className="kw">if</span> (!root) <span className="kw">return</span> [];{"\n\n"}
            {"  "}<span className="kw">const</span> result: <span className="type">number</span>[][] = [];{"\n"}
            {"  "}<span className="kw">const</span> queue:{"  "}<span className="type">TreeNode</span>[] = [root]; <span className="cm">{"// ← seed with root"}</span>{"\n\n"}
            {"  "}<span className="kw">while</span> (queue.length {">"} 0) {"{"}{"\n\n"}
            {"    "}<span className="cm">{"// freeze level size BEFORE processing"}</span>{"\n"}
            {"    "}<span className="kw">const</span> levelSize = queue.length;{"\n"}
            {"    "}<span className="kw">const</span> level:{"    "}<span className="type">number</span>[] = [];{"\n\n"}
            {"    "}<span className="kw">for</span> (<span className="kw">let</span> i = 0; i {"<"} levelSize; i++) {"{"}{"\n"}
            {"      "}<span className="kw">const</span> node = queue.<span className="fn">shift</span>()!; <span className="cm">{"// ← FIFO dequeue"}</span>{"\n"}
            {"      "}level.<span className="fn">push</span>(node.val);{"\n\n"}
            {"      "}<span className="kw">if</span> (node.left){"  "}queue.<span className="fn">push</span>(node.left);{"\n"}
            {"      "}<span className="kw">if</span> (node.right) queue.<span className="fn">push</span>(node.right);{"\n"}
            {"    "}{"}"}{"\n\n"}
            {"    "}result.<span className="fn">push</span>(level);{"\n"}
            {"  "}{"}"}{"\n\n"}
            {"  "}<span className="kw">return</span> result;{"\n"}
            {"}"}{"\n"}
          </>
        }
      />

      <div className="insight-grid">
        <div className="insight-card">
          <div className="insight-num">01</div>
          <div className="insight-title">shift() not pop()</div>
          <div className="insight-body">
            <code>shift()</code> = FIFO (queue front). <code>pop()</code> = LIFO (stack top).
            Using <code>pop()</code> here gives you DFS, the wrong algorithm entirely.
          </div>
        </div>
        <div className="insight-card">
          <div className="insight-num">02</div>
          <div className="insight-title">Freeze levelSize</div>
          <div className="insight-body">
            Capture <code>queue.length</code> before the inner loop. As you enqueue children, the queue grows.
            The snapshot tells you where the current level ends.
          </div>
        </div>
        <div className="insight-card">
          <div className="insight-num">03</div>
          <div className="insight-title">Why iterative wins</div>
          <div className="insight-body">
            BFS is inherently a queue algorithm. The iterative version is cleaner, safer (no call stack),
            and is the standard solution you'll see in interviews.
          </div>
        </div>
        <div className="insight-card">
          <div className="insight-num">04</div>
          <div className="insight-title">Enqueue order matters</div>
          <div className="insight-body">
            Always push <code>left</code> before <code>right</code>. This preserves left-to-right reading
            order within each level of the output.
          </div>
        </div>
      </div>

      <div className="complexity" style={{ marginTop: 4 }}>
        <div className="cx-box"><div className="cx-val">O(n)</div><div className="cx-label">Time</div></div>
        <div className="cx-box"><div className="cx-val">O(w)</div><div className="cx-label">Space (queue)</div></div>
        <div className="cx-box" style={{ borderColor: "var(--ok)" }}>
          <div className="cx-val" style={{ color: "var(--ok)" }}>✓ Best</div>
          <div className="cx-label">preferred approach</div>
        </div>
      </div>
    </div>
  );
}

function CodeEditor({ filename, lineCount, code }) {
  const lines = Array.from({ length: lineCount }, (_, i) => i + 1);
  return (
    <div className="code-editor">
      <div className="editor-titlebar">
        <div className="editor-dots"><span /><span /><span /></div>
        <div className="editor-filename">{filename}</div>
        <div className="editor-lang">TypeScript</div>
      </div>
      <div className="editor-body">
        <div className="editor-lines" aria-hidden="true">
          {lines.map(n => <div key={n}>{n}</div>)}
        </div>
        <pre className="editor-code">{code}</pre>
      </div>
    </div>
  );
}

export default function BstInorder() {
  const [treeIdx, setTreeIdx] = useState(0);
  const tree = TREES[treeIdx];
  const { theme } = useTheme();
  const themeTick = theme;

  const dfsFlat = useMemo(() => inorderFlat(tree), [tree]);
  const bfsFlat = useMemo(() => getLevels(tree).flat(), [tree]);

  return (
    <div className="bst-artifact">
      <div className="bst-header">
        <div>
          <h2>Inorder <em>DFS</em><br />Tree Traversal</h2>
          <p>// recursive vs iterative - TypeScript implementation</p>
        </div>
        <div className="tree-select-wrap">
          <div className="tree-select-label">Select Tree</div>
          <div className="tree-select">
            {TREE_LABELS.map((label, i) => (
              <button
                key={label}
                className={`tree-btn${treeIdx === i ? " active" : ""}`}
                onClick={() => setTreeIdx(i)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="main-grid">
        <RecursivePanel tree={tree} themeTick={themeTick} />
        <IterativePanel tree={tree} themeTick={themeTick} />
      </div>

      <div className="bfs-header">
        <div>
          <div className="bfs-eyebrow">// breadth first search</div>
          <h2 className="bfs-title">BFS <em>Level Order</em> Traversal</h2>
          <p className="bfs-desc">
            Unlike DFS which goes <strong>deep</strong> before wide, BFS visits every node level by level,
            left to right. Uses a <strong>queue</strong> (FIFO) instead of a stack (FILO).
          </p>
        </div>
        <div className="bfs-contrast">
          <div className="contrast-row">
            <span className="contrast-label">DFS Inorder</span>
            <span className="contrast-val">
              {dfsFlat.map(v => <span key={v} className="chip chip-visited">{v}</span>)}
            </span>
          </div>
          <div className="contrast-divider" />
          <div className="contrast-row">
            <span className="contrast-label">BFS Level Order</span>
            <span className="contrast-val accent-bfs">
              {bfsFlat.map(v => <span key={v} className="chip chip-queue">{v}</span>)}
            </span>
          </div>
        </div>
      </div>

      <div className="bfs-concept-bar">
        <div className="concept-card">
          <div className="concept-icon">⬇</div>
          <div>
            <div className="concept-name">DFS Stack</div>
            <div className="concept-detail">LIFO, goes deep before wide</div>
          </div>
        </div>
        <div className="concept-vs">vs</div>
        <div className="concept-card active-concept">
          <div className="concept-icon">➡</div>
          <div>
            <div className="concept-name">BFS Queue</div>
            <div className="concept-detail">FIFO, visits level by level</div>
          </div>
        </div>
      </div>

      <div className="main-grid">
        <BfsRecursivePanel tree={tree} themeTick={themeTick} />
        <BfsIterativePanel tree={tree} themeTick={themeTick} />
      </div>
    </div>
  );
}
