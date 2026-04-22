'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { counselors as mockCounselors } from '@/data/mock';
import { useStore } from '@/hooks/useStore';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Star, Calendar, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CounselorDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const [counselors] = useStore('career_counselors', mockCounselors);
  const counselor = counselors.find((c) => c.id === id);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingForm, setBookingForm] = useState({ date: '', time: '', note: '' });

  if (!counselor) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 py-20 text-center text-muted-foreground">咨询师不存在</main>
        <Footer />
      </div>
    );
  }

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    alert('预约提交成功！（演示模式）');
    setShowBooking(false);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-muted/20 py-12">
        <div className="mx-auto max-w-4xl px-4">
          <Link href="/counselors" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-4 w-4" />
            返回列表
          </Link>

          <div className="rounded-xl border bg-white p-8">
            <div className="flex flex-col gap-6 md:flex-row">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-primary/10 text-3xl font-bold text-primary">
                {counselor.name[0]}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold">{counselor.name}</h1>
                <p className="text-muted-foreground">{counselor.title}</p>
                <div className="mt-2 flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    {counselor.rating}
                  </span>
                  <span>{counselor.experience}年经验</span>
                  <span>{counselor.consultCount}次咨询</span>
                </div>
              </div>
              <div className="flex flex-col gap-3 md:items-end">
                <span className="text-2xl font-bold text-primary">¥{counselor.price}<span className="text-sm font-normal text-muted-foreground">/次</span></span>
                <button
                  onClick={() => setShowBooking(true)}
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  <Calendar className="h-4 w-4" />
                  立即预约
                </button>
              </div>
            </div>

            <div className="mt-6 border-t pt-6">
              <h2 className="mb-3 text-lg font-semibold">专长领域</h2>
              <div className="flex flex-wrap gap-2">
                {counselor.specialty.map((s) => (
                  <span key={s} className="rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground">{s}</span>
                ))}
              </div>
            </div>

            <div className="mt-6 border-t pt-6">
              <h2 className="mb-3 text-lg font-semibold">个人简介</h2>
              <p className="text-muted-foreground leading-relaxed">{counselor.bio}</p>
            </div>
          </div>

          {showBooking && (
            <div className="mt-6 rounded-xl border bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold">预约咨询</h2>
              <form onSubmit={handleBooking} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium">日期</label>
                    <input
                      type="date"
                      required
                      value={bookingForm.date}
                      onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                      className="w-full rounded-md border border-input px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">时间</label>
                    <select
                      required
                      value={bookingForm.time}
                      onChange={(e) => setBookingForm({ ...bookingForm, time: e.target.value })}
                      className="w-full rounded-md border border-input px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">请选择</option>
                      <option value="09:00">09:00</option>
                      <option value="10:00">10:00</option>
                      <option value="14:00">14:00</option>
                      <option value="15:00">15:00</option>
                      <option value="16:00">16:00</option>
                      <option value="19:00">19:00</option>
                      <option value="20:00">20:00</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">咨询备注</label>
                  <textarea
                    rows={3}
                    placeholder="请简述你想咨询的问题..."
                    value={bookingForm.note}
                    onChange={(e) => setBookingForm({ ...bookingForm, note: e.target.value })}
                    className="w-full rounded-md border border-input px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">确认预约</button>
                  <button type="button" onClick={() => setShowBooking(false)} className="rounded-md border px-6 py-2.5 text-sm font-medium hover:bg-accent">取消</button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
