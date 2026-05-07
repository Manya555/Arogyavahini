/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useSimulation } from '../context/SimulationContext';
import { motion } from 'motion/react';
import { Hospital, Bed, Users, MapPin, Phone, Star, Filter, AlertCircle, Heart, TrendingUp, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/UIContext';

export default function HospitalListingsPage() {
  const { hospitals } = useSimulation();
  const { t } = useLanguage();
  const [filterSpecialization, setFilterSpecialization] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'distance' | 'beds' | 'rating'>('distance');

  // Mock ratings and emergency readiness
  const hospitalStats = useMemo(() => {
    return hospitals.map(h => ({
      ...h,
      rating: 4 + Math.random(),
      emergencyReadiness: 75 + Math.random() * 25,
      icuAvailable: h.icuBeds > 0,
      generalAvailable: h.generalBeds > 0,
      distance: Math.random() * 15 + 2 // Random distance between 2-17km
    }));
  }, [hospitals]);

  const allSpecializations = ['All', ...new Set(hospitals.flatMap(h => h.specializations))];

  const filteredHospitals = useMemo(() => {
    let filtered = hospitalStats;

    if (filterSpecialization !== 'all') {
      filtered = filtered.filter(h => h.specializations.includes(filterSpecialization));
    }

    if (sortBy === 'distance') {
      filtered.sort((a, b) => a.distance - b.distance);
    } else if (sortBy === 'beds') {
      filtered.sort((a, b) => (b.icuBeds + b.generalBeds) - (a.icuBeds + a.generalBeds));
    } else {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    return filtered;
  }, [hospitalStats, filterSpecialization, sortBy]);

  const getOccupancyColor = (available: number, total: number) => {
    const occupancy = (total - available) / total;
    if (occupancy > 0.8) return 'text-red-600';
    if (occupancy > 0.5) return 'text-amber-600';
    return 'text-emerald-600';
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-12 px-4 transition-colors duration-300 technical-grid">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
              <Hospital className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-[var(--text-primary)] tracking-tighter uppercase italic">Hospital Network</h1>
              <p className="text-sm text-[var(--text-muted)] mt-2">{filteredHospitals.length} hospitals available in your area</p>
            </div>
          </div>
        </motion.div>

        {/* Filters & Sort */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-2xl p-6 mb-8 border-emerald-600/20"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Specialization Filter */}
            <div>
              <label className="text-xs font-black text-[var(--text-muted)] uppercase tracking-[0.2em] mb-3 block">Filter by Specialization</label>
              <div className="flex flex-wrap gap-2">
                {allSpecializations.map(spec => (
                  <button
                    key={spec}
                    onClick={() => setFilterSpecialization(spec === 'All' ? 'all' : spec)}
                    className={`px-4 py-2 rounded-lg font-bold text-[9px] uppercase tracking-widest transition-all ${
                      (spec === 'All' && filterSpecialization === 'all') || filterSpecialization === spec
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[var(--card-bg)] text-[var(--text-muted)] border border-[var(--border-color)] hover:border-emerald-600/30'
                    }`}
                  >
                    {spec}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Options */}
            <div>
              <label className="text-xs font-black text-[var(--text-muted)] uppercase tracking-[0.2em] mb-3 block">Sort by</label>
              <div className="flex gap-2">
                {[
                  { value: 'distance' as const, label: 'Distance' },
                  { value: 'beds' as const, label: 'Bed Availability' },
                  { value: 'rating' as const, label: 'Rating' }
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => setSortBy(option.value)}
                    className={`flex-1 px-4 py-2 rounded-lg font-bold text-[9px] uppercase tracking-widest transition-all ${
                      sortBy === option.value
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[var(--card-bg)] text-[var(--text-muted)] border border-[var(--border-color)] hover:border-emerald-600/30'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Hospital Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHospitals.map((hospital, idx) => (
            <Link 
              key={hospital.id}
              to={`/hospitals/${hospital.id}`}
              className="no-underline"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="glass-panel rounded-[2rem] p-6 border-emerald-600/10 hover:border-emerald-600/40 transition-all group overflow-hidden h-full cursor-pointer transform hover:scale-105 hover:shadow-xl"
              >
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-black text-[var(--text-primary)] uppercase tracking-tight">{hospital.name}</h3>
                    <div className="flex items-center gap-2 mt-2 text-emerald-600">
                      <MapPin className="w-4 h-4" />
                      <span className="text-[10px] font-bold">{hospital.distance.toFixed(1)} km away</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-600/20 px-3 py-1 rounded-lg">
                    <Star className="w-4 h-4 text-amber-600 fill-amber-600" />
                    <span className="font-black text-[10px] text-amber-600">{hospital.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>

              {/* Emergency Readiness */}
              <div className="mb-6 p-4 bg-red-600/5 rounded-xl border border-red-600/20">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span className="text-[9px] font-black text-red-600 uppercase tracking-widest">Emergency Readiness</span>
                </div>
                <div className="w-full bg-[var(--card-bg)] rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-600 to-emerald-500 transition-all"
                    style={{ width: `${hospital.emergencyReadiness}%` }}
                  />
                </div>
                <span className="text-[9px] font-bold text-[var(--text-muted)] mt-2 block text-right">{hospital.emergencyReadiness.toFixed(0)}%</span>
              </div>

              {/* Specializations */}
              <div className="mb-6">
                <span className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em]">Specializations</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {hospital.specializations.slice(0, 3).map(spec => (
                    <span key={spec} className="px-2 py-1 bg-[var(--card-bg)] text-[8px] font-black text-[var(--text-muted)] rounded-lg uppercase tracking-widest">
                      {spec.split(' ')[0]}
                    </span>
                  ))}
                  {hospital.specializations.length > 3 && (
                    <span className="px-2 py-1 bg-[var(--card-bg)] text-[8px] font-black text-[var(--text-muted)] rounded-lg uppercase tracking-widest">
                      +{hospital.specializations.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Bed Availability */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-[var(--card-bg)] rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="w-4 h-4 text-red-600" />
                    <span className="text-[9px] font-bold text-[var(--text-muted)]">ICU Beds</span>
                  </div>
                  <div className={`text-2xl font-black tracking-tight ${getOccupancyColor(hospital.icuBeds, hospital.icuBeds + 5)}`}>
                    {hospital.icuBeds}
                  </div>
                  <span className="text-[8px] text-[var(--text-muted)] font-bold">Available</span>
                </div>

                <div className="p-4 bg-[var(--card-bg)] rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Bed className="w-4 h-4 text-emerald-600" />
                    <span className="text-[9px] font-bold text-[var(--text-muted)]">General Beds</span>
                  </div>
                  <div className={`text-2xl font-black tracking-tight ${getOccupancyColor(hospital.generalBeds, hospital.generalBeds + 20)}`}>
                    {hospital.generalBeds}
                  </div>
                  <span className="text-[8px] text-[var(--text-muted)] font-bold">Available</span>
                </div>
              </div>

              {/* Footer Stats */}
              <div className="pt-4 border-t border-[var(--border-color)] flex items-center justify-between text-[9px]">
                <div className="flex items-center gap-2 text-[var(--text-muted)]">
                  <Users className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold">{hospital.specializations.length} Specialties</span>
                </div>
                <div className="flex items-center gap-1 px-3 py-2 bg-emerald-600/10 text-emerald-600 rounded-lg font-black uppercase tracking-widest group-hover:bg-emerald-600 group-hover:text-white transition-all text-[8px]">
                  View <ChevronRight className="w-3 h-3" />
                </div>
              </div>
              </motion.div>
            </Link>
          ))}
        </div>

        {filteredHospitals.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <Hospital className="w-16 h-16 text-[var(--text-muted)] mb-4 opacity-30" />
            <p className="text-[14px] font-black text-[var(--text-muted)] uppercase tracking-widest">No hospitals found</p>
            <p className="text-[12px] text-[var(--text-muted)] mt-2">Try adjusting your filters</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
