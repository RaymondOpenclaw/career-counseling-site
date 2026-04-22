'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { counselors as mockCounselors, articles as mockArticles, announcements as mockAnnouncements } from '@/data/mock';
import { useStore } from '@/hooks/useStore';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Star, Calendar, FileText, TestTube, ArrowRight, User, Bell } from 'lucide-react';

export default function Home() {
  const { isLoggedIn } = useAuth();
  const [counselors] = useStore('career_counselors', mockCounselors);
  const [articles] = useStore('career_articles', mockArticles);
  const [announcements] = useStore('career_announcements', mockAnnouncements);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary/5 to-primary/10 py-20 md:py-32">
          <div className="mx-auto max-w-7xl px-4 text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
              找到属于你的<span className="text-primary">职业方向</span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
              专业职业规划师一对一咨询，科学职业测评，助你突破职业瓶颈，开启理想职业生涯
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/counselors"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                <Calendar className="h-4 w-4" />
                预约咨询
              </Link>
              <Link
                href="/tests"
                className="inline-flex items-center gap-2 rounded-md border border-input bg-white px-6 py-3 text-sm font-medium hover:bg-accent"
              >
                <TestTube className="h-4 w-4" />
                职业测评
              </Link>
            </div>
          </div>
        </section>

        {/* Announcements */}
        <section className="border-b bg-muted/30 py-4">
          <div className="mx-auto flex max-w-7xl items-center gap-3 px-4">
            <Bell className="h-4 w-4 shrink-0 text-primary" />
            <div className="flex gap-6 overflow-hidden text-sm text-muted-foreground">
              {announcements.map((a) => (
                <span key={a.id} className="truncate">{a.title}</span>
              ))}
            </div>
          </div>
        </section>

        {/* Counselors */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-10 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">专业咨询师</h2>
                <p className="mt-1 text-muted-foreground">资深行业专家，一对一为你解答职业困惑</p>
              </div>
              <Link href="/counselors" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                查看全部 <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {counselors.slice(0, 4).map((c) => (
                <Link
                  key={c.id}
                  href={`/counselors/${c.id}`}
                  className="group rounded-xl border bg-white p-6 transition-shadow hover:shadow-lg"
                >
                  <div className="mb-4 flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                      {c.name[0]}
                    </div>
                    <div>
                      <h3 className="font-semibold">{c.name}</h3>
                      <p className="text-xs text-muted-foreground">{c.title}</p>
                    </div>
                  </div>
                  <div className="mb-3 flex flex-wrap gap-1">
                    {c.specialty.slice(0, 2).map((s) => (
                      <span key={s} className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
                        {s}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      {c.rating}
                    </span>
                    <span>{c.experience}年经验</span>
                    <span>{c.consultCount}次咨询</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Articles */}
        <section className="border-t bg-muted/20 py-16">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-10 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">精选文章</h2>
                <p className="mt-1 text-muted-foreground">职场干货、行业洞察、心理调适</p>
              </div>
              <Link href="/articles" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                查看全部 <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {articles.slice(0, 4).map((a) => (
                <Link
                  key={a.id}
                  href={`/articles/${a.id}`}
                  className="flex gap-4 rounded-xl border bg-white p-4 transition-shadow hover:shadow-md"
                >
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <FileText className="h-8 w-8 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
                      {a.category}
                    </span>
                    <h3 className="mt-2 truncate font-semibold">{a.title}</h3>
                    <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{a.summary}</p>
                    <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" /> {a.author}
                      </span>
                      <span>{a.views}阅读</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold">为什么选择我们</h2>
              <p className="mt-2 text-muted-foreground">三大核心服务，全方位助力你的职业发展</p>
            </div>
            <div className="mt-10 grid gap-8 md:grid-cols-3">
              <div className="rounded-xl border bg-white p-8 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">专业咨询师</h3>
                <p className="text-sm text-muted-foreground">严选行业资深专家，平均10年以上咨询经验，为你提供一对一深度指导</p>
              </div>
              <div className="rounded-xl border bg-white p-8 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <TestTube className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">科学测评</h3>
                <p className="text-sm text-muted-foreground">基于霍兰德、MBTI等经典职业测评模型，帮助你全面认识自己</p>
              </div>
              <div className="rounded-xl border bg-white p-8 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <Calendar className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">灵活预约</h3>
                <p className="text-sm text-muted-foreground">在线预约、实时沟通，随时随地获取职业支持，不受地域限制</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
