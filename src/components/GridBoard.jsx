// import React from 'react';
// import { ROWS, COLS } from '../constants';

// export const GridBoard = ({ grid, setGrid, isRunning, isMouseDown, setIsMouseDown }) => {
//   return (
//     <section className="flex-1 bg-slate-950 flex flex-col relative overflow-hidden min-h-0">
//       <div className="flex flex-wrap justify-center gap-3 sm:gap-6 p-3 md:p-4 text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-slate-900/80 border-b border-slate-800 z-30 shrink-0 shadow-md">
//         <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-emerald-500 rounded-sm"></div> Start</div>
//         <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-rose-500 rounded-sm"></div> Target</div>
//         <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-slate-700 rounded-sm"></div> Wall</div>
//         <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-yellow-400 rounded-sm shadow-[0_0_8px_#fbbf24]"></div> Path</div>
//       </div>

//       <div className="flex-1 w-full h-full p-2 md:p-4 overflow-hidden">
//         <div className="w-full h-full flex justify-center items-center" style={{ containerType: 'size' }}>
//           <div 
//             className="grid-container grid gap-px md:gap-[1px] bg-slate-800 p-px md:p-[1px] rounded shadow-2xl relative z-10"
//             style={{ 
//               gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
//               gridTemplateRows: `repeat(${ROWS}, minmax(0, 1fr))`,
//               width: 'min(100cqw, calc(100cqh * 2))',
//               height: 'min(100cqh, calc(100cqw / 2))',
//             }}
//             onMouseDown={() => setIsMouseDown(true)}
//             onMouseUp={() => setIsMouseDown(false)}
//             onMouseLeave={() => setIsMouseDown(false)}
//           >
//             {grid.map((row, r) => row.map((node, c) => (
//               <div 
//                 key={`${r}-${c}`} id={`node-${r}-${c}`}
//                 onMouseEnter={() => { 
//                   if (isMouseDown && !isRunning && !node.isStart && !node.isEnd) { 
//                     const newGrid = [...grid]; 
//                     newGrid[r][c].isWall = true; 
//                     setGrid(newGrid); 
//                   } 
//                 }}
//                 className={`node-cell w-full h-full transition-colors duration-200 relative ${node.isStart ? 'bg-emerald-500 z-20 shadow-[0_0_10px_#10b98180]' : node.isEnd ? 'bg-rose-500 z-20 shadow-[0_0_10px_#f43f5e80]' : node.isWall ? 'bg-slate-700' : 'bg-slate-950'}`}
//               >
//                 {(node.isStart || node.isEnd) && <div className="absolute inset-0 animate-pulse bg-white/20 rounded-full scale-125 md:scale-150"></div>}
//               </div>
//             )))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };