import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart,
  Globe,
  Moon,
  Sun,
  LogOut,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage, useTheme, type Language } from '../context/UIContext';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close language dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setIsLangOpen(false);
    if (isLangOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isLangOpen]);

  const navLinks = [
    { to: '/dashboard', label: t('nav.dashboard') || 'Dashboard' },
    { to: '/live-map', label: t('nav.liveTracking') || 'Live Tracking' },
    { to: '/hospitals', label: t('nav.hospitals') || 'Hospitals' },
  ];

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'kn', label: 'ಕನ್ನಡ' },
    { code: 'hi', label: 'हिंदी' },
  ];

  const handleLoginClick = () => {
    navigate('/login');
  };

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
                <span className="text-[8px] font-black tracking-[0.4em] text-[var(--text-muted)] uppercase mt-1.5 hidden sm:block">
                  {t('nav.tagline') || 'MEDICAL EMERGENCY RESPONSE'}
                </span>
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
          <div className="flex items-center gap-3 lg:gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-3 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl hover:bg-[var(--hover-bg)] transition-all"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-yellow-500" />
              ) : (
                <Moon className="w-4 h-4 text-[var(--text-muted)]" />
              )}
            </button>

            {/* Language Dropdown */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLangOpen(!isLangOpen);
                }}
                className="p-3 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl hover:bg-[var(--hover-bg)] transition-all flex items-center gap-2"
                aria-label="Select language"
              >
                <Globe className="w-4 h-4 text-[var(--text-muted)]" />
                <span className="text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)] hidden sm:inline">
                  {language.toUpperCase()}
                </span>
                <ChevronDown className={`w-3 h-3 text-[var(--text-muted)] transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isLangOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 top-full mt-2 bg-[var(--card-bg-solid)] border border-[var(--border-color)] rounded-xl overflow-hidden shadow-xl z-50 min-w-[120px]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setIsLangOpen(false);
                        }}
                        className={`w-full px-4 py-3 text-left text-xs font-bold transition-all hover:bg-[var(--hover-bg)] ${
                          language === lang.code
                            ? 'text-red-600 bg-red-600/5'
                            : 'text-[var(--text-secondary)]'
                        }`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Login / User Section */}
            {!user ? (
              <button
                onClick={handleLoginClick}
                className="btn-primary min-w-[100px] px-4 lg:px-6 !py-3"
              >
                <span>{t('nav.login') || 'Login'}</span>
              </button>
            ) : (
              <div className="flex items-center gap-3">
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

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[var(--bg-primary)] border-b border-[var(--border-color)]"
          >
            <div className="px-6 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    location.pathname === link.to
                      ? 'bg-red-600/10 text-red-600'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--hover-bg)]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
