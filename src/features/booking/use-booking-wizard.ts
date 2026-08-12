"use client";

import { useCallback, useMemo, useState } from "react";

import { getLocationById } from "@/data/locations";
import { getVehicleById } from "@/data/vehicles";

import { getVehiclesForLocation } from "./availability";
import { defaultBookingDetails, WIZARD_STEPS } from "./constants";
import type { BookingDetails, WizardStepId } from "./types";

/**
 * Owns wizard navigation and the data collected so far.
 *
 * Step 1 is validated by react-hook-form inside `StepDetails`; this hook only
 * receives already-valid values. Keeping navigation here means each step
 * component stays a presentational unit that reports upward.
 */
export function useBookingWizard(initialDetails?: Partial<BookingDetails>) {
  const [stepIndex, setStepIndex] = useState(0);
  const [details, setDetails] = useState<BookingDetails>({
    ...defaultBookingDetails,
    ...initialDetails,
  });
  const [vehicleId, setVehicleId] = useState<string>("");

  const availableVehicles = useMemo(
    () => getVehiclesForLocation(details.locationId),
    [details.locationId],
  );

  const location = useMemo(
    () => getLocationById(details.locationId),
    [details.locationId],
  );

  const vehicle = useMemo(() => getVehicleById(vehicleId), [vehicleId]);

  const goToStep = useCallback((index: number) => {
    setStepIndex(index);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  const submitDetails = useCallback(
    (values: BookingDetails) => {
      setDetails(values);
      // Changing the location can make the previously chosen unit unavailable.
      const stillAvailable = getVehiclesForLocation(values.locationId).some(
        (item) => item.id === vehicleId,
      );
      if (!stillAvailable) setVehicleId("");
      goToStep(1);
    },
    [goToStep, vehicleId],
  );

  const selectVehicle = useCallback(
    (id: string) => {
      setVehicleId(id);
      goToStep(2);
    },
    [goToStep],
  );

  const back = useCallback(() => {
    goToStep(Math.max(0, stepIndex - 1));
  }, [goToStep, stepIndex]);

  const reset = useCallback(() => {
    setDetails({ ...defaultBookingDetails, ...initialDetails });
    setVehicleId("");
    goToStep(0);
  }, [goToStep, initialDetails]);

  const currentStep: WizardStepId = WIZARD_STEPS[stepIndex].id;

  return {
    stepIndex,
    currentStep,
    details,
    location,
    vehicle,
    vehicleId,
    availableVehicles,
    submitDetails,
    selectVehicle,
    goToStep,
    back,
    reset,
  };
}
