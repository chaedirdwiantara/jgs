"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { applicationRepository, describeError } from "../repository";
import type {
  ApplicationStatus,
  ApplicationSummary,
  StatusCounts,
  UpdateApplicationInput,
} from "../types";

type Status = "loading" | "ready" | "error";

const PAGE_SIZE = 25;

const emptyCounts: StatusCounts = { baru: 0, diproses: 0, disetujui: 0, ditolak: 0 };

/**
 * Owns the rental-application inbox: the filtered list, its cursor, and the
 * per-status counts that feed the filter chips.
 *
 * Reads are re-fetched after every write rather than patched locally — the API
 * is the source of truth, and a status change also moves the row between
 * counts, which a local patch would get wrong.
 */
export function useApplications(enabled: boolean) {
  const [items, setItems] = useState<ApplicationSummary[]>([]);
  const [counts, setCounts] = useState<StatusCounts>(emptyCounts);
  const [cursor, setCursor] = useState<string | null>(null);
  const [filter, setFilter] = useState<ApplicationStatus | "semua">("semua");
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isMutating, setIsMutating] = useState(false);

  const requestRef = useRef<AbortController | null>(null);

  const start = useCallback(() => {
    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;
    return controller;
  }, []);

  const queryFor = useCallback(
    (target: ApplicationStatus | "semua") =>
      target === "semua" ? { limit: PAGE_SIZE } : { status: target, limit: PAGE_SIZE },
    [],
  );

  /** One read of both the page and the counts, as a promise the caller chains. */
  const fetchPage = useCallback(
    (target: ApplicationStatus | "semua", controller: AbortController) =>
      Promise.all([
        applicationRepository.list(queryFor(target), controller.signal),
        applicationRepository.counts(controller.signal),
      ]),
    [queryFor],
  );

  const applyResult = useCallback(
    ([page, summary]: [Awaited<ReturnType<typeof applicationRepository.list>>, StatusCounts]) => {
      setItems(page.items);
      setCursor(page.nextCursor);
      setCounts(summary);
      setError(null);
      setStatus("ready");
      setIsFetching(false);
    },
    [],
  );

  const applyFailure = useCallback((cause: unknown) => {
    setError(describeError(cause));
    setStatus("error");
    setIsFetching(false);
  }, []);

  /*
   * The initial "loading" comes from `useState`, and every state write happens
   * in a promise callback — never synchronously in the effect body, which would
   * cause the cascading render the compiler flags.
   */
  useEffect(() => {
    if (!enabled) return;

    const controller = start();
    fetchPage(filter, controller)
      .then((result) => {
        if (!controller.signal.aborted) applyResult(result);
      })
      .catch((cause: unknown) => {
        if (!controller.signal.aborted) applyFailure(cause);
      });

    return () => controller.abort();
  }, [enabled, filter, start, fetchPage, applyResult, applyFailure]);

  /** Manual reload, always from an event handler. */
  const refresh = useCallback(async () => {
    setIsFetching(true);
    const controller = start();

    try {
      const result = await fetchPage(filter, controller);
      if (!controller.signal.aborted) applyResult(result);
    } catch (cause) {
      if (!controller.signal.aborted) applyFailure(cause);
    }
  }, [filter, start, fetchPage, applyResult, applyFailure]);

  /** Appends the next page; the list keeps what it already showed. */
  const loadMore = useCallback(async () => {
    if (!cursor || isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      const page = await applicationRepository.list(
        filter === "semua"
          ? { limit: PAGE_SIZE, cursor }
          : { status: filter, limit: PAGE_SIZE, cursor },
      );
      setItems((current) => [...current, ...page.items]);
      setCursor(page.nextCursor);
    } catch (cause) {
      setError(describeError(cause));
    } finally {
      setIsLoadingMore(false);
    }
  }, [cursor, filter, isLoadingMore]);

  const update = useCallback(
    async (id: string, patch: UpdateApplicationInput) => {
      setIsMutating(true);
      try {
        await applicationRepository.update(id, patch);
        await refresh();
      } finally {
        setIsMutating(false);
      }
    },
    [refresh],
  );

  const remove = useCallback(
    async (id: string) => {
      setIsMutating(true);
      try {
        await applicationRepository.remove(id);
        await refresh();
      } finally {
        setIsMutating(false);
      }
    },
    [refresh],
  );

  return {
    items,
    counts,
    filter,
    setFilter,
    hasMore: cursor !== null,
    status,
    error,
    isFetching,
    isLoadingMore,
    isMutating,
    refresh,
    loadMore,
    update,
    remove,
  };
}
