import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  AlertCircle, 
  MapPin, 
  Phone, 
  User, 
  Clipboard, 
  ChevronRight, 
  Activity,
  Clock,
  Truck,
  Hospital,
  CheckCircle,
  Circle,
  Navigation,
  RefreshCw,
  Locate
} from 'lucide-react';
import { EmergencyMap } from '../components/EmergencyMap';
import { useLanguage } from '../context/UIContext';
import { useGeolocation } from '../hooks/useGeolocation';

type DriverStatus = 'pending' | 'accepted' | 'enRoute' | 'arrived';

interface TimelineEvent {
  id: number;
  status: string;
  time: string;
  completed: boolean;
}

interface NearbyHospital {
  id: number;
  name: string;
  distance: string;
  eta: string;
  beds: number;
  coords: { lat: number; lng: number };
}

export default function SOSBookingPage() {
  const { t } = useLanguage();
  const { coords, loading: locationLoading, error: locationError, permissionDenied, refreshLocation } = useGeolocation();
  
  const [formData, setFormData] = useState({
    patientName: '',
    contactNumber: '',
    emergencyType: 'Medical',
    symptoms: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [driverStatus, setDriverStatus] = useState<DriverStatus>('pending');
  const [eta, setEta] = useState(12);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([
    { id: 1, status: 'Request Submitted', time: '', completed: false },
    { id: 2, status: 'Driver Assigned', time: '', completed: false },
    { id: 3, status: 'Ambulance En Route', time: '', completed: false },
    { id: 4, status: 'Ambulance Arrived', time: '', completed: false },
  ]);

  // Mock ambulance location that moves towards user
  const [ambulanceCoords, setAmbulanceCoords] = useState({ 
    lat: coords.lat + 0.02, 
    lng: coords.lng + 0.015 
  });

  // Nearby hospitals based on user location
  const nearbyHospitals: NearbyHospital[] = useMemo(() => [
    { id: 1, name: 'City General Hospital', distance: '2.3 km', eta: '5 min', beds: 12, coords: { lat: coords.lat + 0.008, lng: coords.lng + 0.005 } },
    { id: 2, name: 'Apollo Emergency Center', distance: '3.8 km', eta: '8 min', beds: 8, coords: { lat: coords.lat - 0.01, lng: coords.lng + 0.012 } },
    { id: 3, name: 'St. Mary Medical', distance: '4.5 km', eta: '10 min', beds: 15, coords: { lat: coords.lat + 0.015, lng: coords.lng - 0.008 } },
    { id: 4, name: 'Regional Trauma Center', distance: '5.2 km', eta: '12 min', beds: 6, coords: { lat: coords.lat - 0.018, lng: coords.lng - 0.01 } },
  ], [coords]);

  // Simulate ambulance movement
  useEffect(() => {
    if (!isBooked || driverStatus === 'arrived') return;

    const interval = setInterval(() => {
      setAmbulanceCoords(prev => {
        const stepLat = (coords.lat - prev.lat) * 0.15;
        const stepLng = (coords.lng - prev.lng) * 0.15;
        return {
          lat: prev.lat + stepLat,
          lng: prev.lng + stepLng
        };
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isBooked, coords, driverStatus]);

  // Simulate driver status progression
  useEffect(() => {
    if (!isBooked) return;

    const statusProgression: DriverStatus[] = ['pending', 'accepted', 'enRoute', 'arrived'];
    let currentIndex = 0;

    const interval = setInterval(() => {
      currentIndex++;
      if (currentIndex < statusProgression.length) {
        setDriverStatus(statusProgression[currentIndex]);
        
        setTimeline(prev => prev.map((event, idx) => 
          idx <= currentIndex ? { ...event, completed: true, time: new Date().toLocaleTimeString() } : event
        ));
        
        setEta(prev => Math.max(0, prev - 4));
      } else {
        clearInterval(interval);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isBooked]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsBooked(true);
    setTimeline(prev => prev.map((event, idx) => 
      idx === 0 ? { ...event, completed: true, time: new Date().toLocaleTimeString() } : event
    ));
  };

  const getStatusColor = (status: DriverStatus) => {
    switch (status) {
      case 'pending': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'accepted': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'enRoute': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'arrived': return 'text-green-500 bg-green-500/10 border-green-500/20';
    }
  };

  const getStatusLabel = (status: DriverStatus) => {
    switch (status) {
      case 'pending': return t('ambulanceRequest.pending') || 'Pending';
      case 'accepted': return t('ambulanceRequest.accepted') || 'Accepted';
      case 'enRoute': return t('ambulanceRequest.enRoute') || 'En Route';
      case 'arrived': return t('ambulanceRequest.arrived') || 'Arrived';
    }
  };

  // Map markers for tracking view
  const trackingMarkers = useMemo(() => [
    { id: 'user', coords: coords, type: 'user' as const, label: 'Your Location' },
    { id: 'ambulance', coords: ambulanceCoords, type: 'ambulance' as const, label: 'Ambulance' },
    ...nearbyHospitals.slice(0, 2).map(h => ({ 
      id: `hospital-${h.id}`, 
      coords: h.coords, 
      type: 'hospital' as const, 
      label: h.name 
    }))
  ], [coords, ambulanceCoords, nearbyHospitals]);

  // Route from ambulance to user
  const route = useMemo(() => {
    if (driverStatus === 'enRoute' || driverStatus === 'accepted') {
      return [ambulanceCoords, coords];
    }
    return [];
  }, [ambulanceCoords, coords, driverStatus]);

  if (isBooked) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] py-8 px-4 transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-black text-[var(--text-primary)] uppercase italic mb-2">
              {t('ambulanceRequest.liveTracking') || 'Live Tracking'}
            </h1>
            <p className="text-sm text-[var(--text-muted)]">
              {t('ambulanceRequest.subtitle') || 'Emergency Medical Service'}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Map & Status */}
            <div className="lg:col-span-2 space-y-6">
              {/* Live Map */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel rounded-3xl overflow-hidden"
              >
                <div className="p-6 border-b border-[var(--border-color)] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-600/10 rounded-xl flex items-center justify-center">
                      <Navigation className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <h2 className="font-black text-[var(--text-primary)] uppercase text-sm">
                        {t('ambulanceRequest.liveTracking') || 'Live Tracking'}
                      </h2>
                      <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest">
                        Real-time ambulance location
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Live</span>
                  </div>
                </div>
                <div className="h-80 relative">
                  <EmergencyMap 
                    center={coords}
                    zoom={14}
                    markers={trackingMarkers}
                    route={route}
                    showUserLocation={true}
                    userCoords={coords}
                  />
                </div>
              </motion.div>

              {/* Driver Status & ETA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-2 gap-4"
              >
                <div className="glass-panel rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Truck className="w-5 h-5 text-red-600" />
                    <span className="text-xs font-black text-[var(--text-muted)] uppercase tracking-widest">
                      {t('ambulanceRequest.driverStatus') || 'Driver Status'}
                    </span>
                  </div>
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border ${getStatusColor(driverStatus)}`}>
                    <Activity className={`w-4 h-4 ${driverStatus === 'enRoute' ? 'animate-pulse' : ''}`} />
                    <span className="font-black text-sm uppercase tracking-wider">{getStatusLabel(driverStatus)}</span>
                  </div>
                  {driverStatus !== 'pending' && (
                    <div className="mt-4 text-xs text-[var(--text-muted)]">
                      <p className="font-bold">Driver: Rajesh Kumar</p>
                      <p>Vehicle: KA-01-AB-1234</p>
                    </div>
                  )}
                </div>

                <div className="glass-panel rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Clock className="w-5 h-5 text-red-600" />
                    <span className="text-xs font-black text-[var(--text-muted)] uppercase tracking-widest">
                      {t('ambulanceRequest.eta') || 'ETA'}
                    </span>
                  </div>
                  <div className="text-4xl font-mono font-black text-[var(--text-primary)]">
                    {eta > 0 ? `${eta} min` : 'Arrived'}
                  </div>
                  <p className="text-xs text-[var(--text-muted)] mt-2">Estimated arrival time</p>
                </div>
              </motion.div>

              {/* Location Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="glass-panel rounded-2xl p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-blue-500" />
                    <div>
                      <span className="text-xs font-black text-[var(--text-muted)] uppercase tracking-widest">Your Location</span>
                      <p className="text-sm font-mono text-[var(--text-primary)]">
                        {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={refreshLocation}
                    className="p-2 rounded-lg bg-[var(--hover-bg)] hover:bg-blue-500/10 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4 text-blue-500" />
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Right Column - Nearby Hospitals, Summary, Timeline */}
            <div className="space-y-6">
              {/* Booking Summary */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-panel rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Clipboard className="w-5 h-5 text-red-600" />
                  <span className="text-xs font-black text-[var(--text-muted)] uppercase tracking-widest">
                    {t('ambulanceRequest.bookingSummary') || 'Booking Summary'}
                  </span>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">Patient</span>
                    <span className="font-bold text-[var(--text-primary)]">{formData.patientName || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">Contact</span>
                    <span className="font-bold text-[var(--text-primary)]">{formData.contactNumber || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">Type</span>
                    <span className="font-bold text-red-600">{formData.emergencyType}</span>
                  </div>
                </div>
              </motion.div>

              {/* Timeline */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-panel rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Activity className="w-5 h-5 text-red-600" />
                  <span className="text-xs font-black text-[var(--text-muted)] uppercase tracking-widest">
                    {t('ambulanceRequest.timeline') || 'Request Timeline'}
                  </span>
                </div>
                <div className="space-y-4">
                  {timeline.map((event, idx) => (
                    <div key={event.id} className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        {event.completed ? (
                          <CheckCircle className="w-5 h-5 text-emerald-500" />
                        ) : (
                          <Circle className="w-5 h-5 text-[var(--text-muted)]" />
                        )}
                        {idx < timeline.length - 1 && (
                          <div className={`w-0.5 h-8 mt-1 ${event.completed ? 'bg-emerald-500' : 'bg-[var(--border-color)]'}`} />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-bold ${event.completed ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}`}>
                          {event.status}
                        </p>
                        {event.time && (
                          <p className="text-[10px] text-emerald-500 font-mono">{event.time}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Nearby Hospitals */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-panel rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Hospital className="w-5 h-5 text-red-600" />
                  <span className="text-xs font-black text-[var(--text-muted)] uppercase tracking-widest">
                    {t('ambulanceRequest.nearbyHospitals') || 'Nearby Hospitals'}
                  </span>
                </div>
                <div className="space-y-3">
                  {nearbyHospitals.map((hospital) => (
                    <div 
                      key={hospital.id}
                      className="p-3 bg-[var(--hover-bg)] rounded-xl border border-[var(--border-color)]"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-bold text-[var(--text-primary)]">{hospital.name}</p>
                          <p className="text-[10px] text-[var(--text-muted)]">{hospital.distance} away</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-emerald-500">{hospital.eta}</p>
                          <p className="text-[10px] text-[var(--text-muted)]">{hospital.beds} beds</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Booking Form View
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
                <h1 className="text-2xl font-black text-[var(--text-primary)] uppercase italic">
                  {t('ambulanceRequest.title') || 'Request Ambulance'}
                </h1>
                <p className="text-xs font-bold text-red-600 uppercase tracking-widest mt-1">
                  {t('ambulanceRequest.subtitle') || 'Emergency Medical Service'}
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Patient Information */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <User className="w-4 h-4 text-red-600" />
                <label className="text-xs font-black text-[var(--text-muted)] uppercase tracking-widest">
                  {t('ambulanceRequest.patientInfo') || 'Patient Information'}
                </label>
              </div>
              <input
                type="text"
                placeholder={t('ambulanceRequest.fullName') || 'Full Name'}
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
                <label className="text-xs font-black text-[var(--text-muted)] uppercase tracking-widest">
                  {t('ambulanceRequest.contactNumber') || 'Contact Number'}
                </label>
              </div>
              <input
                type="tel"
                placeholder={t('ambulanceRequest.contactNumber') || 'Mobile Number'}
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
                <label className="text-xs font-black text-[var(--text-muted)] uppercase tracking-widest">
                  {t('ambulanceRequest.emergencyType') || 'Emergency Type'}
                </label>
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
                <label className="text-xs font-black text-[var(--text-muted)] uppercase tracking-widest">
                  {t('ambulanceRequest.symptoms') || 'Symptoms / Description'}
                </label>
              </div>
              <textarea
                placeholder={t('ambulanceRequest.symptoms') || 'Describe symptoms or emergency situation'}
                value={formData.symptoms}
                onChange={(e) => setFormData({...formData, symptoms: e.target.value})}
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-muted)] font-semibold text-sm focus:outline-none focus:border-red-600/50 resize-none"
              />
            </div>

            {/* Map Preview with Real Location */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-red-600" />
                  <label className="text-xs font-black text-[var(--text-muted)] uppercase tracking-widest">
                    {t('ambulanceRequest.currentLocation') || 'Current Location'}
                  </label>
                </div>
                <button 
                  type="button"
                  onClick={refreshLocation}
                  className="flex items-center gap-2 text-[10px] font-bold text-blue-500 uppercase tracking-widest hover:text-blue-400 transition-colors"
                >
                  <Locate className="w-3.5 h-3.5" />
                  Refresh
                </button>
              </div>
              
              {/* Location Status */}
              {locationLoading && (
                <div className="mb-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center gap-3">
                  <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
                  <span className="text-xs text-blue-500 font-bold">Detecting your location...</span>
                </div>
              )}
              
              {permissionDenied && (
                <div className="mb-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex items-center gap-3">
                  <AlertCircle className="w-4 h-4 text-yellow-500" />
                  <span className="text-xs text-yellow-600 dark:text-yellow-400 font-bold">
                    Location access denied. Using default location (Bangalore).
                  </span>
                </div>
              )}

              {/* Coordinates Display */}
              <div className="mb-3 p-3 bg-[var(--hover-bg)] rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  <span className="text-xs font-mono text-[var(--text-muted)]">
                    LAT: {coords.lat.toFixed(6)} | LNG: {coords.lng.toFixed(6)}
                  </span>
                </div>
              </div>

              <div className="h-56 bg-[var(--card-bg)] rounded-xl overflow-hidden border border-[var(--border-color)] relative">
                <EmergencyMap 
                  center={coords}
                  zoom={15}
                  markers={[
                    { id: 'user-location', coords: coords, type: 'user', label: 'Your Location' }
                  ]}
                  showUserLocation={true}
                  userCoords={coords}
                />
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
              {isSubmitting 
                ? (t('ambulanceRequest.dispatching') || 'Dispatching...') 
                : (t('ambulanceRequest.requestAmbulance') || 'Request Ambulance')}
              {!isSubmitting && <ChevronRight className="w-5 h-5" />}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
