import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/section";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-600">
        404
      </p>
      <h1 className="mt-3 text-balance text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
        Halaman tidak ditemukan
      </h1>
      <p className="mt-3 max-w-md text-pretty text-[15px] leading-relaxed text-ink-600">
        Tautan yang Anda buka mungkin sudah dipindahkan atau tidak lagi tersedia.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/" size="lg">
          Kembali ke beranda
        </ButtonLink>
        <ButtonLink href="/sewa-mobil" size="lg" variant="secondary">
          Mulai pesan
        </ButtonLink>
      </div>
    </Container>
  );
}
