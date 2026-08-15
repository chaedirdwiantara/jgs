"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import {
  accentLabels,
  tierLabels,
  vehicleAccents,
  vehicleTiers,
  type Vehicle,
} from "@/data/vehicles";
import { RepositoryError, describeError } from "@/features/admin/repository";
import { emptyVehicleForm, toFormValues, toVehicle } from "@/features/admin/mapper";
import { slugify, vehicleFormSchema, type VehicleFormValues } from "@/features/admin/schema";
import { formatIDR } from "@/lib/format";

type VehicleFormDialogProps = {
  open: boolean;
  /** `null` creates a new unit; a vehicle edits that one. */
  vehicle: Vehicle | null;
  onClose: () => void;
  onSubmit: (vehicle: Vehicle, previousId?: string) => Promise<void>;
};

export function VehicleFormDialog({
  open,
  vehicle,
  onClose,
  onSubmit,
}: VehicleFormDialogProps) {
  const isEdit = vehicle !== null;

  const {
    register,
    handleSubmit,
    reset,
    setError,
    setValue,
    getValues,
    control,
    formState: { errors, isSubmitting },
  } = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: emptyVehicleForm,
    mode: "onTouched",
  });

  // Re-seed whenever the dialog opens so a cancelled edit never bleeds into the
  // next one.
  useEffect(() => {
    if (!open) return;
    reset(vehicle ? toFormValues(vehicle) : emptyVehicleForm);
  }, [open, vehicle, reset]);

  // `useWatch` rather than `watch` — the latter returns a function the React
  // compiler cannot memoize safely, which the project's lint rejects.
  const dailyRate = useWatch({ control, name: "dailyRate" });
  const transferRate = useWatch({ control, name: "transferRate" });

  /**
   * Derives the slug from the model name while creating, but only while the
   * operator has not typed their own — and never when editing, where the id is
   * the record's key.
   */
  const handleNameBlur = () => {
    if (isEdit) return;
    const { name, id } = getValues();
    if (!name.trim() || id.trim()) return;
    setValue("id", slugify(name), { shouldValidate: true });
  };

  const submit = handleSubmit(async (values) => {
    try {
      await onSubmit(toVehicle(values), isEdit ? vehicle.id : undefined);
      onClose();
    } catch (cause) {
      // Field-level messages from the API land on the matching inputs; anything
      // else becomes a form-level error above the actions.
      if (cause instanceof RepositoryError && cause.fieldErrors) {
        for (const [field, message] of Object.entries(cause.fieldErrors)) {
          if (field in emptyVehicleForm) {
            setError(field as keyof VehicleFormValues, { type: "server", message });
          }
        }
      }
      setError("root", { type: "server", message: describeError(cause) });
    }
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={isEdit ? `Ubah ${vehicle.name}` : "Tambah Mobil"}
      description={
        isEdit
          ? "Perubahan langsung menggantikan data unit ini."
          : "Lengkapi data unit agar tampil di halaman armada dan alur pemesanan."
      }
      footer={
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          {errors.root ? (
            <p role="alert" className="flex-1 self-center text-sm text-danger-600">
              {errors.root.message}
            </p>
          ) : null}

          <div className="flex gap-3 sm:shrink-0">
            <Button variant="secondary" onClick={onClose} disabled={isSubmitting} fullWidth>
              Batal
            </Button>
            <Button type="submit" form="vehicle-form" disabled={isSubmitting} fullWidth>
              {isSubmitting ? "Menyimpan…" : isEdit ? "Simpan Perubahan" : "Tambah Mobil"}
            </Button>
          </div>
        </div>
      }
    >
      <form id="vehicle-form" onSubmit={submit} noValidate className="flex flex-col gap-6">
        <FormSection title="Identitas">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              htmlFor="name"
              label="Nama mobil"
              error={errors.name?.message}
              hint="Sesuai penyebutan di brosur, contoh: BYD Seal"
            >
              <Input
                id="name"
                autoComplete="off"
                invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "name-error" : "name-hint"}
                {...register("name", { onBlur: handleNameBlur })}
              />
            </Field>

            <Field
              htmlFor="id"
              label="Kode unit"
              error={errors.id?.message}
              hint={
                isEdit
                  ? "Kode tidak diubah agar tautan lama tetap berfungsi."
                  : "Terisi otomatis dari nama. Huruf kecil dan tanda hubung."
              }
            >
              <Input
                id="id"
                autoComplete="off"
                readOnly={isEdit}
                className={isEdit ? "cursor-not-allowed bg-ink-50 text-ink-600" : undefined}
                invalid={Boolean(errors.id)}
                aria-describedby={errors.id ? "id-error" : "id-hint"}
                {...register("id")}
              />
            </Field>

            <Field htmlFor="tier" label="Kelas armada" error={errors.tier?.message}>
              <Select id="tier" invalid={Boolean(errors.tier)} {...register("tier")}>
                {vehicleTiers.map((tier) => (
                  <option key={tier} value={tier}>
                    {tierLabels[tier]}
                  </option>
                ))}
              </Select>
            </Field>

            <Field htmlFor="accent" label="Warna bodi" error={errors.accent?.message}>
              <Select id="accent" invalid={Boolean(errors.accent)} {...register("accent")}>
                {vehicleAccents.map((accent) => (
                  <option key={accent} value={accent}>
                    {accentLabels[accent]}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
        </FormSection>

        <FormSection title="Spesifikasi">
          <div className="grid gap-4 sm:grid-cols-3">
            <Field htmlFor="seats" label="Kursi" error={errors.seats?.message}>
              <Input
                id="seats"
                type="number"
                inputMode="numeric"
                min={1}
                max={12}
                invalid={Boolean(errors.seats)}
                {...register("seats", { valueAsNumber: true })}
              />
            </Field>

            <Field htmlFor="luggage" label="Koper" error={errors.luggage?.message}>
              <Input
                id="luggage"
                type="number"
                inputMode="numeric"
                min={0}
                max={12}
                invalid={Boolean(errors.luggage)}
                {...register("luggage", { valueAsNumber: true })}
              />
            </Field>

            <Field htmlFor="rangeKm" label="Jarak tempuh (km)" error={errors.rangeKm?.message}>
              <Input
                id="rangeKm"
                type="number"
                inputMode="numeric"
                min={50}
                max={1500}
                invalid={Boolean(errors.rangeKm)}
                {...register("rangeKm", { valueAsNumber: true })}
              />
            </Field>
          </div>
        </FormSection>

        <FormSection title="Tarif">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              htmlFor="dailyRate"
              label="Tarif harian (Rp)"
              error={errors.dailyRate?.message}
              hint={dailyRate > 0 ? formatIDR(dailyRate) : "Tampil sebagai “mulai dari”."}
            >
              <Input
                id="dailyRate"
                type="number"
                inputMode="numeric"
                min={0}
                step={50_000}
                invalid={Boolean(errors.dailyRate)}
                aria-describedby={errors.dailyRate ? "dailyRate-error" : "dailyRate-hint"}
                {...register("dailyRate", { valueAsNumber: true })}
              />
            </Field>

            <Field
              htmlFor="transferRate"
              label="Tarif antar-jemput (Rp)"
              error={errors.transferRate?.message}
              hint={transferRate > 0 ? formatIDR(transferRate) : "Tarif sekali jalan."}
            >
              <Input
                id="transferRate"
                type="number"
                inputMode="numeric"
                min={0}
                step={25_000}
                invalid={Boolean(errors.transferRate)}
                aria-describedby={
                  errors.transferRate ? "transferRate-error" : "transferRate-hint"
                }
                {...register("transferRate", { valueAsNumber: true })}
              />
            </Field>
          </div>
        </FormSection>

        <FormSection title="Tampilan">
          <div className="flex flex-col gap-4">
            <Field
              htmlFor="highlights"
              label="Keunggulan"
              error={errors.highlights?.message}
              hint="Satu poin per baris, maksimal 5 baris."
            >
              <Textarea
                id="highlights"
                rows={4}
                placeholder={"Kabin lega untuk 5 orang\nFast charging\nFitur keselamatan lengkap"}
                invalid={Boolean(errors.highlights)}
                aria-describedby={errors.highlights ? "highlights-error" : "highlights-hint"}
                {...register("highlights")}
              />
            </Field>

            <Field
              htmlFor="photo"
              label="Foto unit"
              error={errors.photo?.message}
              hint="Path di folder public (/images/fleet/nama.jpg) atau URL https://. Rasio 16:10."
            >
              <Input
                id="photo"
                autoComplete="off"
                placeholder="/images/fleet/byd-seal.jpg"
                invalid={Boolean(errors.photo)}
                aria-describedby={errors.photo ? "photo-error" : "photo-hint"}
                {...register("photo")}
              />
            </Field>
          </div>
        </FormSection>
      </form>
    </Modal>
  );
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
        {title}
      </h3>
      {children}
    </section>
  );
}
