'use client';

import { useEffect } from 'react';
import { users as mockUsers } from '@/data/mock';

const DATA_VERSION = '2';
const VERSION_KEY = 'career_data_version';
const USERS_KEY = 'career_users';

export default function DataInitializer() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const currentVersion = window.localStorage.getItem(VERSION_KEY);
    if (currentVersion !== DATA_VERSION) {
      window.localStorage.setItem(USERS_KEY, JSON.stringify(mockUsers));
      window.localStorage.setItem(VERSION_KEY, DATA_VERSION);
      window.dispatchEvent(new StorageEvent('storage', { key: USERS_KEY }));
    }
  }, []);

  return null;
}
