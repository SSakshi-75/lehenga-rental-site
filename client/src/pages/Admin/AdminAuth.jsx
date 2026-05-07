
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, Lock, Mail, Loader2, ArrowRight, Eye, EyeOff } from 'lucide-react';

const AdminAuth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(email, password);
    if (result.success) {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (userInfo && userInfo.role === 'admin') {
        navigate('/rani-manager');
      } else {
        logout(); // Not an admin, kick them out
        setError('AUTHORITY DENIED: Customer accounts are not permitted here.');
      }
    } else {
      setError('AUTHORITY DENIED: Invalid credentials or insufficient permissions.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 font-poppins">
      <div className="max-w-md w-full">
        {/* Logo/Icon */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-maroon rounded-3xl shadow-2xl shadow-maroon/50 mb-6 rotate-3">
            <ShieldAlert className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Authority Portal</h1>
          <p className="text-slate-500 mt-2 text-sm font-bold tracking-[0.3em]">RESTAURANT & RENTAL CONTROL</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
          {/* Subtle Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-maroon/20 blur-[100px] rounded-full"></div>
          
          <form onSubmit={handleAdminLogin} className="space-y-6 relative z-10">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-2xl text-xs font-bold flex items-center gap-3">
                <ShieldAlert className="w-4 h-4" /> {error}
              </div>
            )}

            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2 block">System Identifier</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 w-5 h-5" />
                <input
                  type="email"
                  placeholder="admin@system.io"
                  className="w-full bg-slate-950 border border-slate-800 text-white pl-12 pr-4 py-4 rounded-2xl outline-none focus:border-maroon focus:ring-4 focus:ring-maroon/10 transition-all font-bold text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Access Code</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 text-white pl-12 pr-12 py-4 rounded-2xl outline-none focus:border-maroon focus:ring-4 focus:ring-maroon/10 transition-all font-bold text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-maroon transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-maroon hover:bg-red-700 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl shadow-maroon/30 group disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>Establish Connection <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>
        </div>

        <p className="text-center mt-8 text-slate-600 text-xs font-bold uppercase tracking-widest">
          Secure Terminal v4.2.0 • Authorized Personnel Only
        </p>
      </div>
    </div>
  );
};

export default AdminAuth;
