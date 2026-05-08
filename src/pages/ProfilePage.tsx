/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  History, 
  Hospital, 
  FileText, 
  Bed,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  MapPin,
  Phone,
  Activity,
  ChevronRight,
  LogOut,
  Settings
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/UIContext';
import { useNavigate } from 'react-router-dom';

type TabType = 'bookings' | 'hospitals' | 'records' | 'beds';

interface Booking {
  id: string;
  date: string;
  time: string;
  status: 'Completed' | 'Pending' | 'Cancelled';
  emergencyType: string;
  hospitalName: string;
  driverName: string;
}

interface HospitalVisit {
  id: string;
  hospitalName: string;
  visitDate: string;
  department: string;
  doctor: string;
  diagnosis: string;
}

interface MedicalRecord {
  id: string;
  type: string;
  date: string;
  description: string;
  doctor: string;
}

interface HospitalBed {
  id: string;
  hospitalName: string;
  totalBeds: number;
  availableBeds: number;
  icuBeds: number;
  icuAvailable: number;
}

// Mock data - in production would come from localStorage or API
const mockBookings: Booking[] = [
  { id: '1', date: '2024-01-15', time: '14:32', status: 'Completed', emergencyType: 'Medical', hospitalName: 'City General Hospital', driverName: 'Rajesh Kumar' },
  { id: '2', date: '2024-01-10', time: '09:15', status: 'Completed', emergencyType: 'Trauma', hospitalName: 'Apollo Emergency Center', driverName: 'Suresh Patel' },
  { id: '3', date: '2024-01-05', time: '22:45', status: 'Pending', emergencyType: 'Cardiac', hospitalName: 'Regional Trauma Center', driverName: 'Pending...' },
  { id: '4', date: '2023-12-28', time: '16:20', status: 'Cancelled', emergencyType: 'Other', hospitalName: 'St. Mary Medical', driverName: 'N/A' },
];

const mockHospitalVisits: HospitalVisit[] = [
  { id: '1', hospitalName: 'City General Hospital', visitDate: '2024-01-15', department: 'Emergency', doctor: 'Dr. Sharma', diagnosis: 'Acute respiratory infection' },
  { id: '2', hospitalName: 'Apollo Emergency Center', visitDate: '2024-01-10', department: 'Trauma', doctor: 'Dr. Reddy', diagnosis: 'Minor fracture - left arm' },
  { id: '3', hospitalName: 'St. Mary Medical', visitDate: '2023-12-20', department: 'General', doctor: 'Dr. Kumar', diagnosis: 'Annual health checkup' },
];

const mockMedicalRecords: MedicalRecord[] = [
  { id: '1', type: 'Lab Report', date: '2024-01-15', description: 'Complete Blood Count (CBC)', doctor: 'Dr. Sharma' },
  { id: '2', type: 'X-Ray', date: '2024-01-10', description: 'Left arm X-ray - Post trauma', doctor: 'Dr. Reddy' },
  { id: '3', type: 'Prescription', date: '2024-01-15', description: 'Antibiotics for respiratory infection', doctor: 'Dr. Sharma' },
  { id: '4', type: 'Vaccination', date: '2023-11-20', description: 'Flu vaccination', doctor: 'Dr. Kumar' },
];

