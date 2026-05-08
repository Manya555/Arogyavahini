import React, { useState, useMemo } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { motion } from 'motion/react';
import { Truck, Clock, MapPinIcon, Users, AlertCircle, Eye, Filter, MapPin } from 'lucide-react';
import { SimulatedGridMap } from '../components/SimulatedGridMap';

export default function BookingPage() {
  const { ambulances } = useSimulation();
  const [sortBy, setSortBy] = useState<'distance' | 'availability'>('distance');
  const [filterStatus, setFilterStatus] = useState<'all' | 'Available' | 'Busy'>('all');

  // Mock auto-location for simulation
  const mockPickupLocation = { lat: 12.9716 + (Math.random() - 0.5) * 0.1, lng: 77.5946 + (Math.random() - 0.5) * 0.1 };

  // Calculate distances and sort ambulances
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    return Math.sqrt(Math.pow(lat1 - lat2, 2) + Math.pow(lng1 - lng2, 2)) * 111;
  };

  const filteredAmbulances = useMemo(() => {
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
      ) / 40) * 60)
    }));

    let filtered = withDistance;
    if (filterStatus !== 'all') {
      filtered = filtered.filter(amb => amb.status === filterStatus);
    }

    if (sortBy === 'distance') {
      return filtered.sort((a, b) => a.distance - b.distance);
    } else {
      return filtered.sort((a, b) => {
        const aAvailable = a.status === 'Available' ? 0 : 1;
        const bAvailable = b.status === 'Available' ? 0 : 1;
        return aAvailable - bAvailable || a.distance - b.distance;
      });
    }
  }, [sortBy, filterStatus, mockPickupLocation.lat, mockPickupLocation.lng]);

  const availableCount = ambulances.filter(a => a.status === 'Available').length;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-8 px-4 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-black text-[var(--text-primary)] uppercase italic tracking-tighter">
                Live Ambulance Map
              </h1>
              <p className="text-sm text-[var(--text-muted)] mt-2 font-semibold">Real-time emergency response tracking system</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-black text-emerald-600">{availableCount}</div>
              <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Available</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-3">
            <div className="flex gap-2 bg-[var(--card-bg)] p-1.5 rounded-2xl border border-[var(--border-color)]">
              <button
                onClick={() => setSortBy('distance')}
                className={`px-4 py-2 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all ${
                  sortBy === 'distance'
                    ? 'bg-red-600 text-white'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                Distance
              </button>
              <button
                onClick={() => setSortBy('availability')}
                className={`px-4 py-2 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all ${
                  sortBy === 'availability'
                    ? 'bg-red-600 text-white'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                Availability
              </button>
            </div>

            <div className="flex gap-2 bg-[var(--card-bg)] p-1.5 rounded-2xl border border-[var(--border-color)]">
              {(['all', 'Available', 'Busy'] as const).map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all ${
                    filterStatus === status
                      ? status === 'all' ? 'bg-blue-600 text-white' : status === 'Available' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {status === 'all' ? 'All' : status}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Map Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 glass-panel rounded-[2rem] overflow-hidden border-red-600/20 flex flex-col"
          >
            <div className="p-6 border-b border-[var(--border-color)] bg-red-600/5">
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 bg-red-600 rounded-full" />
                <h2 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-[0.1em]">Interactive Map View</h2>
              </div>
            </div>
            <div className="relative h-[400px] lg:h-[500px] bg-[var(--card-bg-solid)] overflow-hidden">
              <SimulatedGridMap />
              <div className="absolute top-4 left-4 bg-[var(--bg-primary)]/80 backdrop-blur-sm border border-[var(--border-color)] rounded-xl p-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-600" />
                  <span className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest">Current Location</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Ambulances List Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel rounded-[2rem] overflow-hidden border-emerald-600/20 flex flex-col h-fit max-h-[calc(100vh-200px)]"
          >
            <div className="p-6 border-b border-[var(--border-color)] bg-emerald-600/5">
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 bg-emerald-600 rounded-full" />
                <h2 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-[0.1em]">Live Ambulances</h2>
              </div>
              <p className="text-[9px] text-[var(--text-muted)] mt-2">{filteredAmbulances.length} units tracked</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {filteredAmbulances.length > 0 ? (
                filteredAmbulances.map((amb, idx) => (
                  <motion.div
                    key={amb.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer hover:shadow-lg ${
                      amb.status === 'Available'
                        ? 'bg-emerald-600/10 border-emerald-600/30 hover:border-emerald-600/60'
                        : amb.status === 'Busy'
                        ? 'bg-red-600/10 border-red-600/30 hover:border-red-600/60'
                        : 'bg-amber-600/10 border-amber-600/30 hover:border-amber-600/60'
                    }`}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Truck className={`w-4 h-4 ${amb.status === 'Available' ? 'text-emerald-600' : amb.status === 'Busy' ? 'text-red-600' : 'text-amber-600'}`} />
                          <span className="font-black text-sm text-[var(--text-primary)]">{amb.name}</span>
                        </div>
                        <span className="text-[9px] font-bold text-[var(--text-muted)]">{amb.plateNumber}</span>
                      </div>
                      <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest whitespace-nowrap ${
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
                        <MapPinIcon className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                        <span className="font-semibold">{amb.distance.toFixed(1)} km</span>
                      </div>
                      <div className="flex items-center gap-2 text-[var(--text-muted)]">
                        <Clock className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                        <span className="font-semibold">~{amb.eta} mins</span>
                      </div>
                      <div className="flex items-center gap-2 text-[var(--text-muted)]">
                        <Users className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                        <span className="font-semibold">{amb.driverName}</span>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Truck className="w-8 h-8 text-[var(--text-muted)] mb-2 opacity-50" />
                  <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">No ambulances match filter</p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-[var(--border-color)] bg-[var(--card-bg-subtle)]">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-sm font-black text-emerald-600">{ambulances.filter(a => a.status === 'Available').length}</div>
                  <span className="text-[8px] font-bold text-[var(--text-muted)]">Available</span>
                </div>
                <div>
                  <div className="text-sm font-black text-amber-600">{ambulances.filter(a => a.status === 'Dispatched').length}</div>
                  <span className="text-[8px] font-bold text-[var(--text-muted)]">Dispatched</span>
                </div>
                <div>
                  <div className="text-sm font-black text-red-600">{ambulances.filter(a => a.status === 'Busy').length}</div>
                  <span className="text-[8px] font-bold text-[var(--text-muted)]">Busy</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
