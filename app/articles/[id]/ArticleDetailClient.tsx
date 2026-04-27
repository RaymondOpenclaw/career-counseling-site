'use client';

import Link from 'next/link';
import { articles as mockArticles } from '@/data/mock';
import { useStore } from '@/hooks/useStore';
import { ArrowLeft, Eye, Heart, User, Calendar } from 'lucide-react';

export default function ArticleDetailClient({ id }: { id: string }) {
  const [articles] = useStore('career_articles', mockArticles);
  const article = articles.find((a) => a.id === id);

  if (!article) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 py-20 text-center text-muted-foreground">文章不存在</main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 bg-muted/20 py-12">
        <div className="mx-auto max-w-3xl px-4">
          <Link href="/articles" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-4 w-4" />
            返回文章列表
          </Link>

          <article className="rounded-xl border bg-white p-8">
            <span className="mb-3 inline-block rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">{article.category}</span>
            <h1 className="mb-4 text-2xl font-bold md:text-3xl">{article.title}</h1>
            <div className="mb-8 flex flex-wrap items-center gap-4 border-b pb-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><User className="h-4 w-4" /> {article.author}</span>
              <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {article.createdAt}</span>
              <span className="flex items-center gap-1"><Eye className="h-4 w-4" /> {article.views}</span>
              <span className="flex items-center gap-1"><Heart className="h-4 w-4" /> {article.likes}</span>
            </div>
            <div className="prose max-w-none leading-relaxed text-muted-foreground">
              <p className="mb-4 font-medium text-foreground">{article.summary}</p>
              <p>{article.content}</p>
              <p className="mt-4">（此处为演示内容，实际文章将展示完整正文。）</p>
            </div>
          </article>
        </div>
      </main>
    </div>
  );
}
