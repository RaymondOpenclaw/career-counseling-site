'use client';

import { useState, useRef } from 'react';
import { Download, Upload } from 'lucide-react';

export default function DataBackup() {
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const data: Record<string, unknown> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('career_')) {
        try {
          data[key] = JSON.parse(localStorage.getItem(key)!);
        } catch {
          data[key] = localStorage.getItem(key);
        }
      }
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `career-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setMessage({ text: '数据导出成功', type: 'success' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleImport = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const data = JSON.parse(text);

        const careerKeys = Object.keys(data).filter((k) => k.startsWith('career_'));
        if (careerKeys.length === 0) {
          setMessage({ text: '导入失败：未找到有效的职业咨询数据', type: 'error' });
          return;
        }

        careerKeys.forEach((key) => {
          localStorage.setItem(key, JSON.stringify(data[key]));
        });

        setMessage({ text: `导入成功，已恢复 ${careerKeys.length} 项数据`, type: 'success' });
        setTimeout(() => setMessage(null), 3000);
      } catch {
        setMessage({ text: '导入失败：文件格式不正确', type: 'error' });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="rounded-xl border bg-white p-6">
      <h2 className="mb-4 text-lg font-bold">数据备份</h2>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleExport}
          className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent"
        >
          <Download className="h-4 w-4" /> 导出数据
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent"
        >
          <Upload className="h-4 w-4" /> 导入数据
        </button>
        <input
          ref={fileInputRef}
          data-testid="backup-file-input"
          type="file"
          accept="application/json"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleImport(file);
            e.target.value = '';
          }}
        />
      </div>
      {message && (
        <div
          className={`mt-4 rounded-md p-3 text-sm ${
            message.type === 'success'
              ? 'bg-green-50 text-green-700'
              : 'bg-destructive/10 text-destructive'
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
}
