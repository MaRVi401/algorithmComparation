import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ROWS, COLS, TOTAL_EPISODES } from '../constants';

export const usePathfinding = () => {
  const [grid, setGrid] = useState([]);
  const [stats, setStats] = useState({ visited: 0, pathLength: 0, time: 0 });
  const [isRunning, setIsRunning] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState({ title: "", body: "" });

  const [progress, setProgress] = useState(0);
  const [isTrainingComplete, setIsTrainingComplete] = useState(false);
  const [trainingData, setTrainingData] = useState({ episode: 0, epsilon: 1, success: 0 });

  const qTableRef = useRef({});
  const stopTrainingRef = useRef(false);

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
      ...node, isVisited: false, isPath: false
    })));
    setGrid(cleanedGrid);
    setStats({ visited: 0, pathLength: 0, time: 0 });
    setProgress(0);
  };

  useEffect(() => createInitialGrid(), []);

  const handleCancel = () => { stopTrainingRef.current = true; };

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
      if (nodeEl) gsap.to(nodeEl, { backgroundColor: "#fbbf24", scale: 1.1, borderRadius: "20%", zIndex: 10, duration: 0.1 });
      await new Promise(r => setTimeout(r, 15));
    }
    setStats({ visited: vCount, pathLength: path.length, time: (performance.now() - startT).toFixed(2) });
    setIsRunning(false);
  };

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
      stopTrainingRef.current = false;

      const ALPHA = 0.2; const GAMMA = 0.99; let epsilon = 1.0;
      const MAX_STEPS = 1000; const CHUNK_SIZE = 1000;
      const qTable = {};
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) { qTable[`${r}-${c}`] = [0, 0, 0, 0]; }
      }

      const visitedSet = new Set();
      let goalReachedCount = 0;
      const getDist = (r, c) => Math.abs(r - endNode.r) + Math.abs(c - endNode.c);

      for (let i = 0; i < TOTAL_EPISODES; i++) {
        if (stopTrainingRef.current) {
          setIsRunning(false); setProgress(0); return;
        }

        let curr = { r: 10, c: 5 }; let steps = 0;
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
          if (action === 0) nextR--; else if (action === 1) nextR++;
          else if (action === 2) nextC--; else if (action === 3) nextC++;

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
            reward = 500; goalReachedCount++;
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
      setProgress(0); stopTrainingRef.current = false;
      let visitedCount = 0;
      const startNode = { r: 10, c: 5, g: 0, f: 0, parent: null };
      let openSet = [startNode];
      const visitedSet = new Set();

      while (openSet.length > 0) {
        if (stopTrainingRef.current) {
          setIsRunning(false); setStats(prev => ({ ...prev, visited: visitedCount })); return;
        }
        openSet.sort((a, b) => type === 'A*' ? a.f - b.f : a.g - b.g);
        const current = openSet.shift();
        const key = `${current.r}-${current.c}`;
        if (visitedSet.has(key)) continue;
        visitedSet.add(key); visitedCount++;

        if (current.r === endNode.r && current.c === endNode.c) {
          await finishPath(current, workingGrid, startTime, visitedCount); return;
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
      setStats(prev => ({ ...prev, visited: visitedCount }));
      setIsRunning(false);
      setErrorMsg({ title: "Path Unreachable", body: `The ${type} algorithm has exhausted all possibilities, but no valid path exists.` });
      setShowError(true);
    }
  };

  const handleVisualizeML = async () => {
    setIsTrainingComplete(false); setProgress(0);
    const endNode = { r: 10, c: 35 };
    const workingGrid = grid.map(row => row.map(node => ({ ...node, isVisited: false, isPath: false })));
    const startTime = performance.now();
    const qTable = qTableRef.current;

    let temp = { r: 10, c: 5 }; const path = []; const pathSet = new Set();

    while (!(temp.r === endNode.r && temp.c === endNode.c) && path.length < ROWS * COLS) {
      const stateKey = `${temp.r}-${temp.c}`;
      if (pathSet.has(stateKey)) break;
      pathSet.add(stateKey); path.push(temp);
      const values = qTable[stateKey];
      if (values.every(v => v === 0)) break;
      const bestAction = values.indexOf(Math.max(...values));
      if (bestAction === 0) temp = { r: temp.r - 1, c: temp.c };
      else if (bestAction === 1) temp = { r: temp.r + 1, c: temp.c };
      else if (bestAction === 2) temp = { r: temp.r, c: temp.c - 1 };
      else if (bestAction === 3) temp = { r: temp.r, c: temp.c + 1 };
    }

    if (temp.r === endNode.r && temp.c === endNode.c) {
      path.push(temp); await finishPath(null, workingGrid, startTime, stats.visited, path);
    } else {
      setStats(prev => ({ ...prev, visited: stats.visited })); setIsRunning(false);
      setErrorMsg({ title: "Model Non-Convergent", body: "The agent failed to find a stable policy. This may occur due to complex maze geometry or insufficient training steps for the current environment." });
      setShowError(true);
    }
  };

  return {
    grid, setGrid, stats, isRunning, setIsRunning, isMouseDown, setIsMouseDown, 
    showError, setShowError, errorMsg, progress, setProgress, isTrainingComplete, 
    trainingData, createInitialGrid, clearPathOnly, handleCancel, runAlgorithm, handleVisualizeML
  };
};