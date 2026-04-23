'use client';

import { useState } from 'react';
import { tests as mockTests } from '@/data/mock';
import { useStore } from '@/hooks/useStore';
import { TestTube, Clock, Plus, Pencil, Trash2, X } from 'lucide-react';
import type { Question, Option } from '@/types';

function generateId(prefix: string) {
  return prefix + Date.now() + Math.random().toString(36).slice(2, 6);
}

export default function AdminTestsPage() {
  const [tests, setTests] = useStore('career_tests', mockTests);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    questions: [] as Question[],
  });

  const openCreate = () => {
    setForm({
      title: '',
      description: '',
      category: '',
      questions: [
        {
          id: generateId('q'),
          text: '',
          options: [
            { id: generateId('o'), text: '', score: 0 },
            { id: generateId('o'), text: '', score: 0 },
          ],
        },
      ],
    });
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (t: (typeof tests)[0]) => {
    setForm({
      title: t.title,
      description: t.description,
      category: t.category,
      questions: JSON.parse(JSON.stringify(t.questions)),
    });
    setEditingId(t.id);
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setTests((prev) =>
        prev.map((t) => (t.id === editingId ? { ...t, ...form } : t))
      );
    } else {
      const newTest = {
        id: 't' + Date.now(),
        ...form,
      };
      setTests((prev) => [newTest, ...prev]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('确定删除该测评吗？')) {
      setTests((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const addQuestion = () => {
    setForm((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          id: generateId('q'),
          text: '',
          options: [
            { id: generateId('o'), text: '', score: 0 },
            { id: generateId('o'), text: '', score: 0 },
          ],
        },
      ],
    }));
  };

  const removeQuestion = (qid: string) => {
    setForm((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== qid),
    }));
  };

  const updateQuestionText = (qid: string, text: string) => {
    setForm((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => (q.id === qid ? { ...q, text } : q)),
    }));
  };

  const addOption = (qid: string) => {
    setForm((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === qid
          ? { ...q, options: [...q.options, { id: generateId('o'), text: '', score: 0 }] }
          : q
      ),
    }));
  };

  const removeOption = (qid: string, oid: string) => {
    setForm((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === qid ? { ...q, options: q.options.filter((o) => o.id !== oid) } : q
      ),
    }));
  };

  const updateOption = (qid: string, oid: string, patch: Partial<Option>) => {
    setForm((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === qid
          ? {
              ...q,
              options: q.options.map((o) =>
                o.id === oid ? { ...o, ...patch } : o
              ),
            }
          : q
      ),
    }));
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">测评管理</h1>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> 新增测评
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {tests.map((t) => (
          <div key={t.id} className="rounded-xl border bg-white p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <TestTube className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">{t.title}</h3>
            <p className="mb-4 text-sm text-muted-foreground">{t.description}</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> {t.questions.length}道题
              </span>
              <span>{t.category}</span>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={() => openEdit(t)}
                className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-accent"
              >
                <Pencil className="h-3 w-3" /> 编辑
              </button>
              <button
                onClick={() => handleDelete(t.id)}
                className="inline-flex items-center gap-1 rounded-md border border-destructive px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-3 w-3" /> 删除
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-xl border bg-white p-6 shadow-lg max-h-[90vh] overflow-y-auto">
            <h2 className="mb-4 text-lg font-bold">{editingId ? '编辑测评' : '新增测评'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">标题</label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full rounded-md border border-input px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">分类</label>
                  <input
                    required
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full rounded-md border border-input px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">题目数量</label>
                  <div className="px-3 py-2 text-sm text-muted-foreground">{form.questions.length} 道</div>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">描述</label>
                <textarea
                  rows={2}
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full rounded-md border border-input px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">题目列表</h3>
                  <button
                    type="button"
                    onClick={addQuestion}
                    className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-accent"
                  >
                    <Plus className="h-3 w-3" /> 添加题目
                  </button>
                </div>
                {form.questions.map((q, qIdx) => (
                  <div key={q.id} className="rounded-lg border p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <span className="text-xs font-medium text-muted-foreground">Q{qIdx + 1}</span>
                      <input
                        required
                        value={q.text}
                        onChange={(e) => updateQuestionText(q.id, e.target.value)}
                        placeholder="题目内容"
                        className="flex-1 rounded-md border border-input px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary"
                      />
                      <button
                        type="button"
                        onClick={() => removeQuestion(q.id)}
                        className="text-destructive"
                        title="删除题目"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="space-y-2 pl-6">
                      {q.options.map((o, oIdx) => (
                        <div key={o.id} className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">{oIdx + 1}.</span>
                          <input
                            required
                            value={o.text}
                            onChange={(e) => updateOption(q.id, o.id, { text: e.target.value })}
                            placeholder="选项内容"
                            className="flex-1 rounded-md border border-input px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary"
                          />
                          <input
                            type="number"
                            required
                            value={o.score}
                            onChange={(e) => updateOption(q.id, o.id, { score: Number(e.target.value) })}
                            placeholder="分值"
                            className="w-20 rounded-md border border-input px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary"
                          />
                          <button
                            type="button"
                            onClick={() => removeOption(q.id, o.id)}
                            className="text-destructive"
                            title="删除选项"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addOption(q.id)}
                        className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                      >
                        <Plus className="h-3 w-3" /> 添加选项
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  保存
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-md border px-6 py-2.5 text-sm font-medium hover:bg-accent"
                >
                  取消
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
