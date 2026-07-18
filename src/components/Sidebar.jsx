// import React from 'react';

// export const Sidebar = ({ createInitialGrid, runAlgorithm, isRunning, handleCancel, clearPathOnly, stats }) => {
//     return (
//         <aside className="w-full md:w-80 lg:w-[320px] border-t md:border-t-0 md:border-r border-slate-800 p-4 md:p-6 flex flex-col gap-5 md:gap-8 bg-slate-900/20 z-30 shrink-0 max-h-[35vh] md:max-h-none overflow-y-auto">
//             <div className="sidebar-item">
//                 <label className="text-[10px] font-black uppercase text-slate-500 mb-3 md:mb-4 block tracking-widest">1. Category</label>
//                 <div className="grid grid-cols-2 gap-2">
//                     {['empty', 'random', 'barrier'].map(p => (
//                         <button key={p} onClick={() => createInitialGrid(p)} className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-[10px] md:text-[11px] font-bold border border-slate-700/50 capitalize transition-all active:scale-95">{p}</button>
//                     ))}
//                     <button onClick={() => createInitialGrid()} className="py-2.5 px-3 bg-rose-950/30 text-rose-400 hover:bg-rose-950/50 rounded-lg text-[10px] md:text-[11px] font-bold border border-rose-900/20 transition-all">Reset All</button>
//                 </div>
//             </div>

//             <div className="sidebar-item">
//                 <label className="text-[10px] font-black uppercase text-slate-500 mb-3 md:mb-4 block tracking-widest">2. Algorithm</label>
//                 <div className="space-y-2 md:space-y-3">
//                     <button onClick={() => runAlgorithm('Dijkstra')} disabled={isRunning} className="w-full py-3 md:py-3.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-30 rounded-xl font-black text-[10px] md:text-xs uppercase tracking-widest shadow-lg transition-all active:scale-95">Run Dijkstra</button>
//                     <button onClick={() => runAlgorithm('A*')} disabled={isRunning} className="w-full py-3 md:py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 rounded-xl font-black text-[10px] md:text-xs uppercase tracking-widest shadow-lg transition-all active:scale-95">Run A-Star</button>
//                     <button onClick={() => runAlgorithm('Q-Learning')} disabled={isRunning} className="w-full py-3.5 md:py-4.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-30 rounded-xl font-black text-[10px] md:text-xs uppercase tracking-widest border-2 border-purple-400/30 shadow-lg transition-all active:scale-95">Run Q-Learning (ML)</button>
//                 </div>
//             </div>

//             <div className="sidebar-item mt-2 md:mt-4 pt-4 border-t border-slate-800">
//                 <label className="text-[10px] font-black uppercase text-slate-500 mb-3 block tracking-widest">3. Tools</label>
//                 <div className="space-y-3">
//                     {isRunning ? (
//                         <button onClick={handleCancel} className="w-full py-3 md:py-4 bg-rose-600 hover:bg-rose-500 animate-pulse rounded-xl font-black text-[10px] md:text-xs uppercase tracking-widest shadow-xl shadow-rose-900/20 border-2 border-rose-400/30 transition-all flex flex-col items-center justify-center gap-1">
//                             <span className="text-white">Stop Process</span>
//                             <span className="text-[8px] opacity-70 normal-case font-medium tracking-normal">Cancel Calculation</span>
//                         </button>
//                     ) : (
//                         <button onClick={clearPathOnly} disabled={stats.visited === 0 && stats.pathLength === 0} className="w-full py-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-[10px] font-black uppercase border border-slate-700 disabled:opacity-30 transition-all">
//                             Clear Results Only
//                         </button>
//                     )}
//                 </div>
//             </div>
//             <div className="sidebar-item mt-auto pt-4 hidden md:block">
//                 <p className="text-[11px] text-slate-400 leading-relaxed italic text-center">
//                     "Machine Learning (Q-Learning) learns through trials and errors to find the path."
//                 </p>
//             </div>
//         </aside>
//     );
// };