'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useStore } from '@/hooks/useStore';
import { appointments as mockAppointments } from '@/data/mock';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { User, Mail, Phone, Calendar, Lock, Save, ClipboardList, Clock, ArrowRight } from 'lucide-react';
import Toast from '@/components/Toast';

export default function Profile() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    username: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [pwdForm, setPwdForm] = useState({ old: '', new: '', confirm: '' });
  const [activeTab, setActiveTab] = useState<'info' | 'password' | 'appointments'>('info');
  const [appointments] = useStore('career_appointments', mockAppointments);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setToast({ message: '保存成功（演示模式）', type: 'success' });
  };

  const handleChangePwd = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwdForm.new !== pwdForm.confirm) {
      setToast({ message: '两次输入的新密码不一致', type: 'error' });
      return;
    }
    setToast({ message: '密码修改成功（演示模式）', type: 'success' });
    setPwdForm({ old: '', new: '', confirm: '' });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-muted/20 py-12">
        <div className="mx-auto max-w-2xl px-4">
          <h1 className="mb-6 text-2xl font-bold">个人中心</h1>

          <div className="mb-6 flex gap-2">
            <button
              onClick={() => setActiveTab('info')}
              className={`rounded-md px-4 py-2 text-sm font-medium ${activeTab === 'info' ? 'bg-primary text-primary-foreground' : 'bg-white text-muted-foreground hover:bg-accent'}`}
            >
              基本信息
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`rounded-md px-4 py-2 text-sm font-medium ${activeTab === 'password' ? 'bg-primary text-primary-foreground' : 'bg-white text-muted-foreground hover:bg-accent'}`}
            >
              修改密码
            </button>
            <button
              onClick={() => setActiveTab('appointments')}
              className={`rounded-md px-4 py-2 text-sm font-medium ${activeTab === 'appointments' ? 'bg-primary text-primary-foreground' : 'bg-white text-muted-foreground hover:bg-accent'}`}
            >
              我的预约
            </button>
          </div>

          {activeTab === 'info' && (
            <form onSubmit={handleSave} className="rounded-xl border bg-white p-6 space-y-4">
              <div>
                <label htmlFor="username" className="mb-1 block text-sm font-medium">用户名</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="username"
                    type="text"
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    className="w-full rounded-md border border-input py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-medium">邮箱</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full rounded-md border border-input py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="phone" className="mb-1 block text-sm font-medium">手机号</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full rounded-md border border-input py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="createdAt" className="mb-1 block text-sm font-medium">注册时间</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="createdAt"
                    type="text"
                    readOnly
                    value={user?.createdAt || ''}
                    className="w-full rounded-md border border-input bg-muted/30 py-2 pl-10 pr-4 text-sm text-muted-foreground"
                  />
                </div>
              </div>
              <button type="submit" className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                <Save className="h-4 w-4" /> 保存修改
              </button>
            </form>
          )}

          {activeTab === 'password' && (
            <form onSubmit={handleChangePwd} className="rounded-xl border bg-white p-6 space-y-4">
              <div>
                <label htmlFor="oldPassword" className="mb-1 block text-sm font-medium">原密码</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="oldPassword"
                    type="password"
                    required
                    value={pwdForm.old}
                    onChange={(e) => setPwdForm({ ...pwdForm, old: e.target.value })}
                    className="w-full rounded-md border border-input py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="newPassword" className="mb-1 block text-sm font-medium">新密码</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="newPassword"
                    type="password"
                    required
                    value={pwdForm.new}
                    onChange={(e) => setPwdForm({ ...pwdForm, new: e.target.value })}
                    className="w-full rounded-md border border-input py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium">确认新密码</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="confirmPassword"
                    type="password"
                    required
                    value={pwdForm.confirm}
                    onChange={(e) => setPwdForm({ ...pwdForm, confirm: e.target.value })}
                    className="w-full rounded-md border border-input py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <button type="submit" className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                <Lock className="h-4 w-4" /> 修改密码
              </button>
            </form>
          )}

          {activeTab === 'appointments' && (
            <div className="space-y-4">
              {appointments.length === 0 ? (
                <div className="rounded-xl border bg-white p-6 text-center text-muted-foreground">
                  <ClipboardList className="mx-auto mb-2 h-8 w-8" />
                  暂无预约记录
                </div>
              ) : (
                appointments.map((a) => (
                  <div key={a.id} className="rounded-xl border bg-white p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">咨询预约</p>
                        <p className="text-xs text-muted-foreground">{a.counselorName}</p>
                      </div>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor[a.status]}`}>
                        {statusMap[a.status]}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {a.date} {a.time}
                    </div>
                  </div>
                ))
              )}
              <Link
                href="/appointments"
                className="flex items-center justify-center gap-1 rounded-md border bg-white px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-accent"
              >
                查看全部预约管理 <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
