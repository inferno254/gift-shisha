// src/context/AuthContext.tsx
'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export type User = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  location: string | null;
  locationDetail: string | null;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  clearAuth: () => void;
  updateProfile: (updates: Partial<Omit<User, 'id'>>) => Promise<{ error?: string }>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem('gift-shisha-auth');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        supabase.auth.getSession().then(async ({ data: { session } }) => {
          if (session?.user?.id === parsed.id) {
            const authUser: User = {
              id: parsed.id,
              name: parsed.name,
              email: parsed.email,
              phone: parsed.phone || null,
              location: parsed.location || null,
              locationDetail: parsed.locationDetail || null,
            };
            setUser(authUser);
          }
          setLoading(false);
        });
      } catch {
        localStorage.removeItem('gift-shisha-auth');
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const clearAuth = useCallback(() => {
    localStorage.removeItem('gift-shisha-auth');
    setUser(null);
  }, []);

  const login = async (email: string, password: string): Promise<{ error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error: error.message };
      if (data.user) {
        const authUser: User = {
          id: data.user.id,
          name: 'User',
          email: data.user.email || null,
          phone: null,
          location: null,
          locationDetail: null,
        };
        setUser(authUser);
        localStorage.setItem('gift-shisha-auth', JSON.stringify(authUser));
        router.push('/');
        return {};
      }
      return { error: 'Login failed - no user returned' };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Login failed' };
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<{ error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) return { error: error.message };
      if (data.user) {
        const authUser: User = {
          id: data.user.id,
          name,
          email,
          phone: null,
          location: 'Nairobi CBD',
          locationDetail: 'Gift Shisha, Nairobi CBD',
        };
        setUser(authUser);
        localStorage.setItem('gift-shisha-auth', JSON.stringify(authUser));
        router.push('/login');
        return {};
      }
      return { error: 'Signup failed - no user returned' };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Signup failed' };
    }
  };

  const updateProfile = async (updates: Partial<Omit<User, 'id'>>): Promise<{ error?: string }> => {
    if (!user) return { error: 'Not authenticated' };
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'x-user-id': user.id,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (!res.ok) return { error: data.error || 'Update failed' };
      const updated: User = {
        ...user,
        name: data.name || user.name,
        email: data.email || user.email,
        phone: data.phone || user.phone,
        location: data.location || user.location,
        locationDetail: data.location_detail || user.locationDetail,
      };
      setUser(updated);
      localStorage.setItem('gift-shisha-auth', JSON.stringify(updated));
      return {};
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Update failed' };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem('gift-shisha-auth');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, clearAuth, updateProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}