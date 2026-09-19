"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Countdown = {
  /** `Date.now()` at which the countdown ends. */
  until: number;
  /** Whole seconds left, as last sampled. */
  seconds: number;
};

/**
 * A wall-clock countdown: `start(seconds)` arms it, `seconds` ticks down once
 * a second and rests at `0`, and `onFinish` fires once when it gets there.
 *
 * Remaining time is derived from a fixed end timestamp rather than decremented,
 * so a tab that was throttled in the background still shows the right figure
 * when it comes back. Nothing here reads the clock during render.
 */
export function useCountdown(options: { onFinish?: () => void } = {}): {
  seconds: number;
  start: (durationSeconds: number) => void;
} {
  const [countdown, setCountdown] = useState<Countdown | null>(null);

  // The latest callback, without making it a dependency of the timer.
  const onFinish = useRef(options.onFinish);
  useEffect(() => {
    onFinish.current = options.onFinish;
  });

  const start = useCallback((durationSeconds: number) => {
    setCountdown({
      until: Date.now() + durationSeconds * 1000,
      seconds: Math.max(0, Math.ceil(durationSeconds)),
    });
  }, []);

  const until = countdown?.until ?? null;
  useEffect(() => {
    if (until === null) return;

    const timer = window.setInterval(() => {
      const seconds = Math.max(0, Math.ceil((until - Date.now()) / 1000));

      setCountdown((current) =>
        current?.until === until && current.seconds !== seconds ? { until, seconds } : current,
      );

      if (seconds === 0) {
        window.clearInterval(timer);
        onFinish.current?.();
      }
    }, 1_000);

    return () => window.clearInterval(timer);
  }, [until]);

  return { seconds: countdown?.seconds ?? 0, start };
}
