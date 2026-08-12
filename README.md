# Jagayanigiri EV Rental

Situs pemesanan sewa mobil listrik untuk **PT Jagayanigiri Sentosa**. Alur
pemesanan mengikuti pola tiga langkah: **detail sewa → pilih armada →
konfirmasi via WhatsApp**, tanpa registrasi akun dan tanpa pembayaran di muka.

## Teknologi

| Bagian | Pilihan |
| --- | --- |
| Framework | Next.js 16 (App Router, React 19) |
| Bahasa | TypeScript (strict) |
| Styling | Tailwind CSS v4 dengan design token di `globals.css` |
| Form & validasi | react-hook-form + zod |
| Ikon | lucide-react |

## Menjalankan

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build produksi
npm start          # jalankan hasil build
npm run lint       # ESLint (termasuk React Compiler rules)
npx tsc --noEmit   # type check
```

## Struktur

```
src/
  app/                      # route App Router + metadata, sitemap, robots
    sewa-mobil/             # halaman alur pemesanan
  components/
    booking/                # komponen khusus alur pemesanan (per langkah)
    home/                   # section halaman depan
    layout/                 # header, footer, logo, FAB WhatsApp
    ui/                     # primitif: Button, Input, Select, Field, Stepper…
  config/site.ts            # identitas & kontak perusahaan  ← WAJIB DIUBAH
  data/                     # katalog armada, lokasi, FAQ     ← WAJIB DIUBAH
  features/booking/         # domain layer (tanpa UI)
    types.ts constants.ts schema.ts pricing.ts
    availability.ts whatsapp.ts use-booking-wizard.ts
  lib/                      # utilitas format & class merge
scripts/                    # smoke test visual & assertion alur (dev only)
```

Pemisahannya disengaja: `features/booking/*` berisi aturan bisnis murni
(validasi, perhitungan harga, penyusunan pesan WhatsApp) yang dapat diuji dan
dipindah ke server tanpa menyentuh komponen. Komponen di `components/booking/*`
hanya menampilkan dan melaporkan ke atas.

## Yang harus diganti sebelum produksi

Semua nilai sementara ditandai `TODO` / "PLACEHOLDER" pada berkas berikut:

1. **`src/config/site.ts`** — nama domain, nomor WhatsApp admin, telepon,
   email, alamat, jam operasional, tautan media sosial.
   Nomor WhatsApp dinormalisasi otomatis (`08…`, `+62…`, `62…` semuanya valid).
2. **`src/data/vehicles.ts`** — daftar unit, tarif harian, tarif antar-jemput,
   kapasitas, dan jarak tempuh. Angka saat ini adalah nilai indikatif.
3. **`src/data/locations.ts`** — titik layanan dan unit yang tersedia di
   masing-masing titik.
4. **`src/features/booking/constants.ts`** — `DURATION_DISCOUNTS` (kebijakan
   diskon sewa panjang). Kosongkan array untuk menonaktifkan.
5. **Foto armada** — `src/components/booking/vehicle-illustration.tsx` saat ini
   menggambar ilustrasi vektor. Setelah foto asli tersedia, simpan di
   `public/images/fleet/<id>.webp` lalu ganti komponen tersebut dengan
   `next/image`.

Mengganti sumber data ke API/CMS cukup dilakukan di `getVehicles()` dan
`getLocations()`; komponen tidak perlu diubah.

## Alur pemesanan

1. **Detail Sewa** — jenis layanan (Rental Harian / Antar-Jemput), tipe
   pelanggan, nama, WhatsApp, lokasi, dan jadwal. Kolom isian berubah mengikuti
   jenis layanan; validasi menolak nomor tidak valid, tanggal lampau, dan
   tanggal lebih dari 180 hari ke depan.
2. **Pilih Armada** — hanya menampilkan unit yang tersedia di lokasi terpilih,
   dengan filter kapasitas kursi dan estimasi tarif sesuai jenis layanan.
3. **Konfirmasi** — ringkasan lengkap, rincian estimasi biaya, nomor
   referensi, lalu tombol *Pesan via WhatsApp* yang membuka `wa.me` berisi
   ringkasan siap kirim.

Harga selalu ditampilkan sebagai **estimasi**; harga final dikonfirmasi admin.

## Pengujian manual

Dua skrip Playwright disertakan untuk verifikasi. Playwright **tidak** dipasang
sebagai dependency (instalasinya mengunduh ±300 MB browser), jadi pasang hanya
bila ingin menjalankannya:

```bash
npm i -D playwright && npx playwright install chromium

npm run build && npx next start -p 3100   # di terminal terpisah
node scripts/flow-assert.mjs              # 10 assertion alur pemesanan
node scripts/visual-check.mjs             # screenshot mobile & desktop ke /tmp/shots
```

`flow-assert.mjs` memeriksa: validasi nomor & tanggal, nama perusahaan wajib
untuk pelanggan korporat, perhitungan pulang-pergi, empty state ketersediaan
unit, sticky bar mobile menempel ke viewport, pergantian jenis layanan tidak
mengunci form, label zona waktu (WIB/WITA), serta scroll-lock dan focus trap
pada drawer.

## Catatan implementasi

- **Aksesibilitas** — setiap kolom punya `<label>` terkait, pesan galat
  tertaut lewat `aria-describedby`, stepper memakai `aria-current="step"`,
  tersedia skip link, dan fokus ring konsisten.
- **Responsif** — stepper menjadi progress bar di mobile, aksi utama pindah ke
  sticky bar bawah layar pada langkah konfirmasi, navigasi memakai drawer.
- **Animasi** — `animate-fade-rise` (memakai `transform`) tidak boleh dipasang
  pada elemen yang memiliki turunan `position: fixed`, karena `animation-fill-mode:
  both` menyisakan matriks transform dan membentuk containing block. Gunakan
  `animate-fade-in` untuk kasus tersebut.
- **SEO** — metadata per halaman, `sitemap.xml`, `robots.txt`, dan JSON-LD
  (`AutoRental` + `FAQPage`) di halaman depan.
