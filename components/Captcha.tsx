'use client';

import { useRef, useEffect, useImperativeHandle, forwardRef, useState, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';

export interface CaptchaRef {
  validate: (input: string) => boolean;
  refresh: () => void;
}

const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function generateCode(length = 4): string {
  let code = '';
  for (let i = 0; i < length; i++) {
    code += CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  return code;
}

function drawCaptcha(canvas: HTMLCanvasElement, code: string) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const width = canvas.width;
  const height = canvas.height;

  ctx.fillStyle = '#f3f4f6';
  ctx.fillRect(0, 0, width, height);

  for (let i = 0; i < 5; i++) {
    ctx.strokeStyle = `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(Math.random() * width, Math.random() * height);
    ctx.lineTo(Math.random() * width, Math.random() * height);
    ctx.stroke();
  }

  const fontSize = 24;
  ctx.font = `bold ${fontSize}px Arial`;
  ctx.textBaseline = 'middle';
  for (let i = 0; i < code.length; i++) {
    ctx.save();
    const x = 15 + i * 25;
    const y = height / 2 + Math.random() * 6 - 3;
    const angle = Math.random() * 0.4 - 0.2;
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.fillStyle = `rgb(${Math.random() * 100},${Math.random() * 100},${Math.random() * 100})`;
    ctx.fillText(code[i], 0, 0);
    ctx.restore();
  }

  for (let i = 0; i < 30; i++) {
    ctx.fillStyle = `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`;
    ctx.beginPath();
    ctx.arc(Math.random() * width, Math.random() * height, 1, 0, Math.PI * 2);
    ctx.fill();
  }
}

const Captcha = forwardRef<CaptchaRef>((_props, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [code, setCode] = useState('');

  const refresh = useCallback(() => {
    const newCode = generateCode();
    setCode(newCode);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (canvasRef.current && code) {
      drawCaptcha(canvasRef.current, code);
    }
  }, [code]);

  useImperativeHandle(ref, () => ({
    validate: (input: string) => input.toUpperCase() === code,
    refresh,
  }), [code, refresh]);

  return (
    <div className="flex items-center gap-2">
      <canvas ref={canvasRef} width={120} height={40} className="rounded border" data-testid="captcha-canvas" />
      <button
        type="button"
        onClick={refresh}
        className="rounded-md border p-2 text-muted-foreground hover:bg-accent"
        title="刷新验证码"
        aria-label="刷新验证码"
      >
        <RefreshCw className="h-4 w-4" />
      </button>
    </div>
  );
});

Captcha.displayName = 'Captcha';
export default Captcha;
