import React, { createContext, useState, useEffect, useContext } from 'react';
import { login as apiLogin, register as apiRegister, logout as apiLogout, forgotPassword as apiForgotPassword } from '../utils/apifetch';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null
  );
  const [adminUser, setAdminUser] = useState(
    localStorage.getItem('adminInfo') ? JSON.parse(localStorage.getItem('adminInfo')) : null
  );
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await apiLogin({ email, password });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      setLoading(false);
      toast.success(`Welcome back, ${data.name}!`);
      return { success: true };
    } catch (error) {
      setLoading(false);
      const msg = error.response?.data?.message || 'Login failed';
      toast.error(msg);
      return { 
        success: false, 
        message: msg 
      };
    }
  };

  const adminLogin = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await apiLogin({ email, password });
      if (data.role === 'admin') {
        setAdminUser(data);
        localStorage.setItem('adminInfo', JSON.stringify(data));
        setLoading(false);
        toast.success(`Welcome back, Admin ${data.name}!`);
        return { success: true };
      } else {
        setLoading(false);
        return { success: false, message: 'Not authorized as admin' };
      }
    } catch (error) {
      setLoading(false);
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const { data } = await apiRegister({ name, email, password });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      setLoading(false);
      toast.success('Account created successfully!');
      return { success: true };
    } catch (error) {
      setLoading(false);
      const msg = error.response?.data?.message || 'Registration failed';
      toast.error(msg);
      return { 
        success: false, 
        message: msg 
      };
    }
  };

  const logout = async () => {
    try {
      await apiLogout();
      setUser(null);
      localStorage.removeItem('userInfo');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const adminLogout = async () => {
    try {
      await apiLogout();
      setAdminUser(null);
      localStorage.removeItem('adminInfo');
      toast.success('Admin logged out');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const forgotPassword = async (email) => {
    try {
      const { data } = await apiForgotPassword(email);
      return { success: true, message: data.message };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to send reset request.' 
      };
    }
  };

  return (
    <AuthContext.Provider value={{ user, adminUser, loading, login, adminLogin, register, logout, adminLogout, forgotPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
