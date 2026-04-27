'use client';

import { useState } from 'react';
import Link from 'next/link';
import { counselors as mockCounselors } from '@/data/mock';
import { useStore } from '@/hooks/useStore';
import EmptyState from '@/components/EmptyState';
import { Star, Search, Filter, SlidersHorizontal, Frown } from 'lucide-react';

export default function CounselorsPage() {
  const [search, setSearch] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('全部');
  const [priceFilter, setPriceFilter] = useState('全部');
  const [experienceFilter, setExperienceFilter] = useState('全部');
  const [ratingFilter, setRatingFilter] = useState('全部');

  const [counselors] = useStore('career_counselors', mockCounselors);

  const specialties = ['全部', ...Array.from(new Set(counselors.flatMap((c) => c.specialty)))];

  const filtered = counselors.filter((c) => {
    const matchSearch = c.name.includes(search) || c.title.includes(search) || c.bio.includes(search);
    const matchSpecialty = specialtyFilter === '全部' || c.specialty.includes(specialtyFilter);
    const matchPrice =
      priceFilter === '全部' ||
      (priceFilter === '0-200' && c.price <= 200) ||
      (priceFilter === '200-400' && c.price > 200 && c.price <= 400) ||
      (priceFilter === '400+' && c.price > 400);
    const matchExperience =
      experienceFilter === '全部' ||
      (experienceFilter === '1-5' && c.experience >= 1 && c.experience <= 5) ||
      (experienceFilter === '5-10' && c.experience > 5 && c.experience <= 10) ||
      (experienceFilter === '10+' && c.experience > 10);
    const matchRating =
      ratingFilter === '全部' ||
      (ratingFilter === '4.5+' && c.rating >= 4.5) ||
      (ratingFilter === '4.0+' && c.rating >= 4.0);
    return matchSearch && matchSpecialty && matchPrice && matchExperience && matchRating;
  });

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 bg-muted/20 py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">找咨询师</h1>
            <p className="mt-2 text-muted-foreground">选择适合你的职业规划师，开启一对一咨询</p>
          </div>

          <div className="mb-6 flex flex-col gap-4">
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
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
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
              <div className="flex items-center gap-2 overflow-x-auto">
                <SlidersHorizontal className="h-4 w-4 shrink-0 text-muted-foreground" />
                {[
                  { key: '全部', label: '全部价格' },
                  { key: '0-200', label: '¥0-200' },
                  { key: '200-400', label: '¥200-400' },
                  { key: '400+', label: '¥400+' },
                ].map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setPriceFilter(f.key)}
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                      priceFilter === f.key
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-white text-muted-foreground hover:bg-accent'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 overflow-x-auto">
                <Star className="h-4 w-4 shrink-0 text-muted-foreground" />
                {[
                  { key: '全部', label: '全部评分' },
                  { key: '4.5+', label: '4.5分以上' },
                  { key: '4.0+', label: '4.0分以上' },
                ].map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setRatingFilter(f.key)}
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                      ratingFilter === f.key
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-white text-muted-foreground hover:bg-accent'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 overflow-x-auto">
                <span className="text-xs text-muted-foreground shrink-0">经验</span>
                {[
                  { key: '全部', label: '全部' },
                  { key: '1-5', label: '1-5年' },
                  { key: '5-10', label: '5-10年' },
                  { key: '10+', label: '10年+' },
                ].map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setExperienceFilter(f.key)}
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                      experienceFilter === f.key
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-white text-muted-foreground hover:bg-accent'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
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
            <EmptyState
              icon={<Frown className="mx-auto h-10 w-10" />}
              title="没有找到匹配的咨询师"
              description="请尝试调整筛选条件"
            />
          )}
        </div>
      </main>
    </div>
  );
}
