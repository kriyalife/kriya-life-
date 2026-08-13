import React, { useState, useEffect } from 'react';
import { Lock, Loader2, AlertCircle, ShieldCheck, UserPlus, LogIn, Mail, KeyRound, Eye, EyeOff, Sparkles, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import kriyaLogoImg from '../assets/images/regenerated_image_1784990001904.png';

export const UserAuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { loginUser, showToast, currentUser, setCurrentView } = useShop();

  const returnUrl = new URLSearchParams(location.search).get('returnUrl') || '/';

  useEffect(() => {
    // If already logged in, redirect
    if (currentUser) {
      navigate(returnUrl);
    }
  }, [currentUser, navigate, returnUrl]);

  useEffect(() => {
    // Clear autofill on mount
    const timer = setTimeout(() => {
      setEmail('');
      setPassword('');
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setError(null);

    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    if (!cleanEmail) {
      setError('Please enter a valid email address.');
      setAuthLoading(false);
      return;
    }

    // Check if logging in as Admin
    if (cleanEmail === 'kriyalifescience@gmail.com') {
      if (cleanPassword && cleanPassword.toUpperCase() !== 'PRAMUKHSWAMIMAHARAJ') {
        setError('Invalid admin password for kriyalifescience@gmail.com.');
        setAuthLoading(false);
        return;
      }
      setTimeout(() => {
        loginUser('kriyalifescience@gmail.com', 'Kriya Admin');
        showToast('Admin Access Granted', 'Signed in as Administrator.');
        setAuthLoading(false);
        navigate('/admin/dashboard');
      }, 400);
      return;
    }

    // Standard Customer Login / Registration
    setTimeout(() => {
      const emailUsername = cleanEmail.split('@')[0] || 'Customer';
      const formattedName = emailUsername.charAt(0).toUpperCase() + emailUsername.slice(1);

      loginUser(cleanEmail, formattedName);
      showToast(isLogin ? 'Welcome Back' : 'Account Created', isLogin ? `Signed in as ${formattedName}.` : 'Welcome to KRIYA Life Science.');
      setAuthLoading(false);
      navigate(returnUrl);
    }, 400);
  };

  const handleQuickDemoLogin = () => {
    setAuthLoading(true);
    setTimeout(() => {
      loginUser('guest@kriyalifescience.com', 'Valued Sanctuary Guest');
      showToast('Sanctuary Access Granted', 'Logged in as Demo Customer.');
      setAuthLoading(false);
      navigate(returnUrl);
    }, 600);
  };

  return (
    <div className="pt-24 pb-16 min-h-[85vh] bg-[#0D2217] text-white flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Decorative Background Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Back Navigation */}
      <div className="w-full max-w-md mb-6 flex items-center justify-between z-10">
        <button
          onClick={() => { setCurrentView('home'); navigate('/'); }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-stone-900/80 hover:bg-stone-800 text-emerald-300 font-bold text-xs uppercase tracking-wider rounded-xl border border-white/15 transition-all shadow-md cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Store</span>
        </button>
        <div className="flex items-center gap-1.5 text-xs text-emerald-300/80 bg-emerald-950/80 border border-emerald-500/30 px-3 py-1 rounded-full font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>SSL 256-Bit Encrypted</span>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-stone-900/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/15 space-y-6 relative z-10"
      >
        {/* Brand Header & Logo */}
        <div className="text-center space-y-3">
          <div className="inline-block p-2.5 rounded-2xl bg-stone-950 border border-emerald-500/30 shadow-inner">
            <img 
              src={kriyaLogoImg} 
              alt="Kriya Life Science Logo" 
              className="h-10 w-auto mx-auto object-contain"
              referrerPolicy="no-referrer"
            />
          </div>

          <div>
            <h2 id="kriya-user-auth-heading" className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {isLogin ? 'Sign In to Your Account' : 'Create Customer Account'}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/70 font-light mt-1.5">
              {isLogin 
                ? 'Access your custom botanical rituals, order history, and fast checkout.' 
                : 'Join Kriya Life Science to track orders, save favorites, and claim member perks.'}
            </p>
          </div>
        </div>

        {/* Tab Toggle Switch */}
        <div className="grid grid-cols-2 p-1 bg-stone-950 rounded-2xl border border-white/10">
          <button
            type="button"
            onClick={() => { setIsLogin(true); setError(null); }}
            className={`py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
              isLogin ? 'bg-emerald-500 text-stone-950 shadow-md' : 'text-emerald-100/60 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsLogin(false); setError(null); }}
            className={`py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
              !isLogin ? 'bg-emerald-500 text-stone-950 shadow-md' : 'text-emerald-100/60 hover:text-white'
            }`}
          >
            Register
          </button>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-3.5 bg-amber-950/80 border border-amber-500/40 text-amber-200 rounded-2xl text-xs flex items-start gap-2.5"
            >
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
          {/* Hidden inputs to prevent browser aggressive autofill bugs */}
          <input type="text" className="hidden" aria-hidden="true" />
          <input type="password" className="hidden" aria-hidden="true" />

          <div>
            <label className="block text-xs font-bold text-emerald-200 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-stone-950 rounded-xl border border-white/20 text-sm focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 text-white placeholder-white/40 transition-colors"
                required
                placeholder="you@example.com"
                autoComplete="off"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-emerald-200 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-400">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-stone-950 rounded-xl border border-white/20 text-sm focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 text-white placeholder-white/40 transition-colors"
                required
                placeholder="••••••••"
                minLength={6}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-emerald-100/60 hover:text-white transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={authLoading}
            className="w-full py-3.5 bg-emerald-400 hover:bg-emerald-300 text-stone-950 font-extrabold text-xs tracking-wider uppercase rounded-2xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {authLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-stone-950" />
            ) : isLogin ? (
              <LogIn className="w-4 h-4 text-stone-950" />
            ) : (
              <UserPlus className="w-4 h-4 text-stone-950" />
            )}
            <span>{isLogin ? 'Sign In Securely' : 'Create Account'}</span>
          </button>
        </form>

        {/* One-Click Quick Guest / Demo Customer Login */}
        <div className="pt-2">
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-white/15"></div>
            <span className="flex-shrink mx-3 text-[10px] uppercase font-bold text-emerald-100/50 tracking-widest">
              Instant Access
            </span>
            <div className="flex-grow border-t border-white/15"></div>
          </div>

          <button
            type="button"
            onClick={handleQuickDemoLogin}
            disabled={authLoading}
            className="w-full py-2.5 bg-stone-950 hover:bg-stone-800 text-emerald-300 font-semibold text-xs rounded-xl border border-emerald-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:border-emerald-400"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Continue as Guest Customer</span>
          </button>
        </div>

        {/* Footer Features */}
        <div className="pt-4 border-t border-white/10 text-center space-y-2">
          <div className="flex items-center justify-center gap-4 text-[11px] text-emerald-100/70">
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-400" /> Direct Order Tracking</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-400" /> Saved Botanical Wishlist</span>
          </div>

          <button 
            type="button"
            onClick={() => { setIsLogin(!isLogin); setError(null); }}
            className="text-xs font-semibold text-emerald-300 hover:text-emerald-200 underline transition-colors cursor-pointer pt-1"
          >
            {isLogin ? "Don't have an account? Sign up here" : 'Already registered? Sign in here'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

