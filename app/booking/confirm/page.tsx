'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CheckCircle, Calendar, Clock, User, ArrowRight, Home } from 'lucide-react';

interface LastBooking {
  counselorName: string;
  date: string;
  time: string;
  note: string;
}

export default function BookingConfirmPage() {
  const [booking, setBooking] = useState<LastBooking | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem('career_last_booking');
    if (raw) {
      try {
        setBooking(JSON.parse(raw));
      } catch {
        setBooking(null);
      }
    }
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 items-center justify-center bg-muted/20 py-12">
        <div className="w-full max-w-md rounded-xl border bg-white p-8 shadow-sm text-center">
          {booking ? (
            <>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="mb-2 text-2xl font-bold">预约成功</h1>
              <p className="mb-6 text-sm text-muted-foreground">你的咨询预约已提交，请等待确认</p>

              <div className="mb-6 space-y-3 rounded-lg bg-muted/30 p-4 text-left text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">咨询师：</span>{booking.counselorName}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">日期：</span>{booking.date}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">时间：</span>{booking.time}
                </div>
                {booking.note && (
                  <div className="flex items-start gap-2">
                    <span className="font-medium shrink-0">备注：</span>
                    <span className="text-muted-foreground">{booking.note}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <Link
                  href="/appointments"
                  className="inline-flex items-center justify-center gap-1 rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  查看我的预约 <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-1 rounded-md border px-6 py-2.5 text-sm font-medium hover:bg-accent"
                >
                  <Home className="h-4 w-4" /> 返回首页
                </Link>
              </div>
            </>
          ) : (
            <>
              <h1 className="mb-2 text-xl font-bold">未找到预约信息</h1>
              <p className="mb-6 text-sm text-muted-foreground">请在咨询师页面提交预约</p>
              <Link
                href="/counselors"
                className="inline-flex items-center justify-center gap-1 rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                去预约咨询师 <ArrowRight className="h-4 w-4" />
              </Link>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
