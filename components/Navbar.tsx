'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import { Menu, X, LogOut, LayoutDashboard, MessageSquare, ClipboardList } from 'lucide-react';
import NotificationBell from './NotificationBell';

const publicLinks = [
  { href: '/', label: '首页' },
  { href: '/counselors', label: '咨询师' },
  { href: '/articles', label: '心灵文章' },
  { href: '/tests', label: '职业测评' },
];

export default function Navbar() {
  const { user, logout, isLoggedIn, isAdmin, isCounselor, isUser } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const authNavItems = [
    { href: '/appointments', label: '我的预约', icon: ClipboardList, show: isUser },
    { href: '/admin', label: '管理后台', icon: LayoutDashboard, show: isAdmin },
    { href: '/counselor', label: '咨询师中心', icon: LayoutDashboard, show: isCounselor },
  ];

  const visibleAuthItems = authNavItems.filter((item) => item.show);

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
          {publicLinks.map((link) => (
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
              {visibleAuthItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                data-testid="logout-btn"
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
            {publicLinks.map((link) => (
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
                {visibleAuthItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-sm font-medium"
                  >
                    {item.label}
                  </Link>
                ))}
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
