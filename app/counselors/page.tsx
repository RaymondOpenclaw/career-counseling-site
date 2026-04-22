'use client';

import { useState } from 'react';
import Link from 'next/link';
import { counselors as mockCounselors } from '@/data/mock';
import { useStore } from '@/hooks/useStore';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Star, Search, Filter } from 'lucide-react';

export default function CounselorsPage() {
  const [search, setSearch] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('全部');

  const [counselors] = useStore('career_counselors', mockCounselors);

  const specialties = ['全部', ...Array.from(new Set(counselors.flatMap((c) => c.specialty)))];

  const filtered = counselors.filter((c) => {
    const matchSearch = c.name.includes(search) || c.title.includes(search) || c.bio.includes(search);
    const matchSpecialty = specialtyFilter === '全部' || c.specialty.includes(specialtyFilter);
    return matchSearch && matchSpecialty;
  });

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-muted/20 py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">找咨询师</h1>
            <p className="mt-2 text-muted-foreground">选择适合你的职业规划师，开启一对一咨询</p>
          </div>

          <div className="mb-6 flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="搜索咨询师姓名、专长..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-md border border-input bg-white py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto">
              <Filter className="h-4 w-4 shrink-0 text-muted-foreground" />
              {specialties.map((s) => (
                <button
                  key={s}
                  onClick={() => setSpecialtyFilter(s)}
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    specialtyFilter === s
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-white text-muted-foreground hover:bg-accent'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((c) => (
              <Link
                key={c.id}
                href={`/counselors/${c.id}`}
                className="rounded-xl border bg-white p-6 transition-shadow hover:shadow-lg"
              >
                <div className="mb-4 flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                    {c.name[0]}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{c.name}</h3>
                    <p className="text-sm text-muted-foreground">{c.title}</p>
                  </div>
                </div>
                <div className="mb-3 flex flex-wrap gap-1">
                  {c.specialty.map((s) => (
                    <span key={s} className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-secondary-foreground">
                      {s}
                    </span>
                  ))}
                </div>
                <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">{c.bio}</p>
                <div className="flex items-center justify-between border-t pt-4 text-sm">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      {c.rating}
                    </span>
                    <span className="text-muted-foreground">{c.consultCount}次咨询</span>
                  </div>
                  <span className="font-semibold text-primary">¥{c.price}/次</span>
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="py-20 text-center text-muted-foreground">没有找到匹配的咨询师</div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
