import React from 'react';

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative flex items-center justify-center w-12 h-12">
        {/* Outer glowing ring */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#00ff66] to-[#00cc55] opacity-20 blur-md"></div>
        
        {/* Hexagon base */}
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full text-[#131b26] drop-shadow-xl">
          <polygon 
            points="50 3, 93 25, 93 75, 50 97, 7 75, 7 25" 
            fill="currentColor" 
            stroke="url(#green-gradient)" 
            strokeWidth="4"
          />
          <defs>
            <linearGradient id="green-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00ff66" />
              <stop offset="100%" stopColor="#00cc55" />
            </linearGradient>
          </defs>
        </svg>

        {/* Inner stylized 'A' */}
        <svg viewBox="0 0 100 100" className="relative z-10 w-6 h-6 text-white">
          <path 
            d="M50 15 L80 80 L60 80 L50 55 L40 80 L20 80 Z M50 35 L43 50 L57 50 Z" 
            fill="url(#green-gradient)" 
          />
        </svg>
      </div>
      
      {/* Text part */}
      <div className="flex flex-col justify-center">
        <span className="text-2xl font-black tracking-tighter text-white leading-none uppercase">
          ARENA<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff66] to-[#00cc55]">PAY</span>
        </span>
        <span className="text-[0.65rem] font-bold text-slate-400 tracking-[0.2em] uppercase leading-none mt-1">
          Torneos eSports
        </span>
      </div>
    </div>
  );
}
