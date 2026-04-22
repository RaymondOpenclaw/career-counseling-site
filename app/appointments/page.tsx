'use client';

import { useState } from 'react';
import { appointments as mockAppointments } from '@/data/mock';
import { useStore } from '@/hooks/useStore';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Calendar, Clock, User, MessageSquare, Filter, Eye, Pencil, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

export default function AppointmentsPage() {
  const [filter, setFilter] = useState('全部');
  const [appointments, setAppointments] = useStore('career_appointments', mockAppointments);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ date: '', time: '', note: '' });

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

  const filtered = filter === '全部' ? appointments : appointments.filter((a) => statusMap[a.status] === filter || a.status === filter);

  const handleToggleDetail = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleDelete = (id: string) => {
    if (confirm('确定删除此预约吗？删除后不可恢复。')) {
      setAppointments((prev) => prev.filter((a) => a.id !== id));
      if (expandedId === id) setExpandedId(null);
    }
  };

  const handleCancel = (id: string) => {
    if (confirm('确定取消此预约吗？')) {
      setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'cancelled' as const } : a)));
    }
  };

  const handleEditOpen = (id: string) => {
    const a = appointments.find((x) => x.id === id);
    if (!a) return;
    setEditForm({ date: a.date, time: a.time, note: a.note || '' });
    setEditingId(id);
  };

  const handleEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    if (confirm('确定保存修改吗？')) {
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === editingId
            ? { ...a, date: editForm.date, time: editForm.time, note: editForm.note }
            : a
        )
      );
      setEditingId(null);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-muted/20 py-12">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">我的预约</h1>
            <p className="mt-2 text-muted-foreground">管理你的咨询师预约记录</p>
          </div>

          <div className="mb-6 flex items-center gap-2 overflow-x-auto">
            <Filter className="h-4 w-4 shrink-0 text-muted-foreground" />
            {['全部', '待确认', '已确认', '已完成', '已取消'].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  filter === s ? 'bg-primary text-primary-foreground' : 'bg-white text-muted-foreground hover:bg-accent'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filtered.map((a) => (
              <div key={a.id} className="rounded-xl border bg-white p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <h3 className="text-lg font-semibold">咨询预约</h3>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor[a.status]}`}>
                        {statusMap[a.status]}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" /> 咨询师：{a.counselorName}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" /> {a.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" /> {a.time}
                      </span>
                    </div>
                    {a.note && <p className="mt-2 text-sm text-muted-foreground">备注：{a.note}</p>}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleToggleDetail(a.id)}
                      className="inline-flex items-center gap-1 rounded-md border px-3 py-2 text-sm font-medium hover:bg-accent"
                      aria-label="查看详情"
                    >
                      <Eye className="h-4 w-4" /> 详情
                      {expandedId === a.id ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    </button>
                    {(a.status === 'pending' || a.status === 'confirmed') && (
                      <>
                        <button
                          onClick={() => handleEditOpen(a.id)}
                          className="inline-flex items-center gap-1 rounded-md border px-3 py-2 text-sm font-medium hover:bg-accent"
                          aria-label="修改预约"
                        >
                          <Pencil className="h-4 w-4" /> 修改
                        </button>
                        <button
                          onClick={() => handleCancel(a.id)}
                          className="inline-flex items-center gap-1 rounded-md border px-3 py-2 text-sm font-medium hover:bg-accent"
                        >
                          取消预约
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDelete(a.id)}
                      className="inline-flex items-center gap-1 rounded-md border border-destructive px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10"
                      aria-label="删除预约"
                    >
                      <Trash2 className="h-4 w-4" /> 删除
                    </button>
                  </div>
                </div>

                {expandedId === a.id && (
                  <div className="mt-4 border-t pt-4 text-sm text-muted-foreground">
                    <div className="grid gap-2 sm:grid-cols-2">
                      <div><span className="font-medium text-foreground">预约编号：</span>{a.id}</div>
                      <div><span className="font-medium text-foreground">用户：</span>{a.userName}</div>
                      <div><span className="font-medium text-foreground">咨询师：</span>{a.counselorName}</div>
                      <div><span className="font-medium text-foreground">日期：</span>{a.date}</div>
                      <div><span className="font-medium text-foreground">时间：</span>{a.time}</div>
                      <div><span className="font-medium text-foreground">状态：</span>{statusMap[a.status]}</div>
                      <div className="sm:col-span-2"><span className="font-medium text-foreground">备注：</span>{a.note || '无'}</div>
                      <div className="sm:col-span-2"><span className="font-medium text-foreground">创建时间：</span>{a.createdAt}</div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="py-20 text-center text-muted-foreground">暂无预约记录</div>
          )}
        </div>
      </main>

      {editingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl border bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-bold">修改预约</h2>
            <form onSubmit={handleEditSave} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="editDate" className="mb-1 block text-sm font-medium">日期</label>
                  <input
                    id="editDate"
                    type="date"
                    required
                    value={editForm.date}
                    onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                    className="w-full rounded-md border border-input px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label htmlFor="editTime" className="mb-1 block text-sm font-medium">时间</label>
                  <select
                    id="editTime"
                    required
                    value={editForm.time}
                    onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
                    className="w-full rounded-md border border-input px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">请选择</option>
                    <option value="09:00">09:00</option>
                    <option value="10:00">10:00</option>
                    <option value="14:00">14:00</option>
                    <option value="15:00">15:00</option>
                    <option value="16:00">16:00</option>
                    <option value="19:00">19:00</option>
                    <option value="20:00">20:00</option>
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="editNote" className="mb-1 block text-sm font-medium">咨询备注</label>
                <textarea
                  id="editNote"
                  rows={3}
                  value={editForm.note}
                  onChange={(e) => setEditForm({ ...editForm, note: e.target.value })}
                  className="w-full rounded-md border border-input px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex gap-3">
                <button type="submit" className="rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                  保存修改
                </button>
                <button type="button" onClick={() => setEditingId(null)} className="rounded-md border px-6 py-2.5 text-sm font-medium hover:bg-accent">
                  取消
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
