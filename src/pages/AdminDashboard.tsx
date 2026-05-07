/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useSimulation, EmergencyStatus } from '../context/SimulationContext';
import { EmergencyMap } from '../components/EmergencyMap';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Truck, 
  Hospital as HospitalIcon, 
  Activity, 
  Filter, 
  AlertCircle, 
  Trash2, 
  BarChart3,
  Server,
  Zap,
  Clock,
  ExternalLink,
  MapPin
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/UIContext';
import { SimulatedGridMap } from '../components/SimulatedGridMap';

export default function AdminDashboard() {
  const { 
    emergencies, 
    ambulances, 
    hospitals, 
    trafficLevel, 
    setTrafficLevel, 
    resetSimulation 
  } = useSimulation();

  const [activeTab, setActiveTab] = useState<'map' | 'fleet' | 'logs'>('map');
  const navigate = useNavigate();
  const { t } = useLanguage();

   const stats = useMemo(() => {
    return {
      active: emergencies.filter(e => e.status !== EmergencyStatus.COMPLETED).length,
      totalToday: emergencies.length,
      ambulanceReady: ambulances.filter(a => a.status === 'Available').length,
      efficiencyIndex: 98.4,
      hospitalBeds: hospitals.reduce((acc, h) => acc + h.icuBeds, 0)
    };
  }, [emergencies, ambulances, hospitals]);

  return (
    <div className="max-w-[1800px] mx-auto px-8 py-10 min-h-screen technical-grid">
      {/* HUD Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-16">
         {[
           { label: 'Real-time Alerts', value: stats.active, icon: AlertCircle, color: 'bg-red-600', trend: '+12%' },
           { label: 'Available Units', value: stats.ambulanceReady, icon: Truck, color: 'bg-emerald-600', trend: 'STABLE' },
           { label: 'ICU Readiness', value: stats.hospitalBeds, icon: HospitalIcon, color: 'bg-blue-600', trend: 'OPTIMAL' },
           { label: 'Success Index', value: `${stats.efficiencyIndex}%`, icon: Zap, color: 'bg-amber-500', trend: 'TARGET' },
           { label: 'Network Load', value: `${trafficLevel === 'Heavy' ? '92' : trafficLevel === 'Medium' ? '64' : '31'}%`, icon: Activity, color: 'bg-purple-600', trend: 'ACTIVE' }
         ].map((stat, i) => (
           <motion.div
             key={i}
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: i * 0.05 }}
            className="glass-panel p-8 rounded-[2.5rem] relative overflow-hidden group hover:scale-[1.02] transition-all"
           >
              <div className="relative z-10">
                 <div className="flex justify-between items-start mb-6">
                    <div className={`p-4 rounded-2xl ${stat.color} text-white shadow-lg shadow-black/20`}>
                       <stat.icon className="w-6 h-6" />
                    </div>
                    <span className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest">{stat.trend}</span>
                 </div>
                 <p className="text-4xl font-black text-[var(--text-primary)] tracking-tighter leading-none italic uppercase mb-2">{stat.value}</p>
                 <p className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-[0.2em]">{stat.label}</p>
              </div>
              <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                 <stat.icon className="w-24 h-24" />
              </div>
           </motion.div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         {/* Command & Control Center */}
         <div className="lg:col-span-3 space-y-10">
            <div className="glass-panel rounded-[2.5rem] p-10 border-red-600/10">
               <h3 className="text-[10px] font-black text-red-600 uppercase tracking-[0.4em] flex items-center gap-4 mb-12 italic">
                  <Server className="w-5 h-5" />
                  Kernel Global Command
               </h3>
               
               <div className="space-y-12">
                  <div className="space-y-6">
                     <label className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1">Traffic Distortion Load</label>
                     <div className="grid grid-cols-1 gap-3">
                        {(['Low', 'Medium', 'Heavy'] as const).map(level => (
                           <button
                             key={level}
                             onClick={() => setTrafficLevel(level)}
                             className={`py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all border italic ${
                                trafficLevel === level
                                  ? 'bg-red-600 text-white border-red-400/70 shadow-[0_0_26px_var(--glow-red)]'
                                  : 'bg-[var(--card-bg)] text-[var(--text-muted)] border-[var(--border-color)] hover:border-red-500/30'
                             }`}
                           >
                              {level} Simulation
                           </button>
                        ))}
                     </div>
                  </div>

                  <div className="pt-10 border-t border-[var(--border-color)] space-y-6">
                     <label className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1">System Health Index</label>
                     <div className="h-2 w-full bg-[var(--hover-bg)] rounded-full overflow-hidden border border-[var(--border-color)]">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500" 
                          animate={{ width: trafficLevel === 'Heavy' ? '92%' : trafficLevel === 'Medium' ? '64%' : '31%' }}
                        />
                     </div>
                     <div className="flex justify-between text-[8px] font-black text-[var(--text-muted)] uppercase tracking-widest">
                        <span>Cluster: Stable</span>
                        <span>Latency: 4ms</span>
                     </div>
                  </div>

                  <div className="pt-10 border-t border-[var(--border-color)]">
                     <button 
                        onClick={resetSimulation}
                        className="w-full py-5 bg-[var(--card-bg-solid)] border border-[var(--border-color)] rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-red-600 hover:text-white transition-all text-red-600 italic"
                     >
                        <Trash2 className="w-5 h-5" /> Purge Global Cluster
                     </button>
                  </div>
               </div>
            </div>
         </div>

         {/* Flight Operations Deck */}
         <div className="lg:col-span-9 space-y-10">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-4 bg-[var(--bg-secondary)] p-2 rounded-[1.5rem] border border-[var(--border-color)] shadow-xl">
                  {[
                    { id: 'map', label: 'Global Command Map', icon: MapPin },
                    { id: 'fleet', label: 'Fleet Health Deck', icon: Truck },
                    { id: 'logs', label: 'Incident Node Logs', icon: Server }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-4 px-8 py-4 rounded-[1.2rem] font-black text-[10px] uppercase tracking-widest transition-all italic ${
                        activeTab === tab.id ? 'bg-red-600 text-white shadow-xl shadow-red-900/30' : 'text-[var(--text-muted)] hover:text-red-600'
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  ))}
               </div>
            </div>

            <AnimatePresence mode="wait">
               {activeTab === 'map' && (
                  <motion.div
                    key="map"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="relative aspect-video rounded-[3rem] overflow-hidden border border-[var(--border-color)] bg-[var(--card-bg-solid)] dark:bg-black shadow-2xl"
                  >
                     <SimulatedGridMap />
                  </motion.div>
               )}

               {activeTab === 'fleet' && (
                  <motion.div
                    key="fleet"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                   >
                     {ambulances.map(amb => {
                        const currentEmergency = emergencies.find(e => e.id === amb.assignedEmergencyId);
                        return (
                           <div key={amb.id} className="glass-panel p-8 rounded-[2.5rem] group hover:border-emerald-500/30 transition-all bg-[var(--hud-bg)]">
                              <div className="flex items-start justify-between mb-8">
                                 <div className="flex items-center gap-5">
                                    <div className="w-16 h-16 bg-[var(--hover-bg)] rounded-2xl flex items-center justify-center text-[var(--text-muted)] group-hover:text-emerald-600 dark:group-hover:text-emerald-500 transition-colors border border-[var(--border-color)]">
                                       <Truck className="w-8 h-8" />
                                    </div>
                                    <div>
                                       <h4 className="font-black text-[var(--text-primary)] text-xl tracking-tighter italic uppercase leading-none">{amb.name}</h4>
                                       <p className="text-[10px] text-emerald-500 font-mono font-bold uppercase mt-2 tracking-widest">{amb.plateNumber}</p>
                                    </div>
                                 </div>
                                 <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black tracking-[0.2em] uppercase italic ${
                                    amb.status === 'Available' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                                 }`}>
                                    {amb.status}
                                 </span>
                              </div>
                              
                              <div className="p-6 bg-[var(--card-bg-solid)] dark:bg-slate-900 rounded-3xl border border-[var(--border-color)] space-y-6 italic">
                                 {currentEmergency ? (
                                    <>
                                       <div className="flex justify-between items-center">
                                          <span className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest">Active Node Intercept</span>
                                          <span className="text-[9px] text-red-500 font-black animate-pulse uppercase tracking-widest">{currentEmergency.status.replace('_', ' ')}</span>
                                       </div>
                                       <p className="text-sm font-black text-[var(--text-primary)] dark:text-white uppercase">{currentEmergency.patientName} <span className="mx-2 text-[var(--text-muted)]">/</span> <span className="text-red-600">{currentEmergency.severity}</span></p>
                                       <div className="flex items-center gap-3 text-[10px] text-emerald-500 font-black uppercase tracking-widest">
                                          <Clock className="w-4 h-4" />
                                          SYNC ETA: {Math.floor(currentEmergency.eta / 60)}m
                                       </div>
                                    </>
                                 ) : (
                                    <div className="py-2 text-center text-slate-700 text-[10px] font-black uppercase tracking-widest">
                                       No Current Vector Assignment
                                    </div>
                                 )}
                              </div>
                           </div>
                        );
                     })}
                  </motion.div>
               )}

               {activeTab === 'logs' && (
                  <motion.div
                    key="logs"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="glass-panel rounded-[3rem] overflow-hidden shadow-2xl bg-[var(--hud-bg)]"
                  >
                     <div className="overflow-x-auto">
                        <table className="w-full text-left">
                           <thead>
                              <tr className="bg-[var(--hover-bg)] border-b border-[var(--border-color)]">
                                 <th className="px-12 py-8 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.4em]">Protocol ID</th>
                                 <th className="px-12 py-8 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.4em]">Node Description</th>
                                 <th className="px-12 py-8 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.4em]">State Cluster</th>
                                 <th className="px-12 py-8 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.4em] text-right">Telemetry Sync</th>
                                 <th className="px-12 py-8"></th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-white/5">
                              {emergencies.map(e => (
                                 <tr key={e.id} className="hover:bg-red-600/5 transition-all group border-none">
                                    <td className="px-12 py-8 text-sm font-mono font-bold text-red-500 italic tracking-tighter">NODE_INC_{e.id.split('-')[0].toUpperCase()}</td>
                                    <td className="px-12 py-8">
                                       <p className="text-lg font-black text-[var(--text-primary)] dark:text-white italic uppercase leading-none mb-2 tracking-tighter">{e.patientName}</p>
                                       <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest">{e.emergencyType} • {e.severity}</p>
                                    </td>
                                    <td className="px-12 py-8">
                                       <div className="flex items-center gap-4">
                                          <div className={`w-2 h-2 rounded-full ${e.status === EmergencyStatus.COMPLETED ? 'bg-emerald-500' : 'bg-red-500 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.6)]'}`} />
                                          <span className={`text-[11px] font-black uppercase tracking-widest italic ${e.status === EmergencyStatus.COMPLETED ? 'text-emerald-500' : 'text-slate-300'}`}>
                                             {e.status.replace('_', ' ')}
                                          </span>
                                       </div>
                                    </td>
                                    <td className="px-12 py-8 text-right">
                                       <p className="text-sm font-mono font-bold text-[var(--text-primary)] dark:text-white mb-1 uppercase italic">{new Date(e.createdAt).toLocaleTimeString()}</p>
                                       <p className="text-[9px] text-[var(--text-muted)] font-black uppercase tracking-[0.2em]">SYNC COMPLETE</p>
                                    </td>
                                    <td className="px-12 py-8 text-right">
                                       <button onClick={() => navigate(`/tracking/${e.id}`)} className="p-4 bg-[var(--card-bg-solid)] dark:bg-slate-900 border border-[var(--border-color)] rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-xl">
                                          <ExternalLink className="w-5 h-5" />
                                       </button>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </motion.div>
               )}
            </AnimatePresence>
         </div>
      </div>
    </div>
  );
}

