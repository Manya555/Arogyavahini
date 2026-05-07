/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSimulation, Severity } from '../context/SimulationContext';
import { motion } from 'motion/react';
import { AlertCircle, MapPin, User, Phone, Clipboard, Activity, ChevronRight, Info, Truck, Clock, MapPinIcon, Users } from 'lucide-react';
import { useLanguage } from '../context/UIContext';
import { SimulatedGridMap } from '../components/SimulatedGridMap';

export default function BookingPage() {
  const navigate = useNavigate();
  const { createEmergency, ambulances } = useSimulation();
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
  const [sortBy, setSortBy] = useState<'distance' | 'availability'>('distance');

  // Mock auto-location for simulation
  const mockPickupLocation = { lat: 12.9716 + (Math.random() - 0.5) * 0.1, lng: 77.5946 + (Math.random() - 0.5) * 0.1 };

  // Calculate distances and sort ambulances
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    return Math.sqrt(Math.pow(lat1 - lat2, 2) + Math.pow(lng1 - lng2, 2)) * 111; // Convert to approximate km
  };

  const nearbyAmbulances = useMemo(() => {
    const withDistance = ambulances.map(amb => ({
      ...amb,
      distance: calculateDistance(
        mockPickupLocation.lat,
        mockPickupLocation.lng,
        amb.coords.lat,
        amb.coords.lng
      ),
      eta: Math.ceil((calculateDistance(
        mockPickupLocation.lat,
        mockPickupLocation.lng,
        amb.coords.lat,
        amb.coords.lng
      ) / 40) * 60) // Assume 40 km/h average speed
    }));

    if (sortBy === 'distance') {
      return withDistance.sort((a, b) => a.distance - b.distance);
    } else {
      return withDistance.sort((a, b) => {
        const aAvailable = a.status === 'Available' ? 0 : 1;
        const bAvailable = b.status === 'Available' ? 0 : 1;
        return aAvailable - bAvailable || a.distance - b.distance;
      });
    }
  }, [sortBy, mockPickupLocation.lat, mockPickupLocation.lng]);

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
    <div className="min-h-screen bg-[var(--bg-primary)] py-12 px-4 transition-colors duration-300 technical-grid">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Form Panel - 2 columns */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 glass-panel rounded-[2rem] overflow-hidden border-red-600/20"
          >
            {/* Header Section */}
            <div className="p-8 border-b border-[var(--border-color)] bg-red-600/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                <Activity className="w-40 h-40 text-red-600" />
              </div>
              
              <div className="flex items-center gap-6 relative z-10">
                <div className="w-16 h-16 bg-red-600 rounded-[1.2rem] flex items-center justify-center text-white shadow-[0_0_40px_rgba(239,68,68,0.4)] pulse-red-glow">
                  <AlertCircle className="w-8 h-8 animate-pulse" />
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-black text-[var(--text-primary)] tracking-tighter uppercase italic">{t('booking.title')}</h1>
                  <p className="text-[10px] font-black text-red-600 uppercase tracking-[0.2em] mt-1 leading-none">Ambulance Booking System</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-12">
            <div className="space-y-12">
                  {/* Patient Segment */}
                  <section>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-1 h-6 bg-red-600 rounded-full" />
                      <h2 className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em]">{t('booking.patientInfo')}</h2>
                    </div>
                    <div className="space-y-4">
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
                    <div className="aspect-video bg-[var(--card-bg-solid)] rounded-[2rem] overflow-hidden border border-[var(--border-color)] relative group shadow-xl">
                        <SimulatedGridMap />
                        <div className="absolute inset-0 border-2 border-red-500/20 pointer-events-none group-hover:border-red-500/40 transition-colors" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                           <div className="w-4 h-4 bg-red-600 rounded-full animate-ping" />
                        </div>
                    </div>
                  </section>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-6 rounded-xl font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-4 transition-all shadow-lg italic border ${
                isSubmitting
                  ? 'bg-[var(--hover-bg)] text-[var(--text-muted)] border-[var(--border-color)] cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700 text-white border-red-500/25'
              }`}
            >
              <Activity className={`w-5 h-5 ${isSubmitting ? 'animate-spin' : ''}`} />
              {isSubmitting ? 'PROCESSING...' : 'Book Ambulance'}
              {!isSubmitting && <ChevronRight className="w-5 h-5" />}
            </button>
            </form>
          </motion.div>

          {/* Right: Nearby Ambulances Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1 glass-panel rounded-[2rem] overflow-hidden border-emerald-600/20 flex flex-col h-fit max-h-[calc(100vh-150px)]"
          >
            <div className="p-6 border-b border-[var(--border-color)] bg-emerald-600/5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-6 bg-emerald-600 rounded-full" />
                <h2 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-[0.1em]">Nearby Ambulances</h2>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setSortBy('distance')}
                  className={`flex-1 py-2 rounded-lg font-black text-[9px] uppercase tracking-widest transition-all ${
                    sortBy === 'distance'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[var(--card-bg)] text-[var(--text-muted)] border border-[var(--border-color)]'
                  }`}
                >
                  Distance
                </button>
                <button
                  onClick={() => setSortBy('availability')}
                  className={`flex-1 py-2 rounded-lg font-black text-[9px] uppercase tracking-widest transition-all ${
                    sortBy === 'availability'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[var(--card-bg)] text-[var(--text-muted)] border border-[var(--border-color)]'
                  }`}
                >
                  Availability
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {nearbyAmbulances.slice(0, 6).map((amb, idx) => (
                <motion.div
                  key={amb.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`p-4 rounded-xl border transition-all ${
                    amb.status === 'Available'
                      ? 'bg-emerald-600/10 border-emerald-600/30 hover:border-emerald-600/60'
                      : amb.status === 'Busy'
                      ? 'bg-red-600/10 border-red-600/30'
                      : 'bg-amber-600/10 border-amber-600/30'
                  }`}
                >
                  <div className="flex items-start gap-3 mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Truck className={`w-4 h-4 ${amb.status === 'Available' ? 'text-emerald-600' : amb.status === 'Busy' ? 'text-red-600' : 'text-amber-600'}`} />
                        <span className="font-black text-sm text-[var(--text-primary)]">{amb.name}</span>
                      </div>
                      <span className="text-[9px] font-bold text-[var(--text-muted)]">{amb.plateNumber}</span>
                    </div>
                    <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${
                      amb.status === 'Available'
                        ? 'bg-emerald-600/20 text-emerald-600'
                        : amb.status === 'Busy'
                        ? 'bg-red-600/20 text-red-600'
                        : 'bg-amber-600/20 text-amber-600'
                    }`}>
                      {amb.status}
                    </span>
                  </div>

                  <div className="space-y-2 text-[9px]">
                    <div className="flex items-center gap-2 text-[var(--text-muted)]">
                      <MapPinIcon className="w-3 h-3 text-emerald-600" />
                      <span className="font-semibold">{amb.distance.toFixed(1)} km away</span>
                    </div>
                    <div className="flex items-center gap-2 text-[var(--text-muted)]">
                      <Clock className="w-3 h-3 text-emerald-600" />
                      <span className="font-semibold">ETA: {amb.eta} mins</span>
                    </div>
                    <div className="flex items-center gap-2 text-[var(--text-muted)]">
                      <Users className="w-3 h-3 text-emerald-600" />
                      <span className="font-semibold">{amb.driverName}</span>
                    </div>
                  </div>
                </motion.div>
              ))}

              {nearbyAmbulances.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Truck className="w-8 h-8 text-[var(--text-muted)] mb-2 opacity-50" />
                  <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">No ambulances available</p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-[var(--border-color)] bg-[var(--card-bg-subtle)]">
              <div className="text-[9px] font-bold text-[var(--text-muted)] text-center">
                <span className="inline-block px-3 py-1 rounded-lg bg-[var(--hover-bg)]">
                  {nearbyAmbulances.filter(a => a.status === 'Available').length} Available
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
