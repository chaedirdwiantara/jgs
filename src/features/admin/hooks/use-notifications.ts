"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { notificationRepository } from "../repository";
import type { Notification } from "../types";

/**
 * How often the badge asks the API whether anything new arrived.
 *
 * The site is a static export with no socket, so this is a poll. 45 seconds is
 * the compromise: an operator notices a new application within about a minute,
 * and an idle console still costs under a hundred requests in an 8-hour shift.
 */
const POLL_INTERVAL_MS = 45_000;

export function useNotifications(enabled: boolean) {
  const [unread, setUnread] = useState(0);
  const [items, setItems] = useState<Notification[]>([]);
  const [isLoadingItems, setIsLoadingItems] = useState(false);

  /** Keeps the poll from overlapping itself on a slow connection. */
  const inFlight = useRef(false);

  /*
   * A promise chain rather than `async`/`await`, so every state write lands in
   * a `.then` callback instead of running synchronously when the effect below
   * kicks off the first poll — the cascading render the compiler rejects.
   */
  const pollUnread = useCallback(() => {
    if (inFlight.current) return Promise.resolve();
    inFlight.current = true;

    return notificationRepository
      .unreadCount()
      .then((count) => setUnread(count))
      .catch(() => {
        // A failed poll is not worth a banner: the next one is 45 seconds away,
        // and any real outage will surface on the screen the operator is using.
      })
      .finally(() => {
        inFlight.current = false;
      });
  }, []);

  useEffect(() => {
    if (!enabled) return;

    void pollUnread();
    const timer = setInterval(() => void pollUnread(), POLL_INTERVAL_MS);

    /*
     * A backgrounded tab should not keep polling, and an operator returning to
     * it wants the truth immediately rather than up to 45 seconds later.
     */
    const onVisibility = () => {
      if (document.visibilityState === "visible") void pollUnread();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [enabled, pollUnread]);

  /** Called when the bell opens — the feed itself is never polled. */
  const loadItems = useCallback(async () => {
    setIsLoadingItems(true);
    try {
      setItems(await notificationRepository.list());
    } catch {
      setItems([]);
    } finally {
      setIsLoadingItems(false);
    }
  }, []);

  const markRead = useCallback(async (id: string) => {
    // Optimistic: the badge should drop the instant the operator clicks, and a
    // failed write is corrected by the next poll.
    setItems((current) =>
      current.map((item) =>
        item.id === id && !item.readAt ? { ...item, readAt: new Date().toISOString() } : item,
      ),
    );
    setUnread((current) => Math.max(0, current - 1));

    try {
      await notificationRepository.markRead(id);
    } catch {
      void pollUnread();
    }
  }, [pollUnread]);

  const markAllRead = useCallback(async () => {
    const readAt = new Date().toISOString();
    setItems((current) => current.map((item) => (item.readAt ? item : { ...item, readAt })));
    setUnread(0);

    try {
      await notificationRepository.markAllRead();
    } catch {
      void pollUnread();
    }
  }, [pollUnread]);

  return { unread, items, isLoadingItems, loadItems, markRead, markAllRead, refresh: pollUnread };
}
