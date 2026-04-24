'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { users as mockUsers } from '@/data/mock';
import { useStore } from '@/hooks/useStore';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Captcha, { CaptchaRef } from '@/components/Captcha';
import { Eye, EyeOff } from 'lucide-react';
import { validateField } from '@/lib/validation';
import bcrypt from 'bcryptjs';

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [users] = useStore('career_users', mockUsers);
  const captchaRef = useRef<CaptchaRef>(null);
  const [form, setForm] = useState({ username: '', password: '', captcha: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validationRules = {
    username: (value: string) => (value.trim() ? '' : '请输入用户名'),
    password: (value: string) => (value.length >= 6 ? '' : '密码至少需要6个字符'),
    captcha: (value: string) => (value.trim() ? '' : '请输入验证码'),
  };

  const validate = (name: string, value: string) => {
    const error = validateField(name, value, validationRules);
    setErrors((prev) => ({ ...prev, [name]: error }));
    return error;
  };

  const handleChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) validate(name, value);
  };

  const handleBlur = (name: string, value: string) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    validate(name, value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const allErrors: Record<string, string> = {};
    Object.keys(validationRules).forEach((key) => {
      const err = validateField(key, form[key as keyof typeof form], validationRules);
      if (err) allErrors[key] = err;
    });
    setErrors(allErrors);
    setTouched({ username: true, password: true, captcha: true });
    if (Object.keys(allErrors).length > 0) return;

    if (!captchaRef.current?.validate(form.captcha)) {
      setError('验证码错误');
      captchaRef.current?.refresh();
      setForm((prev) => ({ ...prev, captcha: '' }));
      return;
    }

    const found = users.find(
      (u) => u.username === form.username || u.email === form.username
    );

    if (found?.passwordHash && bcrypt.compareSync(form.password, found.passwordHash)) {
      login(found.id);
      if (found.role === 'admin') router.push('/admin');
      else if (found.role === 'counselor') router.push('/counselor');
      else router.push('/');
      return;
    }

    setError('用户名或密码错误');
    captchaRef.current?.refresh();
    setForm((prev) => ({ ...prev, captcha: '' }));
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
              <label htmlFor="username" className="mb-1 block text-sm font-medium">用户名</label>
              <input
                id="username"
                type="text"
                placeholder="张三 或 zhangsan@example.com"
                value={form.username}
                onChange={(e) => handleChange('username', e.target.value)}
                onBlur={(e) => handleBlur('username', e.target.value)}
                className={`w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary ${errors.username ? 'border-destructive' : 'border-input'}`}
              />
              {errors.username && <p className="mt-1 text-xs text-destructive">{errors.username}</p>}
            </div>
            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-medium">密码</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPwd ? 'text' : 'password'}
                  placeholder="123456"
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
              <label htmlFor="captcha" className="mb-1 block text-sm font-medium">验证码</label>
              <div className="flex items-center gap-3">
                <input
                  id="captcha"
                  type="text"
                  placeholder="请输入验证码"
                  value={form.captcha}
                  onChange={(e) => handleChange('captcha', e.target.value)}
                  onBlur={(e) => handleBlur('captcha', e.target.value)}
                  className={`w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary ${errors.captcha ? 'border-destructive' : 'border-input'}`}
                />
                <Captcha ref={captchaRef} />
              </div>
              {errors.captcha && <p className="mt-1 text-xs text-destructive">{errors.captcha}</p>}
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
