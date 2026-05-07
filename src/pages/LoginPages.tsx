/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSimulation } from '../context/SimulationContext';
import { useLanguage } from '../context/UIContext';
import { motion } from 'motion/react';
import { ShieldCheck, Truck, Hospital, UserCog, ChevronRight, Lock } from 'lucide-react';

interface LoginPagesProps {
  type: 'driver' | 'hospital' | 'admin';
}

export default function LoginPages({ type }: LoginPagesProps) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { hospitals, ambulances } = useSimulation();
  const { t } = useLanguage();

  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const config = {
    driver: {
      icon: Truck,
      title: 'Rescuer Portal',
      accent: 'emerald',
      mockId: 'driver1',
      mockPass: 'driver123',
      redirect: '/driver'
    },
    hospital: {
      icon: Hospital,
      title: 'Facility Portal',
      accent: 'red',
      mockId: 'hospital1',
      mockPass: 'hospital123',
      redirect: '/hospital'
    },
    admin: {
      icon: UserCog,
      title: 'System Access',
      accent: 'blue',
      mockId: 'admin',
      mockPass: 'admin123',
      redirect: '/admin'
    }
  }[type];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (id === config.mockId && password === config.mockPass) {
      if (type === 'driver') {
        const amb = ambulances[0];
        login('Driver', 'D001', amb.driverName, amb.id);
      } else if (type === 'hospital') {
        const hosp = hospitals[0];
        login('Hospital', 'H001', hosp.name, hosp.id);
      } else {
        login('Admin', 'A001', 'System Administrator');
      }
      navigate(config.redirect);
    } else {
      setError('Vector mismatch. Security credentials rejected.');
    }
  };

  const accentColor = config.accent === 'emerald' ? 'text-emerald-500' : config.accent === 'red' ? 'text-red-500' : 'text-blue-500';
  const accentBg = config.accent === 'emerald' ? 'bg-emerald-500' : config.accent === 'red' ? 'bg-red-500' : 'bg-blue-500';
  const accentBorder = config.accent === 'emerald' ? 'border-emerald-500/20' : config.accent === 'red' ? 'border-red-500/20' : 'border-blue-500/20';
  const accentGlow = config.accent === 'emerald' ? 'emerald-glow' : '';

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center px-4 relative overflow-hidden transition-colors duration-300">
      {/* Background Decor */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-panel rounded-[2.5rem] overflow-hidden shadow-2xl p-px">
          <div className="bg-[var(--bg-secondary)] rounded-[2.5rem] overflow-hidden">
            <div className="p-10 text-center relative border-b border-[var(--border-color)] bg-gradient-to-b from-[var(--text-primary)]/[0.02] to-transparent">
              <div className={`w-20 h-20 mx-auto mb-6 rounded-3xl ${accentBg} flex items-center justify-center text-white ${accentGlow} shadow-2xl`}>
                <config.icon className="w-10 h-10" />
              </div>
              <h1 className="text-2xl font-black text-[var(--text-primary)] tracking-tight uppercase leading-none">{config.title}</h1>
              <p className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-[0.3em] mt-3">{t('auth.personnelAuth')}</p>
            </div>

            <form onSubmit={handleLogin} className="p-10 space-y-8">
              <div className="p-5 bg-[var(--hover-bg)] rounded-2xl border border-[var(--border-color)] text-[10px] text-[var(--text-muted)] flex items-start gap-4 shadow-inner">
                 <Lock className={`w-4 h-4 shrink-0 mt-0.5 ${accentColor}`} />
                 <div className="font-black uppercase tracking-widest leading-loose">
                    <p className="text-[var(--text-muted)] mb-1">{t('auth.accessProtocol')}:</p>
                    <p>ID: <span className="text-[var(--text-primary)] ml-2">{config.mockId}</span></p>
                    <p>KEY: <span className="text-[var(--text-primary)] ml-2">{config.mockPass}</span></p>
                 </div>
              </div>

              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] ml-1">{t('auth.terminalId')}</label>
                    <input
                      required
                      type="text"
                      placeholder="ENTER ID..."
                      className="w-full px-5 py-4 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl text-[var(--text-primary)] font-mono text-xs focus:border-emerald-500/40 outline-none transition-all placeholder:text-[var(--text-muted)]"
                      value={id}
                      onChange={e => setId(e.target.value)}
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] ml-1">{t('auth.vectorCode')}</label>
                    <input
                      required
                      type="password"
                      placeholder="ENTER KEY..."
                      className="w-full px-5 py-4 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl text-[var(--text-primary)] font-mono text-xs focus:border-emerald-500/40 outline-none transition-all placeholder:text-[var(--text-muted)]"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                 </div>
              </div>

              {error && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500 text-[10px] font-black uppercase tracking-widest text-center py-2 bg-red-500/5 rounded-lg border border-red-500/10"
                >
                  {t('auth.error')}
                </motion.p>
              )}

              <button
                type="submit"
                className={`w-full py-5 ${accentBg} text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-2xl ${accentGlow}`}
              >
                {t('auth.accessSystem')}
                <ChevronRight className="w-5 h-5" />
              </button>

              <div className="text-center">
                 <button 
                  type="button" 
                  onClick={() => navigate('/')} 
                  className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-widest hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors"
                 >
                    {t('auth.abort')}
                 </button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
