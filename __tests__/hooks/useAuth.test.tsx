import { renderHook, act } from '@testing-library/react';
import { useAuth } from '@/hooks/useAuth';

describe('useAuth hook', () => {
  const STORAGE_KEY = 'career_auth_id';

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
    localStorage.setItem(STORAGE_KEY, 'u1');
    // Pre-populate users in localStorage so useStore finds the user
    localStorage.setItem('career_users', JSON.stringify([
      { id: 'u1', username: '张三', email: 'zs@example.com', role: 'user', createdAt: '2024-01-01' },
    ]));

    const { result } = renderHook(() => useAuth());
    expect(result.current.user).toEqual(
      expect.objectContaining({ id: 'u1', username: '张三', role: 'user' })
    );
    expect(result.current.isLoggedIn).toBe(true);
    expect(result.current.isUser).toBe(true);
  });

  it('should login a user and persist userId to localStorage', () => {
    const { result } = renderHook(() => useAuth());

    act(() => {
      result.current.login('u1');
    });

    expect(result.current.user).toEqual(
      expect.objectContaining({ id: 'u1', username: '张三', role: 'user' })
    );
    expect(result.current.isLoggedIn).toBe(true);
    expect(localStorage.getItem(STORAGE_KEY)).toBe('u1');
  });

  it('should logout and clear localStorage', () => {
    localStorage.setItem(STORAGE_KEY, 'u1');

    const { result } = renderHook(() => useAuth());
    expect(result.current.isLoggedIn).toBe(true);

    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isLoggedIn).toBe(false);
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('should correctly identify admin role when users array contains admin', () => {
    localStorage.setItem('career_users', JSON.stringify([
      { id: 'a1', username: '管理员', email: 'admin@example.com', role: 'admin', createdAt: '2024-01-01' },
    ]));
    const { result } = renderHook(() => useAuth());

    act(() => {
      result.current.login('a1');
    });

    expect(result.current.isAdmin).toBe(true);
    expect(result.current.isCounselor).toBe(false);
    expect(result.current.isUser).toBe(false);
  });

  it('should correctly identify counselor role', () => {
    localStorage.setItem('career_users', JSON.stringify([
      { id: 'c1', username: '王职业', email: 'wz@example.com', role: 'counselor', createdAt: '2024-01-01' },
    ]));
    const { result } = renderHook(() => useAuth());

    act(() => {
      result.current.login('c1');
    });

    expect(result.current.isAdmin).toBe(false);
    expect(result.current.isCounselor).toBe(true);
    expect(result.current.isUser).toBe(false);
  });

  it('should handle corrupted localStorage gracefully', () => {
    localStorage.setItem(STORAGE_KEY, 'not-json'); // string value is fine, it's a userId
    const { result } = renderHook(() => useAuth());
    expect(result.current.user).toBeNull();
    expect(result.current.isLoggedIn).toBe(false);
  });
});
