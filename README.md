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
assets/brand/               # artwork master logo (sumber, tidak disajikan ke publik)
public/
  brand/                    # logo hasil turunan yang dipakai situs
  images/fleet/             # foto armada (saat ini placeholder)
src/
  app/                      # route App Router + metadata, sitemap, robots
    (site)/                 # halaman publik — memakai header/footer marketing
      sewa-mobil/           # halaman alur pemesanan
    admin/                  # konsol admin — sengaja tanpa chrome marketing
  components/
    admin/                  # tabel, form, dan dialog konsol admin
    booking/                # komponen khusus alur pemesanan (per langkah)
    home/                   # section halaman depan
    layout/                 # header, footer, logo, FAB WhatsApp, SiteChrome
    ui/                     # primitif: Button, Input, Select, Field, Modal…
  config/site.ts            # identitas & kontak perusahaan  ← WAJIB DIUBAH
  data/                     # katalog armada, lokasi, FAQ     ← WAJIB DIUBAH
  features/
    admin/                  # domain layer admin (tanpa UI)
      config.ts schema.ts mapper.ts
      auth/ hooks/ repository/
    booking/                # domain layer pemesanan (tanpa UI)
      types.ts constants.ts schema.ts pricing.ts
      availability.ts whatsapp.ts use-booking-wizard.ts
  lib/                      # utilitas format & class merge
scripts/                    # generator aset + smoke test (dev only)
```

Route group `(site)` tidak muncul di URL — `(site)/armada` tetap melayani
`/armada`. Keberadaannya membuat chrome marketing (header, footer, tombol
WhatsApp) dipasang lewat `SiteChrome` hanya untuk halaman publik, sehingga
`/admin` bisa memakai `<html>` dan font yang sama tanpa ikut membawa tampilan
situs publik.

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
5. **Foto armada** — `public/images/fleet/<id>.svg` saat ini berisi placeholder
   hasil generate (lihat *Aset merek & armada*). Ganti dengan foto asli rasio
   **16:10**, lalu perbarui kolom `photo` di `src/data/vehicles.ts`. Tidak ada
   komponen yang perlu diubah.

Mengganti sumber data ke API/CMS cukup dilakukan di `getVehicles()` dan
`getLocations()`; komponen tidak perlu diubah.

## Konsol admin (`/admin`)

Halaman pengelolaan data armada: tambah, ubah, dan hapus unit dengan validasi
zod yang sama ketatnya dengan alur pemesanan.

### Menghubungkan ke backend AWS

Situs ini adalah *static export*, jadi tidak punya server sendiri — konsol admin
memanggil API dari browser. Arahkan ke API dengan satu variabel lingkungan:

```bash
NEXT_PUBLIC_API_BASE_URL=https://api.jgs-ev.com
```

Nilai `NEXT_PUBLIC_*` ditanam saat build, jadi perubahan memerlukan build ulang.

Kontrak yang diharapkan — implementasikan lima endpoint ini dan konsol langsung
berfungsi tanpa perubahan kode:

| Method | Path | Respons |
| --- | --- | --- |
| `POST` | `/auth/login` | `{ token }` — `401` bila kredensial salah |
| `GET` | `/vehicles` | `Vehicle[]` atau `{ data: Vehicle[] }` |
| `POST` | `/vehicles` | `Vehicle` — `409` bila `id` sudah dipakai |
| `PUT` | `/vehicles/:id` | `Vehicle` |
| `DELETE` | `/vehicles/:id` | `204` |

Galat sebaiknya berbentuk `{ message, errors?: { field: string } }`; isi
`errors` otomatis dipetakan ke kolom form yang bersangkutan.

### Mode lokal

Selama `NEXT_PUBLIC_API_BASE_URL` kosong, konsol memakai penyimpanan browser dan
menampilkan banner peringatan. Ini agar layar admin bisa dipakai dan ditinjau
sebelum backend siap — **bukan** tempat menyimpan katalog sungguhan.

### Keamanan

`/admin` adalah berkas HTML statis yang bisa dibuka siapa saja; `noindex` dan
`Disallow` hanya menjauhkan crawler. **Otorisasi sepenuhnya tanggung jawab
API** — setiap permintaan membawa bearer token dan backend wajib menolak yang
tidak valid. Token disimpan di `sessionStorage` (ikut hilang saat tab ditutup),
bukan `localStorage`.

## Aset merek & armada

Semua aset turunan dibuat ulang dari satu berkas master, jadi jangan diedit
manual:

```bash
npm run build:brand      # logo header/footer, icon.png, apple-icon.png, favicon.ico
npm run build:fleet      # placeholder foto armada 16:10
```

`build:brand` membaca `assets/brand/jgs-logo-source.png`, memangkas margin
transparannya, lalu menurunkan seluruh ukuran yang dipakai situs.

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

## Warna merek

Primer **merah**, sekunder **putih**, diturunkan dari logo JGS. Semua nilai ada
di `@theme` pada `src/app/globals.css` — jangan menulis hex langsung di komponen.

`brand-500` (`#fa2020`) sengaja dibuat sama dengan warna dominan logo agar mark
menyatu dengan palet. Merah murni terlalu terang untuk menopang teks putih, jadi
warna primer aksi adalah `brand-600` (`#d90000`). Rasio kontras pasangan yang
benar-benar dipakai di UI:

| Pasangan | Rasio | Syarat WCAG |
| --- | --- | --- |
| Teks putih di atas `brand-600` (tombol) | 5.32 : 1 | AA ✓ |
| Teks putih di atas `brand-700` (hover) | 7.03 : 1 | AA ✓ |
| Teks `brand-600` di atas putih | 5.32 : 1 | AA ✓ |
| Teks `brand-700` di atas `brand-50` (nav aktif, badge) | 6.39 : 1 | AA ✓ |
| Teks `brand-200` di atas `ink-950` (hero) | 12.92 : 1 | AA ✓ |
| Teks `brand-300` di atas `ink-950` | 9.58 : 1 | AA ✓ |
| Cincin fokus `brand-600` di atas `ink-950` | 3.61 : 1 | non-teks ✓ |

**Status galat** memakai skala terpisah `danger-*` — crimson (hue ≈347°), bukan
merah murni merek (hue 0°). Dengan merek berwarna merah, galat yang juga merah
tidak lagi menonjol, karena itu `Field` selalu menyertakan ikon peringatan agar
warna bukan satu-satunya penanda (WCAG 1.4.1). Garis tepi galat memakai
`danger-500` (3.63 : 1), bukan bobot 400 yang hanya mencapai 2.66 : 1 — di bawah
minimum 3 : 1 untuk penanda non-teks.

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
  (`AutoRental` + `FAQPage`) di halaman depan. `/admin` dikecualikan dari
  sitemap, `robots.txt`, dan diberi `noindex`.
- **Korsel hero** — berputar otomatis tiap 5,5 detik dan berhenti saat kursor
  di atasnya, saat fokus keyboard masuk, saat tab tidak aktif, serta saat
  pengunjung memilih *reduced motion*. Tombol jeda yang terlihat disediakan
  karena berhenti-saat-hover saja tidak memenuhi WCAG 2.2.2 untuk pengguna
  layar sentuh. Mengikuti pola APG: `aria-live` bernilai `off` selama berputar
  sendiri dan `polite` begitu kendali dipegang pengunjung.
- **Dialog** — `components/ui/modal.tsx` memakai elemen `<dialog>` native, jadi
  jebakan fokus, tombol Escape, latar inert, dan urutan lapisan ditangani
  browser, bukan diimplementasikan ulang.
