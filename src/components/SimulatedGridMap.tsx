import React from 'react';
import { motion } from 'motion/react';

interface Point {
  x: number;
  y: number;
}

export const SimulatedGridMap = () => {
  const gridSize = 10;
  const spacing = 10; // percent

  // Extended mock path for more detail
  const path: Point[] = [
    { x: 10, y: 90 },
    { x: 40, y: 90 },
    { x: 40, y: 70 },
    { x: 20, y: 70 },
    { x: 20, y: 30 },
    { x: 70, y: 30 },
    { x: 70, y: 10 },
    { x: 90, y: 10 },
  ];

  const pathD = `M ${path.map(p => `${p.x},${p.y}`).join(' L ')}`;

  return (
    <div className="w-full h-full bg-[var(--card-bg-solid)] dark:bg-[#020305] relative overflow-hidden technical-dots rounded-3xl border border-[var(--border-color)]">
      {/* City Sector Indicators */}
      <div className="absolute inset-0 flex flex-wrap opacity-20 pointer-events-none">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="w-1/2 h-1/2 border border-[var(--border-color)] flex items-start p-2">
            <span className="text-[6px] font-mono font-bold text-[var(--text-muted)]">SECTOR_0{i+1}</span>
          </div>
        ))}
      </div>

      {/* SVG Filters Definition */}
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id="distortion">
            <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="15" />
          </filter>
        </defs>
      </svg>

      {/* City Grid */}
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Street Network */}
        {Array.from({ length: 11 }).map((_, i) => (
          <React.Fragment key={i}>
            <line x1="0" y1={i * spacing} x2="100" y2={i * spacing} stroke="rgba(255,255,255,0.015)" strokeWidth="0.2" />
            <line x1={i * spacing} y1="0" x2={i * spacing} y2="100" stroke="rgba(255,255,255,0.015)" strokeWidth="0.2" />
          </React.Fragment>
        ))}

        {/* Arterial Roads */}
        <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.05)" strokeWidth="0.8" />
        <line x1="50" y1="0" x2="50" y2="100" stroke="rgba(255,255,255,0.05)" strokeWidth="0.8" />

        {/* Dynamic Data Blocks (Buildings) */}
        {Array.from({ length: 20 }).map((_, i) => (
          <rect 
            key={i}
            x={10 + (i % 5) * 20 + Math.random() * 5} 
            y={10 + Math.floor(i / 5) * 20 + Math.random() * 5} 
            width="4" 
            height="4" 
            fill="rgba(255,255,255,0.02)" 
          />
        ))}

        {/* Mission Path Shadow */}
        <path
          d={pathD}
          fill="none"
          stroke="rgba(239, 68, 68, 0.1)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Mission Path */}
        <motion.path
          d={pathD}
          fill="none"
          stroke="rgba(239, 68, 68, 0.4)"
          strokeWidth="1.5"
          strokeDasharray="4 2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />

        {/* Unit Indicator */}
        <motion.g style={{ offsetPath: `path("${pathD}")` }} animate={{ offsetDistance: "100%" }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }}>
          {/* Signal Wave */}
          {[1, 2, 3].map(i => (
             <motion.circle
               key={i}
               r="0"
               fill="none"
               stroke="#f43f5e"
               strokeWidth="0.5"
               initial={{ r: 0, opacity: 0.5 }}
               animate={{ r: 8, opacity: 0 }}
               transition={{ duration: 2, repeat: Infinity, delay: i * 0.6 }}
             />
          ))}
          <circle r="1.5" fill="#f43f5e" className="shadow-[0_0_10px_#f43f5e]" />
        </motion.g>

        {/* Node Points */}
        <circle cx={path[0].x} cy={path[0].y} r="1.2" fill="#f59e0b" />
        <rect x={path[path.length - 1].x - 1.5} y={path[path.length - 1].y - 1.5} width="3" height="3" fill="#10b981" />
      </svg>

      {/* Real-time Telemetry HUD overlay */}
      <div className="absolute inset-4 pointer-events-none flex flex-col justify-between">
         <div className="flex justify-between items-start">
            <div className="space-y-1">
               <div className="flex items-center gap-2 px-2 py-0.5 bg-[var(--hud-bg)] backdrop-blur rounded border border-[var(--border-color)] text-[7px] font-mono text-emerald-600 dark:text-emerald-500 font-bold uppercase tracking-widest">
                  <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                  SYS_LINK_07: OK
               </div>
               <div className="text-[9px] font-mono text-[var(--text-muted)] font-bold tracking-tighter">SPD: 82.4 KM/H</div>
            </div>
            <div className="text-right">
               <div className="text-[10px] font-mono text-[var(--text-muted)]/70 dark:text-white/40 font-bold leading-none">GRID_POS_A12</div>
               <div className="text-[7px] font-mono text-[var(--text-muted)] font-bold uppercase mt-1">SATELLITE_FIX_HIGH</div>
            </div>
         </div>

         <div className="flex justify-between items-end">
            <div className="space-y-1">
               <div className="text-[7px] font-mono text-[var(--text-muted)] font-bold uppercase">Bearing: 124° NW</div>
               <div className="flex items-center gap-1">
                  <div className="w-16 h-1 bg-[var(--hover-bg)] rounded-full overflow-hidden border border-[var(--border-color)]">
                     <motion.div className="h-full bg-emerald-500" animate={{ width: ['40%', '80%', '40%'] }} transition={{ duration: 5, repeat: Infinity }} />
                  </div>
                  <span className="text-[7px] font-mono text-emerald-600 dark:text-emerald-500 font-bold">SIGNAL</span>
               </div>
            </div>
            <div className="px-2 py-1 bg-[var(--hud-bg)] backdrop-blur rounded border border-[var(--border-color)] text-[7px] font-mono text-[var(--text-muted)] font-bold flex gap-3">
               <span>LAT: 12.97</span>
               <span>LNG: 77.59</span>
            </div>
         </div>
      </div>

      {/* Traffic Distortion Zones */}
      <TrafficZone top="40%" left="30%" color="rgba(244, 63, 94, 0.4)" size="140px" />
      <TrafficZone top="70%" left="70%" color="rgba(16, 185, 129, 0.2)" size="200px" />
    </div>
  );
};

const TrafficZone = ({ top, left, color, size }: { top: string, left: string, color: string, size: string }) => {
  return (
    <div 
      className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      style={{ top, left, width: size, height: size }}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Shifting Distortion Base */}
        <motion.div 
          className="absolute inset-0 rounded-full opacity-30 blur-2xl"
          style={{ backgroundColor: color, filter: 'url(#distortion)' }}
          animate={{ scale: [1, 1.1, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />

        {/* Pulsating HUD Rings */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-current opacity-20"
            style={{ color, width: '100%', height: '100%' }}
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 1,
              ease: "easeOut"
            }}
          />
        ))}

        {/* Drifting Particles */}
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-white opacity-40 shadow-[0_0_8px_rgba(255,255,255,0.8)]"
            initial={{ 
              x: Math.random() * 40 - 20, 
              y: Math.random() * 40 - 20 
            }}
            animate={{ 
              x: [null, Math.random() * 60 - 30, Math.random() * 40 - 20],
              y: [null, Math.random() * 60 - 30, Math.random() * 40 - 20],
              opacity: [0.2, 0.8, 0.2]
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Digital Scanline */}
        <motion.div 
          className="absolute w-full h-[1px] bg-white/20 blur-[1px]"
          animate={{ top: ['0%', '100%', '0%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
      </div>
    </div>
  );
};
