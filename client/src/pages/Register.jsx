import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Loader2 } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { register, user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Name validation: letters and spaces only
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(name)) {
      setError('Name should only contain letters.');
      return;
    }

    // Password validation: 8-16 chars
    if (password.length < 8 || password.length > 16) {
      setError('Password must be between 8 and 16 characters.');
      return;
    }

    const result = await register(name, email.toLowerCase(), password);
    if (!result.success) {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gold/20">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-playfair text-maroon mb-3 tracking-tight">Join the Registry</h1>
          <p className="text-luxury-gold font-display text-lg italic tracking-[0.1em]">Become a member of our designer collection</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm mb-6 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gold w-5 h-5" />
            <input
              type="text"
              placeholder="Full Name"
              className="w-full pl-11 pr-4 py-3 border-b-2 border-gray-100 focus:border-gold outline-none transition-colors font-poppins"
              value={name}
              onChange={(e) => {
                const val = e.target.value;
                if (val === '' || /^[a-zA-Z\s]+$/.test(val)) {
                  setName(val);
                }
              }}
              required
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gold w-5 h-5" />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full pl-11 pr-4 py-3 border-b-2 border-gray-100 focus:border-gold outline-none transition-colors font-poppins"
              value={email}
              onChange={(e) => setEmail(e.target.value.toLowerCase())}
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gold w-5 h-5" />
            <input
              type="password"
              placeholder="Create Password"
              className="w-full pl-11 pr-4 py-3 border-b-2 border-gray-100 focus:border-gold outline-none transition-colors font-poppins"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              maxLength={16}
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
              'Create Membership'
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm font-poppins text-gray-500">
          Already have access?{' '}
          <Link to="/login" className="text-maroon font-bold hover:underline">
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
