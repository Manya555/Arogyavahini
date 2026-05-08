import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/UIContext';
import { motion } from 'motion/react';
import { Heart, Mail, Lock, ChevronRight, Info } from 'lucide-react';

// Demo credentials for each role
const demoCredentials = {
  user: { email: 'user@arogyavahini.com', password: 'user123', role: 'Patient' as const, name: 'Public User' },
  driver: { email: 'driver@arogyavahini.com', password: 'driver123', role: 'Driver' as const, name: 'Rajesh Kumar', targetId: 'amb-1' },
  admin: { email: 'admin@arogyavahini.com', password: 'admin123', role: 'Admin' as const, name: 'Hospital Admin' },
};

export default function LoginPages() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useLanguage();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Role-based redirect function
  const redirectByRole = (role: string) => {
    switch (role) {
      case 'Patient':
        navigate('/profile');
        break;
      case 'Driver':
        navigate('/driver');
        break;
      case 'Admin':
      case 'Hospital':
        navigate('/admin');
        break;
      default:
        navigate('/profile');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 800));

    // Check demo credentials
    let matchedCredential = null;
    for (const [key, cred] of Object.entries(demoCredentials)) {
      if (email === cred.email && password === cred.password) {
        matchedCredential = cred;
        break;
      }
    }

    if (matchedCredential) {
      login(matchedCredential.role, `${matchedCredential.role.toLowerCase()}-${Date.now()}`, matchedCredential.name, matchedCredential.targetId);
      redirectByRole(matchedCredential.role);
    } else if (email.includes('@') && password.length >= 6) {
      // Generic login - default to Patient role
      login('Patient', `user-${Date.now()}`, email.split('@')[0] || 'User');
      navigate('/profile');
    } else {
      setError('Invalid email or password. Please try again.');
    }
    
    setIsLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    login('Patient', `google-${Date.now()}`, 'Google User');
    navigate('/profile');
  };

  const handleDemoLogin = (role: 'user' | 'driver' | 'admin') => {
    const cred = demoCredentials[role];
    setEmail(cred.email);
    setPassword(cred.password);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center px-4 relative overflow-hidden transition-colors duration-300">
      {/* Background Decor */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-panel rounded-[2.5rem] overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="p-10 text-center relative border-b border-[var(--border-color)] bg-gradient-to-b from-[var(--text-primary)]/[0.02] to-transparent">
            <Link to="/" className="inline-block mb-6">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-red-600 flex items-center justify-center text-white shadow-2xl shadow-red-600/30">
                <Heart className="w-10 h-10 fill-white" />
              </div>
            </Link>
            <h1 className="text-2xl font-black text-[var(--text-primary)] uppercase italic leading-none">
              {t('auth.title') || 'Login'}
            </h1>
            <p className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-[0.3em] mt-3">
              Arogya<span className="text-red-600">Vahini</span> Access
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="p-10 space-y-6">
            {/* Demo Credentials Cards */}
            <div className="space-y-2">
              <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-3 flex items-center gap-2">
                <Info className="w-3 h-3" />
                Demo Credentials (Click to fill)
              </p>
              
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleDemoLogin('user')}
                  className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 hover:bg-blue-500/20 transition-all text-center"
                >
                  <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest">Public</p>
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin('driver')}
                  className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 hover:bg-emerald-500/20 transition-all text-center"
                >
                  <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Driver</p>
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin('admin')}
                  className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20 hover:bg-purple-500/20 transition-all text-center"
                >
                  <p className="text-[9px] font-black text-purple-500 uppercase tracking-widest">Admin</p>
                </button>
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                <Mail className="w-3 h-3" />
                {t('auth.email') || 'Email Address'}
              </label>
              <input
                required
                type="email"
                placeholder="Enter your email..."
                className="w-full px-5 py-4 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl text-[var(--text-primary)] text-sm focus:border-red-500/40 outline-none transition-all placeholder:text-[var(--text-muted)]"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                <Lock className="w-3 h-3" />
                {t('auth.password') || 'Password'}
              </label>
              <input
                required
                type="password"
                placeholder="Enter your password..."
                className="w-full px-5 py-4 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl text-[var(--text-primary)] text-sm focus:border-red-500/40 outline-none transition-all placeholder:text-[var(--text-muted)]"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            {/* Error Message */}
            {error && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-[10px] font-black uppercase tracking-widest text-center py-2 bg-red-500/5 rounded-lg border border-red-500/10"
              >
                {error}
              </motion.p>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all shadow-2xl ${
                isLoading 
                  ? 'bg-[var(--hover-bg)] text-[var(--text-muted)] cursor-not-allowed'
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              {isLoading ? 'Authenticating...' : (t('auth.loginButton') || 'Login')}
              {!isLoading && <ChevronRight className="w-5 h-5" />}
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--border-color)]"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase">
                <span className="px-4 bg-[var(--bg-secondary)] text-[var(--text-muted)] font-black tracking-widest">
                  or continue with
                </span>
              </div>
            </div>

            {/* Google Sign In */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] hover:border-[var(--border-strong)] transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {t('auth.googleSignIn') || 'Sign in with Google'}
            </button>

            {/* Register Link */}
            <div className="text-center pt-4">
              <p className="text-[10px] text-[var(--text-muted)] font-bold">
                {t('auth.noAccount') || "Don't have an account?"}{' '}
                <button 
                  type="button"
                  className="text-red-600 hover:text-red-500 font-black uppercase tracking-wider"
                >
                  {t('auth.registerLink') || 'Create an account'}
                </button>
              </p>
            </div>
          </form>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <Link 
            to="/"
            className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-widest hover:text-red-600 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
