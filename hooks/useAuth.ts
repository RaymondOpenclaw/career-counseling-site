'use client';

import { useState, useEffect, useCallback } from 'react';
import { User } from '@/types';

const STORAGE_KEY = 'career_auth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback((userData: User) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  const isAdmin = user?.role === 'admin';
  const isCounselor = user?.role === 'counselor';
  const isUser = user?.role === 'user';
  const isLoggedIn = !!user;

  return { user, loading, login, logout, isAdmin, isCounselor, isUser, isLoggedIn };
}
