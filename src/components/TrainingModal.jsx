// import React from 'react';
// import { TOTAL_EPISODES } from '../constants';

// export const TrainingModal = ({ isRunning, progress, trainingData, isTrainingComplete, handleVisualizeML, setIsRunning, setProgress, handleCancel }) => {
//   if (!isRunning || progress <= 0) return null;

//   return (
//     <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-md px-4">
//       <div className="w-full max-w-[90%] sm:max-w-sm md:max-w-md p-6 md:p-8 rounded-2xl md:rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl text-center">
//         <div className="flex justify-between items-end mb-4 md:mb-6 text-left">
//           <div>
//             <h2 className="text-xl md:text-2xl font-black text-white italic tracking-tight uppercase">Training <span className="text-purple-500">Model...</span></h2>
//             <p className="text-[8px] md:text-[10px] text-slate-500 uppercase tracking-widest mt-1">Episode {trainingData.episode.toLocaleString()} / {TOTAL_EPISODES.toLocaleString()}</p>
//           </div>
//           <div className="text-2xl md:text-3xl font-mono font-black text-purple-400">{progress}%</div>
//         </div>

//         <div className="relative w-full bg-slate-800 h-3 md:h-4 rounded-full border border-slate-700 p-1 mb-6 md:mb-8">
//           <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 transition-all duration-300 shadow-[0_0_20px_#a855f760]" style={{ width: `${progress}%` }}></div>
//         </div>

//         <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8 text-left font-bold tracking-tighter">
//           <div className="bg-slate-950/50 p-3 md:p-4 rounded-xl md:rounded-2xl border border-slate-800">
//             <p className="text-[8px] md:text-[9px] uppercase text-slate-500 mb-1 tracking-widest font-black">Exploration <span className="normal-case font-medium text-[9px] md:text-[11px]">(ε)</span></p>
//             <p className="text-base md:text-lg font-mono font-bold text-cyan-400">{(trainingData.epsilon * 100).toFixed(1)}%</p>
//           </div>
//           <div className="bg-slate-950/50 p-3 md:p-4 rounded-xl md:rounded-2xl border border-slate-800">
//             <p className="text-[8px] md:text-[9px] uppercase text-slate-500 mb-1 tracking-widest font-black">Goals Found</p>
//             <p className="text-base md:text-lg font-mono font-bold text-emerald-400">{trainingData.success}</p>
//           </div>
//         </div>

//         {isTrainingComplete ? (
//           <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500 italic uppercase">
//             <button onClick={handleVisualizeML} className="w-full py-3 md:py-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs tracking-widest shadow-lg shadow-emerald-500/20 active:scale-95 transition-all">
//               View Training Results Track
//             </button>
//             <button onClick={() => { setIsRunning(false); setProgress(0); }} className="w-full py-2 text-[10px] text-slate-500 font-bold tracking-widest hover:text-rose-400 transition-colors">
//               Cancel Training
//             </button>
//           </div>
//         ) : (
//           <div className="mt-6 md:mt-8 flex flex-col items-center gap-3 md:gap-4">
//             <p className="text-[8px] md:text-[10px] text-slate-500 italic animate-pulse tracking-wide font-medium">Agent is exploring the environment...</p>
//             <button onClick={handleCancel} className="px-5 md:px-6 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-[9px] md:text-[10px] font-bold uppercase tracking-widest rounded-full border border-rose-500/30 transition-all active:scale-95">
//               Cancel Training
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };