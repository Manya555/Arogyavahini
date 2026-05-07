/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useAuth } from '../context/AuthContext';
import { useSimulation, EmergencyStatus, Emergency } from '../context/SimulationContext';
import { motion, AnimatePresence } from 'motion/react';
import { Hospital, Bed, Users, Activity, Clock, ChevronRight, CheckCircle2, TrendingUp, Filter, MapPin, Truck, History, X, ShieldAlert, Pill, Calendar } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useLanguage } from '../context/UIContext';

interface MedicalHistoryRecord {
  pastAdmissions: { date: string, reason: string, facility: string }[];
  treatments: { date: string, type: string, notes: string }[];
  conditions: string[];
}

const MOCK_HISTORIES: Record<string, MedicalHistoryRecord> = {
  default: {
    pastAdmissions: [
      { date: '2025-11-12', reason: 'Abdominal Distress', facility: 'City General' },
      { date: '2024-05-20', reason: 'Routine Checkup', facility: 'St. Marys' }
    ],
    treatments: [
      { date: '2025-11-13', type: 'Endoscopy', notes: 'Negative for ulcers.' }
    ],
    conditions: ['Hypertension', 'Type 2 Diabetes']
  },
  'John Doe': {
    pastAdmissions: [
      { date: '2025-08-15', reason: 'Acute Tachycardia', facility: 'Apollo Health' },
      { date: '2023-12-04', reason: 'Fractured Radial Node', facility: 'Bgs Gleneagles' }
    ],
    treatments: [
      { date: '2025-08-16', type: 'Beta-Blocker Admin', notes: 'Reduced heart rate to stable 72bpm.' },
      { date: '2023-12-05', type: 'Orthopedic Reset', notes: 'Full recovery achieved.' }
    ],
    conditions: ['Exercise-induced asthma', 'Cardiac arrhythmia']
  }
};

