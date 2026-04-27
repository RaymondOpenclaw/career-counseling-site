'use client';

import { useState } from 'react';
import Link from 'next/link';
import { tests as mockTests, testResults as mockTestResults } from '@/data/mock';
import { useStore } from '@/hooks/useStore';
import { useAuth } from '@/hooks/useAuth';
import { TestTube, Clock, ArrowRight, CheckCircle } from 'lucide-react';

export default function TestsPage() {
  const { isLoggedIn } = useAuth();
  const [tests] = useStore('career_tests', mockTests);
  const [testResults, setTestResults] = useStore('career_testResults', mockTestResults);
  const [activeTest, setActiveTest] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ score: number; text: string } | null>(null);

  const currentTest = tests.find((t) => t.id === activeTest);

  const handleAnswer = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmit = () => {
    if (!currentTest) return;
    const totalScore = currentTest.questions.reduce((sum, q) => {
      const option = q.options.find((o) => o.id === answers[q.id]);
      return sum + (option?.score || 0);
    }, 0);
    const maxScore = currentTest.questions.length * 3;
    const percentage = Math.round((totalScore / maxScore) * 100);
    let text = '';
    if (percentage >= 80) text = '你的职业匹配度非常高，当前方向很适合你！';
    else if (percentage >= 60) text = '你的职业匹配度良好，可以在此基础上继续发展。';
    else if (percentage >= 40) text = '你的职业匹配度一般，建议多尝试不同领域。';
    else text = '你可能需要重新思考职业方向，建议寻求专业咨询。';
    setResult({ score: percentage, text });
  };

  const allAnswered = currentTest ? currentTest.questions.every((q) => answers[q.id]) : false;

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 bg-muted/20 py-12">
        <div className="mx-auto max-w-4xl px-4">
          {!activeTest ? (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-bold">职业测评</h1>
                <p className="mt-2 text-muted-foreground">通过科学测评，深入了解自己的职业兴趣、性格与价值观</p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {tests.map((t) => (
                  <div key={t.id} className="rounded-xl border bg-white p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <TestTube className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold">{t.title}</h3>
                    <p className="mb-4 text-sm text-muted-foreground">{t.description}</p>
                    <div className="mb-4 flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {t.questions.length}道题</span>
                      <span>{t.category}</span>
                    </div>
                    <button
                      onClick={() => { setActiveTest(t.id); setAnswers({}); setResult(null); }}
                      className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                    >
                      开始测评 <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              {isLoggedIn && testResults.length > 0 && (
                <div className="mt-12">
                  <h2 className="mb-4 text-xl font-bold">我的测评记录</h2>
                  <div className="space-y-3">
                    {testResults.map((r) => (
                      <div key={r.id} className="flex items-center justify-between rounded-xl border bg-white p-4">
                        <div>
                          <h4 className="font-medium">{r.testTitle}</h4>
                          <p className="text-sm text-muted-foreground">{r.createdAt}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-bold text-primary">{r.score}分</span>
                          <p className="text-xs text-muted-foreground">{r.result}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="rounded-xl border bg-white p-8">
              <button onClick={() => setActiveTest(null)} className="mb-4 text-sm text-muted-foreground hover:text-primary">← 返回测评列表</button>
              <h2 className="mb-6 text-xl font-bold">{currentTest?.title}</h2>

              {result ? (
                <div className="py-8 text-center">
                  <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
                  <h3 className="mb-2 text-2xl font-bold">测评完成</h3>
                  <p className="mb-4 text-4xl font-bold text-primary">{result.score}分</p>
                  <p className="mx-auto max-w-md text-muted-foreground">{result.text}</p>
                  <button
                    onClick={() => setActiveTest(null)}
                    className="mt-6 rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                  >
                    完成
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  {currentTest?.questions.map((q, idx) => (
                    <div key={q.id}>
                      <p className="mb-3 font-medium">{idx + 1}. {q.text}</p>
                      <div className="space-y-2">
                        {q.options.map((o) => (
                          <label
                            key={o.id}
                            className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
                              answers[q.id] === o.id ? 'border-primary bg-primary/5' : 'hover:bg-accent'
                            }`}
                          >
                            <input
                              type="radio"
                              name={q.id}
                              value={o.id}
                              checked={answers[q.id] === o.id}
                              onChange={() => handleAnswer(q.id, o.id)}
                              className="h-4 w-4 accent-primary"
                            />
                            <span className="text-sm">{o.text}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={handleSubmit}
                    disabled={!allAnswered}
                    className="w-full rounded-md bg-primary py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                  >
                    提交测评
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
