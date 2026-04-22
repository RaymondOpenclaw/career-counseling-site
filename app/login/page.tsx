'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { users as mockUsers } from '@/data/mock';
import { useStore } from '@/hooks/useStore';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [users] = useStore('career_users', mockUsers);
  const [form, setForm] = useState({ username: '', password: '', role: 'user' as 'user' | 'counselor' | 'admin' });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 模拟登录：admin/123456, zhangsan/123456
    if (form.role === 'admin' && form.username === 'admin' && form.password === '123456') {
      login(users.find(u => u.role === 'admin') || { id: 'a1', username: '管理员', email: 'admin@example.com', role: 'admin', createdAt: '2024-01-01' });
      router.push('/admin');
      return;
    }
    if (form.username === 'zhangsan' && form.password === '123456') {
      const user = users.find(u => u.username === '张三');
      if (user) {
        login({ ...user, role: form.role === 'counselor' ? 'counselor' : 'user' });
        router.push(form.role === 'counselor' ? '/counselor' : '/');
      }
      return;
    }
    setError('用户名或密码错误（演示账号：admin/123456 或 zhangsan/123456）');
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 items-center justify-center bg-muted/20 py-12">
        <div className="w-full max-w-md rounded-xl border bg-white p-8 shadow-sm">
          <h1 className="mb-2 text-2xl font-bold">欢迎回来</h1>
          <p className="mb-6 text-sm text-muted-foreground">登录你的职引未来账号</p>

          {error && (
            <div className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="role" className="mb-1 block text-sm font-medium">角色</label>
              <select
                id="role"
                name="role"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value as any })}
                className="w-full rounded-md border border-input px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="user">用户</option>
                <option value="counselor">咨询师</option>
                <option value="admin">管理员</option>
              </select>
            </div>
            <div>
              <label htmlFor="username" className="mb-1 block text-sm font-medium">用户名</label>
              <input
                id="username"
                type="text"
                required
                placeholder={form.role === 'admin' ? 'admin' : 'zhangsan'}
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full rounded-md border border-input px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-medium">密码</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPwd ? 'text' : 'password'}
                  required
                  placeholder="123456"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full rounded-md border border-input px-3 py-2 pr-10 text-sm outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="button"
                  aria-label={showPwd ? '隐藏密码' : '显示密码'}
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="w-full rounded-md bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              登录
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            还没有账号？{' '}
            <Link href="/register" className="font-medium text-primary hover:underline">
              立即注册
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
