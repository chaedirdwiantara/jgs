"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { Vehicle } from "@/data/vehicles";

import { describeError, vehicleRepository } from "../repository";

type Status = "loading" | "ready" | "error";

/** Sorted the way an operator scans a price list: cheapest first. */
const byDailyRate = (a: Vehicle, b: Vehicle) => a.dailyRate - b.dailyRate;

/**
 * Owns the fleet list and its mutations.
 *
 * Reads are re-fetched after every write rather than patched locally: the API
 * is the source of truth and may normalise what it stores, so echoing the
 * response back into a local array is how lists quietly drift from the server.
 */
export function useVehicles(enabled: boolean) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [isMutating, setIsMutating] = useState(false);

  // Tracks the in-flight read so a newer one can cancel it.
  const requestRef = useRef<AbortController | null>(null);

  const start = useCallback(() => {
    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;
    return controller;
  }, []);

  const applyResult = useCallback((data: Vehicle[]) => {
    setVehicles([...data].sort(byDailyRate));
    setError(null);
    setStatus("ready");
    setIsFetching(false);
  }, []);

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
    vehicleRepository
      .list(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) applyResult(data);
      })
      .catch((cause: unknown) => {
        if (!controller.signal.aborted) applyFailure(cause);
      });

    return () => controller.abort();
  }, [enabled, start, applyResult, applyFailure]);

  /** Manual reload, always from an event handler. */
  const refresh = useCallback(async () => {
    setIsFetching(true);
    const controller = start();

    try {
      const data = await vehicleRepository.list(controller.signal);
      if (!controller.signal.aborted) applyResult(data);
    } catch (cause) {
      if (!controller.signal.aborted) applyFailure(cause);
    }
  }, [start, applyResult, applyFailure]);

  /**
   * Creates or replaces a unit. Rejects on failure so the caller can map
   * per-field messages onto the form; the banner is only for list-level errors.
   */
  const save = useCallback(
    async (vehicle: Vehicle, previousId?: string) => {
      setIsMutating(true);
      try {
        if (previousId) {
          await vehicleRepository.update(previousId, vehicle);
        } else {
          await vehicleRepository.create(vehicle);
        }
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
        await vehicleRepository.remove(id);
        await refresh();
      } finally {
        setIsMutating(false);
      }
    },
    [refresh],
  );

  return { vehicles, status, error, isFetching, isMutating, refresh, save, remove };
}
