'use client';

import { useState } from 'react';
import { announcements as mockAnnouncements } from '@/data/mock';
import { useStore } from '@/hooks/useStore';
import { Trash2, Plus } from 'lucide-react';
import ConfirmModal from '@/components/ConfirmModal';

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useStore('career_announcements', mockAnnouncements);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', content: '' });
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newAnnouncement = {
      id: 'an' + Date.now(),
      title: form.title,
      content: form.content,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setAnnouncements((prev) => [newAnnouncement, ...prev]);
    setForm({ title: '', content: '' });
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    setConfirmModal({
      isOpen: true,
      title: '删除公告',
      message: '确定删除该公告吗？',
      onConfirm: () => {
        setAnnouncements((prev) => prev.filter((a) => a.id !== id));
      },
    });
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">公告管理</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> 新增公告
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
            <label className="mb-1 block text-sm font-medium">内容</label>
            <textarea
              rows={3}
              required
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="w-full rounded-md border border-input px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              发布
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="rounded-md border px-6 py-2 text-sm font-medium hover:bg-accent">
              取消
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {announcements.map((a) => (
          <div key={a.id} className="rounded-xl border bg-white p-6">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-lg font-semibold">{a.title}</h3>
              <button onClick={() => handleDelete(a.id)} className="text-destructive hover:underline">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground">{a.content}</p>
            <div className="mt-2 text-xs text-muted-foreground">{a.createdAt}</div>
          </div>
        ))}
      </div>

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
