import { renderHook, act } from '@testing-library/react';
import { usePagination } from '@/hooks/usePagination';

describe('usePagination', () => {
  const data = Array.from({ length: 25 }, (_, i) => i + 1);

  it('returns first page by default', () => {
    const { result } = renderHook(() => usePagination({ data, pageSize: 10 }));
    expect(result.current.page).toBe(1);
    expect(result.current.paginatedData).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it('calculates total pages', () => {
    const { result } = renderHook(() => usePagination({ data, pageSize: 10 }));
    expect(result.current.totalPages).toBe(3);
  });

  it('changes page', () => {
    const { result } = renderHook(() => usePagination({ data, pageSize: 10 }));
    act(() => result.current.setPage(2));
    expect(result.current.page).toBe(2);
    expect(result.current.paginatedData).toEqual([11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
  });

  it('clamps page to valid range', () => {
    const { result } = renderHook(() => usePagination({ data, pageSize: 10 }));
    act(() => result.current.setPage(99));
    expect(result.current.page).toBe(3);
    act(() => result.current.setPage(0));
    expect(result.current.page).toBe(1);
  });

  it('handles empty data', () => {
    const { result } = renderHook(() => usePagination({ data: [], pageSize: 10 }));
    expect(result.current.totalPages).toBe(1);
    expect(result.current.paginatedData).toEqual([]);
  });
});
