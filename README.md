# Jayanagiri EV Rental

Situs pemesanan sewa mobil listrik untuk **PT Jayanagiri Sentosa**. Alur
pemesanan mengikuti pola tiga langkah: **detail sewa → pilih armada →
konfirmasi via WhatsApp**, tanpa registrasi akun. Verifikasi dokumen, DP, dan
deposit diurus admin setelah pesanan masuk — lihat halaman Cara Sewa.

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
  _headers                  # header respons Cloudflare Pages (CSP, HSTS, cache)
  brand/                    # logo hasil turunan yang dipakai situs
  images/fleet/             # foto armada (saat ini placeholder)
src/
  app/                      # route App Router + metadata, manifest, OG image, sitemap, robots
    (site)/                 # halaman publik — memakai header/footer marketing
      sewa-mobil/           # halaman alur pemesanan
      cara-sewa/            # langkah sewa, DP/deposit, ketentuan insiden
      formulir/             # formulir data penyewa (KTP/SIM, dengan/tanpa driver)
    admin/                  # konsol admin — sengaja tanpa chrome marketing
      armada/ pengguna/     # layar selain kotak masuk pengajuan
  components/
    admin/                  # shell, sidebar, lonceng, dan layar konsol admin
      applications/ users/  # kotak masuk pengajuan & manajemen akun
    analytics/              # Google Tag Manager (hanya build produksi)
    booking/                # komponen khusus alur pemesanan (per langkah)
    formulir/               # komponen formulir data penyewa (per langkah + unggah)
    faq/                    # section FAQ bersama (beranda & /sewa-mobil)
    home/                   # section halaman depan
    layout/                 # header, footer, logo, FAB WhatsApp, SiteChrome
    seo/                    # JSON-LD
    ui/                     # primitif: Button, Input, Select, Field, Modal…
  config/
    site.ts                 # identitas, kontak & pengenal Google ← WAJIB DIUBAH
    api.ts                  # base URL API AWS (dipakai admin & formulir)
  data/                     # katalog armada, area layanan, FAQ ← WAJIB DIUBAH
  features/
    admin/                  # domain layer admin (tanpa UI)
      config.ts schema.ts mapper.ts
      auth/ hooks/ repository/
    booking/                # domain layer pemesanan (tanpa UI)
      types.ts constants.ts schema.ts pricing.ts
      availability.ts whatsapp.ts use-booking-wizard.ts
    rental-form/            # domain layer formulir penyewa (tanpa UI)
      schema.ts api.ts use-rental-form.ts
  lib/                      # utilitas format, tautan kontak, JSON-LD, class merge
                            # + api-client.ts & api-error.ts (dipakai bersama)
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
   email, alamat, jam operasional, tautan media sosial, serta pengenal Google
   (`google.siteVerification` untuk Search Console dan `google.tagManagerId`).
   Nomor WhatsApp dinormalisasi otomatis (`08…`, `+62…`, `62…` semuanya valid).
2. **`src/data/vehicles.ts`** — tarif harian, bulanan, dan biaya downtime sudah
   memakai daftar harga asli (belum termasuk PPN). Kapasitas dan jarak tempuh
   masih angka indikatif dari klaim pabrikan.
3. **`src/data/service-areas.ts`** — wilayah operasional (Jabodetabek).
4. **`src/features/booking/constants.ts`** — `DURATION_DISCOUNTS` (kebijakan
   diskon sewa panjang). Kosongkan array untuk menonaktifkan.
Mengganti sumber data ke API/CMS cukup dilakukan di `getVehicles()` dan
`getAvailableVehicles()`; komponen tidak perlu diubah.

## Foto armada

Setiap unit punya **dua suasana × dua bentuk** (empat berkas):

| Berkas | Dipakai di |
| --- | --- |
| `<id>-outdoor-wide.jpg` | korsel beranda, ≥640px |
| `<id>-outdoor-tall.jpg` | korsel beranda, ponsel |
| `<id>-studio-wide.jpg` | armada, pemilihan unit, admin, ≥640px |
| `<id>-studio-tall.jpg` | armada, pemilihan unit, ponsel |

Versi `tall` **bukan** potongan lain dari foto yang sama — itu foto yang sama di
kanvas potret dengan isian blur di atas dan bawah. Karena itu ia dipakai di
bingkai tinggi (ponsel) dan versi `wide` di bingkai lebar; memaksa `wide` masuk
bingkai potret akan memotong bodi mobil.

