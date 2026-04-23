interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  total: number;
}

export default function Pagination({ page, totalPages, onChange, total }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | string)[] = [];
  const add = (p: number | string) => pages.push(p);

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) add(i);
  } else {
    if (page <= 4) {
      for (let i = 1; i <= 5; i++) add(i);
      add('...');
      add(totalPages);
    } else if (page >= totalPages - 3) {
      add(1);
      add('...');
      for (let i = totalPages - 4; i <= totalPages; i++) add(i);
    } else {
      add(1);
      add('...');
      for (let i = page - 1; i <= page + 1; i++) add(i);
      add('...');
      add(totalPages);
    }
  }

  return (
    <div className="flex items-center justify-between px-4 py-3 text-sm">
      <span className="text-muted-foreground">
        共 {total} 条，第 {page}/{totalPages} 页
      </span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={page === 1}
          onClick={() => onChange(page - 1)}
          className="rounded-md border px-3 py-1 text-sm font-medium hover:bg-accent disabled:opacity-40"
        >
          上一页
        </button>
        {pages.map((p, i) =>
          typeof p === 'number' ? (
            <button
              key={`${p}-${i}`}
              type="button"
              onClick={() => onChange(p)}
              className={`rounded-md px-3 py-1 text-sm font-medium ${
                p === page ? 'bg-primary text-primary-foreground' : 'border hover:bg-accent'
              }`}
            >
              {p}
            </button>
          ) : (
            <span key={`ellipsis-${i}`} className="px-1 text-muted-foreground">
              ...
            </span>
          )
        )}
        <button
          type="button"
          disabled={page === totalPages}
          onClick={() => onChange(page + 1)}
          className="rounded-md border px-3 py-1 text-sm font-medium hover:bg-accent disabled:opacity-40"
        >
          下一页
        </button>
      </div>
    </div>
  );
}
