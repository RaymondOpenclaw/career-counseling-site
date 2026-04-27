'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export function useRequireRole(
  allowedRole: 'user' | 'counselor' | 'admin',
  fallback = '/'
) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user?.role !== allowedRole) {
      router.push(fallback);
    }
  }, [loading, user, allowedRole, fallback, router]);

  return { loading, user };
}
