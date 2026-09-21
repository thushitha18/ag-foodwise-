"use client";
import { createContext, useContext, useState, useEffect } from 'react';
import { UserRole } from '@/types';

const AuthContext = createContext(null);

// In-memory store for demo users
const registeredUsers = [
  {
    id: 'cu1', name: 'Priya Sharma', email: 'consumer@foodwise.demo',
    role: 'consumer', latitude: 11.0168, longitude: 76.9558,
    address: 'RS Puram, Coimbatore', phone: '+91 98765 43210',
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 'u1', name: 'Ramesh Kumar', email: 'provider@foodwise.demo',
    role: 'provider', latitude: 11.0168, longitude: 76.9558,
    address: 'Gandhipuram, Coimbatore', phone: '+91 98765 43211',
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 'is1', name: 'Meena Lakshmi', email: 'seller@foodwise.demo',
    role: 'individual_seller', latitude: 11.0244, longitude: 76.9609,
    address: 'Saibaba Colony, Coimbatore', phone: '+91 98765 43214',
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 'ru1', name: 'Sunita Rao', email: 'rescue@foodwise.demo',
    role: 'rescue_partner', latitude: 11.0060, longitude: 76.9615,
    address: 'Singanallur, Coimbatore', phone: '+91 98765 43212',
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 'admin1', name: 'Dr. Aris Thorne', email: 'admin@foodwise.demo',
    role: 'admin',
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
];

const demoPasswords = {
  'consumer@foodwise.demo': 'Demo@1234',
  'provider@foodwise.demo': 'Demo@1234',
  'seller@foodwise.demo': 'Demo@1234',
  'rescue@foodwise.demo': 'Demo@1234',
  'admin@foodwise.demo': 'Demo@1234',
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('fw_user');
      if (saved) setUser(JSON.parse(saved));
    } catch {}
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const found = registeredUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    const expectedPassword = demoPasswords[email.toLowerCase()];

    if (!found) {
      setIsLoading(false);
      return { success: false, error: 'No account found with this email.' };
    }
    if (expectedPassword && password !== expectedPassword) {
      setIsLoading(false);
      return { success: false, error: 'Incorrect password.' };
    }

    setUser(found);
    localStorage.setItem('fw_user', JSON.stringify(found));
    setIsLoading(false);
    return { success: true };
  };

  const register = async (nameOrOptions, maybeEmail, maybePassword, maybeRole) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));

    let name = '';
    let email = '';
    let password = '';
    let phone = '';
    let role = UserRole.CONSUMER;
    let city = 'Coimbatore';

    if (typeof nameOrOptions === 'object') {
      name = nameOrOptions.name;
      email = nameOrOptions.email;
      password = nameOrOptions.password;
      phone = nameOrOptions.phone || '';
      role = nameOrOptions.role;
      city = nameOrOptions.city || 'Coimbatore';
    } else {
      name = nameOrOptions;
      email = maybeEmail || '';
      password = maybePassword || '';
      role = maybeRole || UserRole.CONSUMER;
    }

    if (registeredUsers.find((u) => u.email === email)) {
      setIsLoading(false);
      return { success: false, error: 'An account with this email already exists.' };
    }

    const newUser = {
      id: `user_${Date.now()}`,
      name,
      email,
      phone,
      role,
      address: city,
      latitude: city === 'Chennai' ? 13.0827 : 11.0168,
      longitude: city === 'Chennai' ? 80.2707 : 76.9558,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    registeredUsers.push(newUser);
    demoPasswords[email] = password;
    setUser(newUser);
    localStorage.setItem('fw_user', JSON.stringify(newUser));
    setIsLoading(false);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('fw_user');
  };

  const forgotPassword = async (email) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setIsLoading(false);
    return {
      success: true,
      message: `Password reset instructions have been dispatched to ${email}. Check your inbox.`,
    };
  };

  const switchRole = (role) => {
    const demoUser = registeredUsers.find((u) => u.role === role);
    if (demoUser) {
      setUser(demoUser);
      localStorage.setItem('fw_user', JSON.stringify(demoUser));
    }
  };

  const updateUser = (updates) => {
    if (!user) return;
    const updated = { ...user, ...updates, updated_at: new Date().toISOString() };
    setUser(updated);
    localStorage.setItem('fw_user', JSON.stringify(updated));
    const idx = registeredUsers.findIndex((u) => u.id === user.id);
    if (idx !== -1) registeredUsers[idx] = updated;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role ?? null,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        forgotPassword,
        switchRole,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
