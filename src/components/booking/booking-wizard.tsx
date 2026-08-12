"use client";

import { StepConfirm } from "@/components/booking/step-confirm";
import { StepDetails } from "@/components/booking/step-details";
import { StepVehicle } from "@/components/booking/step-vehicle";
import { Stepper } from "@/components/ui/stepper";
import { WIZARD_STEPS } from "@/features/booking/constants";
import type { ServiceType } from "@/features/booking/types";
import { useBookingWizard } from "@/features/booking/use-booking-wizard";

type Props = {
  /** Preselected from the `?layanan=` query string. */
  initialServiceType?: ServiceType;
};

/**
 * Three-step booking flow:
 *   1. Detail sewa  → 2. Pilih armada → 3. Konfirmasi & kirim ke WhatsApp
 *
 * Navigation and collected data live in `useBookingWizard`; each step is a
 * presentational component that reports upward.
 */
export function BookingWizard({ initialServiceType }: Props) {
  const wizard = useBookingWizard(
    initialServiceType ? { serviceType: initialServiceType } : undefined,
  );

  const { vehicle, location } = wizard;

  /**
   * The confirmation step needs both a vehicle and a location; if either is
   * missing (e.g. the location changed and invalidated the choice) we fall back
   * to the fleet step instead of rendering an empty screen.
   */
  const activeStep =
    wizard.currentStep === "konfirmasi" && !(vehicle && location)
      ? "armada"
      : wizard.currentStep;

  return (
    <div className="flex flex-col gap-8">
      <Stepper
        steps={WIZARD_STEPS}
        current={wizard.stepIndex}
        onStepClick={wizard.goToStep}
      />

      {/*
        Opacity-only transition: a `transform` animation here would turn this
        wrapper into a containing block and break the `fixed` mobile action bar
        rendered by the confirmation step.
      */}
      <div key={activeStep} className="animate-fade-in">
        {activeStep === "detail" ? (
          <StepDetails defaultValues={wizard.details} onSubmit={wizard.submitDetails} />
        ) : null}

        {activeStep === "armada" ? (
          <StepVehicle
            details={wizard.details}
            location={location}
            vehicles={wizard.availableVehicles}
            selectedVehicleId={wizard.vehicleId}
            onSelect={wizard.selectVehicle}
            onBack={() => wizard.goToStep(0)}
          />
        ) : null}

        {activeStep === "konfirmasi" && vehicle && location ? (
          <StepConfirm
            details={wizard.details}
            vehicle={vehicle}
            location={location}
            onBack={() => wizard.goToStep(1)}
            onReset={wizard.reset}
          />
        ) : null}
      </div>
    </div>
  );
}
