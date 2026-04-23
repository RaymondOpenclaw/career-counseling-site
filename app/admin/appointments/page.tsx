'use client';

import { useState } from 'react';
import { appointments as mockAppointments, users as mockUsers, counselors as mockCounselors } from '@/data/mock';
import { useStore } from '@/hooks/useStore';
import { Search, Trash2, Calendar, Clock, User, CheckCircle, Plus, Pencil, XCircle, CheckCircle2 } from 'lucide-react';

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useStore('career_appointments', mockAppointments);
  const [users] = useStore('career_users', mockUsers);
  const [counselors] = useStore('career_counselors', mockCounselors);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    userId: '',
    userName: '',
    counselorId: '',
    counselorName: '',
    date: '',
    time: '09:00',
    status: 'pending' as 'pending' | 'confirmed' | 'completed' | 'cancelled',
    note: '',
  });

  const statusMap: Record<string, string> = {
    pending: '待确认',
    confirmed: '已确认',
    completed: '已完成',
    cancelled: '已取消',
  };

  const statusColor: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-gray-100 text-gray-700',
  };

  const filtered = appointments.filter(
    (a) => a.userName.includes(search) || a.counselorName.includes(search)
  );

  const openCreate = () => {
    setForm({
      userId: users[0]?.id || '',
      userName: users[0]?.username || '',
      counselorId: counselors[0]?.id || '',
      counselorName: counselors[0]?.name || '',
      date: new Date().toISOString().slice(0, 10),
      time: '09:00',
      status: 'pending',
      note: '',
    });
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (a: (typeof appointments)[0]) => {
    setForm({
      userId: a.userId,
      userName: a.userName,
      counselorId: a.counselorId,
      counselorName: a.counselorName,
      date: a.date,
      time: a.time,
      status: a.status,
      note: a.note || '',
    });
    setEditingId(a.id);
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setAppointments((prev) =>
        prev.map((a) => (a.id === editingId ? { ...a, ...form } : a))
      );
    } else {
      const newAppointment = {
        id: 'ap' + Date.now(),
        ...form,
        createdAt: new Date().toISOString().slice(0, 10),
      };
      setAppointments((prev) => [newAppointment, ...prev]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('确定删除该预约吗？')) {
      setAppointments((prev) => prev.filter((a) => a.id !== id));
    }
  };

  const handleStatusChange = (id: string, status: typeof form.status) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
  };

  const handleUserChange = (userId: string) => {
    const u = users.find((x) => x.id === userId);
    if (u) setForm((prev) => ({ ...prev, userId: u.id, userName: u.username }));
  };

  const handleCounselorChange = (counselorId: string) => {
    const c = counselors.find((x) => x.id === counselorId);
    if (c) setForm((prev) => ({ ...prev, counselorId: c.id, counselorName: c.name }));
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">预约管理</h1>

      <div className="mb-6 flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="搜索预约..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-input bg-white py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> 新增预约
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium">用户</th>
              <th className="px-4 py-3 text-left font-medium">咨询师</th>
              <th className="px-4 py-3 text-left font-medium">日期</th>
              <th className="px-4 py-3 text-left font-medium">时间</th>
              <th className="px-4 py-3 text-left font-medium">状态</th>
              <th className="px-4 py-3 text-right font-medium">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((a) => (
              <tr key={a.id} className="hover:bg-muted/30">
                <td className="px-4 py-3">{a.userName}</td>
                <td className="px-4 py-3">{a.counselorName}</td>
                <td className="px-4 py-3">{a.date}</td>
                <td className="px-4 py-3">{a.time}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColor[a.status]}`}>
                    {statusMap[a.status]}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {a.status === 'pending' && (
                      <button
                        onClick={() => handleStatusChange(a.id, 'confirmed')}
                        className="text-primary hover:underline"
                        title="确认"
                      >
                        <CheckCircle2 className="h-4 w-4 inline" />
                      </button>
                    )}
                    {a.status === 'confirmed' && (
                      <button
                        onClick={() => handleStatusChange(a.id, 'completed')}
                        className="text-green-600 hover:underline"
                        title="完成"
                      >
                        <CheckCircle className="h-4 w-4 inline" />
                      </button>
                    )}
                    {(a.status === 'pending' || a.status === 'confirmed') && (
                      <button
                        onClick={() => handleStatusChange(a.id, 'cancelled')}
                        className="text-gray-500 hover:underline"
                        title="取消"
                      >
                        <XCircle className="h-4 w-4 inline" />
                      </button>
                    )}
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
          <div className="w-full max-w-lg rounded-xl border bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-bold">{editingId ? '编辑预约' : '新增预约'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">用户</label>
                  <select
                    required
                    value={form.userId}
                    onChange={(e) => handleUserChange(e.target.value)}
                    className="w-full rounded-md border border-input px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                  >
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>{u.username}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">咨询师</label>
                  <select
                    required
                    value={form.counselorId}
                    onChange={(e) => handleCounselorChange(e.target.value)}
                    className="w-full rounded-md border border-input px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                  >
                    {counselors.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">日期</label>
                  <input
                    type="date"
                    required
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full rounded-md border border-input px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">时间</label>
                  <select
                    required
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                    className="w-full rounded-md border border-input px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                  >
                    {['09:00', '10:00', '14:00', '15:00', '16:00', '19:00', '20:00'].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">状态</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as typeof form.status })}
                  className="w-full rounded-md border border-input px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="pending">待确认</option>
                  <option value="confirmed">已确认</option>
                  <option value="completed">已完成</option>
                  <option value="cancelled">已取消</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">备注</label>
                <textarea
                  rows={3}
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
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
    </div>
  );
}
