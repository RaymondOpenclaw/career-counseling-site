'use client';

import { useState } from 'react';
import { users as mockUsers } from '@/data/mock';
import { useStore } from '@/hooks/useStore';
import { Search, Trash2, User, Plus, Pencil, ArrowUpDown } from 'lucide-react';
import ConfirmModal from '@/components/ConfirmModal';
import Pagination from '@/components/Pagination';
import { usePagination } from '@/hooks/usePagination';

export default function UsersPage() {
  const [users, setUsers] = useStore('career_users', mockUsers);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    username: '',
    email: '',
    phone: '',
    role: 'user' as 'user' | 'counselor' | 'admin',
  });
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const filtered = users.filter((u) => u.username.includes(search) || u.email.includes(search));

  const sorted = [...filtered].sort((a, b) => {
    if (!sortKey) return 0;
    const av = String(a[sortKey as keyof typeof a] || '');
    const bv = String(b[sortKey as keyof typeof b] || '');
    return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
  });

  const { page, setPage, totalPages, paginatedData } = usePagination({ data: sorted, pageSize: 5 });

  const openCreate = () => {
    setForm({ username: '', email: '', phone: '', role: 'user' });
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (u: (typeof users)[0]) => {
    setForm({
      username: u.username,
      email: u.email,
      phone: u.phone || '',
      role: u.role,
    });
    setEditingId(u.id);
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setUsers((prev) => prev.map((u) => (u.id === editingId ? { ...u, ...form } : u)));
    } else {
      const newUser = {
        id: 'u' + Date.now(),
        ...form,
        createdAt: new Date().toISOString().slice(0, 10),
      };
      setUsers((prev) => [newUser, ...prev]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    setConfirmModal({
      isOpen: true,
      title: '删除用户',
      message: '确定删除该用户吗？',
      onConfirm: () => {
        setUsers((prev) => prev.filter((u) => u.id !== id));
      },
    });
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">用户管理</h1>

      <div className="mb-6 flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="搜索用户..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-input bg-white py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> 新增用户
        </button>
      </div>

      <div className="hidden md:block overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium">
                <button type="button" onClick={() => handleSort('username')} className="flex items-center gap-1">
                  用户 <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="px-4 py-3 text-left font-medium">
                <button type="button" onClick={() => handleSort('email')} className="flex items-center gap-1">
                  邮箱 <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="px-4 py-3 text-left font-medium">手机号</th>
              <th className="px-4 py-3 text-left font-medium">角色</th>
              <th className="px-4 py-3 text-left font-medium">
                <button type="button" onClick={() => handleSort('createdAt')} className="flex items-center gap-1">
                  注册时间 <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="px-4 py-3 text-right font-medium">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {paginatedData.map((u) => (
              <tr key={u.id} className="hover:bg-muted/30">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    {u.username}
                  </div>
                </td>
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3">{u.phone || '-'}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-xs">{u.role}</span>
                </td>
                <td className="px-4 py-3">{u.createdAt}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => openEdit(u)}
                      className="text-primary hover:underline"
                      title="编辑"
                    >
                      <Pencil className="h-4 w-4 inline" />
                    </button>
                    <button
                      onClick={() => handleDelete(u.id)}
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
        <Pagination page={page} totalPages={totalPages} total={sorted.length} onChange={setPage} />
      </div>

      <div className="md:hidden space-y-4">
        {paginatedData.map((u) => (
          <div key={u.id} className="rounded-xl border bg-white p-4">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">{u.username}</p>
                <p className="text-xs text-muted-foreground">{u.email}</p>
              </div>
            </div>
            <div className="mb-3 grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-xs text-muted-foreground">手机号</span>
                <p>{u.phone || '-'}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">角色</span>
                <p><span className="rounded-full bg-secondary px-2 py-0.5 text-xs">{u.role}</span></p>
              </div>
              <div className="col-span-2">
                <span className="text-xs text-muted-foreground">注册时间</span>
                <p>{u.createdAt}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 border-t pt-3">
              <button
                onClick={() => openEdit(u)}
                className="inline-flex flex-1 items-center justify-center gap-1 rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-accent"
              >
                <Pencil className="h-3 w-3" /> 编辑
              </button>
              <button
                onClick={() => handleDelete(u.id)}
                className="inline-flex flex-1 items-center justify-center gap-1 rounded-md border border-destructive px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-3 w-3" /> 删除
              </button>
            </div>
          </div>
        ))}
        <Pagination page={page} totalPages={totalPages} total={sorted.length} onChange={setPage} />
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-bold">{editingId ? '编辑用户' : '新增用户'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">用户名</label>
                <input
                  required
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="w-full rounded-md border border-input px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">邮箱</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-md border border-input px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">手机号</label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full rounded-md border border-input px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">角色</label>
                <select
                  value={form.role}
                  onChange={(e) =>
                    setForm({ ...form, role: e.target.value as typeof form.role })
                  }
                  className="w-full rounded-md border border-input px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="user">user</option>
                  <option value="counselor">counselor</option>
                  <option value="admin">admin</option>
                </select>
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
