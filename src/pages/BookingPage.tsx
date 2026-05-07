/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSimulation, Severity } from '../context/SimulationContext';
import { motion } from 'motion/react';
import { AlertCircle, MapPin, User, Phone, Clipboard, Activity, ChevronRight, Info } from 'lucide-react';
import { useLanguage } from '../context/UIContext';
import { SimulatedGridMap } from '../components/SimulatedGridMap';

export default function BookingPage() {
  const navigate = useNavigate();
  const { createEmergency, hospitals } = useSimulation();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    patientName: '',
    contactNumber: '',
    emergencyType: '',
    severity: 'Moderate' as Severity,
    symptoms: '',
    preferredHospitalId: '',
    gcs: 15,
    bp: '120/80',
    spo2: 98,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock auto-location for simulation
  const mockPickupLocation = { lat: 12.9716 + (Math.random() - 0.5) * 0.1, lng: 77.5946 + (Math.random() - 0.5) * 0.1 };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate system delay
    setTimeout(() => {
      const id = createEmergency({
        patientName: formData.patientName,
        contactNumber: formData.contactNumber,
        emergencyType: formData.emergencyType || 'General Medical',
        severity: formData.severity,
        symptoms: `${formData.symptoms} | GCS: ${formData.gcs}, BP: ${formData.bp}, SpO2: ${formData.spo2}%`,
        pickupCoords: mockPickupLocation,
      });
      navigate(`/tracking/${id}`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-16 px-4 transition-colors duration-300 technical-grid">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-[3rem] overflow-hidden border-red-600/20"
        >
          {/* Header Section */}
          <div className="p-12 border-b border-[var(--border-color)] bg-red-600/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
              <Activity className="w-64 h-64 text-red-600" />
            </div>
            
            <div className="flex items-center gap-8 relative z-10">
              <div className="w-20 h-20 bg-red-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-[0_0_40px_rgba(239,68,68,0.4)] pulse-red-glow">
                <AlertCircle className="w-10 h-10 animate-pulse" />
              </div>
              <div>
                <h1 className="text-4xl font-black text-[var(--text-primary)] tracking-tighter uppercase italic">{t('booking.title')}</h1>
                <p className="text-xs font-black text-red-600 uppercase tracking-[0.4em] mt-2 leading-none">High Priority Intercept Protocol Activated</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-12 space-y-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
               <div className="space-y-12">
                  {/* Patient Segment */}
                  <section>
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-1 h-8 bg-red-600 rounded-full" />
                      <h2 className="text-xs font-black text-[var(--text-muted)] uppercase tracking-[0.2em]">{t('booking.patientInfo')}</h2>
                    </div>
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] ml-1">{t('booking.fullName')}</label>
                        <div className="relative group">
                          <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--icon-muted)] group-focus-within:text-red-500 transition-colors" />
                          <input
                            required
                            type="text"
                            placeholder="OPERATIONAL NAME"
                            className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl py-5 pl-14 pr-6 text-[var(--text-primary)] font-bold focus:outline-none focus:border-red-500/40 transition-all uppercase tracking-tight placeholder:text-[var(--text-muted)] italic"
                            value={formData.patientName}
                            onChange={e => setFormData({ ...formData, patientName: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] ml-1">{t('booking.contact')}</label>
                        <div className="relative group">
                          <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--icon-muted)] group-focus-within:text-red-500 transition-colors" />
                          <input
                            required
                            type="tel"
                            placeholder="+XX-XXXXXXXX"
                            className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl py-5 pl-14 pr-6 text-[var(--text-primary)] font-bold focus:outline-none focus:border-red-500/40 transition-all uppercase tracking-tight placeholder:text-[var(--text-muted)] italic"
                            value={formData.contactNumber}
                            onChange={e => setFormData({ ...formData, contactNumber: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Medical Segment */}
                  <section>
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-1 h-8 bg-red-600 rounded-full" />
                      <h2 className="text-xs font-black text-[var(--text-muted)] uppercase tracking-[0.2em]">{t('booking.medicalInfo')}</h2>
                    </div>
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] ml-1">{t('booking.type')}</label>
                        <select
                          required
                          className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl py-5 px-6 text-[var(--text-primary)] font-bold hover:border-red-500/30 transition-all appearance-none cursor-pointer uppercase tracking-tight"
                          value={formData.emergencyType}
                          onChange={e => setFormData({ ...formData, emergencyType: e.target.value })}
                        >
                          <option value="" className="bg-[var(--bg-secondary)]">{t('booking.selectCriticality')}</option>
                          <option value="Cardiac Arrest" className="bg-[var(--bg-secondary)]">{t('booking.cardiacArrest')}</option>
                          <option value="Road Accident" className="bg-[var(--bg-secondary)]">{t('booking.roadAccident')}</option>
                          <option value="Respiratory Distress" className="bg-[var(--bg-secondary)]">{t('booking.respiratoryDistress')}</option>
                          <option value="Stroke" className="bg-[var(--bg-secondary)]">{t('booking.stroke')}</option>
                          <option value="Burn Care" className="bg-[var(--bg-secondary)]">{t('booking.burnCare')}</option>
                          <option value="Other Medical" className="bg-[var(--bg-secondary)]">{t('booking.otherMedical')}</option>
                        </select>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] ml-1">{t('booking.severity')}</label>
                        <div className="flex gap-3 p-2 bg-[var(--bg-primary)] rounded-[1.5rem] border border-[var(--border-color)]">
                          {(['Stable', 'Moderate', 'Critical'] as Severity[]).map(level => (
                            <button
                              key={level}
                              type="button"
                              onClick={() => setFormData({ ...formData, severity: level })}
                              className={`flex-1 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                                formData.severity === level 
                                  ? (level === 'Critical' ? 'bg-red-600 text-white shadow-xl shadow-red-900/40' : level === 'Moderate' ? 'bg-amber-600 text-white shadow-xl shadow-amber-900/40' : 'bg-emerald-600 text-white shadow-xl shadow-emerald-900/40')
                                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                              }`}
                            >
                              {level}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </section>
               </div>

               <div className="space-y-12">
                  {/* Trauma Metrics */}
                  <section>
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-1 h-8 bg-red-600 rounded-full" />
                     <h2 className="text-xs font-black text-[var(--text-muted)] uppercase tracking-[0.2em]">Trauma HUD Metrics</h2>
                    </div>
                    <div className="grid grid-cols-3 gap-6">
                       <div className="space-y-2">
                          <label className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest">GCS Scale</label>
                          <input 
                             type="number" 
                             min="3" max="15" 
                             className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl py-3 px-4 font-mono font-bold text-red-600 dark:text-red-500"
                             value={formData.gcs}
                             onChange={e => setFormData({ ...formData, gcs: parseInt(e.target.value) })}
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest">Blood Pr.</label>
                          <input 
                             type="text" 
                             className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl py-3 px-4 font-mono font-bold text-red-600 dark:text-red-500" 
                             value={formData.bp}
                             onChange={e => setFormData({ ...formData, bp: e.target.value })}
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest">SpO2 %</label>
                          <input 
                             type="number" 
                             min="0" max="100" 
                             className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl py-3 px-4 font-mono font-bold text-red-600 dark:text-red-500" 
                             value={formData.spo2}
                             onChange={e => setFormData({ ...formData, spo2: parseInt(e.target.value) })}
                          />
                       </div>
                    </div>
                  </section>

                  {/* Location Selector */}
                  <section>
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-1 h-8 bg-red-600 rounded-full" />
                      <h2 className="text-xs font-black text-[var(--text-muted)] uppercase tracking-[0.2em]">Location Intercept</h2>
                    </div>
                    <div className="aspect-square bg-[var(--card-bg-solid)] rounded-[2rem] overflow-hidden border border-[var(--border-color)] relative group shadow-xl">
                        <SimulatedGridMap />
                        <div className="absolute inset-0 border-2 border-red-500/20 pointer-events-none group-hover:border-red-500/40 transition-colors" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                           <div className="w-4 h-4 bg-red-600 rounded-full animate-ping" />
                        </div>
                    </div>
                  </section>
               </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-8 rounded-[2rem] font-black text-sm uppercase tracking-[0.4em] flex items-center justify-center gap-6 transition-all shadow-2xl italic border ${
                isSubmitting
                  ? 'bg-[var(--hover-bg)] text-[var(--text-muted)] border-[var(--border-color)] cursor-not-allowed'
                  : 'bg-[var(--accent-red)] hover:bg-[var(--accent-red-2)] text-white border-red-500/25 pulse-red-glow'
              }`}
            >
              <Activity className={`w-6 h-6 ${isSubmitting ? 'animate-spin' : ''}`} />
              {isSubmitting ? 'DECRYPTING PROTOCOL...' : 'EXECUTE SOS PROTOCOL'}
              {!isSubmitting && <ChevronRight className="w-6 h-6" />}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
