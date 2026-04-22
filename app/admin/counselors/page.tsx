'use client';

import { useState } from 'react';
import { counselors as mockCounselors } from '@/data/mock';
import { useStore } from '@/hooks/useStore';
import { Search, Trash2, Star } from 'lucide-react';

export default function AdminCounselorsPage() {
  const [counselors, setCounselors] = useStore('career_counselors', mockCounselors);
  const [search, setSearch] = useState('');

  const filtered = counselors.filter((c) => c.name.includes(search) || c.title.includes(search));

  const handleDelete = (id: string) => {
    if (confirm('确定删除该咨询师吗？')) {
      setCounselors((prev) => prev.filter((c) => c.id !== id));
    }
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">咨询师管理</h1>

      <div className="mb-6 flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="搜索咨询师..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-input bg-white py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium">姓名</th>
              <th className="px-4 py-3 text-left font-medium">头衔</th>
              <th className="px-4 py-3 text-left font-medium">专长</th>
              <th className="px-4 py-3 text-left font-medium">评分</th>
              <th className="px-4 py-3 text-left font-medium">咨询次数</th>
              <th className="px-4 py-3 text-left font-medium">价格</th>
              <th className="px-4 py-3 text-right font-medium">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <td className="px-4 py-3">{c.title}</td>
                <td className="px-4 py-3">{c.specialty.join(', ')}</td>
                <td className="px-4 py-3">
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    {c.rating}
                  </span>
                </td>
                <td className="px-4 py-3">{c.consultCount}</td>
                <td className="px-4 py-3">¥{c.price}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => handleDelete(c.id)} className="text-destructive hover:underline">
                    <Trash2 className="h-4 w-4 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
