import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, Loader2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { login, user, logout, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // Even if admin, redirect to home to keep storefront separate
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(email, password);
    if (result.success) {
      // After login, check if the person is an admin trying to use user login
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (userInfo && userInfo.role === 'admin') {
        logout(); // Kick them out
        setError('Access Denied: Admin accounts must use the dedicated Manager Portal.');
      }
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gold/20">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-playfair text-maroon mb-3 tracking-tight">Welcome Back</h1>
          <p className="text-luxury-gold font-display text-lg italic tracking-[0.1em]">Luxury fashion awaits you</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm mb-6 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gold w-5 h-5" />
            <input
              type="email"
              name="user_email_login"
              placeholder="Email Address"
              className="w-full pl-11 pr-4 py-3 border-b-2 border-gray-100 focus:border-gold outline-none transition-colors font-poppins"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="off"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gold w-5 h-5" />
            <input
              type="password"
              name="user_password_login"
              placeholder="Password"
              className="w-full pl-11 pr-4 py-3 border-b-2 border-gray-100 focus:border-gold outline-none transition-colors font-poppins"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-maroon text-white py-4 rounded-xl font-poppins font-semibold hover:bg-red-900 transition-all flex items-center justify-center gap-2 shadow-lg shadow-maroon/20 disabled:opacity-70 mt-4"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'Enter the Collection'
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm font-poppins text-gray-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-maroon font-bold hover:underline">
            Request Access
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;
