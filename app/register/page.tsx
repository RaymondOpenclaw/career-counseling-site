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
import { validators, validateField } from '@/lib/validation';
import bcrypt from 'bcryptjs';

export default function Register() {
  const router = useRouter();
  const { login } = useAuth();
  const [users, setUsers] = useStore('career_users', mockUsers);
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '', phone: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showPwd, setShowPwd] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const validationRules = {
    username: (value: string) => validators.username(value),
    email: (value: string) => validators.email(value),
    phone: (value: string) => validators.phone(value),
    password: (value: string) => validators.password(value),
    confirmPassword: (value: string, allValues?: Record<string, string>) =>
      validators.confirmPassword(value, allValues?.password || ''),
  };

  const validate = (name: string, value: string) => {
    const error = validateField(name, value, validationRules, form);
    setErrors((prev) => ({ ...prev, [name]: error }));
    return error;
  };

  const handleChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      validate(name, value);
    }
  };

  const handleBlur = (name: string, value: string) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    validate(name, value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    const allErrors: Record<string, string> = {};
    Object.keys(validationRules).forEach((key) => {
      const error = validateField(key, form[key as keyof typeof form], validationRules, form);
      if (error) allErrors[key] = error;
    });
    setErrors(allErrors);
    setTouched(Object.fromEntries(Object.keys(validationRules).map((k) => [k, true])));
    if (Object.keys(allErrors).length > 0) {
      setSubmitError('请修正表单中的错误');
      return;
    }
    const newUser = {
      id: 'u' + Date.now(),
      username: form.username,
      email: form.email,
      role: 'user' as const,
      createdAt: new Date().toISOString().split('T')[0],
      phone: form.phone,
      passwordHash: bcrypt.hashSync(form.password, 10),
    };
    setUsers((prev) => [...prev, newUser]);
    login(newUser.id);
    router.push('/');
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 items-center justify-center bg-muted/20 py-12">
        <div className="w-full max-w-md rounded-xl border bg-white p-8 shadow-sm">
          <h1 className="mb-2 text-2xl font-bold">创建账号</h1>
          <p className="mb-6 text-sm text-muted-foreground">注册成为职引未来用户</p>

          {submitError && (
            <div className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">{submitError}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="mb-1 block text-sm font-medium">用户名</label>
              <input
                id="username"
                type="text"
                value={form.username}
                onChange={(e) => handleChange('username', e.target.value)}
                onBlur={(e) => handleBlur('username', e.target.value)}
                className={`w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary ${errors.username ? 'border-destructive' : 'border-input'}`}
              />
              {errors.username && <p className="mt-1 text-xs text-destructive">{errors.username}</p>}
            </div>
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium">邮箱</label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={(e) => handleBlur('email', e.target.value)}
                className={`w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary ${errors.email ? 'border-destructive' : 'border-input'}`}
              />
              {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="phone" className="mb-1 block text-sm font-medium">手机号</label>
              <input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                onBlur={(e) => handleBlur('phone', e.target.value)}
                className={`w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary ${errors.phone ? 'border-destructive' : 'border-input'}`}
              />
              {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone}</p>}
            </div>
            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-medium">密码</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPwd ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  onBlur={(e) => handleBlur('password', e.target.value)}
                  className={`w-full rounded-md border px-3 py-2 pr-10 text-sm outline-none focus:ring-2 focus:ring-primary ${errors.password ? 'border-destructive' : 'border-input'}`}
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
              {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password}</p>}
            </div>
            <div>
              <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium">确认密码</label>
              <input
                id="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                onBlur={(e) => handleBlur('confirmPassword', e.target.value)}
                className={`w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary ${errors.confirmPassword ? 'border-destructive' : 'border-input'}`}
              />
              {errors.confirmPassword && <p className="mt-1 text-xs text-destructive">{errors.confirmPassword}</p>}
            </div>
            <button
              type="submit"
              className="w-full rounded-md bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              注册
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            已有账号？{' '}
            <Link href="/login" className="font-medium text-primary hover:underline">
              去登录
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
