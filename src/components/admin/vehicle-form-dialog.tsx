"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm, useWatch, type UseFormRegister } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { tierLabels, vehicleTiers, type Vehicle } from "@/data/vehicles";
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

            <Field
              htmlFor="tier"
              label="Kelas armada"
              error={errors.tier?.message}
              className="sm:col-span-2"
            >
              <Select id="tier" invalid={Boolean(errors.tier)} {...register("tier")}>
                {vehicleTiers.map((tier) => (
                  <option key={tier} value={tier}>
                    {tierLabels[tier]}
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

          </div>
        </FormSection>

        <FormSection title="Foto">
          <p className="-mt-1 text-xs leading-relaxed text-ink-500">
            Setiap unit punya dua suasana — luar ruangan untuk beranda, studio
            untuk halaman armada. Masing-masing butuh dua bentuk: versi{" "}
            <strong className="font-semibold text-ink-700">lebar</strong> (lanskap)
            dipakai mulai layar 640px, versi{" "}
            <strong className="font-semibold text-ink-700">tinggi</strong> (potret)
            dipakai di ponsel. Isi path folder public atau URL https://.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <PhotoField
              id="photoOutdoorWide"
              label="Luar ruangan — lebar"
              placeholder="/images/fleet/byd-m6-outdoor-wide.jpg"
              error={errors.photoOutdoorWide?.message}
              register={register}
            />
            <PhotoField
              id="photoOutdoorTall"
              label="Luar ruangan — tinggi"
              placeholder="/images/fleet/byd-m6-outdoor-tall.jpg"
              error={errors.photoOutdoorTall?.message}
              register={register}
            />
            <PhotoField
              id="photoStudioWide"
              label="Studio — lebar"
              placeholder="/images/fleet/byd-m6-studio-wide.jpg"
              error={errors.photoStudioWide?.message}
              register={register}
            />
            <PhotoField
              id="photoStudioTall"
              label="Studio — tinggi"
              placeholder="/images/fleet/byd-m6-studio-tall.jpg"
              error={errors.photoStudioTall?.message}
              register={register}
            />
          </div>
        </FormSection>
      </form>
    </Modal>
  );
}

/** The four photo inputs differ only by name, so they share one definition. */
function PhotoField({
  id,
  label,
  placeholder,
  error,
  register,
}: {
  id: keyof VehicleFormValues;
  label: string;
  placeholder: string;
  error?: string;
  register: UseFormRegister<VehicleFormValues>;
}) {
  return (
    <Field htmlFor={id} label={label} error={error}>
      <Input
        id={id}
        autoComplete="off"
        spellCheck={false}
        placeholder={placeholder}
        invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        {...register(id)}
      />
    </Field>
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
