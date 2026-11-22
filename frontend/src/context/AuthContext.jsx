import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const ROLE_PRESETS = [
  { role: 'ADMIN', name: 'Sarah Jenkins', email: 'admin@supplystock.ai', company: 'SupplyStock Global HQ', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  { role: 'RETAILER', name: 'Dan Reynolds', email: 'retailer@supplystock.ai', company: 'Metro Retail Electronics', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  { role: 'WHOLESALER', name: 'Maya Patel', email: 'wholesaler@supplystock.ai', company: 'Apex Wholesale Distribution', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  { role: 'SUPPLIER', name: 'Kenji Takahashi', email: 'supplier@supplystock.ai', company: 'Nippon Micro Silicon Co.', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  { role: 'MANUFACTURER', name: 'Elena Rostova', email: 'manufacturer@supplystock.ai', company: 'Vanguard Precision Assembly', color: 'bg-rose-500/20 text-rose-400 border-rose-500/30' },
  { role: 'DELIVERY_PARTNER', name: 'Marcus Vance', email: 'delivery@supplystock.ai', company: 'SwiftLogistics Express', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('supplystock_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return null; }
    }
    // Default demo user: Retailer (or Admin)
    return {
      id: 2,
      username: 'retailer_dan',
      email: 'retailer@supplystock.ai',
      fullName: 'Dan Reynolds',
      role: 'RETAILER',
      companyName: 'Metro Retail Electronics'
    };
  });

  const [token, setToken] = useState(() => localStorage.getItem('supplystock_token') || 'demo-jwt-token');

  useEffect(() => {
    if (user) {
      localStorage.setItem('supplystock_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('supplystock_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('supplystock_token', token);
    } else {
      localStorage.removeItem('supplystock_token');
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await api.login(email, password);
    if (res && res.user) {
      setUser(res.user);
      setToken(res.token);
      return res.user;
    }
    throw new Error('Authentication failed');
  };

  const register = async (userData) => {
    const res = await api.register(userData);
    if (res && res.user) {
      setUser(res.user);
      setToken(res.token);
      return res.user;
    }
    throw new Error('Registration failed');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('supplystock_user');
    localStorage.removeItem('supplystock_token');
  };

  const switchRolePreset = (presetRole) => {
    const preset = ROLE_PRESETS.find(p => p.role === presetRole) || ROLE_PRESETS[1];
    const newUser = {
      id: Date.now(),
      username: preset.email.split('@')[0],
      email: preset.email,
      fullName: preset.name,
      role: preset.role,
      companyName: preset.company
    };
    setUser(newUser);
    setToken(`preset-jwt-${preset.role.toLowerCase()}-${Date.now()}`);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, switchRolePreset, ROLE_PRESETS }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
