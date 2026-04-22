'use client';

import { tests as mockTests } from '@/data/mock';
import { useStore } from '@/hooks/useStore';
import { TestTube, Clock } from 'lucide-react';

export default function AdminTestsPage() {
  const [tests] = useStore('career_tests', mockTests);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">测评管理</h1>

      <div className="grid gap-4 md:grid-cols-2">
        {tests.map((t) => (
          <div key={t.id} className="rounded-xl border bg-white p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <TestTube className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">{t.title}</h3>
            <p className="mb-4 text-sm text-muted-foreground">{t.description}</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {t.questions.length}道题</span>
              <span>{t.category}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
