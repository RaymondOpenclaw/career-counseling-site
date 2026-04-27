'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { counselors as mockCounselors, messages as mockMessages } from '@/data/mock';
import { useStore } from '@/hooks/useStore';
import { Send, User } from 'lucide-react';

export default function ChatPage() {
  const { user } = useAuth();
  const [counselors] = useStore('career_counselors', mockCounselors);
  const [selectedCounselor, setSelectedCounselor] = useState(counselors[0]);
  const [messages, setMessages] = useStore('career_messages', mockMessages);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const chatMessages = messages.filter(
    (m) =>
      (m.fromId === user?.id && m.toId === selectedCounselor.userId) ||
      (m.fromId === selectedCounselor.userId && m.toId === user?.id)
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const newMsg = {
      id: 'm' + Date.now(),
      fromId: user?.id || 'u1',
      toId: selectedCounselor.userId,
      content: input,
      createdAt: new Date().toLocaleString(),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput('');
    // 模拟自动回复
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: 'm' + Date.now() + 1,
          fromId: selectedCounselor.userId,
          toId: user?.id || 'u1',
          content: '收到，我会尽快为你解答。',
          createdAt: new Date().toLocaleString(),
        },
      ]);
    }, 1500);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 bg-muted/20 py-6">
        <div className="mx-auto flex h-[calc(100vh-200px)] max-w-5xl gap-4 px-4">
          {/* 左侧列表 */}
          <div className="w-64 shrink-0 overflow-hidden rounded-xl border bg-white">
            <div className="border-b p-4 font-semibold">咨询列表</div>
            <div className="overflow-y-auto">
              {counselors.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCounselor(c)}
                  className={`flex w-full items-center gap-3 p-3 text-left transition-colors ${
                    selectedCounselor.id === c.id ? 'bg-primary/5' : 'hover:bg-accent'
                  }`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {c.name[0]}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{c.name}</div>
                    <div className="truncate text-xs text-muted-foreground">{c.title}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 右侧聊天 */}
          <div className="flex flex-1 flex-col overflow-hidden rounded-xl border bg-white">
            <div className="flex items-center gap-3 border-b p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                {selectedCounselor.name[0]}
              </div>
              <div>
                <div className="font-medium">{selectedCounselor.name}</div>
                <div className="text-xs text-muted-foreground">{selectedCounselor.title}</div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map((m) => {
                const isMe = m.fromId === user?.id;
                return (
                  <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] rounded-xl px-4 py-2 text-sm ${isMe ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                      {m.content}
                      <div className={`mt-1 text-xs ${isMe ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{m.createdAt}</div>
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            <form onSubmit={handleSend} className="flex items-center gap-2 border-t p-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="输入消息..."
                className="flex-1 rounded-md border border-input px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                <Send className="h-4 w-4" /> 发送
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
