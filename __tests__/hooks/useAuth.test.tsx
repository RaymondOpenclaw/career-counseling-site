'use client';

import { renderHook, act } from '@testing-library/react';
import { useAuth } from '@/hooks/useAuth';

describe('useAuth hook', () => {
  const STORAGE_KEY = 'career_auth';

  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize with null user when localStorage is empty', () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.user).toBeNull();
    expect(result.current.isLoggedIn).toBe(false);
    expect(result.current.loading).toBe(false);
  });

  it('should load user from localStorage on mount', () => {
    const mockUser = { id: 'u1', username: '张三', email: 'zs@example.com', role: 'user' as const, createdAt: '2024-01-01' };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockUser));

    const { result } = renderHook(() => useAuth());
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isLoggedIn).toBe(true);
    expect(result.current.isUser).toBe(true);
  });

  it('should login a user and persist to localStorage', () => {
    const { result } = renderHook(() => useAuth());
    const mockUser = { id: 'u1', username: '张三', email: 'zs@example.com', role: 'user' as const, createdAt: '2024-01-01' };

    act(() => {
      result.current.login(mockUser);
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isLoggedIn).toBe(true);
    expect(localStorage.getItem(STORAGE_KEY)).toBe(JSON.stringify(mockUser));
  });

  it('should logout and clear localStorage', () => {
    const mockUser = { id: 'u1', username: '张三', email: 'zs@example.com', role: 'user' as const, createdAt: '2024-01-01' };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockUser));

    const { result } = renderHook(() => useAuth());
    expect(result.current.isLoggedIn).toBe(true);

    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isLoggedIn).toBe(false);
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('should correctly identify admin role', () => {
    const { result } = renderHook(() => useAuth());
    const adminUser = { id: 'a1', username: '管理员', email: 'admin@example.com', role: 'admin' as const, createdAt: '2024-01-01' };

    act(() => {
      result.current.login(adminUser);
    });

    expect(result.current.isAdmin).toBe(true);
    expect(result.current.isCounselor).toBe(false);
    expect(result.current.isUser).toBe(false);
  });

  it('should correctly identify counselor role', () => {
    const { result } = renderHook(() => useAuth());
    const counselorUser = { id: 'c1', username: '王职业', email: 'wz@example.com', role: 'counselor' as const, createdAt: '2024-01-01' };

    act(() => {
      result.current.login(counselorUser);
    });

    expect(result.current.isAdmin).toBe(false);
    expect(result.current.isCounselor).toBe(true);
    expect(result.current.isUser).toBe(false);
  });

  it('should handle corrupted localStorage gracefully', () => {
    localStorage.setItem(STORAGE_KEY, 'not-json');
    const { result } = renderHook(() => useAuth());
    expect(result.current.user).toBeNull();
    expect(result.current.isLoggedIn).toBe(false);
  });
});
