'use client';

import { useState } from 'react';
import { counselors as mockCounselors } from '@/data/mock';
import { useStore } from '@/hooks/useStore';
import { Search, Trash2, Star, Plus, Pencil } from 'lucide-react';
import ConfirmModal from '@/components/ConfirmModal';

export default function AdminCounselorsPage() {
  const [counselors, setCounselors] = useStore('career_counselors', mockCounselors);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    title: '',
    specialty: '',
    experience: 0,
    bio: '',
    rating: 5,
    consultCount: 0,
    price: 0,
    status: 'active' as 'active' | 'busy' | 'offline',
  });
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const filtered = counselors.filter((c) => c.name.includes(search) || c.title.includes(search));

  const openCreate = () => {
    setForm({
      name: '',
      title: '',
      specialty: '',
      experience: 0,
      bio: '',
      rating: 5,
      consultCount: 0,
      price: 0,
      status: 'active',
    });
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (c: (typeof counselors)[0]) => {
    setForm({
      name: c.name,
      title: c.title,
      specialty: c.specialty.join(', '),
      experience: c.experience,
      bio: c.bio,
      rating: c.rating,
      consultCount: c.consultCount,
      price: c.price,
      status: c.status,
    });
    setEditingId(c.id);
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      specialty: form.specialty.split(',').map((s) => s.trim()).filter(Boolean),
    };
    if (editingId) {
      setCounselors((prev) =>
        prev.map((c) => (c.id === editingId ? { ...c, ...payload } : c))
      );
    } else {
      const newCounselor = {
        id: 'c' + Date.now(),
        userId: 'uc' + Date.now(),
        ...payload,
      };
      setCounselors((prev) => [newCounselor, ...prev]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    setConfirmModal({
      isOpen: true,
      title: '删除咨询师',
      message: '确定删除该咨询师吗？',
      onConfirm: () => {
        setCounselors((prev) => prev.filter((c) => c.id !== id));
      },
    });
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
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> 新增咨询师
        </button>
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
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => openEdit(c)}
                      className="text-primary hover:underline"
                      title="编辑"
                    >
                      <Pencil className="h-4 w-4 inline" />
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="text-destructive hover:underline"
                      title="删除"
                    >
                      <Trash2 className="h-4 w-4 inline" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl border bg-white p-6 shadow-lg max-h-[90vh] overflow-y-auto">
            <h2 className="mb-4 text-lg font-bold">{editingId ? '编辑咨询师' : '新增咨询师'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">姓名</label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-md border border-input px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">头衔</label>
                  <input
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full rounded-md border border-input px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">专长（逗号分隔）</label>
                <input
                  required
                  value={form.specialty}
                  onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                  className="w-full rounded-md border border-input px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">经验（年）</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={form.experience}
                    onChange={(e) => setForm({ ...form, experience: Number(e.target.value) })}
                    className="w-full rounded-md border border-input px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">评分</label>
                  <input
                    type="number"
                    required
                    min={0}
                    max={5}
                    step={0.1}
                    value={form.rating}
                    onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                    className="w-full rounded-md border border-input px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">咨询次数</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={form.consultCount}
                    onChange={(e) => setForm({ ...form, consultCount: Number(e.target.value) })}
                    className="w-full rounded-md border border-input px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">价格（¥）</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    className="w-full rounded-md border border-input px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">状态</label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({ ...form, status: e.target.value as typeof form.status })
                  }
                  className="w-full rounded-md border border-input px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="active">active</option>
                  <option value="busy">busy</option>
                  <option value="offline">offline</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">简介</label>
                <textarea
                  rows={3}
                  required
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  className="w-full rounded-md border border-input px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  保存
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-md border px-6 py-2.5 text-sm font-medium hover:bg-accent"
                >
                  取消
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={() => {
          confirmModal.onConfirm();
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        }}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
