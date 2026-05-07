import React from 'react';
import { motion } from 'motion/react';
import { Activity, AlertCircle, Search, RefreshCw } from 'lucide-react';

export const LoadingState = ({ message = 'Synchronizing Neural Link...' }: { message?: string }) => (
  <div className="flex flex-col items-center justify-center p-12 text-center h-[400px]">
    <div className="relative mb-8">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        className="w-24 h-24 rounded-[2rem] border-2 border-red-600/20 border-t-red-600 shadow-[0_0_20px_rgba(239,68,68,0.2)]"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <Activity className="w-8 h-8 text-red-600 animate-pulse" />
      </div>
    </div>
    <div className="space-y-4">
      <p className="text-[10px] font-black text-red-600 uppercase tracking-[0.5em] animate-pulse">{message}</p>
      <div className="flex gap-1 justify-center">
        {[1, 2, 3].map(i => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 bg-red-600 rounded-full"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
    </div>
  </div>
);

export const EmptyState = ({ title, description, icon: Icon = Search }: { title: string, description: string, icon?: any }) => (
  <div className="flex flex-col items-center justify-center p-12 text-center glass-panel rounded-[3rem] border-dashed">
    <div className="w-20 h-20 bg-[var(--hover-bg)] rounded-[1.5rem] flex items-center justify-center mb-8 border border-[var(--border-color)] shadow-inner">
      <Icon className="w-8 h-8 text-[var(--icon-muted)]" />
    </div>
    <h3 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-[0.3em] mb-4 italic">{title}</h3>
    <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest max-w-[240px] leading-relaxed mx-auto">
      {description}
    </p>
  </div>
);

export const ErrorState = ({ message, onRetry }: { message: string, onRetry?: () => void }) => (
  <div className="flex flex-col items-center justify-center p-12 text-center glass-panel rounded-[3rem] border-red-600/10">
    <div className="w-20 h-20 bg-red-600/10 rounded-[1.5rem] flex items-center justify-center mb-8 border border-red-600/20 shadow-xl">
      <AlertCircle className="w-8 h-8 text-red-600" />
    </div>
    <h3 className="text-sm font-black text-red-600 uppercase tracking-[0.3em] mb-4 italic">Critical Error Detected</h3>
    <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest max-w-[240px] leading-relaxed mx-auto italic mb-8">
      {message}
    </p>
    {onRetry && (
      <button 
        onClick={onRetry}
        className="btn-secondary"
      >
        <RefreshCw className="w-4 h-4" />
        Retry Initial Sequence
      </button>
    )}
  </div>
);
