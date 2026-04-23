import { useState, useMemo } from 'react';

interface UsePaginationOptions<T> {
  data: T[];
  pageSize?: number;
  initialPage?: number;
}

export function usePagination<T>({ data, pageSize = 10, initialPage = 1 }: UsePaginationOptions<T>) {
  const [page, setPage] = useState(initialPage);

  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));

  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, page, pageSize]);

  const goToPage = (p: number) => {
    setPage(Math.min(Math.max(1, p), totalPages));
  };

  return { page, setPage: goToPage, totalPages, paginatedData, total: data.length };
}
