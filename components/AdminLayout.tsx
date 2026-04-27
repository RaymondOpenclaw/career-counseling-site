'use client';

import SidebarLayout from '@/components/SidebarLayout';
import {
  LayoutDashboard,
  Users,
  UserCog,
  FileText,
  TestTube,
  Calendar,
  Bell,
  Image,
} from 'lucide-react';

const navItems = [
  { href: '/admin', label: '仪表盘', icon: LayoutDashboard },
  { href: '/admin/users', label: '用户管理', icon: Users },
  { href: '/admin/counselors', label: '咨询师管理', icon: UserCog },
  { href: '/admin/articles', label: '文章管理', icon: FileText },
  { href: '/admin/tests', label: '测评管理', icon: TestTube },
  { href: '/admin/appointments', label: '预约管理', icon: Calendar },
  { href: '/admin/announcements', label: '公告管理', icon: Bell },
  { href: '/admin/banners', label: '轮播图管理', icon: Image },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarLayout title="管理后台" navItems={navItems} guardRole="admin">
      {children}
    </SidebarLayout>
  );
}
