'use client';

import { useEffect } from 'react';
import {
  users as mockUsers,
  counselors as mockCounselors,
  articles as mockArticles,
  announcements as mockAnnouncements,
  banners as mockBanners,
  tests as mockTests,
  testResults as mockTestResults,
  appointments as mockAppointments,
  messages as mockMessages,
} from '@/data/mock';

const DATA_VERSION = '2';
const VERSION_KEY = 'career_data_version';
const SEEDED_KEY = 'career_seeded';

const seeds: Record<string, unknown> = {
  career_users: mockUsers,
  career_counselors: mockCounselors,
  career_articles: mockArticles,
  career_announcements: mockAnnouncements,
  career_banners: mockBanners,
  career_tests: mockTests,
  career_testResults: mockTestResults,
  career_appointments: mockAppointments,
  career_messages: mockMessages,
};

export default function DataInitializer() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isFirstVisit = window.localStorage.getItem(SEEDED_KEY) !== 'true';
    const currentVersion = window.localStorage.getItem(VERSION_KEY);

    if (isFirstVisit) {
      // 首次访问：写入所有种子数据
      Object.entries(seeds).forEach(([key, value]) => {
        window.localStorage.setItem(key, JSON.stringify(value));
      });
      window.localStorage.setItem(SEEDED_KEY, 'true');
      window.localStorage.setItem(VERSION_KEY, DATA_VERSION);
      return;
    }

    if (currentVersion !== DATA_VERSION) {
      // 版本变化：增量迁移，不覆盖已有数据
      Object.entries(seeds).forEach(([key, value]) => {
        const existing = window.localStorage.getItem(key);
        if (!existing) {
          // key 不存在时才 seed
          window.localStorage.setItem(key, JSON.stringify(value));
        }
      });
      window.localStorage.setItem(VERSION_KEY, DATA_VERSION);
    }
  }, []);

  return null;
}
