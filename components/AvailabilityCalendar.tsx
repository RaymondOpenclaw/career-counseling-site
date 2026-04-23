'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';

interface AvailabilityCalendarProps {
  onSelect: (date: string, time: string) => void;
}

const timeSlots = ['09:00', '10:00', '14:00', '15:00', '16:00', '19:00', '20:00'];

function getWeekDates(base: Date) {
  const dates: Date[] = [];
  const start = new Date(base);
  start.setDate(start.getDate() - start.getDay() + 1);
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    dates.push(d);
  }
  return dates;
}

function formatDateKey(d: Date) {
  return d.toISOString().slice(0, 10);
}

function isAvailable(date: Date, time: string) {
  const day = date.getDay();
  if (day === 0 || day === 6) {
    return time === '10:00' || time === '14:00';
  }
  return true;
}

export default function AvailabilityCalendar({ onSelect }: AvailabilityCalendarProps) {
  const [weekOffset, setWeekOffset] = useState(0);
  const [selected, setSelected] = useState<{ date: string; time: string } | null>(null);

  const today = new Date();
  today.setDate(today.getDate() + weekOffset * 7);
  const weekDates = getWeekDates(today);

  const weekLabel = `${weekDates[0].getMonth() + 1}月${weekDates[0].getDate()}日 - ${weekDates[6].getMonth() + 1}月${weekDates[6].getDate()}日`;

  const handleSelect = (date: string, time: string) => {
    setSelected({ date, time });
    onSelect(date, time);
  };

  return (
    <div className="rounded-xl border bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">可预约时间</h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setWeekOffset((p) => p - 1)}
            className="rounded-md border p-1 hover:bg-accent"
            aria-label="上一周"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm font-medium">{weekLabel}</span>
          <button
            type="button"
            onClick={() => setWeekOffset((p) => p + 1)}
            className="rounded-md border p-1 hover:bg-accent"
            aria-label="下一周"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {weekDates.map((d) => {
          const key = formatDateKey(d);
          const dayNames = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
          return (
            <div key={key} className="text-center">
              <div className="mb-2 text-xs text-muted-foreground">
                <div>{dayNames[d.getDay() === 0 ? 6 : d.getDay() - 1]}</div>
                <div className="font-medium text-foreground">{d.getDate()}</div>
              </div>
              <div className="space-y-1">
                {timeSlots.map((time) => {
                  const available = isAvailable(d, time);
                  const isSelected = selected?.date === key && selected?.time === time;
                  return (
                    <button
                      key={time}
                      type="button"
                      disabled={!available}
                      onClick={() => handleSelect(key, time)}
                      className={`w-full rounded-md px-1 py-1 text-xs font-medium transition-colors ${
                        isSelected
                          ? 'bg-primary text-primary-foreground'
                          : available
                          ? 'bg-secondary text-secondary-foreground hover:bg-primary/10'
                          : 'bg-muted text-muted-foreground cursor-not-allowed'
                      }`}
                    >
                      <span className="flex items-center justify-center gap-0.5">
                        <Clock className="h-3 w-3" />
                        {time}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
