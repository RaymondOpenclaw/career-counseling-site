'use client';

import { useState } from 'react';
import { articles as mockArticles } from '@/data/mock';
import { useStore } from '@/hooks/useStore';
import { Search, Trash2, Eye, Heart } from 'lucide-react';

export default function AdminArticlesPage() {
  const [articles, setArticles] = useStore('career_articles', mockArticles);
  const [search, setSearch] = useState('');

  const filtered = articles.filter((a) => a.title.includes(search) || a.author.includes(search));

  const handleDelete = (id: string) => {
    if (confirm('确定删除该文章吗？')) {
      setArticles((prev) => prev.filter((a) => a.id !== id));
    }
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">文章管理</h1>

      <div className="mb-6 flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="搜索文章..."
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
              <th className="px-4 py-3 text-left font-medium">标题</th>
              <th className="px-4 py-3 text-left font-medium">分类</th>
              <th className="px-4 py-3 text-left font-medium">作者</th>
              <th className="px-4 py-3 text-left font-medium">阅读量</th>
              <th className="px-4 py-3 text-left font-medium">点赞</th>
              <th className="px-4 py-3 text-right font-medium">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((a) => (
              <tr key={a.id} className="hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">{a.title}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-xs">{a.category}</span>
                </td>
                <td className="px-4 py-3">{a.author}</td>
                <td className="px-4 py-3">
                  <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {a.views}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="flex items-center gap-1"><Heart className="h-3 w-3" /> {a.likes}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => handleDelete(a.id)} className="text-destructive hover:underline">
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
