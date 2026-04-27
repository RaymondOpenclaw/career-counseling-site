'use client';

import { useState } from 'react';
import Link from 'next/link';
import { articles as mockArticles } from '@/data/mock';
import { useStore } from '@/hooks/useStore';
import { FileText, Eye, Heart, User, Search } from 'lucide-react';

export default function ArticlesPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('全部');

  const [articles] = useStore('career_articles', mockArticles);

  const categories = ['全部', ...Array.from(new Set(articles.map((a) => a.category)))];

  const filtered = articles.filter((a) => {
    const matchSearch = a.title.includes(search) || a.summary.includes(search);
    const matchCategory = category === '全部' || a.category === category;
    return matchSearch && matchCategory;
  });

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 bg-muted/20 py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">心灵文章</h1>
            <p className="mt-2 text-muted-foreground">职场干货、行业洞察、心理调适，助力职业成长</p>
          </div>

          <div className="mb-6 flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="搜索文章..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-md border border-input bg-white py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    category === c ? 'bg-primary text-primary-foreground' : 'bg-white text-muted-foreground hover:bg-accent'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((a) => (
              <Link
                key={a.id}
                href={`/articles/${a.id}`}
                className="group flex flex-col rounded-xl border bg-white transition-shadow hover:shadow-lg"
              >
                <div className="flex h-40 items-center justify-center rounded-t-xl bg-primary/5">
                  <FileText className="h-12 w-12 text-primary/40" />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <span className="mb-2 w-fit rounded-full bg-secondary px-2.5 py-0.5 text-xs text-secondary-foreground">{a.category}</span>
                  <h3 className="mb-2 text-lg font-semibold group-hover:text-primary">{a.title}</h3>
                  <p className="mb-4 line-clamp-2 flex-1 text-sm text-muted-foreground">{a.summary}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><User className="h-3 w-3" /> {a.author}</span>
                    <div className="flex gap-3">
                      <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {a.views}</span>
                      <span className="flex items-center gap-1"><Heart className="h-3 w-3" /> {a.likes}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="py-20 text-center text-muted-foreground">没有找到相关文章</div>
          )}
        </div>
      </main>
    </div>
  );
}
