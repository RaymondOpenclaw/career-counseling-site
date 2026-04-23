'use client';

import { useState } from 'react';
import { articles as mockArticles } from '@/data/mock';
import { useStore } from '@/hooks/useStore';
import { Search, Trash2, Eye, Heart, Plus, Pencil } from 'lucide-react';
import ConfirmModal from '@/components/ConfirmModal';

export default function AdminArticlesPage() {
  const [articles, setArticles] = useStore('career_articles', mockArticles);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '',
    summary: '',
    content: '',
    category: '',
    author: '',
    authorId: '',
    cover: '',
  });
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const filtered = articles.filter((a) => a.title.includes(search) || a.author.includes(search));

  const openCreate = () => {
    setForm({ title: '', summary: '', content: '', category: '', author: '', authorId: '', cover: '' });
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (a: (typeof articles)[0]) => {
    setForm({
      title: a.title,
      summary: a.summary,
      content: a.content,
      category: a.category,
      author: a.author,
      authorId: a.authorId,
      cover: a.cover || '',
    });
    setEditingId(a.id);
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      cover: form.cover || undefined,
    };
    if (editingId) {
      setArticles((prev) =>
        prev.map((a) => (a.id === editingId ? { ...a, ...payload } : a))
      );
    } else {
      const newArticle = {
        id: 'a' + Date.now(),
        ...payload,
        views: 0,
        likes: 0,
        createdAt: new Date().toISOString().slice(0, 10),
      };
      setArticles((prev) => [newArticle, ...prev]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    setConfirmModal({
      isOpen: true,
      title: '删除文章',
      message: '确定删除该文章吗？',
      onConfirm: () => {
        setArticles((prev) => prev.filter((a) => a.id !== id));
      },
    });
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
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> 新增文章
        </button>
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
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" /> {a.views}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="flex items-center gap-1">
                    <Heart className="h-3 w-3" /> {a.likes}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => openEdit(a)}
                      className="text-primary hover:underline"
                      title="编辑"
                    >
                      <Pencil className="h-4 w-4 inline" />
                    </button>
                    <button
                      onClick={() => handleDelete(a.id)}
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
          <div className="w-full max-w-2xl rounded-xl border bg-white p-6 shadow-lg max-h-[90vh] overflow-y-auto">
            <h2 className="mb-4 text-lg font-bold">{editingId ? '编辑文章' : '新增文章'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">标题</label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full rounded-md border border-input px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">分类</label>
                  <input
                    required
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full rounded-md border border-input px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">作者</label>
                  <input
                    required
                    value={form.author}
                    onChange={(e) => setForm({ ...form, author: e.target.value })}
                    className="w-full rounded-md border border-input px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">作者ID</label>
                  <input
                    required
                    value={form.authorId}
                    onChange={(e) => setForm({ ...form, authorId: e.target.value })}
                    className="w-full rounded-md border border-input px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">封面图片URL</label>
                  <input
                    value={form.cover}
                    onChange={(e) => setForm({ ...form, cover: e.target.value })}
                    className="w-full rounded-md border border-input px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">摘要</label>
                <textarea
                  rows={2}
                  required
                  value={form.summary}
                  onChange={(e) => setForm({ ...form, summary: e.target.value })}
                  className="w-full rounded-md border border-input px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">正文内容</label>
                <textarea
                  rows={6}
                  required
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
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