const mockBedAvailability: HospitalBed[] = [
  { id: '1', hospitalName: 'City General Hospital', totalBeds: 200, availableBeds: 45, icuBeds: 20, icuAvailable: 5 },
  { id: '2', hospitalName: 'Apollo Emergency Center', totalBeds: 150, availableBeds: 32, icuBeds: 15, icuAvailable: 3 },
  { id: '3', hospitalName: 'St. Mary Medical', totalBeds: 180, availableBeds: 28, icuBeds: 18, icuAvailable: 7 },
  { id: '4', hospitalName: 'Regional Trauma Center', totalBeds: 120, availableBeds: 15, icuBeds: 12, icuAvailable: 2 },
];

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('bookings');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [hospitalVisits, setHospitalVisits] = useState<HospitalVisit[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [bedAvailability, setBedAvailability] = useState<HospitalBed[]>([]);

  useEffect(() => {
    // Load data from localStorage or use mock data
    const savedBookings = localStorage.getItem('arogyavahini_bookings');
    const savedVisits = localStorage.getItem('arogyavahini_visits');
    const savedRecords = localStorage.getItem('arogyavahini_records');
    
    setBookings(savedBookings ? JSON.parse(savedBookings) : mockBookings);
    setHospitalVisits(savedVisits ? JSON.parse(savedVisits) : mockHospitalVisits);
    setMedicalRecords(savedRecords ? JSON.parse(savedRecords) : mockMedicalRecords);
    setBedAvailability(mockBedAvailability);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const tabs = [
    { id: 'bookings', label: 'Booking History', icon: History },
    { id: 'hospitals', label: 'Hospital Visits', icon: Hospital },
    { id: 'records', label: 'Medical Records', icon: FileText },
    { id: 'beds', label: 'Bed Availability', icon: Bed },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'Pending': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'Cancelled': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-[var(--text-muted)] bg-[var(--hover-bg)]';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 min-h-screen">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel rounded-3xl p-8 mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-red-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-red-600/30">
              <User className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-[var(--text-primary)] uppercase italic">
                {user?.name || 'Guest User'}
              </h1>
              <p className="text-sm text-[var(--text-muted)] font-bold uppercase tracking-widest mt-1">
                {user?.role || 'Public User'} Account
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-2">
                Member since January 2024
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="p-3 rounded-xl bg-[var(--hover-bg)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600/10 border border-red-600/20 text-red-600 font-bold text-xs uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap gap-2 mb-8 bg-[var(--bg-secondary)] p-2 rounded-2xl border border-[var(--border-color)]"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
              activeTab === tab.id
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)]'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {/* Booking History */}
        {activeTab === 'bookings' && (
          <motion.div
            key="bookings"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {bookings.map((booking, idx) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="glass-panel rounded-2xl p-6"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-red-600/10 rounded-xl flex items-center justify-center">
                      <Activity className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-black text-[var(--text-primary)] uppercase text-sm mb-1">
                        {booking.emergencyType} Emergency
                      </h3>
                      <p className="text-xs text-[var(--text-muted)]">
                        {booking.hospitalName}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {booking.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {booking.time}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs text-[var(--text-muted)]">Driver</p>
                      <p className="font-bold text-sm text-[var(--text-primary)]">{booking.driverName}</p>
                    </div>
                    <span className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}

            {bookings.length === 0 && (
              <div className="glass-panel rounded-2xl p-12 text-center">
                <History className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4" />
                <p className="text-[var(--text-muted)] font-bold uppercase tracking-widest text-sm">
                  No booking history found
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* Hospital Visits */}
        {activeTab === 'hospitals' && (
          <motion.div
            key="hospitals"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {hospitalVisits.map((visit, idx) => (
              <motion.div
                key={visit.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="glass-panel rounded-2xl p-6"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                      <Hospital className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div>
                      <h3 className="font-black text-[var(--text-primary)] uppercase text-sm mb-1">
                        {visit.hospitalName}
                      </h3>
                      <p className="text-xs text-[var(--text-muted)] mb-2">
                        Department: {visit.department}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest">
                        <Calendar className="w-3 h-3" />
                        {visit.visitDate}
                      </div>
                    </div>
                  </div>
                  <div className="bg-[var(--hover-bg)] rounded-xl p-4 border border-[var(--border-color)]">
                    <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest mb-1">Attending Doctor</p>
                    <p className="font-bold text-sm text-[var(--text-primary)]">{visit.doctor}</p>
                    <p className="text-xs text-[var(--text-muted)] mt-2">{visit.diagnosis}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Medical Records */}
        {activeTab === 'records' && (
          <motion.div
            key="records"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {medicalRecords.map((record, idx) => (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="glass-panel rounded-2xl p-6 hover:border-red-600/30 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-500" />
                  </div>
                  <span className="px-3 py-1 rounded-lg bg-[var(--hover-bg)] text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">
                    {record.type}
                  </span>
                </div>
                <h3 className="font-bold text-[var(--text-primary)] text-sm mb-2">
                  {record.description}
                </h3>
                <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest">
                  <span>{record.doctor}</span>
                  <span>{record.date}</span>
                </div>
                <div className="mt-4 pt-4 border-t border-[var(--border-color)] opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="flex items-center gap-2 text-red-600 text-[10px] font-black uppercase tracking-widest">
                    View Details <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Bed Availability */}
        {activeTab === 'beds' && (
          <motion.div
            key="beds"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {bedAvailability.map((hospital, idx) => (
              <motion.div
                key={hospital.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="glass-panel rounded-2xl p-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                      <Hospital className="w-6 h-6 text-purple-500" />
                    </div>
                    <div>
                      <h3 className="font-black text-[var(--text-primary)] uppercase text-sm">
                        {hospital.hospitalName}
                      </h3>
                      <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest mt-1">
                        Last updated: 5 min ago
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-[var(--hover-bg)] rounded-xl p-4 text-center border border-[var(--border-color)]">
                      <p className="text-2xl font-mono font-black text-[var(--text-primary)]">{hospital.totalBeds}</p>
                      <p className="text-[9px] text-[var(--text-muted)] font-bold uppercase tracking-widest mt-1">Total Beds</p>
                    </div>
                    <div className="bg-emerald-500/10 rounded-xl p-4 text-center border border-emerald-500/20">
                      <p className="text-2xl font-mono font-black text-emerald-500">{hospital.availableBeds}</p>
                      <p className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-widest mt-1">Available</p>
                    </div>
                    <div className="bg-[var(--hover-bg)] rounded-xl p-4 text-center border border-[var(--border-color)]">
                      <p className="text-2xl font-mono font-black text-[var(--text-primary)]">{hospital.icuBeds}</p>
                      <p className="text-[9px] text-[var(--text-muted)] font-bold uppercase tracking-widest mt-1">ICU Beds</p>
                    </div>
                    <div className={`rounded-xl p-4 text-center border ${hospital.icuAvailable > 3 ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                      <p className={`text-2xl font-mono font-black ${hospital.icuAvailable > 3 ? 'text-emerald-500' : 'text-red-500'}`}>
                        {hospital.icuAvailable}
                      </p>
                      <p className={`text-[9px] font-bold uppercase tracking-widest mt-1 ${hospital.icuAvailable > 3 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                        ICU Free
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Availability Bar */}
                <div className="mt-4 pt-4 border-t border-[var(--border-color)]">
                  <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest mb-2">
                    <span>Bed Occupancy</span>
                    <span>{Math.round((1 - hospital.availableBeds / hospital.totalBeds) * 100)}%</span>
                  </div>
                  <div className="h-2 bg-[var(--hover-bg)] rounded-full overflow-hidden border border-[var(--border-color)]">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        (1 - hospital.availableBeds / hospital.totalBeds) > 0.8 
                          ? 'bg-red-500' 
                          : (1 - hospital.availableBeds / hospital.totalBeds) > 0.6 
                            ? 'bg-yellow-500' 
                            : 'bg-emerald-500'
                      }`}
                      style={{ width: `${(1 - hospital.availableBeds / hospital.totalBeds) * 100}%` }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
