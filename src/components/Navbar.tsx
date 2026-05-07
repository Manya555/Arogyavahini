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
  X,
  Activity,
  ShieldCheck,
  TrendingUp,
  Hospital
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage, useTheme } from '../context/UIContext';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { t, setLanguage, language } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/emergency', label: 'Emergency' },
    { to: '/ambulance-booking', label: 'Book Ambulance' },
    { to: '/hospitals', label: 'Hospitals' },
  ];

  return (
    <nav className={`fixed top-0 lg:left-20 right-0 z-50 transition-all duration-500 ${
      scrolled 
        ? 'bg-[var(--bg-primary)]/80 backdrop-blur-2xl border-b border-[var(--border-color)] h-20' 
        : 'bg-transparent h-24'
    }`}>
      <div className="px-6 lg:px-10 h-full">
        <div className="flex justify-between h-full items-center">
          {/* Left Side: Logo & Quick Stats */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center space-x-4 group">
              <div className="relative">
                <div className="absolute inset-0 bg-red-600 rounded-lg blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="p-3 bg-red-600/10 rounded-2xl border border-red-600/20 relative z-10 group-hover:rotate-12 transition-transform duration-500">
                  <Heart className="w-6 h-6 text-red-600 fill-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)]" />
                </div>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-xl lg:text-2xl font-black tracking-tighter text-[var(--text-primary)] uppercase italic">
                  Arogya<span className="text-red-600 italic">Vahini</span>
                </span>
                <span className="text-[8px] font-black tracking-[0.4em] text-[var(--text-muted)] uppercase mt-1.5 opacity-60 hidden sm:block">MEDICAL EMERGENCY RESPONSE</span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden xl:flex items-center gap-8 ml-10 pl-10 border-l border-[var(--border-color)]">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:text-red-500 relative py-2 ${
                    location.pathname === link.to ? 'text-red-600' : 'text-[var(--text-muted)]'
                  }`}
                >
                  {link.label}
                  {location.pathname === link.to && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 shadow-[0_0_10px_rgba(239,68,68,0.8)]"
                    />
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Side: Actions */}
          <div className="flex items-center gap-4 lg:gap-6">
            <div className="hidden lg:flex items-center gap-3 bg-[var(--hover-bg)] p-1.5 rounded-2xl border border-[var(--border-color)]">
              {/* Language Selector */}
              <div className="relative group">
                <button className="flex items-center gap-3 px-4 py-2 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl text-[var(--text-muted)] font-black text-[9px] uppercase tracking-widest hover:border-emerald-500/30 transition-all italic">
                  <Globe className="w-4 h-4 text-emerald-600" />
                  {language.toUpperCase()}
                </button>
                <div className="absolute top-full right-0 mt-4 w-48 bg-[var(--bg-secondary)]/95 backdrop-blur-xl border border-[var(--border-color)] rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0 transition-all z-50 overflow-hidden">
                   <div className="p-2 space-y-1">
                      {['en', 'kn', 'hi'].map(lang => (
                        <button
                          key={lang}
                          onClick={() => setLanguage(lang as any)}
                          className={`w-full text-left px-4 py-3 rounded-xl transition-all flex flex-col italic border ${
                            language === lang ? 'bg-red-600 text-white border-red-400/60' : 'text-[var(--text-muted)] hover:bg-[var(--hover-bg)] border-transparent'
                          }`}
                        >
                          <span className="text-[10px] font-black uppercase tracking-tight">{lang === 'en' ? 'English' : lang === 'kn' ? 'ಕನ್ನಡ' : 'हिन्दी'}</span>
                        </button>
                      ))}
                   </div>
                </div>
              </div>
              
              <button 
                onClick={toggleTheme}
                className="p-2.5 hover:bg-[var(--hover-bg)] text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-xl transition-all"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>

            {!user ? (
               <Link to="/ambulance-booking" className="btn-primary min-w-[140px] px-6 lg:px-8">
                  <Bell className="w-4 h-4 animate-pulse" />
                  <span className="hidden sm:inline">SOS Protocol</span>
                  <span className="sm:hidden">SOS</span>
               </Link>
            ) : (
                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-[8px] font-black text-red-600 uppercase tracking-widest">{user.role}</span>
                    <span className="text-xs font-black text-[var(--text-primary)]">{user.name}</span>
                  </div>
                  <button onClick={logout} className="p-3 bg-red-600/10 text-red-600 border border-red-600/20 rounded-xl hover:bg-red-600 hover:text-white transition-all">
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
            )}

            {/* Mobile Toggle */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-3 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 z-[100] lg:hidden bg-[var(--bg-primary)]/98 backdrop-blur-xl flex flex-col p-8"
          >
            <div className="flex justify-between items-center mb-16">
              <div className="text-xl font-black text-red-500 italic uppercase">Menu</div>
              <button onClick={() => setIsMenuOpen(false)} className="p-3 bg-[var(--card-bg)] rounded-2xl border border-[var(--border-color)]">
                <X className="w-6 h-6 text-[var(--text-muted)]" />
              </button>
            </div>
            
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-4xl font-black uppercase tracking-tighter text-[var(--text-primary)] italic hover:text-red-500 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="mt-auto space-y-6">
              <div className="flex gap-4">
                <button onClick={toggleTheme} className="flex-1 py-4 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] flex items-center justify-center gap-3">
                  {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </button>
                <div className="flex-1 py-4 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] flex items-center justify-center gap-3">
                  <Globe className="w-4 h-4" />
                  {language.toUpperCase()}
                </div>
              </div>
              <Link to="/ambulance-booking" onClick={() => setIsMenuOpen(false)} className="block w-full py-6 bg-red-600 text-white rounded-2xl text-center text-sm font-black uppercase tracking-[0.2em] italic shadow-2xl shadow-red-900/40">
                Initiate SOS Protocol
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
