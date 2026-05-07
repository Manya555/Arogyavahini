/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { SimulationProvider } from './context/SimulationContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, LanguageProvider, useLanguage, useTheme } from './context/UIContext';
import { Heart, Activity, ShieldCheck, MapPin, Truck, Hospital, UserCog, LogOut, Bell, Menu, X, Globe, Moon, Sun, TrendingUp, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from './components/Navbar';
import LandingPage from './pages/LandingPage';
import BookingPage from './pages/BookingPage';
import TrackingPage from './pages/TrackingPage';
import DriverDashboard from './pages/DriverDashboard';
import HospitalDashboard from './pages/HospitalDashboard';
import HospitalListingsPage from './pages/HospitalListingsPage';
import AdminDashboard from './pages/AdminDashboard';
import LoginPages from './pages/LoginPages';
import { EmergencyStatus } from './context/SimulationContext';

// Global Protected Route Helper
const ProtectedRoute = ({ children, roles }: { children: React.ReactNode, roles: string[] }) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && (!user || !roles.includes(user.role))) {
      navigate('/');
    }
  }, [user, isLoading, roles, navigate]);

  if (isLoading) return <div className="h-screen w-screen flex items-center justify-center bg-[var(--bg-primary)]"><Activity className="w-12 h-12 text-emerald-500 animate-spin" /></div>;
  if (!user || !roles.includes(user.role)) return null;

  return <>{children}</>;
};

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const navItems = [
    { to: "/", icon: Heart, label: 'Home', id: 'home' },
    { to: "/ambulance-booking", icon: Truck, label: 'Book Ambulance', id: 'ambulance' },
    { to: "/hospitals", icon: Hospital, label: 'Hospitals', id: 'hospitals' },
    { to: "/admin", icon: ShieldCheck, label: 'Admin Portal', id: 'admin' },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="fixed left-0 top-0 bottom-0 w-20 bg-[var(--sidebar-bg)] border-r border-[var(--border-color)] z-[60] hidden lg:flex flex-col items-center py-10 gap-12">
        <Link to="/" className="w-12 h-12 rounded-2xl bg-red-600/10 flex items-center justify-center border border-red-600/25 group transition-all hover:bg-red-600/15">
          <div className="w-3 h-3 bg-red-600 rounded-full animate-ping group-hover:scale-150 transition-transform" />
        </Link>
        
        <div className="flex-1 flex flex-col items-center gap-10">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
              
            return (
              <Link 
                key={item.id}
                to={item.to} 
                className={`relative group p-3 transition-all duration-300 rounded-2xl ${
                  isActive
                    ? 'bg-red-600 text-white shadow-xl shadow-red-900/20 cursor-default'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)]'
                }`}
              >
                <item.icon className="w-6 h-6" />
                {isActive && (
                  <motion.div 
                    layoutId="sidebar-active"
                    className="absolute left-[-20px] top-2 bottom-2 w-1.5 bg-red-600 rounded-r-full shadow-[0_0_18px_var(--glow-red)]"
                  />
                )}
                {/* Technical Tooltip */}
                <div className="absolute left-full ml-6 px-4 py-2 bg-[var(--tooltip-bg)] text-[var(--tooltip-text)] text-[9px] font-black uppercase tracking-[0.2em] rounded-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0 whitespace-nowrap z-[100] border border-[var(--border-strong)] shadow-2xl flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_var(--glow-red)]" />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </div>
  
        <div className="flex flex-col items-center gap-6 mt-auto">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-[0_0_15px_var(--glow-emerald)]" 
            title="System Online" 
          />
          <div className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest vertical-text py-6 select-none opacity-40">AXON_SECURE_NODE</div>
        </div>
      </div>

      {/* Mobile Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 h-20 bg-[var(--sidebar-bg)]/85 border-t border-[var(--border-color)] z-[60] flex items-center justify-around px-4 backdrop-blur-xl">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
            
          return (
            <Link 
              key={item.id}
              to={item.to} 
              className={`flex flex-col items-center gap-1.5 ${isActive ? 'text-red-600' : 'text-[var(--text-muted)]'}`}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-[8px] font-black uppercase tracking-widest leading-none">{item.id}</span>
            </Link>
          );
        })}
        <button 
          onClick={user ? () => {} : () => {}} 
          className="text-[var(--text-muted)] flex flex-col items-center gap-1.5 hover:text-[var(--text-primary)] transition-colors"
        >
          <UserCog className="w-6 h-6" />
          <span className="text-[8px] font-black uppercase tracking-widest leading-none">Profile</span>
        </button>
      </div>
    </>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <SimulationProvider>
            <Router>
              <div className="min-h-screen bg-[var(--bg-primary)] font-sans text-[var(--text-primary)] flex overflow-x-hidden">
                <Sidebar />

                <div className="flex-1 lg:ml-20">
                   <Navbar />
                   <main className="pt-20 pb-28 lg:pb-12 px-4 lg:px-0">
                     <Routes>
                       <Route path="/" element={<LandingPage />} />
                       <Route path="/ambulance-booking" element={<BookingPage />} />
                       <Route path="/tracking/:id" element={<TrackingPage />} />
                       
                       {/* Logins */}
                       <Route path="/login/driver" element={<LoginPages type="driver" />} />
                       <Route path="/internal/hospital-login" element={<LoginPages type="hospital" />} />
                       <Route path="/internal/admin-login" element={<LoginPages type="admin" />} />

                       {/* Dashboards */}
                       <Route path="/driver" element={
                         <ProtectedRoute roles={['Driver']}>
                           <DriverDashboard />
                         </ProtectedRoute>
                       } />
                       <Route path="/hospitals" element={<HospitalListingsPage />} />
                       <Route path="/admin" element={
                         <ProtectedRoute roles={['Admin']}>
                           <AdminDashboard />
                         </ProtectedRoute>
                       } />
                     </Routes>
                   </main>
                </div>
              </div>
            </Router>
          </SimulationProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
