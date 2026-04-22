'use client';

import { useState } from 'react';
import { banners as mockBanners } from '@/data/mock';
import { useStore } from '@/hooks/useStore';
import { Trash2, Plus, Image } from 'lucide-react';

export default function AdminBannersPage() {
  const [banners, setBanners] = useStore('career_banners', mockBanners);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', image: '', link: '' });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newBanner = {
      id: 'b' + Date.now(),
      title: form.title,
      image: form.image || '/images/banner1.jpg',
      link: form.link,
      sort: banners.length + 1,
    };
    setBanners((prev) => [...prev, newBanner]);
    setForm({ title: '', image: '', link: '' });
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('确定删除该轮播图吗？')) {
      setBanners((prev) => prev.filter((b) => b.id !== id));
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">轮播图管理</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> 新增轮播图
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="mb-6 rounded-xl border bg-white p-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">标题</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full rounded-md border border-input px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">图片地址</label>
            <input
              type="text"
              placeholder="/images/banner1.jpg"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              className="w-full rounded-md border border-input px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">链接</label>
            <input
              type="text"
              placeholder="/counselors"
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
              className="w-full rounded-md border border-input px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              添加
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="rounded-md border px-6 py-2 text-sm font-medium hover:bg-accent">
              取消
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {banners.map((b) => (
          <div key={b.id} className="flex items-center gap-4 rounded-xl border bg-white p-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Image className="h-8 w-8 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-medium">{b.title}</h3>
              <p className="text-sm text-muted-foreground">排序：{b.sort}</p>
              {b.link && <p className="text-xs text-muted-foreground">链接：{b.link}</p>}
            </div>
            <button onClick={() => handleDelete(b.id)} className="text-destructive hover:underline">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
