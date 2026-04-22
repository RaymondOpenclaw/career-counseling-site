'use client';

import { users as mockUsers, counselors as mockCounselors, articles as mockArticles, appointments as mockAppointments, testResults as mockTestResults, announcements as mockAnnouncements } from '@/data/mock';
import { useStore } from '@/hooks/useStore';
import { Users, UserCog, FileText, Calendar, TestTube, Bell } from 'lucide-react';

export default function AdminDashboard() {
  const [users] = useStore('career_users', mockUsers);
  const [counselors] = useStore('career_counselors', mockCounselors);
  const [articles] = useStore('career_articles', mockArticles);
  const [appointments] = useStore('career_appointments', mockAppointments);
  const [testResults] = useStore('career_testResults', mockTestResults);
  const [announcements] = useStore('career_announcements', mockAnnouncements);

  const stats = [
    { label: '用户总数', value: users.filter((u) => u.role === 'user').length, icon: Users },
    { label: '咨询师', value: counselors.length, icon: UserCog },
    { label: '文章数', value: articles.length, icon: FileText },
    { label: '预约数', value: appointments.length, icon: Calendar },
    { label: '测评记录', value: testResults.length, icon: TestTube },
    { label: '公告数', value: announcements.length, icon: Bell },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">仪表盘</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-xl border bg-white p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <div className="text-3xl font-bold">{s.value}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold">最近预约</h2>
          <div className="space-y-3">
            {appointments.slice(0, 5).map((a) => (
              <div key={a.id} className="flex items-center justify-between border-b pb-2 text-sm last:border-0">
                <span>{a.userName} → {a.counselorName}</span>
                <span className="text-muted-foreground">{a.date} {a.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold">最近公告</h2>
          <div className="space-y-3">
            {announcements.slice(0, 5).map((a) => (
              <div key={a.id} className="border-b pb-2 text-sm last:border-0">
                <div className="font-medium">{a.title}</div>
                <div className="text-muted-foreground">{a.createdAt}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