export default function HospitalDashboard() {
  const { user } = useAuth();
  const { emergencies, ambulances, hospitals, updateHospitalBeds } = useSimulation();
  const { t } = useLanguage();
  const [selectedPatient, setSelectedPatient] = useState<Emergency | null>(null);

  const medicalHistory = useMemo(() => {
    if (!selectedPatient) return null;
    return MOCK_HISTORIES[selectedPatient.patientName] || MOCK_HISTORIES.default;
  }, [selectedPatient]);

  const hospital = hospitals.find(h => h.id === user?.targetId);
  
  const incomingEmergencies = useMemo(() => {
    return emergencies.filter(e => e.hospitalId === hospital?.id && e.status !== EmergencyStatus.COMPLETED);
  }, [emergencies, hospital]);

  const stats = useMemo(() => {
    return {
      active: incomingEmergencies.length,
      critical: incomingEmergencies.filter(e => e.severity === 'Critical').length,
      enRoute: incomingEmergencies.filter(e => e.status === EmergencyStatus.EN_ROUTE_HOSPITAL).length,
    };
  }, [incomingEmergencies]);

  if (!hospital) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 min-h-screen">
      {/* Header & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
         <div className="md:col-span-6 glass-panel rounded-[2rem] p-8 flex items-center gap-8 shadow-2xl relative overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border-color)]">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
               <Hospital className="w-48 h-48" />
            </div>
            <div className="p-6 bg-emerald-600 rounded-2xl text-white shadow-2xl shadow-emerald-500/20 relative z-10 border border-emerald-400/30">
               <Hospital className="w-12 h-12" />
            </div>
            <div className="relative z-10">
               <h1 className="text-3xl font-black text-[var(--text-primary)] tracking-tight uppercase leading-none">{hospital.name}</h1>
               <div className="flex gap-4 mt-3">
            <div className="flex items-center gap-2 text-[var(--text-muted)]">
                     <MapPin className="w-4 h-4" />
                     <span className="text-[10px] font-black uppercase tracking-widest">BENGALURU CENTRAL</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-500 font-black bg-emerald-500/10 px-3 py-1 rounded border border-emerald-500/20">
                     <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                     <span className="text-[10px] uppercase tracking-widest leading-none pt-0.5">SYSCAP CONNECTED</span>
                  </div>
               </div>
            </div>
         </div>

         <div className="md:col-span-3 glass-panel rounded-[2rem] p-6 shadow-xl group bg-[var(--bg-secondary)] border border-[var(--border-color)]">
            <div className="flex justify-between items-start mb-6">
               <div>
                  <p className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-widest">{t('hospital.icuCap')}</p>
                  <p className="text-4xl font-mono font-black text-[var(--text-primary)] mt-1 group-hover:text-emerald-600 transition-colors uppercase">{hospital.icuBeds}</p>
               </div>
               <Bed className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="flex gap-2">
               <button onClick={() => updateHospitalBeds(hospital.id, 'icu', Math.max(0, hospital.icuBeds - 1))} className="flex-1 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg font-black text-[10px] hover:bg-red-600/20 text-red-500 transition-all uppercase tracking-widest">-</button>
               <button onClick={() => updateHospitalBeds(hospital.id, 'icu', hospital.icuBeds + 1)} className="flex-1 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg font-black text-[10px] hover:bg-emerald-600/20 text-emerald-600 transition-all uppercase tracking-widest">+</button>
            </div>
         </div>

         <div className="md:col-span-3 glass-panel rounded-[2rem] p-6 shadow-xl group bg-[var(--bg-secondary)] border border-[var(--border-color)]">
            <div className="flex justify-between items-start mb-6">
               <div>
                  <p className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-widest">{t('hospital.generalCap')}</p>
                  <p className="text-4xl font-mono font-black text-[var(--text-primary)] mt-1 group-hover:text-emerald-600 transition-colors uppercase">{hospital.generalBeds}</p>
               </div>
               <Users className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="flex gap-2">
               <button onClick={() => updateHospitalBeds(hospital.id, 'general', Math.max(0, hospital.generalBeds - 1))} className="flex-1 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg font-black text-[10px] hover:bg-red-600/20 text-red-500 transition-all uppercase tracking-widest">-</button>
               <button onClick={() => updateHospitalBeds(hospital.id, 'general', hospital.generalBeds + 1)} className="flex-1 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg font-black text-[10px] hover:bg-emerald-600/20 text-emerald-600 transition-all uppercase tracking-widest">+</button>
            </div>
         </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         {/* Live Emergency Queue */}
         <div className="lg:col-span-8 space-y-8">
            <div className="flex items-center justify-between">
               <h2 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-[0.2em] flex items-center gap-3">
                  {t('hospital.dispatchStream')}
                  <span className="px-3 py-1 bg-red-600 text-white rounded text-[10px] font-black animate-pulse uppercase tracking-widest">{t('hospital.criticalFilter')}</span>
               </h2>
               <div className="flex items-center gap-2">
                  <button className="p-3 bg-[var(--hover-bg)] border border-[var(--border-color)] rounded-xl text-[var(--text-muted)] hover:text-emerald-600 dark:hover:text-emerald-500 transition-all shadow-sm"><Filter className="w-5 h-5" /></button>
               </div>
            </div>

            <div className="space-y-4">
               <AnimatePresence mode="popLayout">
                  {incomingEmergencies.length === 0 ? (
                     <div className="bg-[var(--bg-secondary)] rounded-[2rem] p-24 text-center border-2 border-dashed border-[var(--border-color)] shadow-inner">
                        <CheckCircle2 className="w-20 h-20 mx-auto mb-6 opacity-10 text-emerald-600" />
                        <p className="text-[var(--text-primary)] font-black uppercase tracking-widest text-xs">{t('hospital.queueEmpty')}</p>
                        <p className="text-[var(--text-muted)] text-[10px] uppercase font-bold mt-2">{t('hospital.monitoring')}</p>
                     </div>
                  ) : (
                     incomingEmergencies.sort((a, b) => b.updatedAt - a.updatedAt).map((e) => {
                        const amb = ambulances.find(a => a.id === e.ambulanceId);
                        const isEnRoute = e.status === EmergencyStatus.EN_ROUTE_HOSPITAL;
                        
                        return (
                           <motion.div
                               key={e.id}
                               layout
                               initial={{ opacity: 0, x: -20 }}
                               animate={{ opacity: 1, x: 0 }}
                               exit={{ opacity: 0, scale: 0.95 }}
                               className={`glass-panel p-px rounded-[2rem] overflow-hidden group transition-all duration-500 border border-[var(--border-color)] bg-[var(--bg-secondary)] shadow-xl ${
                                  e.severity === 'Critical' ? 'hover:border-red-500/50 hover:shadow-red-500/10' : 'hover:border-emerald-500/50 hover:shadow-emerald-500/10'
                               }`}
                           >
                              <div className="p-8 rounded-[2rem] h-full">
                                 <div className="flex items-start justify-between mb-8">
                                    <div className="flex items-center gap-6">
                                       <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all ${
                                          e.severity === 'Critical' ? 'bg-red-600/10 text-red-500 border-red-500/20 shadow-lg shadow-red-500/10' : 'bg-emerald-600/10 text-emerald-500 border-emerald-500/20 shadow-lg shadow-emerald-500/10'
                                       } group-hover:scale-110`}>
                                          <Activity className="w-6 h-6" />
                                       </div>
                                       <div>
                                          <h3 className="text-xl font-black text-[var(--text-primary)] tracking-tight uppercase leading-none">{e.patientName}</h3>
                                          <div className="flex items-center gap-6 mt-3 text-[var(--text-muted)] text-[10px] font-black uppercase tracking-widest">
                                             <span className="flex items-center gap-2"><Activity className="w-3.5 h-3.5 text-emerald-600" /> {e.emergencyType}</span>
                                             <span className={`font-black ${e.severity === 'Critical' ? 'text-red-500' : 'text-amber-500'}`}>Gradient: {e.severity}</span>
                                          </div>
                                       </div>
                                    </div>
                                    <div className="text-right">
                                       <p className={`text-[10px] font-black uppercase mb-2 tracking-widest ${isEnRoute ? 'text-emerald-600' : 'text-[var(--text-muted)]'}`}>
                                          {e.status.replace('_', ' ')}
                                       </p>
                                       {isEnRoute ? (
                                          <div className="flex items-center gap-2 text-emerald-600 font-mono font-bold bg-emerald-500/10 px-3 py-1 rounded border border-emerald-500/20">
                                             <Clock className="w-4 h-4" />
                                             <span className="text-xs pt-0.5">{Math.floor(e.eta / 60)}:{(e.eta % 60).toString().padStart(2, '0')} REMAINING</span>
                                          </div>
                                       ) : (
                                          <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">SYNC PENDING</span>
                                       )}
                                    </div>
                                 </div>

                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[var(--hover-bg)] border border-[var(--border-color)] rounded-2xl p-6 mb-8">
                                    <div>
                                       <p className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2">Deployed Unit</p>
                                       <div className="flex items-center gap-3">
                                          <Truck className="w-4 h-4 text-emerald-600" />
                                          <span className="text-[11px] font-black text-[var(--text-primary)] uppercase tracking-tight">{amb?.name || 'SYNC_ERROR'} <span className="text-[var(--text-muted)] font-mono ml-2">[{amb?.plateNumber}]</span></span>
                                       </div>
                                    </div>
                                    <div>
                                       <p className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2">Critical Notes</p>
                                       <p className="text-[11px] text-[var(--text-muted)] truncate italic font-medium">"{e.symptoms || "No additional telemetry provided."}"</p>
                                    </div>
                                 </div>

                                 <div className="flex gap-3">
                                    <button className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3 emerald-glow">
                                       {t('hospital.traumaVector')}
                                       <ChevronRight className="w-4 h-4" />
                                    </button>
                                    <button 
                                       onClick={() => setSelectedPatient(e)}
                                       className="px-6 py-4 bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center gap-2 group"
                                     >
                                       <History className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                                       {t('hospital.viewHistory')}
                                     </button>
                                 </div>
                              </div>
                           </motion.div>
                        );
                     })
                  )}
               </AnimatePresence>
            </div>
         </div>

         {/* Sidebar Cards */}
         <div className="lg:col-span-4 space-y-8">
            <div className="p-8 bg-[var(--bg-secondary)] rounded-[2rem] border border-[var(--border-color)] overflow-hidden relative group shadow-xl">
               <div className="relative z-10">
                  <h3 className="text-xs font-black text-[var(--text-muted)] uppercase tracking-[0.2em] mb-10 flex justify-between items-center">
                     {t('hospital.activityMatrix')}
                     <TrendingUp className="w-5 h-5 text-emerald-600 animate-pulse" />
                  </h3>
                  <div className="space-y-8">
                     <div className="flex justify-between items-end group/item">
                        <p className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-widest group-hover/item:text-[var(--text-primary)] transition-colors">{t('common.active')}</p>
                        <p className="text-5xl font-mono font-black text-[var(--text-primary)] leading-none tracking-tighter">{stats.active}</p>
                     </div>
                     <div className="flex justify-between items-end border-t border-[var(--border-color)] pt-6 group/item">
                        <p className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-widest group-hover/item:text-[var(--text-primary)] transition-colors">High Criticality</p>
                        <p className="text-5xl font-mono font-black text-red-600 leading-none tracking-tighter">{stats.critical}</p>
                     </div>
                     <div className="flex justify-between items-end border-t border-[var(--border-color)] pt-6 group/item">
                        <p className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-widest group-hover/item:text-[var(--text-primary)] transition-colors">Incoming ETA</p>
                        <p className="text-5xl font-mono font-black text-emerald-600 leading-none tracking-tighter">{stats.enRoute}</p>
                     </div>
                  </div>
               </div>
               <Activity className="absolute -bottom-12 -right-12 w-64 h-64 opacity-[0.02] text-[var(--text-primary)] group-hover:opacity-[0.05] transition-opacity duration-700" />
            </div>

            <div className="glass-panel rounded-[2rem] p-8 bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-xl">
               <h3 className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] px-1 mb-8">Resource Readiness</h3>
               <div className="space-y-3">
                  {[
                    { label: 'Trauma Unit', status: 'READY', color: 'emerald' },
                    { label: 'Radiology Lab', status: 'READY', color: 'emerald' },
                    { label: 'Cardiology Node', status: 'ON CALL', color: 'amber' },
                    { label: 'Surgery Block', status: 'BUSY', color: 'red' },
                  ].map((res, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-[var(--hover-bg)] hover:bg-[var(--card-bg)] border border-[var(--border-color)] transition-all cursor-pointer group">
                       <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest group-hover:text-[var(--text-primary)] transition-colors">{res.label}</span>
                       <span className={`text-[9px] font-black px-2 py-1 rounded bg-${res.color}-500/10 text-${res.color}-600 border border-${res.color}-500/20 shadow-sm`}>{res.status}</span>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </div>

      {/* Medical History Modal */}
      <AnimatePresence>
         {selectedPatient && medicalHistory && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
               <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedPatient(null)}
                  className="absolute inset-0 bg-black/45 backdrop-blur-sm"
               />
               <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="relative w-full max-w-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[3rem] shadow-2xl overflow-hidden"
               >
                  <div className="p-10">
                     <div className="flex justify-between items-start mb-12">
                        <div className="flex items-center gap-6">
                           <div className="w-16 h-16 bg-blue-600/10 text-blue-500 rounded-2xl flex items-center justify-center border border-blue-500/20">
                              <History className="w-8 h-8" />
                           </div>
                           <div>
                              <p className="text-[10px] text-blue-500 font-black uppercase tracking-[0.3em] mb-2">{t('hospital.medicalHistory')}</p>
                              <h2 className="text-3xl font-black text-[var(--text-primary)] uppercase tracking-tight italic">{selectedPatient.patientName}</h2>
                           </div>
                        </div>
                        <button 
                           onClick={() => setSelectedPatient(null)}
                           className="p-3 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl hover:bg-red-600 hover:text-white transition-all text-[var(--text-muted)]"
                        >
                           <X className="w-5 h-5" />
                        </button>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Past Admissions */}
                        <div className="space-y-6">
                           <h3 className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest flex items-center gap-3">
                              <Calendar className="w-4 h-4 text-blue-500" />
                              {t('hospital.pastAdmissions')}
                           </h3>
                           <div className="space-y-4">
                              {medicalHistory.pastAdmissions.map((adm, i) => (
                                 <div key={i} className="p-4 bg-[var(--hover-bg)] border border-[var(--border-color)] rounded-2xl">
                                    <p className="text-[9px] font-mono font-bold text-blue-500 uppercase tracking-widest mb-1">{adm.date} • {adm.facility}</p>
                                    <p className="text-xs font-black text-[var(--text-primary)] uppercase leading-tight">{adm.reason}</p>
                                 </div>
                              ))}
                           </div>
                        </div>

                        {/* Treatments & Conditions */}
                        <div className="space-y-8">
                           <div className="space-y-6">
                              <h3 className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest flex items-center gap-3">
                                 <Pill className="w-4 h-4 text-emerald-500" />
                                 {t('hospital.treatments')}
                              </h3>
                              <div className="space-y-4">
                                 {medicalHistory.treatments.map((tr, i) => (
                                    <div key={i} className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
                                       <p className="text-[9px] font-mono font-bold text-emerald-600 uppercase tracking-widest mb-1">{tr.date} • {tr.type}</p>
                                       <p className="text-xs text-[var(--text-muted)] italic">"{tr.notes}"</p>
                                    </div>
                                 ))}
                              </div>
                           </div>

                           <div className="space-y-6 pt-6 border-t border-[var(--border-color)]">
                              <h3 className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest flex items-center gap-3">
                                 <ShieldAlert className="w-4 h-4 text-red-500" />
                                 {t('hospital.conditions')}
                              </h3>
                              <div className="flex flex-wrap gap-2">
                                 {medicalHistory.conditions.map((cond, i) => (
                                    <span key={i} className="px-3 py-1 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg text-[9px] font-black uppercase tracking-widest">
                                       {cond}
                                    </span>
                                 ))}
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="mt-12 pt-8 border-t border-[var(--border-color)] text-center">
                        <p className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-[0.5em]">End of Historical Telemetry Node Data</p>
                     </div>
                  </div>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
    </div>
  );
}


// End of file
