import React from 'react';

const StatDisplay = ({ label, value, color }) => (
  <div className="text-center min-w-[4rem] md:min-w-17.5 uppercase tracking-tighter shrink-0">
    <p className="text-[8px] md:text-[10px] text-slate-500 font-black mb-0.5 md:mb-1">{label}</p>
    <p className={`text-lg md:text-xl font-mono font-black ${color}`}>{value}</p>
  </div>
);

export const Header = ({ stats }) => {
  return (
    <header className="py-3 md:py-0 md:h-16 border-b border-slate-800 flex flex-col md:flex-row items-center justify-between px-4 md:px-8 bg-slate-950/80 backdrop-blur-md z-20 shadow-sm shadow-indigo-500/10 shrink-0 gap-3 md:gap-0">
      <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto justify-center md:justify-start">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className="w-8 h-8 md:w-10 md:h-10 filter drop-shadow-[0_0_8px_rgba(99,102,241,0.3)] transition-transform hover:scale-110 duration-300">
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
          <h1 className="text-lg md:text-xl font-bold tracking-tight text-white leading-none italic uppercase">
            Pathfinding <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Labs</span>
          </h1>
          <p className="text-[8px] md:text-[10px] text-slate-500 font-medium tracking-wider uppercase mt-1">Algorithm Research Journal</p>
        </div>
      </div>
      <div className="flex gap-4 sm:gap-8 md:gap-15 w-full md:w-auto justify-center md:justify-end overflow-x-auto pb-1 md:pb-0">
        <StatDisplay label="States Explored" value={stats.visited} color="text-cyan-400" />
        <StatDisplay label="Path" value={stats.pathLength} color="text-yellow-400" />
        <StatDisplay label="Time" value={<>{stats.time}<span className="text-xs md:text-sm lowercase ml-1">ms</span></>} color="text-emerald-400" />
      </div>
    </header>
  );
};