'use client';

import { useState, useEffect } from 'react';
import { mockExamService } from '@/lib/mock-exam/service';

/**
 * Hook to sync UI with simulated server time.
 * Polls the MockExamService for current server time every second.
 * Use this instead of Date.now() directly in components for time-based logic.
 */
export function useServerTime(pollInterval = 1000): number {
  const [serverTime, setServerTime] = useState(() => mockExamService.getServerTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setServerTime(mockExamService.getServerTime());
    }, pollInterval);

    return () => clearInterval(interval);
  }, [pollInterval]);

  return serverTime;
}

/**
 * Calculate time remaining until a target time
 */
export function useTimeRemaining(targetTime: string | null): {
  remaining: number;
  isExpired: boolean;
  formatted: string;
} {
  const serverTime = useServerTime();

  if (!targetTime) {
    return { remaining: 0, isExpired: true, formatted: '00:00:00' };
  }

  const target = new Date(targetTime).getTime();
  const remaining = Math.max(0, target - serverTime);
  const isExpired = remaining <= 0;

  // Format as HH:MM:SS
  const hours = Math.floor(remaining / (1000 * 60 * 60));
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

  const formatted = [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    seconds.toString().padStart(2, '0'),
  ].join(':');

  return { remaining, isExpired, formatted };
}
