'use client';

import { useState, useEffect, useCallback } from 'react';
import { User } from '@/types';
import { users as mockUsers } from '@/data/mock';
import { useStore } from '@/hooks/useStore';

const STORAGE_KEY = 'career_auth_id';

export function useAuth() {
  const [authId, setAuthId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [users] = useStore('career_users', mockUsers);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setAuthId(stored);
    }
    setLoading(false);
  }, []);

  const user: User | null = authId ? users.find((u) => u.id === authId) || null : null;

  const login = useCallback((userId: string) => {
    localStorage.setItem(STORAGE_KEY, userId);
    setAuthId(userId);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setAuthId(null);
  }, []);

  const isAdmin = user?.role === 'admin';
  const isCounselor = user?.role === 'counselor';
  const isUser = user?.role === 'user';
  const isLoggedIn = !!user;

  return { user, loading, login, logout, isAdmin, isCounselor, isUser, isLoggedIn };
}
