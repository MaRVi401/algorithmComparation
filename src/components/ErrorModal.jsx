// import React from 'react';

// export const ErrorModal = ({ showError, setShowError, errorMsg, createInitialGrid }) => {
//   if (!showError) return null;

//   return (
//     <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm px-4">
//       <div className="bg-slate-900 border border-rose-500/30 p-5 md:p-6 rounded-2xl shadow-2xl max-w-[90%] md:max-w-[320px] w-full text-center animate-in zoom-in duration-300">
//         <div className="text-rose-500 mb-3 md:mb-4 flex justify-center">
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-10 md:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//           </svg>
//         </div>
//         <h3 className="text-lg md:text-xl font-black text-white mb-2 tracking-tighter uppercase italic">{errorMsg.title}</h3>
//         <p className="text-slate-400 text-[10px] md:text-[11px] mb-5 md:mb-6 leading-relaxed font-medium">{errorMsg.body}</p>
//         <div className="flex flex-col gap-2">
//           <button onClick={() => setShowError(false)} className="w-full py-2.5 md:py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all uppercase tracking-widest text-[9px] md:text-[10px] border border-slate-700">Dismiss</button>
//           <button onClick={() => { createInitialGrid(); setShowError(false); }} className="w-full py-2.5 md:py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-black transition-all uppercase tracking-widest text-[9px] md:text-[10px]">Reset Grid & Walls</button>
//         </div>
//       </div>
//     </div>
//   );
// };