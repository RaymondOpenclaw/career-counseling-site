import { renderHook, act, waitFor } from '@testing-library/react';
import { useStore } from '@/hooks/useStore';

describe('useStore', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes from localStorage if key exists', () => {
    localStorage.setItem('career_test', JSON.stringify({ foo: 'bar' }));
    const { result } = renderHook(() => useStore('career_test', { foo: 'default' }));
    expect(result.current[0]).toEqual({ foo: 'bar' });
  });

  it('initializes with initialValue if key does not exist', () => {
    const { result } = renderHook(() => useStore('career_test', { foo: 'default' }));
    expect(result.current[0]).toEqual({ foo: 'default' });
  });

  it('updates state and persists to localStorage', () => {
    const { result } = renderHook(() => useStore('career_test', { count: 0 }));
    act(() => {
      result.current[1]({ count: 5 });
    });
    expect(result.current[0]).toEqual({ count: 5 });
    expect(JSON.parse(localStorage.getItem('career_test')!)).toEqual({ count: 5 });
  });

  it('supports functional updates', () => {
    const { result } = renderHook(() => useStore('career_test', [1, 2]));
    act(() => {
      result.current[1]((prev) => [...prev, 3]);
    });
    expect(result.current[0]).toEqual([1, 2, 3]);
  });

  it('syncs across hooks with the same key in the same tab', async () => {
    const { result: resultA } = renderHook(() => useStore('career_sync', 0));
    const { result: resultB } = renderHook(() => useStore('career_sync', 0));

    act(() => {
      resultA.current[1](10);
    });

    await waitFor(() => {
      expect(resultB.current[0]).toBe(10);
    });
  });

  it('reads latest localStorage value before applying functional update', () => {
    localStorage.setItem('career_race', JSON.stringify([1]));
    const { result } = renderHook(() => useStore('career_race', []));

    // Simulate external modification after hook mounts
    localStorage.setItem('career_race', JSON.stringify([1, 2]));

    act(() => {
      result.current[1]((prev) => {
        // In the old implementation prev would be [1], but with the fix
        // it should read the latest from localStorage and append to [1, 2]
        return [...prev, 3];
      });
    });

    expect(result.current[0]).toEqual([1, 2, 3]);
  });
});