Pergantian sumber ini dilakukan `components/fleet/fleet-photo.tsx` memakai
elemen `<picture>`. `next/image` tidak dipakai di sana karena ia hanya
menukar *resolusi*, bukan *artwork* — inilah kasus art direction.

Untuk menambah atau mengganti unit: simpan master ke `assets/fleet/` mengikuti
pola nama `<id>-<suasana>-<lebar>x<tinggi>.jpg`, daftarkan `id`-nya di
`scripts/build-fleet-photos.mjs`, lalu jalankan `npm run build:fleet`.

## Formulir data penyewa (`/formulir`)

Formulir pendaftaran penyewa, empat langkah: data penyewa → detail sewa →
dokumen → peraturan & konfirmasi. Menggantikan Google Form yang dipakai
sebelumnya, dengan tambahan pilihan **dengan atau tanpa driver**.

Pilihan "Jenis Mobil" dan "Darimana Anda mengetahui JGS" ada di
`src/data/rental-form-options.ts`. Daftar unit di sana **sengaja lebih luas**
daripada katalog `src/data/vehicles.ts` — JGS menyewakan unit yang belum
difoto untuk situs. Jangan disamakan tanpa konfirmasi pemilik.

Tujuh slot dokumen (KTP, selfie dengan KTP, SIM, Kartu Keluarga, media sosial
wajib; token listrik dan riwayat akun opsional) diunggah **langsung ke S3**
begitu berkasnya dipilih, memakai tiket presigned POST berumur pendek. Berkas
tidak pernah melewati API. Di ponsel tersedia tombol kamera (`capture`) selain
pilih berkas; di desktop tombol itu disembunyikan karena tidak ada gunanya.

Halaman ini `noindex` — bisa dibuka lewat tautan, tapi tidak untuk dicari.
Selama `NEXT_PUBLIC_API_BASE_URL` kosong, halaman menolak mengumpulkan data dan
mengarahkan ke WhatsApp; lebih baik daripada diam-diam membuang KTP orang.

## Konsol admin (`/admin`)

Tiga layar, dengan sidebar (drawer di layar kecil):

| Menu | Rute | Isi |
| --- | --- | --- |
| Pengajuan | `/admin` | Kotak masuk formulir penyewa: saring per status, buka detail, lihat dokumen, ubah status, catatan internal |
| Armada | `/admin/armada` | Tambah/ubah/hapus unit, validasi zod yang sama ketatnya dengan alur pemesanan |
| Pengguna | `/admin/pengguna` | Akun konsol — **hanya Pemilik** |

Lonceng notifikasi di bilah atas menampilkan formulir yang baru masuk. Situs ini
static export, jadi tidak ada socket: jumlah belum dibaca di-*poll* tiap 45
detik lewat satu endpoint penghitung, dan daftarnya baru diambil saat lonceng
dibuka.

Peran: **Pemilik** (semua, termasuk kelola pengguna dan hapus pengajuan) dan
**Staf** (pengajuan + armada). Sidebar menyembunyikan menu yang tidak relevan,
tapi yang menegakkan aturan adalah API.

### Menghubungkan ke backend AWS

Situs ini adalah *static export*, jadi tidak punya server sendiri — konsol admin
dan formulir memanggil API dari browser. Arahkan ke API dengan satu variabel
lingkungan:

```bash
NEXT_PUBLIC_API_BASE_URL=https://xxxxxxxx.execute-api.ap-southeast-1.amazonaws.com
```

Nilai `NEXT_PUBLIC_*` ditanam saat build, jadi perubahan memerlukan build ulang.

Backend-nya ada di repo terpisah **`chaedirdwiantara/jgs-be`** (Lambda +
DynamoDB + S3); daftar endpoint lengkap ada di README repo tersebut. Adapter di
sisi ini ada di `src/features/admin/repository/` dan `src/features/rental-form/`
— ganti adapter, bukan layar, bila kontraknya berubah.

Galat berbentuk `{ message, errors?: { field: string } }`; isi `errors`
otomatis dipetakan ke kolom form yang bersangkutan.

### Mode lokal

Selama `NEXT_PUBLIC_API_BASE_URL` kosong, konsol memakai penyimpanan browser dan
menampilkan banner peringatan. Ini agar layar admin bisa dipakai dan ditinjau
sebelum backend siap — **bukan** tempat menyimpan katalog sungguhan. Kotak
masuk pengajuan sengaja tidak diisi contoh palsu.

### Keamanan

