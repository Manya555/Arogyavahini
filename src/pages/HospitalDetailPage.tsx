import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSimulation } from '../context/SimulationContext';
import { motion } from 'motion/react';
import { Hospital, Bed, Users, MapPin, Phone, Star, Heart, ArrowLeft, AlertCircle, CheckCircle, Clock, TrendingUp } from 'lucide-react';

export default function HospitalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { hospitals } = useSimulation();

  const hospital = useMemo(() => {
    const h = hospitals.find(h => h.id === id);
    if (!h) return null;
    return {
      ...h,
      rating: 4 + Math.random(),
      emergencyReadiness: 75 + Math.random() * 25,
      contactNumber: '+91-080-2662-3333',
      address: 'Bengaluru, Karnataka',
      doctors: [
        { name: 'Dr. Rajesh Kumar', specialization: 'Cardiology', available: true },
        { name: 'Dr. Priya Sharma', specialization: 'Neurology', available: true },
        { name: 'Dr. Amit Patel', specialization: 'Emergency Medicine', available: false },
      ],
      distance: Math.random() * 15 + 2,
      waitTime: Math.floor(Math.random() * 45) + 15,
    };
  }, [id, hospitals]);

  if (!hospital) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center px-4">
        <div className="text-center">
          <Hospital className="w-16 h-16 text-[var(--text-muted)] mx-auto mb-4 opacity-50" />
          <h2 className="text-2xl font-black text-[var(--text-primary)] uppercase tracking-tight mb-2">Hospital Not Found</h2>
          <Link to="/hospitals" className="text-red-600 font-bold hover:underline">Back to Hospitals</Link>
        </div>
      </div>
    );
  }

  const totalBeds = hospital.icuBeds + hospital.generalBeds;
  const bedOccupancy = ((totalBeds - (hospital.icuBeds + hospital.generalBeds)) / totalBeds) * 100;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-12 px-4 transition-colors duration-300">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <Link 
          to="/hospitals"
          className="inline-flex items-center gap-2 text-red-600 font-bold hover:text-red-700 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Hospitals
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Main Info */}
            <div className="lg:col-span-2">
              <div className="glass-panel rounded-[2rem] p-8 border-emerald-600/20">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h1 className="text-4xl font-black text-[var(--text-primary)] uppercase tracking-tight mb-4">{hospital.name}</h1>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-2 text-[var(--text-muted)]">
                        <MapPin className="w-5 h-5 text-emerald-600" />
                        <span>{hospital.address}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[var(--text-muted)]">
                        <Clock className="w-5 h-5 text-emerald-600" />
                        <span>{hospital.distance.toFixed(1)} km away</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-600/20 px-4 py-2 rounded-xl">
                    <Star className="w-5 h-5 text-amber-600 fill-amber-600" />
                    <span className="font-black text-amber-600">{hospital.rating.toFixed(1)}</span>
                  </div>
                </div>

                {/* Emergency Readiness */}
                <div className="p-4 bg-red-600/5 rounded-xl border border-red-600/20">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <span className="text-sm font-black text-red-600 uppercase tracking-widest">Emergency Readiness</span>
                  </div>
                  <div className="w-full bg-[var(--card-bg)] rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-600 to-emerald-500"
                      style={{ width: `${hospital.emergencyReadiness}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-2 text-sm">
                    <span className="text-[var(--text-muted)] font-bold">{hospital.emergencyReadiness.toFixed(0)}% Ready</span>
                    <span className="text-[var(--text-muted)] font-bold">~{hospital.waitTime} min wait</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-panel rounded-[2rem] p-6 border-emerald-600/20"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Heart className="w-6 h-6 text-red-600" />
                  <div>
                    <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">ICU Beds</p>
                    <p className="text-3xl font-black text-red-600 tracking-tight">{hospital.icuBeds}</p>
                  </div>
                </div>
                <span className="text-[9px] text-[var(--text-muted)] font-bold">Available</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 }}
                className="glass-panel rounded-[2rem] p-6 border-emerald-600/20"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Bed className="w-6 h-6 text-emerald-600" />
                  <div>
                    <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">General Beds</p>
                    <p className="text-3xl font-black text-emerald-600 tracking-tight">{hospital.generalBeds}</p>
                  </div>
                </div>
                <span className="text-[9px] text-[var(--text-muted)] font-bold">Available</span>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Specializations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 glass-panel rounded-[2rem] p-8 border-emerald-600/20"
          >
            <h2 className="text-2xl font-black text-[var(--text-primary)] uppercase tracking-tight mb-6 flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
              Specializations
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {hospital.specializations.map((spec, idx) => (
                <motion.div
                  key={spec}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-4 bg-emerald-600/10 border border-emerald-600/30 rounded-xl"
                >
                  <p className="font-black text-[var(--text-primary)] text-sm">{spec}</p>
                  <p className="text-[9px] text-[var(--text-muted)] font-bold mt-1">Available 24/7</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel rounded-[2rem] p-8 border-emerald-600/20"
          >
            <h3 className="text-lg font-black text-[var(--text-primary)] uppercase tracking-tight mb-6">Contact</h3>
            <div className="space-y-4">
              <a 
                href={`tel:${hospital.contactNumber}`}
                className="flex items-center gap-3 p-4 bg-red-600/10 border border-red-600/30 rounded-xl hover:bg-red-600/20 transition-colors"
              >
                <Phone className="w-5 h-5 text-red-600 flex-shrink-0" />
                <div>
                  <p className="text-[9px] font-black text-[var(--text-muted)] uppercase">Emergency</p>
                  <p className="font-black text-red-600">{hospital.contactNumber}</p>
                </div>
              </a>
              <button className="w-full py-4 bg-emerald-600 text-white font-black uppercase tracking-widest rounded-xl hover:bg-emerald-700 transition-colors text-sm">
                Request Admission
              </button>
            </div>
          </motion.div>
        </div>

        {/* Doctors & Staff */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-6 glass-panel rounded-[2rem] p-8 border-emerald-600/20"
        >
          <h2 className="text-2xl font-black text-[var(--text-primary)] uppercase tracking-tight mb-6 flex items-center gap-3">
            <Users className="w-6 h-6 text-emerald-600" />
            Available Doctors
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hospital.doctors.map((doctor, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`p-4 rounded-xl border ${
                  doctor.available
                    ? 'bg-emerald-600/10 border-emerald-600/30'
                    : 'bg-[var(--card-bg)] border-[var(--border-color)] opacity-60'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-black text-[var(--text-primary)]">{doctor.name}</p>
                    <p className="text-[9px] text-[var(--text-muted)] font-bold mt-1">{doctor.specialization}</p>
                  </div>
                  {doctor.available && (
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  )}
                </div>
                <span className={`inline-block text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded ${
                  doctor.available
                    ? 'bg-emerald-600/20 text-emerald-600'
                    : 'bg-[var(--hover-bg)] text-[var(--text-muted)]'
                }`}>
                  {doctor.available ? 'Available' : 'On Break'}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bed Occupancy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 glass-panel rounded-[2rem] p-8 border-emerald-600/20"
        >
          <h3 className="text-lg font-black text-[var(--text-primary)] uppercase tracking-tight mb-6">Bed Occupancy Status</h3>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-black text-[var(--text-primary)]">Overall Occupancy</span>
                <span className="text-lg font-black text-emerald-600">{bedOccupancy.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-[var(--card-bg)] rounded-full h-4 overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    bedOccupancy < 50 ? 'bg-emerald-600' : bedOccupancy < 80 ? 'bg-amber-600' : 'bg-red-600'
                  }`}
                  style={{ width: `${bedOccupancy}%` }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
