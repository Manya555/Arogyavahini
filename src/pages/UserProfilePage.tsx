/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useAuth } from '../context/AuthContext';
import { useSimulation } from '../context/SimulationContext';
import { useLanguage } from '../context/UIContext';
import { motion } from 'motion/react';
import { useState, useMemo } from 'react';
import { Calendar, MapPin, FileText, Hospital, Heart, User, LogOut, Activity, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BookingRecord {
  id: string;
  date: string;
  ambulanceId: string;
  hospitalId: string;
  status: 'Pending' | 'Accepted' | 'Completed';
  type: string;
}

interface HospitalVisit {
  id: string;
  hospitalName: string;
  date: string;
  department: string;
  notes: string;
}

interface MedicalRecord {
  id: string;
  date: string;
  type: string;
  description: string;
  doctor: string;
}

export default function UserProfilePage() {
  const { user, logout } = useAuth();
  const { hospitals, emergencies } = useSimulation();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'bookings' | 'visits' | 'records' | 'beds'>('bookings');

  // Mock booking history from emergencies
  const bookingHistory = useMemo(() => {
    return emergencies.slice(0, 5).map((e, idx) => ({
      id: e.id,
      date: new Date(e.createdAt).toLocaleDateString(),
      ambulanceId: e.ambulanceId || 'A-0' + (idx + 1),
      hospitalId: e.hospitalId || 'h1',
      status: e.status === 'Case Completed' ? 'Completed' : 'Accepted' as const,
      type: e.emergencyType
    }));
  }, [emergencies]);

  // Mock hospital visits
  const hospitalVisits: HospitalVisit[] = [
    { id: '1', hospitalName: 'Apollo Hospitals, Jayanagar', date: '2024-01-15', department: 'Emergency', notes: 'Acute chest pain - resolved' },
    { id: '2', hospitalName: 'Fortis Hospital, Bannerghatta', date: '2023-12-20', department: 'Orthopedics', notes: 'Minor fracture treatment' },
    { id: '3', hospitalName: 'Manipal Hospital, Old Airport', date: '2023-11-10', department: 'General Medicine', notes: 'Routine checkup' }
  ];

  // Mock medical records
  const medicalRecords: MedicalRecord[] = [
    { id: '1', date: '2024-01-15', type: 'Vital Signs Report', description: 'BP: 120/80, HR: 72', doctor: 'Dr. Rajesh Kumar' },
    { id: '2', date: '2023-12-20', type: 'X-Ray Report', description: 'Left arm - No fractures detected', doctor: 'Dr. Priya Sharma' },
    { id: '3', date: '2023-11-10', type: 'Lab Report', description: 'Blood work normal', doctor: 'Dr. Arjun Singh' }
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 min-h-screen">
      {/* Header Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel rounded-[2rem] p-8 mb-8 bg-gradient-to-br from-blue-600/10 to-transparent border border-blue-500/20 shadow-xl"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/40">
              <User className="w-10 h-10" />
            </div>
            <div>
              <p className="text-[10px] text-blue-500 font-black uppercase tracking-[0.2em] mb-1">{t('profile.welcome') || 'Welcome'}</p>
              <h1 className="font-black text-[var(--text-primary)] text-2xl tracking-tight leading-none mb-3">{user?.name || 'User'}</h1>
              <div className="flex items-center gap-3 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">
                <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-600">Patient</span>
                <span>ID: {user?.id?.slice(-8)}</span>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-3 bg-red-600/10 hover:bg-red-600 text-red-600 hover:text-white border border-red-600/20 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-3 mb-8 bg-[var(--bg-secondary)] p-2 rounded-[1.5rem] border border-[var(--border-color)] shadow-xl overflow-x-auto">
        {[
          { id: 'bookings' as const, label: 'Bookings', icon: Activity },
          { id: 'visits' as const, label: 'Hospital Visits', icon: Hospital },
          { id: 'records' as const, label: 'Medical Records', icon: FileText },
          { id: 'beds' as const, label: 'Bed Availability', icon: AlertCircle }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-4 rounded-[1.2rem] font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap ${
              activeTab === tab.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/30' : 'text-[var(--text-muted)] hover:text-blue-600'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bookings Tab */}
      {activeTab === 'bookings' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="glass-panel rounded-[2rem] p-8 border-blue-600/10">
            <h2 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-[0.2em] mb-8">Ambulance Booking History</h2>
            <div className="space-y-4">
              {bookingHistory.length > 0 ? (
                bookingHistory.map(booking => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-6 bg-[var(--card-bg)] rounded-xl border border-[var(--border-color)] hover:border-blue-500/30 transition-all"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                          <Activity className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-black text-[var(--text-primary)] tracking-tight">{booking.type}</p>
                          <p className="text-[10px] text-[var(--text-muted)] font-bold mt-1">Ambulance {booking.ambulanceId}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-[var(--text-muted)] mb-2">{booking.date}</p>
                        <span className={`px-3 py-1 rounded-lg text-[9px] font-black tracking-widest ${
                          booking.status === 'Completed' 
                            ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' 
                            : 'bg-blue-500/10 text-blue-600 border border-blue-500/20'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-center py-12 text-[var(--text-muted)] text-sm">No booking history yet</p>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Hospital Visits Tab */}
      {activeTab === 'visits' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="glass-panel rounded-[2rem] p-8 border-green-600/10">
            <h2 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-[0.2em] mb-8">Hospital Visit History</h2>
            <div className="space-y-4">
              {hospitalVisits.map(visit => (
                <motion.div
                  key={visit.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-6 bg-[var(--card-bg)] rounded-xl border border-[var(--border-color)] hover:border-green-500/30 transition-all"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-600 flex-shrink-0">
                      <Hospital className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <p className="font-black text-[var(--text-primary)] tracking-tight">{visit.hospitalName}</p>
                      <p className="text-[10px] text-[var(--text-muted)] font-bold mt-1 flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        {visit.date} • {visit.department}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-[var(--text-muted)] pl-16">{visit.notes}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Medical Records Tab */}
      {activeTab === 'records' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="glass-panel rounded-[2rem] p-8 border-purple-600/10">
            <h2 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-[0.2em] mb-8">Medical Records</h2>
            <div className="space-y-4">
              {medicalRecords.map(record => (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-6 bg-[var(--card-bg)] rounded-xl border border-[var(--border-color)] hover:border-purple-500/30 transition-all"
                >
                  <div className="flex items-start gap-4 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600 flex-shrink-0">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <p className="font-black text-[var(--text-primary)] tracking-tight">{record.type}</p>
                      <p className="text-[10px] text-[var(--text-muted)] font-bold mt-1">{record.date} • Dr. {record.doctor}</p>
                    </div>
                  </div>
                  <p className="text-sm text-[var(--text-muted)] pl-16">{record.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Bed Availability Tab */}
      {activeTab === 'beds' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {hospitals.map(hospital => (
            <motion.div
              key={hospital.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-panel rounded-[2rem] p-8 border-amber-600/10 hover:border-amber-600/30 transition-all"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                  <Hospital className="w-7 h-7" />
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-[var(--text-primary)] text-lg tracking-tight">{hospital.name}</h3>
                  <p className="text-[10px] text-[var(--text-muted)] font-bold mt-1 flex items-center gap-2">
                    <MapPin className="w-3 h-3" />
                    Lat: {hospital.coords.lat.toFixed(3)}, Lng: {hospital.coords.lng.toFixed(3)}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-[var(--card-bg)] rounded-xl border border-[var(--border-color)]">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">ICU Beds Available</p>
                    <p className="font-black text-emerald-600 text-lg">{hospital.icuBeds}</p>
                  </div>
                  <div className="w-full h-2 bg-[var(--hover-bg)] rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${(hospital.icuBeds / 50) * 100}%` }} />
                  </div>
                </div>
                <div className="p-4 bg-[var(--card-bg)] rounded-xl border border-[var(--border-color)]">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">General Beds</p>
                    <p className="font-black text-blue-600 text-lg">{hospital.generalBeds}</p>
                  </div>
                  <div className="w-full h-2 bg-[var(--hover-bg)] rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: `${(hospital.generalBeds / 200) * 100}%` }} />
                  </div>
                </div>
                <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Specializations</p>
                  <p className="text-[10px] text-[var(--text-muted)] mt-2 leading-relaxed">{hospital.specializations.join(' • ')}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
