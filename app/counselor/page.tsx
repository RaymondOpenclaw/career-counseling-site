'use client';

import { useState } from 'react';
import { appointments as mockAppointments } from '@/data/mock';
import { useStore } from '@/hooks/useStore';
import { Calendar, Clock, User, CheckCircle, XCircle } from 'lucide-react';

export default function CounselorPage() {
  const [appointments, setAppointments] = useStore('career_appointments', mockAppointments);

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

  const handleConfirm = (id: string) => {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'confirmed' as const } : a)));
  };

  const handleComplete = (id: string) => {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'completed' as const } : a)));
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">预约管理</h1>

      <div className="space-y-4">
        {appointments.map((a) => (
          <div key={a.id} className="rounded-xl border bg-white p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-3">
                  <h3 className="text-lg font-semibold">{a.userName}</h3>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor[a.status]}`}>
                    {statusMap[a.status]}
                  </span>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {a.date}</span>
                  <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {a.time}</span>
                </div>
                {a.note && <p className="mt-2 text-sm text-muted-foreground">备注：{a.note}</p>}
              </div>
              <div className="flex gap-2">
                {a.status === 'pending' && (
                  <button
                    onClick={() => handleConfirm(a.id)}
                    className="inline-flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                  >
                    <CheckCircle className="h-4 w-4" /> 确认
                  </button>
                )}
                {a.status === 'confirmed' && (
                  <button
                    onClick={() => handleComplete(a.id)}
                    className="inline-flex items-center gap-1 rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent"
                  >
                    <CheckCircle className="h-4 w-4" /> 完成
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {appointments.length === 0 && (
        <div className="py-20 text-center text-muted-foreground">暂无预约</div>
      )}
    </div>
  );
}
