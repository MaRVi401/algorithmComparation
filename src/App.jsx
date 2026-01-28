import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

// --- Konstanta Global ---
const ROWS = 20;
const COLS = 40;
const TOTAL_EPISODES = 1000000;

const App = () => {
  const [grid, setGrid] = useState([]);
  const [stats, setStats] = useState({ visited: 0, pathLength: 0, time: 0 });
  const [isRunning, setIsRunning] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [showError, setShowError] = useState(false);

  // State UI Progress (Khusus Q-Learning)
  const [progress, setProgress] = useState(0);
  const [isTrainingComplete, setIsTrainingComplete] = useState(false);
  const [trainingData, setTrainingData] = useState({
    episode: 0,
    epsilon: 1,
    success: 0
  });

  const containerRef = useRef();
  const qTableRef = useRef({});
  const stopTrainingRef = useRef(false);

  // --- Grid Management ---
  const createInitialGrid = (pattern = 'empty') => {
    if (isRunning) return;
    if (document.querySelectorAll(".node-cell").length > 0) {
      gsap.set(".node-cell", { clearProps: "all" });
    }

    const newGrid = [];
    for (let r = 0; r < ROWS; r++) {
      const row = [];
      for (let c = 0; c < COLS; c++) {
        let isWall = false;
        if (pattern === 'random') isWall = Math.random() < 0.25;
        if (pattern === 'barrier' && c === 20 && r > 2 && r < 17) isWall = true;

        row.push({
          r, c,
          isStart: r === 10 && c === 5,
          isEnd: r === 10 && c === 35,
          isWall: (r === 10 && c === 5) || (r === 10 && c === 35) ? false : isWall,
          isVisited: false, isPath: false
        });
      }
      newGrid.push(row);
    }
    setGrid(newGrid);
    setStats({ visited: 0, pathLength: 0, time: 0 });
    setProgress(0);
    setIsTrainingComplete(false);
  };

  const clearPathOnly = () => {
    if (isRunning) return;
    if (document.querySelectorAll(".node-cell").length > 0) {
      gsap.set(".node-cell", { clearProps: "all" });
    }
    const cleanedGrid = grid.map(row => row.map(node => ({
      ...node,
      isVisited: false,
      isPath: false
    })));
    setGrid(cleanedGrid);
    setStats({ visited: 0, pathLength: 0, time: 0 });
    setProgress(0);
  };

  useEffect(() => createInitialGrid(), []);

  useGSAP(() => {
    gsap.from(".sidebar-item", { x: -30, opacity: 0, stagger: 0.1, duration: 0.8, ease: "power3.out" });
    gsap.from(".grid-container", { scale: 0.95, opacity: 0, duration: 1, ease: "expo.out" });
  }, { scope: containerRef });

  // --- Fungsi Cancel ---
  const handleCancel = () => {
    stopTrainingRef.current = true;
  };

  // --- Logic Pathfinding ---
  const runAlgorithm = async (type) => {
    if (isRunning) return;
    if (stats.visited > 0 || stats.pathLength > 0) clearPathOnly();

    setIsRunning(true);
    const startTime = performance.now();
    const endNode = { r: 10, c: 35 };
    const workingGrid = grid.map(row => row.map(node => ({ ...node, isVisited: false, isPath: false })));

    if (type === 'Q-Learning') {
      setProgress(0.1);
      setIsTrainingComplete(false);
      stopTrainingRef.current = false; // Reset sinyal stop

      const ALPHA = 0.2;
      const GAMMA = 0.99;
      let epsilon = 1.0;
      const MAX_STEPS = 1000;
      const CHUNK_SIZE = 1000;

      const qTable = {};
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          qTable[`${r}-${c}`] = [0, 0, 0, 0];
        }
      }

      const visitedSet = new Set();
      let goalReachedCount = 0;
      const getDist = (r, c) => Math.abs(r - endNode.r) + Math.abs(c - endNode.c);

      // --- TRAINING PHASE ASYNC ---
      for (let i = 0; i < TOTAL_EPISODES; i++) {
        // CEK SINYAL CANCEL
        if (stopTrainingRef.current) {
          setIsRunning(false);
          setProgress(0);
          return;
        }

        let curr = { r: 10, c: 5 };
        let steps = 0;
        epsilon = Math.max(0.1, epsilon * 0.9998);

        while (!(curr.r === endNode.r && curr.c === endNode.c) && steps < MAX_STEPS) {
          const stateKey = `${curr.r}-${curr.c}`;
          visitedSet.add(stateKey);

          let action;
          if (Math.random() < epsilon) {
            action = Math.floor(Math.random() * 4);
          } else {
            const values = qTable[stateKey];
            action = values.every(v => v === values[0]) ? Math.floor(Math.random() * 4) : values.indexOf(Math.max(...values));
          }

          let nextR = curr.r, nextC = curr.c;
          if (action === 0) nextR--;
          else if (action === 1) nextR++;
          else if (action === 2) nextC--;
          else if (action === 3) nextC++;

          let reward = -1;
          if (nextR < 0 || nextR >= ROWS || nextC < 0 || nextC >= COLS || workingGrid[nextR][nextC].isWall) {
            reward = -15;
            qTable[stateKey][action] += ALPHA * (reward - qTable[stateKey][action]);
            break;
          }

          const currentDist = getDist(curr.r, curr.c);
          const nextDist = getDist(nextR, nextC);
          reward = nextDist < currentDist ? 1 : -1.5;

          if (nextR === endNode.r && nextC === endNode.c) {
            reward = 500;
            goalReachedCount++;
          }

          const nextStateKey = `${nextR}-${nextC}`;
          const maxNextQ = Math.max(...qTable[nextStateKey]);
          qTable[stateKey][action] += ALPHA * (reward + GAMMA * maxNextQ - qTable[stateKey][action]);

          curr = { r: nextR, c: nextC };
          steps++;
        }

        if (i % CHUNK_SIZE === 0) {
          setProgress(Math.round((i / TOTAL_EPISODES) * 100));
          setTrainingData({ episode: i, epsilon: epsilon, success: goalReachedCount });
          await new Promise(resolve => setTimeout(resolve, 0));
        }
      }

      qTableRef.current = qTable;
      setProgress(100);
      setStats(prev => ({ ...prev, visited: visitedSet.size }));
      setIsTrainingComplete(true);

    } else {
      // --- DIJKSTRA & A* LOGIC ---
      setProgress(0);
      let visitedCount = 0;
      const startNode = { r: 10, c: 5, g: 0, f: 0, parent: null };
      let openSet = [startNode];
      const visitedSet = new Set();

      while (openSet.length > 0) {
        openSet.sort((a, b) => type === 'A*' ? a.f - b.f : a.g - b.g);
        const current = openSet.shift();
        const key = `${current.r}-${current.c}`;
        if (visitedSet.has(key)) continue;
        visitedSet.add(key);
        visitedCount++;

        if (current.r === endNode.r && current.c === endNode.c) {
          await finishPath(current, workingGrid, startTime, visitedCount);
          return;
        }

        if (!workingGrid[current.r][current.c].isStart) {
          workingGrid[current.r][current.c].isVisited = true;
          setGrid([...workingGrid]);
          const nodeEl = document.getElementById(`node-${current.r}-${current.c}`);
          if (nodeEl) gsap.to(nodeEl, { backgroundColor: type === 'A*' ? "#818cf8" : "#22d3ee", scale: 0.8, borderRadius: "50%", duration: 0.1 });
        }
        await new Promise(r => setTimeout(r, 5));
        const neighbors = [[0, 1], [0, -1], [1, 0], [-1, 0]];
        for (const [dr, dc] of neighbors) {
          const nr = current.r + dr, nc = current.c + dc;
          if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && !workingGrid[nr][nc].isWall) {
            const g = current.g + 1;
            const h = Math.abs(nr - endNode.r) + Math.abs(nc - endNode.c);
            openSet.push({ r: nr, c: nc, g, f: g + h, parent: current });
          }
        }
      }
      setIsRunning(false);
      setShowError(true);
    }
  };

  const handleVisualizeML = async () => {
    setIsTrainingComplete(false);
    setProgress(0);
    const endNode = { r: 10, c: 35 };
    const workingGrid = grid.map(row => row.map(node => ({ ...node, isVisited: false, isPath: false })));
    const startTime = performance.now();
    const qTable = qTableRef.current;

    let temp = { r: 10, c: 5 };
    const path = [];
    const pathSet = new Set();

    while (!(temp.r === endNode.r && temp.c === endNode.c) && path.length < ROWS * COLS) {
      const stateKey = `${temp.r}-${temp.c}`;
      if (pathSet.has(stateKey)) break;
      pathSet.add(stateKey);
      path.push(temp);
      const values = qTable[stateKey];
      if (values.every(v => v === 0)) break;
      const bestAction = values.indexOf(Math.max(...values));
      if (bestAction === 0) temp = { r: temp.r - 1, c: temp.c };
      else if (bestAction === 1) temp = { r: temp.r + 1, c: temp.c };
      else if (bestAction === 2) temp = { r: temp.r, c: temp.c - 1 };
      else if (bestAction === 3) temp = { r: temp.r, c: temp.c + 1 };
    }

    if (temp.r === endNode.r && temp.c === endNode.c) {
      path.push(temp);
      await finishPath(null, workingGrid, startTime, stats.visited, path);
    } else {
      setIsRunning(false);
      setShowError(true);
    }
  };

  const finishPath = async (node, fGrid, startT, vCount, mlPath = null) => {
    let path = [];
    if (mlPath) { path = mlPath; }
    else {
      let temp = node;
      while (temp) { path.push(temp); temp = temp.parent; }
      path.reverse();
    }

    for (const p of path) {
      fGrid[p.r][p.c].isPath = true;
      setGrid([...fGrid]);
      const nodeEl = document.getElementById(`node-${p.r}-${p.c}`);
      if (nodeEl) gsap.to(nodeEl, { backgroundColor: "#fbbf24", scale: 1.1, borderRadius: "4px", zIndex: 10, duration: 0.1 });
      await new Promise(r => setTimeout(r, 15));
    }
    setStats({ visited: vCount, pathLength: path.length, time: (performance.now() - startT).toFixed(2) });
    setIsRunning(false);
  };

  return (
    <div ref={containerRef} className="h-screen w-screen bg-slate-950 text-slate-200 overflow-hidden flex flex-col font-sans">

      {/* --- HEADER --- */}
      <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-950/80 backdrop-blur-md z-20 shadow-sm shadow-indigo-500/10">
        <div className="flex items-center gap-4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className="w-10 h-10 filter drop-shadow-[0_0_8px_rgba(99,102,241,0.3)] transition-transform hover:scale-110 duration-300">
            <defs>
              <linearGradient id="logo-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: '#6366f1' }} />
                <stop offset="100%" style={{ stopColor: '#22d3ee' }} />
              </linearGradient>
            </defs>
            <circle cx="12" cy="12" r="3" fill="#334155" opacity="0.3" />
            <circle cx="32" cy="32" r="3" fill="#334155" opacity="0.3" />
            <circle cx="52" cy="52" r="3" fill="#334155" opacity="0.3" />
            <circle cx="12" cy="52" r="3" fill="#334155" opacity="0.3" />
            <g fill="url(#logo-gradient)">
              <circle cx="16" cy="48" r="5" />
              <path d="M48,16 l-3,9 l-6,-3 z" />
              <circle cx="48" cy="16" r="5" />
            </g>
            <path d="M16,48 C20,30 30,20 48,16" stroke="url(#logo-gradient)" strokeWidth="4" strokeLinecap="round" fill="none" />
          </svg>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white leading-none italic uppercase">
              Pathfinding <span className="bg-linear-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Labs</span>
            </h1>
            <p className="text-[10px] text-slate-500 font-medium tracking-wider uppercase mt-1">Algorithm Research Journal</p>
          </div>
        </div>

        <div className="flex gap-15">
          <StatDisplay label="States Explored" value={stats.visited} color="text-cyan-400" />
          <StatDisplay label="Path" value={stats.pathLength} color="text-yellow-400" />
          <StatDisplay
            label="Time"
            value={<>{stats.time}<span className="text-sm lowercase ml-1">ms</span></>}
            color="text-emerald-400"
          />
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* --- SIDEBAR --- */}
        <aside className="w-80 border-r border-slate-800 p-6 flex flex-col gap-8 bg-slate-900/20 z-30">
          <div className="sidebar-item">
            <label className="text-[10px] font-black uppercase text-slate-500 mb-4 block tracking-widest">1. Category</label>
            <div className="grid grid-cols-2 gap-2">
              {['empty', 'random', 'barrier'].map(p => (
                <button key={p} onClick={() => createInitialGrid(p)} className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-[11px] font-bold border border-slate-700/50 capitalize transition-all active:scale-95">{p}</button>
              ))}
              <button onClick={() => createInitialGrid()} className="py-2.5 px-3 bg-rose-950/30 text-rose-400 hover:bg-rose-950/50 rounded-lg text-[11px] font-bold border border-rose-900/20 transition-all">Reset All</button>
            </div>
          </div>

          <div className="sidebar-item">
            <label className="text-[10px] font-black uppercase text-slate-500 mb-4 block tracking-widest">2. Algorithm</label>
            <div className="space-y-3">
              <button onClick={() => runAlgorithm('Dijkstra')} disabled={isRunning} className="w-full py-3.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-30 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg transition-all active:scale-95">Run Dijkstra</button>
              <button onClick={() => runAlgorithm('A*')} disabled={isRunning} className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg transition-all active:scale-95">Run A-Star</button>
              <button onClick={() => runAlgorithm('Q-Learning')} disabled={isRunning} className="w-full py-4.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-30 rounded-xl font-black text-xs uppercase tracking-widest border-2 border-purple-400/30 shadow-lg transition-all active:scale-95">Run Q-Learning (ML)</button>
            </div>
          </div>

          <div className="sidebar-item mt-4 pt-4 border-t border-slate-800">
            <label className="text-[10px] font-black uppercase text-slate-500 mb-3 block tracking-widest">3. Tools</label>
            <button
              onClick={clearPathOnly}
              disabled={isRunning || (stats.visited === 0 && stats.pathLength === 0)}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-[10px] font-black uppercase border border-slate-700 disabled:opacity-30 transition-all"
            >
              Clear Results Only
            </button>
          </div>
          <div className="sidebar-item mt-auto p-4 bg-slate-900/50 rounded-lg border border-slate-800">
            <p className="text-[11px] text-slate-400 leading-relaxed italic text-center">
              "Machine Learning (Q-Learning) learns through trials and errors to find the path."
            </p>
          </div>
        </aside>

        {/* --- MAIN AREA --- */}
        <section className="flex-1 bg-slate-950 p-8 flex flex-col items-center justify-center relative">

          <div className="flex flex-wrap justify-center gap-6 mb-6 text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-slate-900/50 px-4 py-2 rounded-full border border-slate-800 z-30 relative">
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-emerald-500 rounded-sm"></div> Start</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-rose-500 rounded-sm"></div> Target</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-slate-700 rounded-sm"></div> Wall</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-yellow-400 rounded-sm shadow-[0_0_8px_#fbbf24]"></div> Path</div>
          </div>

          <div className="grid-container relative z-10 shadow-2xl rounded overflow-hidden">
            <div className="grid gap-px bg-slate-800 p-px"
              style={{ gridTemplateColumns: `repeat(${COLS}, 22px)` }}
              onMouseDown={() => setIsMouseDown(true)}
              onMouseUp={() => setIsMouseDown(false)}>
              {grid.map((row, r) => row.map((node, c) => (
                <div key={`${r}-${c}`} id={`node-${r}-${c}`}
                  onMouseEnter={() => { if (isMouseDown && !isRunning && !node.isStart && !node.isEnd) { const newGrid = [...grid]; newGrid[r][c].isWall = true; setGrid(newGrid); } }}
                  className={`node-cell w-5.5 h-5.5 transition-colors duration-500 relative ${node.isStart ? 'bg-emerald-500 z-20 shadow-[0_0_15px_#10b98180]' : node.isEnd ? 'bg-rose-500 z-20 shadow-[0_0_15px_#f43f5e80]' : node.isWall ? 'bg-slate-700' : 'bg-slate-950'}`}
                >
                  {(node.isStart || node.isEnd) && <div className="absolute inset-0 animate-pulse bg-white/20 rounded-full scale-150"></div>}
                </div>
              )))}
            </div>

            {/* --- TRAINING OVERLAY (Z-50) --- */}
            {isRunning && progress > 0 && (
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md px-4">
                <div className="w-full max-w-md p-8 rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl text-center">

                  <div className="flex justify-between items-end mb-6 text-left">
                    <div>
                      <h2 className="text-2xl font-black text-white italic tracking-tight uppercase">Training <span className="text-purple-500">Model...</span></h2>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Episode {trainingData.episode.toLocaleString()} / {TOTAL_EPISODES.toLocaleString()}</p>
                    </div>
                    <div className="text-3xl font-mono font-black text-purple-400">{progress}%</div>
                  </div>

                  <div className="relative w-full bg-slate-800 h-4 rounded-full border border-slate-700 p-1 mb-8">
                    <div className="h-full rounded-full bg-linear-to-r from-indigo-500 via-purple-500 to-cyan-400 transition-all duration-300 shadow-[0_0_20px_#a855f760]" style={{ width: `${progress}%` }}></div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-8 text-left font-bold tracking-tighter">
                    <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
                      <p className="text-[9px] uppercase text-slate-500 mb-1 tracking-widest font-black">
                        Exploration <span className="normal-case font-medium text-[11px]">(ε)</span>
                      </p>
                      <p className="text-lg font-mono font-bold text-cyan-400">
                        {(trainingData.epsilon * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
                      <p className="text-[9px] uppercase text-slate-500 mb-1 tracking-widest font-black">Goals Found</p>
                      <p className="text-lg font-mono font-bold text-emerald-400">{trainingData.success}</p>
                    </div>
                  </div>

                  {isTrainingComplete ? (
                    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500 italic uppercase">
                      <button
                        onClick={handleVisualizeML}
                        className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl font-black text-xs tracking-widest shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
                      >
                        View Training Results Track
                      </button>
                      <button
                        onClick={() => { setIsRunning(false); setProgress(0); }}
                        className="w-full py-2 text-[10px] text-slate-500 font-bold tracking-widest hover:text-rose-400 transition-colors"
                      >
                        Cancel Training
                      </button>
                    </div>
                  ) : (
                    <div className="mt-8 flex flex-col items-center gap-4">
                      <p className="text-[10px] text-slate-500 italic animate-pulse tracking-wide font-medium">
                        Agent is exploring the environment and optimizing the Q-Table...
                      </p>
                      <button
                        onClick={handleCancel}
                        className="px-6 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-[10px] font-bold uppercase tracking-widest rounded-full border border-rose-500/30 transition-all active:scale-95"
                      >
                        Cancel Training
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Error Boundary */}
      {showError && (
        <div className="absolute inset-0 z-60 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm px-4">
          <div className="bg-slate-900 border border-rose-500/30 p-10 rounded-3xl shadow-2xl max-w-sm w-full text-center">
            <h3 className="text-2xl font-black text-white mb-2 tracking-tighter uppercase italic">No Path Found!</h3>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed font-medium">Model gagal menemukan jalur. Coba reset dinding atau jalankan ulang training.</p>
            <button onClick={() => setShowError(false)} className="w-full py-4 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-black transition-all shadow-lg shadow-rose-900/30 uppercase tracking-widest text-xs">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

const StatDisplay = ({ label, value, color }) => (
  <div className="text-center min-w-17.5 uppercase tracking-tighter">
    <p className="text-[10px] text-slate-500 font-black mb-1">{label}</p>
    <p className={`text-xl font-mono font-black ${color}`}>{value}</p>
  </div>
);

export default App;