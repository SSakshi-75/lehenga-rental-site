import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { ShieldAlert, Lock, Mail, Loader2, ArrowRight, Eye, EyeOff } from 'lucide-react';

const AdminAuth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { adminLogin, forgotPassword, loading } = useAuth();
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const result = await forgotPassword(email);
    if (result.success) {
      setSuccess(result.message);
    } else {
      setError(result.message);
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError('');
    const result = await adminLogin(email, password);
    if (result.success) {
      navigate('/rani-manager');
    } else {
      setError(result.message || 'AUTHORITY DENIED: Invalid credentials or insufficient permissions.');
    }
  };

  return (
    <div className="min-h-screen bg-luxury-bg flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="max-w-md w-full">
        <div className="bg-white p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] shadow-2xl shadow-black/5 space-y-6">
          {isForgotMode ? (
            /* Forgot Password Form - Layout matched to reference image but with admin colors */
            <form onSubmit={handleForgotPassword} className="space-y-6 pt-2">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center">
                  <Mail className="w-8 h-8 text-maroon" />
                </div>
                <div>
                  <h2 className="text-3xl font-display font-medium text-maroon leading-tight uppercase tracking-widest">Reset<br />Password</h2>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 text-red-500 p-3 rounded-xl text-[10px] font-bold border border-red-100 animate-shake">
                  {error}
                </div>
              )}
              {success && (
                <div className="bg-green-50 text-green-600 p-3 rounded-xl text-[10px] font-bold border border-green-100">
                  {success}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full bg-white border border-gray-100 rounded-xl px-4 py-4 outline-none focus:border-maroon transition-all text-sm font-medium placeholder:text-gray-300"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-maroon text-white py-4 rounded-xl font-bold text-sm tracking-widest transition-all shadow-xl shadow-maroon/20 active:scale-[0.98] disabled:opacity-50 mt-4"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Send Reset Link'}
              </button>

              <div className="text-center pt-4">
                <button
                  type="button"
                  onClick={() => { setIsForgotMode(false); setError(''); setSuccess(''); }}
                  className="text-[10px] font-bold text-luxury-gold uppercase tracking-[0.2em] hover:text-maroon transition-all"
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          ) : (
            /* Login Form */
            <>
              <div className="text-center space-y-2">
                <h1 className="text-2xl sm:text-3xl font-display font-medium text-maroon tracking-widest uppercase">
                  Authority Portal
                </h1>
                <p className="font-display italic text-luxury-gold text-[12px] tracking-[0.3em] uppercase opacity-80">
                  LUXURY RENTAL CONTROL
                </p>
              </div>

              <form onSubmit={handleAdminLogin} className="space-y-6" autoComplete="off">
                <input type="text" name="prevent_autofill" id="prevent_autofill" value="" style={{ display: 'none' }} readOnly />
                <input type="password" name="password_step_error" id="password_step_error" value="" style={{ display: 'none' }} readOnly />

                {error && (
                  <div className="bg-red-50 text-red-500 p-3 rounded-xl text-[10px] font-bold flex items-center gap-3 border border-red-100">
                    <ShieldAlert className="w-4 h-4 flex-shrink-0" /> {error}
                  </div>
                )}

                <div className="space-y-1 relative group">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1 block">Email</label>
                  <Mail className="absolute left-0 bottom-3 text-luxury-gold w-4 h-4 transition-transform group-focus-within:-translate-y-1" />
                  <input
                    type="email"
                    name="authority-identifier-v1"
                    id="authority-identifier-v1"
                    placeholder=""
                    autoComplete="off"
                    className="w-full bg-transparent border-b border-gray-100 pl-8 pr-4 py-2 outline-none focus:border-maroon transition-all text-sm font-medium placeholder:text-gray-300"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1 relative group">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1 block">Password</label>
                  <Lock className="absolute left-0 bottom-3 text-luxury-gold w-4 h-4 transition-transform group-focus-within:-translate-y-1" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="secure-access-key-v1"
                    id="secure-access-key-v1"
                    placeholder=""
                    autoComplete="new-password"
                    className="w-full bg-transparent border-b border-gray-100 pl-8 pr-12 py-2 outline-none focus:border-maroon transition-all text-sm font-medium placeholder:text-gray-300"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 bottom-3 text-gray-400 hover:text-maroon transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex justify-end -mt-4">
                  <button
                    type="button"
                    onClick={() => setIsForgotMode(true)}
                    className="text-[9px] font-bold text-luxury-gold uppercase tracking-widest hover:text-maroon transition-colors"
                  >
                    Forgot your password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-maroon text-white py-4 rounded-2xl font-bold text-sm tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl shadow-maroon/20 active:scale-[0.98] disabled:opacity-50 mt-4"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <span className="font-sans font-bold uppercase tracking-[0.2em]">Sign In</span>
                  )}
                </button>
              </form>
            </>
          )}

          <div className="text-center pt-2 border-t border-gray-50">
            <p className="text-[10px] font-medium text-gray-400 tracking-widest uppercase">
              Secure Terminal v4.2.0 • Authorized Personnel Only
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAuth;
