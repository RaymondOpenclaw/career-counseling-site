'use client';

import SidebarLayout from '@/components/SidebarLayout';
import { Calendar, MessageSquare, User } from 'lucide-react';

const navItems = [
  { href: '/counselor', label: '预约管理', icon: Calendar },
  { href: '/chat', label: '在线聊天', icon: MessageSquare },
  { href: '/profile', label: '个人中心', icon: User },
];

export default function CounselorLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarLayout title="咨询师中心" navItems={navItems} guardRole="counselor">
      {children}
    </SidebarLayout>
  );
}
