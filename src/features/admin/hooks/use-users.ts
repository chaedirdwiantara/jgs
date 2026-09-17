"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { describeError, userRepository } from "../repository";
import type { AdminUser, CreateUserInput, UpdateUserInput } from "../types";

type Status = "loading" | "ready" | "error";

/** Owners first, then alphabetical — the list is read as "who can do what". */
const byRoleThenName = (a: AdminUser, b: AdminUser) => {
  if (a.role !== b.role) return a.role === "owner" ? -1 : 1;
  return a.name.localeCompare(b.name, "id");
};

export function useUsers(enabled: boolean) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [isMutating, setIsMutating] = useState(false);

  const requestRef = useRef<AbortController | null>(null);

  const start = useCallback(() => {
    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;
    return controller;
  }, []);

  const applyResult = useCallback((data: AdminUser[]) => {
    setUsers([...data].sort(byRoleThenName));
    setError(null);
    setStatus("ready");
    setIsFetching(false);
  }, []);

  const applyFailure = useCallback((cause: unknown) => {
    setError(describeError(cause));
    setStatus("error");
    setIsFetching(false);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const controller = start();
    userRepository
      .list(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) applyResult(data);
      })
      .catch((cause: unknown) => {
        if (!controller.signal.aborted) applyFailure(cause);
      });

    return () => controller.abort();
  }, [enabled, start, applyResult, applyFailure]);

  const refresh = useCallback(async () => {
    setIsFetching(true);
    const controller = start();
    try {
      const data = await userRepository.list(controller.signal);
      if (!controller.signal.aborted) applyResult(data);
    } catch (cause) {
      if (!controller.signal.aborted) applyFailure(cause);
    }
  }, [start, applyResult, applyFailure]);

  /** Rejects on failure so the dialog can map per-field messages onto the form. */
  const create = useCallback(
    async (input: CreateUserInput) => {
      setIsMutating(true);
      try {
        await userRepository.create(input);
        await refresh();
      } finally {
        setIsMutating(false);
      }
    },
    [refresh],
  );

  const update = useCallback(
    async (id: string, patch: UpdateUserInput) => {
      setIsMutating(true);
      try {
        await userRepository.update(id, patch);
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
        await userRepository.remove(id);
        await refresh();
      } finally {
        setIsMutating(false);
      }
    },
    [refresh],
  );

  return { users, status, error, isFetching, isMutating, refresh, create, update, remove };
}
