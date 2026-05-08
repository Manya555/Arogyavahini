import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSimulation } from '../context/SimulationContext';
import { motion } from 'motion/react';
import { AlertCircle, MapPin, Phone, User, Clipboard, ChevronRight, Activity } from 'lucide-react';
import { SimulatedGridMap } from '../components/SimulatedGridMap';

export default function SOSBookingPage() {
  const navigate = useNavigate();
  const { createEmergency } = useSimulation();
  const [formData, setFormData] = useState({
    patientName: '',
    contactNumber: '',
    emergencyType: 'Medical',
    symptoms: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mockPickupLocation = { lat: 12.9716 + (Math.random() - 0.5) * 0.1, lng: 77.5946 + (Math.random() - 0.5) * 0.1 };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const emergencyData = {
        ...formData,
        location: mockPickupLocation,
        severity: 'High',
        gcs: 15,
        bp: '120/80',
        spo2: 98,
      };
      
      await createEmergency(emergencyData);
      setTimeout(() => {
        navigate('/live-map');
      }, 1000);
    } catch (error) {
      console.error('Error creating emergency:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-8 px-4 transition-colors duration-300">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-3xl overflow-hidden border-red-600/20"
        >
          {/* Header */}
          <div className="p-8 border-b border-[var(--border-color)] bg-red-600/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
              <Activity className="w-40 h-40 text-red-600" />
            </div>
            
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center text-white shadow-[0_0_30px_rgba(239,68,68,0.3)]">
                <AlertCircle className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-[var(--text-primary)] uppercase italic">SOS Emergency Request</h1>
                <p className="text-xs font-bold text-red-600 uppercase tracking-widest mt-1">Rapid Ambulance Dispatch</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Patient Information */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <User className="w-4 h-4 text-red-600" />
                <label className="text-xs font-black text-[var(--text-muted)] uppercase tracking-widest">Patient Information</label>
              </div>
              <input
                type="text"
                placeholder="Full Name"
                value={formData.patientName}
                onChange={(e) => setFormData({...formData, patientName: e.target.value})}
                required
                className="w-full px-4 py-3 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-muted)] font-semibold text-sm focus:outline-none focus:border-red-600/50"
              />
            </div>

            {/* Contact Number */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Phone className="w-4 h-4 text-red-600" />
                <label className="text-xs font-black text-[var(--text-muted)] uppercase tracking-widest">Contact Number</label>
              </div>
              <input
                type="tel"
                placeholder="Mobile Number"
                value={formData.contactNumber}
                onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
                required
                className="w-full px-4 py-3 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-muted)] font-semibold text-sm focus:outline-none focus:border-red-600/50"
              />
            </div>

            {/* Emergency Type */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <label className="text-xs font-black text-[var(--text-muted)] uppercase tracking-widest">Emergency Type</label>
              </div>
              <select
                value={formData.emergencyType}
                onChange={(e) => setFormData({...formData, emergencyType: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-primary)] font-semibold text-sm focus:outline-none focus:border-red-600/50"
              >
                <option>Medical</option>
                <option>Trauma</option>
                <option>Cardiac</option>
                <option>Respiratory</option>
                <option>Other</option>
              </select>
            </div>

            {/* Symptoms */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Clipboard className="w-4 h-4 text-red-600" />
                <label className="text-xs font-black text-[var(--text-muted)] uppercase tracking-widest">Symptoms / Description</label>
              </div>
              <textarea
                placeholder="Describe symptoms or emergency situation"
                value={formData.symptoms}
                onChange={(e) => setFormData({...formData, symptoms: e.target.value})}
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-muted)] font-semibold text-sm focus:outline-none focus:border-red-600/50 resize-none"
              />
            </div>

            {/* Map Preview */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-4 h-4 text-red-600" />
                <label className="text-xs font-black text-[var(--text-muted)] uppercase tracking-widest">Current Location</label>
              </div>
              <div className="h-56 bg-[var(--card-bg)] rounded-xl overflow-hidden border border-[var(--border-color)] relative">
                <SimulatedGridMap />
                <div className="absolute inset-0 border-2 border-red-500/20 pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse" />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-lg ${
                isSubmitting
                  ? 'bg-[var(--hover-bg)] text-[var(--text-muted)] cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              <Activity className={`w-5 h-5 ${isSubmitting ? 'animate-spin' : ''}`} />
              {isSubmitting ? 'DISPATCHING...' : 'Request Ambulance'}
              {!isSubmitting && <ChevronRight className="w-5 h-5" />}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
