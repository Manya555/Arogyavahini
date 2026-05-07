/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useAuth } from '../context/AuthContext';
import { useSimulation, EmergencyStatus } from '../context/SimulationContext';
import { EmergencyMap } from '../components/EmergencyMap';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Activity, Navigation, ChevronRight, Phone, MessageSquare, Truck, Globe, UserCog, ShieldCheck, ArrowUp, ArrowRight, ArrowLeft, RotateCcw, Info } from 'lucide-react';
import { useMemo } from 'react';
import { useLanguage } from '../context/UIContext';

export default function DriverDashboard() {
  const { user } = useAuth();
  const { emergencies, ambulances, hospitals, updateEmergencyStatus } = useSimulation();
  const { t } = useLanguage();

  const ambulance = ambulances.find(a => a.id === user?.targetId);
  const activeEmergency = emergencies.find(e => e.id === ambulance?.assignedEmergencyId && e.status !== EmergencyStatus.COMPLETED);
  const hospital = hospitals.find(h => h.id === activeEmergency?.hospitalId);

  const workflow = useMemo(() => {
    if (!activeEmergency) return null;
    
    const steps = [
      { status: EmergencyStatus.ASSIGNED, label: 'Accept Request', next: EmergencyStatus.EN_ROUTE_PICKUP },
      { status: EmergencyStatus.EN_ROUTE_PICKUP, label: 'Arrived at Location', next: EmergencyStatus.ARRIVED_PICKUP },
      { status: EmergencyStatus.ARRIVED_PICKUP, label: 'Patient Picked Up', next: EmergencyStatus.PICKED_UP },
      { status: EmergencyStatus.PICKED_UP, label: 'En Route to Hospital', next: EmergencyStatus.EN_ROUTE_HOSPITAL },
      { status: EmergencyStatus.EN_ROUTE_HOSPITAL, label: 'Arrived at Hospital', next: EmergencyStatus.ARRIVED_HOSPITAL },
      { status: EmergencyStatus.ARRIVED_HOSPITAL, label: 'Admitted / Handover', next: EmergencyStatus.ADMITTED },
      { status: EmergencyStatus.ADMITTED, label: 'Complete Case', next: EmergencyStatus.COMPLETED },
    ];

    const current = steps.find(s => s.status === activeEmergency.status);
    return current;
  }, [activeEmergency]);

  const handleStatusUpdate = () => {
    if (activeEmergency && workflow) {
      updateEmergencyStatus(activeEmergency.id, workflow.next);
    }
  };

  const maneuvers = useMemo(() => {
    if (!activeEmergency || !ambulance) return [];
    
    const target = activeEmergency.status === EmergencyStatus.EN_ROUTE_PICKUP 
      ? activeEmergency.pickupCoords 
      : (activeEmergency.status === EmergencyStatus.EN_ROUTE_HOSPITAL && hospital) 
        ? hospital.coords 
        : null;

    if (!target) return [];

    const dist = Math.sqrt(Math.pow(ambulance.coords.lat - target.lat, 2) + Math.pow(ambulance.coords.lng - target.lng, 2));
    const distanceValue = dist * 10000; 

    if (distanceValue > 100) {
      return [
        { instruction: 'Continue on Primary Vascular Route', distance: '1.2 km', icon: ArrowUp, color: 'text-emerald-500' },
        { instruction: 'Prepare Left Vector Shift', distance: '2.4 km', icon: ArrowLeft, color: 'text-blue-500' },
        { instruction: 'Optimal Path via Neural Link', distance: '4.8 km', icon: Globe, color: 'text-purple-500' }
      ];
    } else if (distanceValue > 50) {
      return [
        { instruction: 'Turn Left onto Medical Broadway', distance: '450 m', icon: ArrowLeft, color: 'text-blue-500' },
        { instruction: 'Continue Straight for 1.2km', distance: '1.2 km', icon: ArrowUp, color: 'text-emerald-500' },
        { instruction: 'Yield to Emergency Lane', distance: '1.8 km', icon: Info, color: 'text-amber-500' }
      ];
    } else {
       return [
        { instruction: 'Arriving at Destination Node', distance: '150 m', icon: MapPin, color: 'text-red-500' },
        { instruction: 'Final Approach - Slow Speed', distance: '50 m', icon: ArrowUp, color: 'text-emerald-500' },
        { instruction: 'Secure Landing Zone Search', distance: 'Ready', icon: ShieldCheck, color: 'text-emerald-500' }
      ];
    }
  }, [activeEmergency, ambulance, hospital]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-screen">
      {/* Map View */}
      <div className="lg:col-span-8 h-[500px] lg:h-[800px] relative rounded-[2rem] overflow-hidden border border-[var(--border-color)] bg-[var(--bg-secondary)] shadow-2xl">
         <div className="absolute inset-0 grayscale contrast-125 opacity-70">
           <EmergencyMap 
              center={ambulance?.coords} 
              markers={[
                 ...(ambulance ? [{ id: 'amb', coords: ambulance.coords, type: 'ambulance' as const, label: 'My Location' }] : []),
                 ...(activeEmergency ? [{ id: 'patient', coords: activeEmergency.pickupCoords, type: 'patient' as const, label: 'Patient' }] : []),
                 ...(hospital ? [{ id: 'hosp', coords: hospital.coords, type: 'hospital' as const, label: hospital.name }] : [])
              ]}
              route={
                 activeEmergency?.status === EmergencyStatus.EN_ROUTE_PICKUP && ambulance 
                   ? [ambulance.coords, activeEmergency.pickupCoords]
                   : activeEmergency?.status === EmergencyStatus.EN_ROUTE_HOSPITAL && ambulance && hospital
                   ? [ambulance.coords, hospital.coords]
                   : []
              }
           />
         </div>
         
          {/* Floating Nav Instructions */}
          <AnimatePresence>
             {activeEmergency && (
                <div className="absolute inset-0 pointer-events-none z-40 p-6 flex flex-col justify-between">
                   {/* Top HUD */}
                   <motion.div 
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                   >
                      <div className="glass-panel p-6 rounded-3xl flex items-center justify-between shadow-2xl bg-[var(--hud-bg)] border border-[var(--border-color)]">
                         <div className="flex items-center gap-6">
                            <div className="p-4 bg-emerald-600 rounded-2xl text-white shadow-lg shadow-emerald-500/30 animate-pulse">
                               <Navigation className="w-8 h-8" />
                            </div>
                            <div>
                               <p className="text-[10px] text-emerald-500 font-black uppercase tracking-[0.3em] mb-1">{t('driver.navigation')} • AI LINK ACTIVE</p>
                               <p className="font-black text-[var(--text-primary)] dark:text-white text-2xl tracking-tight italic uppercase">
                                  {activeEmergency.status === EmergencyStatus.EN_ROUTE_PICKUP ? t('driver.approaching') : activeEmergency.status === EmergencyStatus.EN_ROUTE_HOSPITAL ? `ROUTING: ${hospital?.name}` : 'AWAITING SEQUENCE'}
                               </p>
                            </div>
                         </div>
                         <div className="text-right">
                            <p className="text-4xl font-mono font-black text-emerald-500 tracking-tighter leading-none mb-2">
                               {activeEmergency.eta > 0 ? `${Math.floor(activeEmergency.eta / 60)}:${(activeEmergency.eta % 60).toString().padStart(2, '0')}` : '--:--'}
                            </p>
                           <p className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-[0.2em]">{t('driver.estimArrival')}</p>
                         </div>
                      </div>
                   </motion.div>

                   {/* Left Maneuver Feed */}
                   <div className="flex flex-col gap-3 w-72">
                      <AnimatePresence mode="popLayout">
                         {maneuvers.map((m, idx) => (
                            <motion.div
                               key={m.instruction}
                               initial={{ opacity: 0, x: -30 }}
                               animate={{ opacity: 1 - (idx * 0.3), x: 0, scale: 1 - (idx * 0.05) }}
                               exit={{ opacity: 0, x: -30 }}
                               transition={{ delay: idx * 0.1 }}
                               className={`glass-panel p-4 rounded-2xl flex items-center gap-4 bg-[var(--hud-bg)] border border-[var(--border-color)] shadow-xl ${idx === 0 ? 'border-l-4 border-l-emerald-500' : ''}`}
                            >
                               <div className={`p-2 rounded-lg bg-white/5 ${m.color}`}>
                                  <m.icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1 overflow-hidden">
                                   <p className="text-[11px] font-black text-[var(--text-primary)] dark:text-white italic uppercase tracking-tight truncate leading-none mb-1">{m.instruction}</p>
                                   <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest">{m.distance}</p>
                                </div>
                                {idx === 0 && (
                                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                )}
                            </motion.div>
                         ))}
                      </AnimatePresence>
                   </div>
                </div>
             )}
          </AnimatePresence>
      </div>

      {/* Control Panel */}
      <div className="lg:col-span-4 space-y-6">
         {/* Driver Profile */}
         <div className="glass-panel rounded-[2rem] p-6 bg-gradient-to-br from-emerald-600/10 to-transparent border border-emerald-500/20 shadow-xl">
            <div className="flex items-center gap-5">
               <div className="w-16 h-16 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/40 transform -rotate-3">
                  <UserCog className="w-8 h-8" />
               </div>
               <div>
                  <p className="text-[10px] text-emerald-500 font-black uppercase tracking-[0.2em] mb-1">{t('driver.pilotIdentity')}</p>
                  <h3 className="font-black text-[var(--text-primary)] text-xl tracking-tight leading-none mb-2">{user?.name}</h3>
                  <div className="flex items-center gap-3">
                     <div className="px-2 py-0.5 bg-[var(--hover-bg)] rounded border border-[var(--border-color)] text-[9px] font-mono font-black text-[var(--text-muted)] uppercase tracking-widest">
                        {t('driver.licensePlate')}: {ambulance?.plateNumber}
                     </div>
                     <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">VERIFIED</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <div className="glass-panel rounded-[2rem] p-8 bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-2xl">
            <div className="flex items-center justify-between mb-8">
               <h2 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-[0.2em]">{t('driver.title')}</h2>
               <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                   LINK: ACTIVE
               </div>
            </div>

            {!activeEmergency ? (
               <div className="py-20 text-center flex flex-col items-center gap-6">
                  <div className="w-24 h-24 bg-[var(--bg-primary)] rounded-full flex items-center justify-center border border-[var(--border-color)]">
                     <Truck className="w-10 h-10 text-[var(--icon-muted)]" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-[var(--text-primary)] font-black uppercase tracking-widest text-xs">{t('driver.standby')}</p>
                    <p className="text-[var(--text-muted)] text-xs px-8 leading-relaxed font-medium">{t('driver.monitoring')}</p>
                  </div>
               </div>
            ) : (
               <div className="space-y-8">
                  <div className={`p-6 rounded-2xl border transition-all ${
                     activeEmergency.severity === 'Critical' ? 'bg-red-600/5 border-red-500/20' : 'bg-amber-600/5 border-amber-500/20'
                  }`}>
                     <div className="flex justify-between items-start mb-6">
                        <div>
                           <p className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-widest mb-1">Subject</p>
                           <h3 className="text-xl font-black text-[var(--text-primary)] leading-tight">{activeEmergency.patientName}</h3>
                        </div>
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                           activeEmergency.severity === 'Critical' ? 'bg-red-600 text-white shadow-lg shadow-red-900/20' : 'bg-amber-600 text-white shadow-lg shadow-amber-900/20'
                        }`}>
                           {activeEmergency.severity}
                        </span>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                           <Activity className="w-4 h-4 text-emerald-500" />
                           <span className="text-[10px] font-black text-[var(--text-muted)] uppercase truncate">{activeEmergency.emergencyType}</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <Phone className="w-4 h-4 text-emerald-500" />
                           <span className="text-[10px] font-black text-[var(--text-muted)] uppercase truncate">{activeEmergency.contactNumber}</span>
                        </div>
                        <div className="col-span-2 p-3 bg-[var(--bg-primary)] rounded-xl border border-[var(--border-color)]">
                           <p className="text-[9px] font-black text-[var(--text-muted)] uppercase mb-1">{t('driver.incidentNotes')}</p>
                           <p className="text-[11px] text-[var(--text-muted)] leading-relaxed font-medium italic">{activeEmergency.symptoms}</p>
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                     <button className="py-4 bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-muted)] font-black uppercase text-[10px] tracking-widest hover:bg-[var(--hover-bg)] transition-all flex items-center justify-center gap-2">
                        <Phone className="w-4 h-4" />
                        {t('driver.commLink')}
                     </button>
                     <button className="py-4 bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-muted)] font-black uppercase text-[10px] tracking-widest hover:bg-[var(--hover-bg)] transition-all flex items-center justify-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        {t('driver.logEvent')}
                     </button>
                  </div>

                  {workflow && (
                    <motion.button
                      layoutId="workflow-btn"
                      onClick={handleStatusUpdate}
                      className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl emerald-glow flex items-center justify-center gap-3 active:scale-95 transition-all"
                    >
                      {workflow.label}
                      <ChevronRight className="w-5 h-5" />
                    </motion.button>
                  )}
               </div>
            )}
         </div>

         {/* Unit Telemetry */}
         <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[2rem] p-8 group shadow-xl">
            <div className="flex items-center gap-5">
               <div className="w-14 h-14 rounded-2xl bg-[var(--hover-bg)] border border-[var(--border-color)] flex items-center justify-center text-[var(--icon-muted)] group-hover:text-emerald-600 dark:group-hover:text-emerald-500 transition-all duration-500 shadow-inner">
                  <Truck className="w-7 h-7" />
               </div>
               <div>
                  <p className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-widest mb-1">{t('driver.activeNode')}</p>
                  <p className="font-black text-[var(--text-primary)] text-lg tracking-tight">{ambulance?.name}</p>
                  <p className="text-[10px] font-mono text-[var(--text-muted)] uppercase mt-0.5 tracking-widest">{ambulance?.plateNumber}</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

