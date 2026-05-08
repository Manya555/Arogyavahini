import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart,
  Bell,
  Globe,
  Moon,
  Sun,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage, useTheme } from '../context/UIContext';

export const Navbar = () => {
  const { user, logout, login } = useAuth();
  const { language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { to: '/user-dashboard', label: 'Dashboard' },
    { to: '/sos-booking', label: 'SOS Emergency' },
    { to: '/live-map', label: 'Live Tracking' },
    { to: '/hospitals', label: 'Hospitals' },
  ];

  return (
    <nav className={`fixed top-0 lg:left-20 right-0 z-50 transition-all duration-500 ${scrolled
        ? 'bg-[var(--bg-primary)]/80 backdrop-blur-2xl border-b border-[var(--border-color)] h-20'
        : 'bg-transparent h-24'
      }`}>
      <div className="px-6 lg:px-10 h-full">
        <div className="flex justify-between h-full items-center">
          {/* Left Side: Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center space-x-4 group">
              <div className="relative">
                <div className="absolute inset-0 bg-red-600 rounded-lg blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="p-3 bg-red-600/10 rounded-2xl border border-red-600/20 relative z-10 group-hover:rotate-12 transition-transform duration-500">
                  <Heart className="w-6 h-6 text-red-600 fill-red-600" />
                </div>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-xl lg:text-2xl font-black tracking-tighter text-[var(--text-primary)] uppercase italic">
                  Arogya<span className="text-red-600 italic">Vahini</span>
                </span>
                <span className="text-[8px] font-black tracking-[0.4em] text-[var(--text-muted)] uppercase mt-1.5 hidden sm:block">MEDICAL EMERGENCY RESPONSE</span>
              </div>
            </Link>

            <div className="hidden xl:flex items-center gap-8 ml-10 pl-10 border-l border-[var(--border-color)]">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:text-red-500 relative py-2 ${location.pathname === link.to ? 'text-red-600' : 'text-[var(--text-muted)]'
                    }`}
                >
                  {link.label}
                  {location.pathname === link.to && (
                    <motion.div layoutId="nav-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600" />
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4 lg:gap-6">
            {!user ? (
              <button onClick={() => setIsLoginOpen(true)} className="btn-primary min-w-[140px] px-6 lg:px-8">
                <Bell className="w-4 h-4 animate-pulse" />
                <span>Login</span>
              </button>
            ) : (
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-[8px] font-black text-red-600 uppercase tracking-widest">{String(user.role)}</span>
                  <span className="text-xs font-black text-[var(--text-primary)]">{String(user.name)}</span>
                </div>
                <button onClick={logout} className="p-3 bg-red-600/10 text-red-600 border border-red-600/20 rounded-xl hover:bg-red-600 hover:text-white transition-all">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-3 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl">
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <AnimatePresence>
        {isLoginOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
            onClick={() => setIsLoginOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-3xl p-8 max-w-sm w-full shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-2xl font-black text-[var(--text-primary)] uppercase italic mb-8">Login</h2>
              <div className="space-y-3">
                {['Patient', 'Driver', 'Hospital', 'Admin'].map((role) => (
                  <button
                    key={role}
                    onClick={() => {
                      // FIXED: Passing separate string arguments instead of one object
                      login(role as any, `user-${Date.now()}`, `${role} User`);
                      setIsLoginOpen(false);
                    }}
                    className="w-full py-4 rounded-xl font-black uppercase tracking-widest text-white transition-all bg-red-600 hover:bg-red-700 border-2 border-red-500"
                  >
                    Login as {role}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};