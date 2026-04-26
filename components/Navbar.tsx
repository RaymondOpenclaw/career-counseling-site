'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import { Menu, X, User, LogOut, LayoutDashboard, MessageSquare, ClipboardList } from 'lucide-react';
import NotificationBell from './NotificationBell';

export default function Navbar() {
  const { user, logout, isLoggedIn, isAdmin, isCounselor, isUser } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: '/', label: '首页' },
    { href: '/counselors', label: '咨询师' },
    { href: '/articles', label: '心灵文章' },
    { href: '/tests', label: '职业测评' },
  ];

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary">
          <MessageSquare className="h-6 w-6" />
          职引未来
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === link.href ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              {link.label}
            </Link>
          ))}

          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <NotificationBell />
              {isUser && (
                <Link
                  href="/appointments"
                  className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary"
                >
                  <ClipboardList className="h-4 w-4" />
                  我的预约
                </Link>
              )}
              {(isAdmin || isCounselor) && (
                <Link
                  href={isAdmin ? '/admin' : '/counselor'}
                  className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  {isAdmin ? '管理后台' : '咨询师中心'}
                </Link>
              )}
              <Link
                href="/profile"
                className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary"
              >
                <User className="h-4 w-4" />
                {user?.username}
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-destructive"
              >
                <LogOut className="h-4 w-4" />
                退出
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-sm font-medium text-muted-foreground hover:text-primary"
              >
                登录
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                注册
              </Link>
            </div>
          )}
        </div>

        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`text-sm font-medium ${
                  pathname === link.href ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isLoggedIn ? (
              <>
                {isUser && (
                  <Link href="/appointments" onClick={() => setMobileOpen(false)} className="text-sm font-medium">
                    我的预约
                  </Link>
                )}
                <Link href="/profile" onClick={() => setMobileOpen(false)} className="text-sm font-medium">
                  个人中心
                </Link>
                {(isAdmin || isCounselor) && (
                  <Link
                    href={isAdmin ? '/admin' : '/counselor'}
                    onClick={() => setMobileOpen(false)}
                    className="text-sm font-medium"
                  >
                    {isAdmin ? '管理后台' : '咨询师中心'}
                  </Link>
                )}
                <button onClick={handleLogout} className="text-left text-sm font-medium text-destructive">
                  退出登录
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileOpen(false)} className="text-sm font-medium">
                  登录
                </Link>
                <Link href="/register" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-primary">
                  注册
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
