'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell, Check } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const raw = localStorage.getItem('career_notifications');
    if (raw) {
      try {
        setNotifications(JSON.parse(raw));
      } catch {
        setNotifications([]);
      }
    } else {
      const defaults: Notification[] = [
        { id: 'n1', title: '预约提醒', message: '你有一条待确认的咨询预约', read: false, createdAt: '2024-06-01' },
        { id: 'n2', title: '系统公告', message: '平台将于本周日晚进行维护升级', read: false, createdAt: '2024-06-02' },
      ];
      setNotifications(defaults);
      localStorage.setItem('career_notifications', JSON.stringify(defaults));
    }
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem('career_notifications', JSON.stringify(updated));
  };

  const markRead = (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    setNotifications(updated);
    localStorage.setItem('career_notifications', JSON.stringify(updated));
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="relative rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
        aria-label="通知"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-medium text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 rounded-xl border bg-white shadow-lg">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <span className="text-sm font-semibold">通知</span>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="flex items-center gap-1 text-xs text-primary hover:underline"
              >
                <Check className="h-3 w-3" /> 全部已读
              </button>
            )}
          </div>
          <div className="max-h-72 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-muted-foreground">暂无通知</div>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => markRead(n.id)}
                  className={`flex w-full flex-col gap-0.5 border-b px-4 py-3 text-left last:border-b-0 hover:bg-muted/50 ${
                    n.read ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {!n.read && <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />}
                    <span className="text-sm font-medium">{n.title}</span>
                  </div>
                  <p className="pl-4 text-xs text-muted-foreground">{n.message}</p>
                  <span className="pl-4 text-[10px] text-muted-foreground">{n.createdAt}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