`/admin` adalah berkas HTML statis yang bisa dibuka siapa saja; `noindex` dan
`Disallow` hanya menjauhkan crawler. **Otorisasi sepenuhnya tanggung jawab
API** — setiap permintaan membawa bearer token dan backend wajib menolak yang
tidak valid, termasuk memeriksa ulang peran di setiap rute khusus Pemilik.
Token disimpan di `sessionStorage` (ikut hilang saat tab ditutup), bukan
`localStorage`.

Header keamanan (CSP, `X-Frame-Options`, HSTS, `Permissions-Policy`) diatur di
`public/_headers`, yang dibaca Cloudflare Pages — `headers()` di
`next.config.ts` tidak berlaku pada static export. CSP-nya membatasi
`connect-src`; **origin API dan bucket dokumen wajib terdaftar di sana**, atau
formulir dan konsol diblokir browser di produksi tanpa error saat build.

## Aset merek & armada

Semua aset turunan dibuat ulang dari satu berkas master, jadi jangan diedit
manual:

```bash
npm run build:brand      # logo header/footer, icon.png, apple-icon.png, favicon.ico, opengraph-image.png
npm run build:fleet      # 24 foto armada (6 unit × 2 suasana × 2 bentuk)
```

`build:brand` membaca `assets/brand/jgs-logo-source.png`, memangkas margin
transparannya, lalu menurunkan seluruh ukuran yang dipakai situs.
`build:fleet` menurunkan `assets/fleet/*.jpg` ke lebar 900px (bentuk lebar) dan
800px (bentuk tinggi) pada kualitas 70.

## Alur pemesanan

1. **Detail Sewa** — tipe pelanggan, nama, WhatsApp, tanggal mulai, dan lama
   sewa. Validasi menolak nomor tidak valid, tanggal lampau, dan tanggal lebih
   dari 180 hari ke depan. Titik serah terima unit tidak diminta di formulir —
   disepakati bersama admin lewat WhatsApp.
2. **Pilih Armada** — menampilkan unit yang tersedia, dengan filter kapasitas
   kursi dan estimasi tarif harian.
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
- **SEO & identitas** — metadata per halaman dengan canonical yang merujuk ke
  dirinya sendiri (termasuk beranda), `sitemap.xml`, `robots.txt`, JSON-LD
  (`AutoRental` + `FAQPage` di beranda, `FAQPage` di `/sewa-mobil` — daftar
  FAQ kedua halaman sengaja berbeda dan JSON-LD hanya memuat pertanyaan yang
  tampil di halaman itu), kartu Open Graph (`opengraph-image.png`, dipakai
  pratinjau tautan WhatsApp/sosial), dan web manifest (`manifest.webmanifest`)
  yang menetapkan nama serta ikon untuk bookmark dan pintasan layar utama.
  Verifikasi Google Search Console lewat `metadata.verification` di root
  layout. `/admin` dikecualikan dari sitemap, `robots.txt`, dan diberi
  `noindex`.
- **Kontak** — nomor admin di header, footer, dan CTA membuka chat WhatsApp
  (`wa.me`) lewat `lib/contact-links.ts`, bukan `tel:`; hanya halaman Kontak
  yang tetap menyediakan tautan telepon terpisah.
- **Analitik** — Google Tag Manager dipasang lewat `@next/third-parties` di
  `SiteChrome`, sehingga hanya halaman publik yang terukur (`/admin` tidak)
  dan hanya pada build produksi (`next dev` tidak mengirim hit). CSP di
  `public/_headers` sudah mengizinkan host Tag Manager, GA4, dan mode pratinjau
  GTM; tag jenis lain yang ditambahkan dari GTM (mis. Google Ads) perlu
  host-nya ditambahkan ke sana juga. Event kustom dapat dikirim dengan
  `sendGTMEvent` dari paket yang sama.
- **Korsel hero** — berputar otomatis tiap 5,5 detik dan berhenti saat kursor
  di atasnya, saat fokus keyboard masuk, saat tab tidak aktif, serta saat
  pengunjung memilih *reduced motion*. Tombol jeda yang terlihat disediakan
  karena berhenti-saat-hover saja tidak memenuhi WCAG 2.2.2 untuk pengguna
  layar sentuh. Mengikuti pola APG: `aria-live` bernilai `off` selama berputar
  sendiri dan `polite` begitu kendali dipegang pengunjung.
- **Dialog** — `components/ui/modal.tsx` memakai elemen `<dialog>` native, jadi
  jebakan fokus, tombol Escape, latar inert, dan urutan lapisan ditangani
  browser, bukan diimplementasikan ulang.
