/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSimulation, EmergencyStatus, Coordinates } from '../context/SimulationContext';
import { useLanguage } from '../context/UIContext';
import { EmergencyMap } from '../components/EmergencyMap';
import { motion } from 'motion/react';
import { Activity, Clock, MapPin, Truck, Hospital, User, Phone, CheckCircle2, ChevronRight, AlertTriangle } from 'lucide-react';

const STATUS_ORDER = [
  EmergencyStatus.SUBMITTED,
  EmergencyStatus.DISPATCHING,
  EmergencyStatus.ASSIGNED,
  EmergencyStatus.EN_ROUTE_PICKUP,
  EmergencyStatus.ARRIVED_PICKUP,
  EmergencyStatus.PICKED_UP,
  EmergencyStatus.EN_ROUTE_HOSPITAL,
  EmergencyStatus.ARRIVED_HOSPITAL,
  EmergencyStatus.ADMITTED,
  EmergencyStatus.COMPLETED,
];

export default function TrackingPage() {
  const { id } = useParams();
  const { emergencies, ambulances, hospitals } = useSimulation();
  const { t } = useLanguage();

  const emergency = emergencies.find(e => e.id === id);
  const ambulance = ambulances.find(a => a.id === emergency?.ambulanceId);
  const hospital = hospitals.find(h => h.id === emergency?.hospitalId);

  const currentStatusIndex = useMemo(() => {
    if (!emergency) return -1;
    return STATUS_ORDER.indexOf(emergency.status);
  }, [emergency]);

  if (!emergency) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
        <div className="p-6 bg-red-500/10 rounded-full mb-8">
           <AlertTriangle className="w-16 h-16 text-red-500" />
        </div>
        <h2 className="text-3xl font-black text-[var(--text-primary)] uppercase tracking-tighter">{t('tracking.notFound')}</h2>
        <p className="text-[var(--text-muted)] mt-4 max-w-sm mx-auto font-medium">{t('tracking.notFoundDesc')}</p>
        <Link to="/" className="mt-12 px-8 py-4 bg-[var(--card-bg-solid)] border border-[var(--border-color)] text-[var(--text-primary)] rounded font-black text-xs uppercase tracking-widest hover:bg-[var(--hover-bg)] transition-all">
          {t('tracking.back')}
        </Link>
      </div>
    );
  }

  const markers = [
    { id: 'patient', coords: emergency.pickupCoords, type: 'patient' as const, label: 'Patient Location' },
  ] as Array<{ id: string, coords: Coordinates, type: 'ambulance' | 'hospital' | 'patient', label: string }>;

  if (ambulance) markers.push({ id: 'amb', coords: ambulance.coords, type: 'ambulance', label: 'Ambulance Unit' });
  if (hospital) markers.push({ id: 'hosp', coords: hospital.coords, type: 'hospital', label: hospital.name });

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pb-12 transition-colors duration-300 technical-grid">
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Flight Deck */}
          <div className="lg:col-span-8 space-y-6">
             {/* Satellite Navigation Feed */}
             <div className="relative aspect-video rounded-[3rem] overflow-hidden border border-[var(--border-color)] bg-[var(--card-bg-solid)] dark:bg-black shadow-2xl group">
                <div className="absolute inset-0 z-10 pointer-events-none border-[12px] border-black/20 dark:border-black/40 backdrop-blur-[2px]" />
                
                {/* HUD Overlays */}
                <div className="absolute top-10 left-10 z-20 flex flex-col gap-4">
                   <div className="glass-panel px-6 py-4 rounded-2xl flex flex-col gap-1">
                      <span className="text-[10px] text-red-500 font-black uppercase tracking-[0.3em]">Golden Hour Window</span>
                      <div className="text-4xl font-mono text-[var(--text-primary)] dark:text-white font-bold italic">
                         <span className="text-red-600 animate-pulse">42</span>:18
                      </div>
                   </div>
                   <div className="flex items-center gap-3 glass-panel px-4 py-2 rounded-xl">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                      <span className="text-[9px] font-mono text-emerald-500 font-bold uppercase tracking-widest leading-none">SAT_LINK: ESTABLISHED</span>
                   </div>
                </div>

                <div className="absolute bottom-10 left-10 z-20">
                   <div className="glass-panel px-6 py-4 rounded-2xl">
                      <p className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-widest mb-2">Current Coordinates</p>
                      <div className="flex gap-6 font-mono text-sm text-[var(--text-primary)] font-bold italic">
                         <span>LAT: 12.9716</span>
                         <span className="text-[var(--text-muted)]">|</span>
                         <span>LNG: 77.5946</span>
                      </div>
                   </div>
                </div>

                <div className="w-full h-full grayscale contrast-[1.1] brightness-[0.8] saturate-[1.2]">
                   <EmergencyMap
                     center={ambulance?.coords || emergency.pickupCoords}
                     markers={markers}
                     route={
                       emergency.status === EmergencyStatus.EN_ROUTE_PICKUP && ambulance 
                         ? [ambulance.coords, emergency.pickupCoords]
                         : emergency.status === EmergencyStatus.EN_ROUTE_HOSPITAL && ambulance && hospital
                         ? [ambulance.coords, hospital.coords]
                         : []
                     }
                   />
                </div>
                
                {/* Scanline Effect */}
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,3px_100%] opacity-10 dark:opacity-20 pointer-events-none" />
             </div>

             {/* Live Chronology */}
             <div className="glass-panel rounded-[2.5rem] p-10 border-emerald-500/10 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                   <Clock className="w-48 h-48" />
                </div>
                <h2 className="text-xs font-black text-[var(--text-muted)] uppercase tracking-[0.4em] mb-12">Mission Chronology</h2>
                <div className="flex justify-between items-start relative max-w-4xl mx-auto">
                   <div className="absolute top-3 left-0 right-0 h-px bg-[var(--border-color)] z-0" />
                   {STATUS_ORDER.filter((_, i) => i % 2 === 0).map((status, i) => {
                      const idx = STATUS_ORDER.indexOf(status);
                      const isActive = idx <= currentStatusIndex;
                      const isCurrent = idx === currentStatusIndex;
                      
                      return (
                         <div key={status} className="flex flex-col items-center relative z-10 w-24">
                            <div className={`w-6 h-6 rounded-full border-4 transition-all duration-500 mb-4 ${
                               isActive ? 'bg-red-600 border-red-600/20 shadow-[0_0_20px_var(--glow-red)]' : 'bg-[var(--hover-bg)] border-[var(--border-color)]'
                            } ${isCurrent ? 'scale-150 animate-pulse' : ''}`} />
                            <span className={`text-[9px] font-black uppercase text-center tracking-widest leading-none ${
                               isCurrent ? 'text-red-600' : isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'
                            }`}>
                               {status.replace('_', ' ')}
                            </span>
                         </div>
                      );
                   })}
                </div>
             </div>
          </div>

          {/* Logistics HUD Sidebar */}
          <div className="lg:col-span-4 space-y-6">
             {/* Patient HUD Card */}
             <div className="glass-panel rounded-[2.5rem] p-8 border-red-600/10 overflow-hidden relative group">
                <div className="absolute -right-4 -top-4 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                   <User className="w-32 h-32" />
                </div>
                <div className="relative z-10 space-y-8">
                   <div className="flex justify-between items-start">
                      <div>
                         <p className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-[0.2em] mb-2 leading-none">Subject Identity</p>
                         <p className="text-2xl font-black text-[var(--text-primary)] leading-none italic uppercase tracking-tighter">{emergency.patientName}</p>
                      </div>
                      <div className="px-3 py-1 bg-red-600/10 text-red-600 border border-red-600/20 rounded-lg text-[9px] font-black uppercase tracking-widest">
                         {emergency.severity}
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-[var(--hover-bg)] rounded-2xl border border-[var(--border-color)]">
                         <p className="text-[9px] text-[var(--text-muted)] font-black uppercase tracking-widest mb-1">Vital: BPM</p>
                         <p className="text-xl font-mono font-bold text-red-600 dark:text-red-500">108 <span className="text-[10px] text-[var(--text-muted)]">AVG</span></p>
                      </div>
                      <div className="p-4 bg-[var(--hover-bg)] rounded-2xl border border-[var(--border-color)]">
                         <p className="text-[9px] text-[var(--text-muted)] font-black uppercase tracking-widest mb-1"> Vital: SpO2</p>
                         <p className="text-xl font-mono font-bold text-emerald-600 dark:text-emerald-500">96% <span className="text-[10px] text-[var(--text-muted)]">STB</span></p>
                      </div>
                   </div>

                   <div className="pt-6 border-t border-[var(--border-color)]">
                      <p className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-widest mb-3">Intercept Protocol</p>
                      <div className="bg-[var(--bg-primary)] p-4 rounded-xl text-[11px] font-medium leading-relaxed italic border border-[var(--border-color)] uppercase">
                         {emergency.emergencyType} - TRANSIT OPTIMIZED VIA VECTOR_LINK_4
                      </div>
                   </div>
                </div>
             </div>

             {/* Ambulance Hub */}
             <div className="glass-panel rounded-[2.5rem] p-8 border-emerald-500/10 transition-all hover:border-emerald-500/30">
                <p className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-[0.2em] mb-6">Ambulance Unit Vector</p>
                {ambulance ? (
                   <div className="space-y-6">
                      <div className="flex gap-5 items-center">
                         <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-900/20">
                            <Truck className="w-7 h-7" />
                         </div>
                         <div>
                            <p className="text-lg font-black text-[var(--text-primary)] uppercase italic leading-none">{ambulance.name}</p>
                            <p className="text-[10px] text-emerald-500 font-mono mt-1 font-bold tracking-[0.2em]">{ambulance.plateNumber}</p>
                         </div>
                      </div>
                      <div className="flex gap-4">
                         <button className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all">
                            SYNC RADIO
                         </button>
                         <button className="p-4 glass-panel border-[var(--border-color)] rounded-2xl text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all">
                            <Phone className="w-5 h-5" />
                         </button>
                      </div>
                   </div>
                ) : (
                   <div className="h-28 flex flex-col items-center justify-center border-2 border-dashed border-[var(--border-color)] rounded-2xl">
                      <Activity className="w-8 h-8 text-slate-700 animate-pulse mb-2" />
                      <span className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest">Awaiting Assignment</span>
                   </div>
                )}
             </div>

             {/* Hospital Link */}
             <div className="glass-panel rounded-[2.5rem] p-8 border-blue-500/10">
                <p className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-[0.2em] mb-6">Facility Intercept Status</p>
                {hospital ? (
                   <div className="space-y-6">
                      <div className="flex gap-5 items-center">
                         <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-900/20">
                            <Hospital className="w-7 h-7" />
                         </div>
                         <div>
                            <p className="text-lg font-black text-[var(--text-primary)] uppercase italic leading-none">{hospital.name}</p>
                            <p className="text-[10px] text-blue-500 font-bold mt-1 tracking-widest uppercase">TERTIARY CARE NODE</p>
                         </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                         <div className="p-4 rounded-xl bg-[var(--hover-bg)] border border-[var(--border-color)] text-center">
                            <p className="text-[8px] text-[var(--text-muted)] font-black uppercase tracking-widest mb-1">ICU BEDS</p>
                            <p className="text-xl font-mono font-black text-[var(--text-primary)]">{hospital.icuBeds}</p>
                         </div>
                         <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-center">
                            <p className="text-[8px] text-emerald-500 font-black uppercase tracking-widest mb-1">PROTOCOL</p>
                            <p className="text-lg font-black text-emerald-500 italic">READY</p>
                         </div>
                      </div>
                   </div>
                ) : (
                   <div className="h-28 flex flex-col items-center justify-center border-2 border-dashed border-[var(--border-color)] rounded-2xl">
                      <Activity className="w-8 h-8 text-slate-700 animate-pulse mb-2" />
                      <span className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest">Routing Analysis...</span>
                   </div>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
