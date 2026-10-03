# Fintrack

Aplikasi manajemen keuangan pribadi: mencatat, memantau, dan menganalisis
pemasukan serta pengeluaran dalam Rupiah, dengan dua dompet (cash dan digital).

---

## Fitur

- **Dashboard Overview** — saldo per dompet, total pemasukan/pengeluaran, grafik
  bulanan (12 bulan terakhir), dan distribusi pengeluaran per kategori
- **Tambah / Edit Transaksi** — tipe, jumlah, kategori, tanggal, dompet, catatan
- **Riwayat Transaksi** — filter tipe/dompet/kategori plus pencarian teks
- **Dua Dompet** — `cash` (tunai) dan `digital` (e-wallet / QRIS)
- **Tema terang & gelap** — mengikuti preferensi sistem, bisa diubah lewat tombol di topbar dan tersimpan di browser
- **Responsif** — sidebar menjadi drawer di layar kecil

---

## Tech Stack

| Layer | Teknologi |
|---|---|
| Framework | Nuxt 4 (Vue 3, SPA mode — `ssr: false`) |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`), token-based tema terang/gelap |
| Charts | Chart.js via vue-chartjs |
| Font | Inter, self-hosted oleh `@nuxt/fonts` |
| API | Nitro route handlers (`server/api/`) |
| Database | Neon Postgres, driver `pg` |
| Deploy | Vercel (zero-config) |

Frontend dan API berjalan sebagai satu aplikasi di satu origin — tidak ada lagi
proses Express terpisah dan tidak ada proxy `/api`.

---

## Menjalankan secara lokal

### Prasyarat

- Node.js `>= 22.19.0` (Nuxt 4.5 tidak lagi mendukung Node 20)
- Satu database Neon Postgres

### Instalasi

```bash
npm install
cp .env.example .env     # lalu isi nilainya, lihat di bawah
npm run dev              # http://localhost:3000
```

`npm run dev` menjalankan halaman dan API sekaligus pada satu port.

### Environment

| Variabel | Keterangan |
|---|---|
| `DATABASE_URL` | Connection string Neon **pooled** (host `-pooler`). Untuk lokal, arahkan ke branch `dev`, bukan `main`. |
| `DATABASE_URL_UNPOOLED` | Connection string langsung, hanya untuk DDL (`npm run db:schema`). |

Membuat skema di database kosong:

```bash
npm run db:schema        # menjalankan db/schema.sql lewat DATABASE_URL_UNPOOLED
```

### Perintah lain

| Perintah | Fungsi |
|---|---|
| `npm run build` | Build produksi ke `.output/` |
| `npm run preview` | Menjalankan hasil build secara lokal |
| `npm run typecheck` | `nuxt typecheck` (vue-tsc) |

---

## Akses

Aplikasi ini **tidak punya autentikasi**. Tidak ada tabel `users`, tidak ada
kolom `user_id`, dan tidak ada passcode — semua endpoint terbuka.

Selama hanya berjalan di `localhost` itu tidak masalah. **Begitu di-deploy ke
Vercel, siapa pun yang tahu URL-nya bisa membaca, menambah, mengubah, dan
menghapus seluruh catatan keuangan.** Kalau itu bukan yang diinginkan, pilihan
paling cepat adalah menyalakan Vercel Deployment Protection di pengaturan
project; solusi sebenarnya adalah menambahkan autentikasi.

---

## Tema

Token warna didefinisikan sekali di `app/assets/css/main.css` (`@theme static`)
dan di-override di bawah `:root[data-theme="light"]`. Utility Tailwind seperti
`bg-surface` atau `text-muted` dikompilasi menjadi `var(--color-*)`, jadi ganti
tema cukup menukar variabel — bukan menyapu ulang markup.

Aksen punya nilai berbeda per tema dengan sengaja: `#10b981` di atas putih hanya
2.3:1, terlalu rendah untuk teks, sehingga versi terang memakai shade 600/700.

Chart.js melukis ke canvas dan tidak bisa membaca `var()`, jadi
`app/composables/useThemeColors.ts` membaca token hasil komputasi dan
mengembalikannya sebagai string, lalu dihitung ulang setiap tema berubah.

## API

| Method | Endpoint | Keterangan |
|---|---|---|
| `GET` | `/api/transactions` | Opsional `?month=YYYY-MM`, `?wallet=cash\|digital` |
| `POST` | `/api/transactions` | Membuat transaksi |
| `PUT` | `/api/transactions/:id` | Mengubah transaksi |
| `DELETE` | `/api/transactions/:id` | Menghapus transaksi |
| `GET` | `/api/summary` | Opsional `?month`, `?wallet` |
| `GET` | `/api/summary/wallets` | Saldo per dompet |
| `GET` | `/api/summary/monthly` | 12 bulan terakhir |

Error yang diharapkan (400/404) memakai bentuk `{ "error": "pesan" }`. Error tak
terduga menghasilkan 500 generik; penyebab aslinya hanya muncul di log server.

`amount` dan `id` dikirim sebagai **number**, dan `date` sebagai `YYYY-MM-DD`,
berkat cast eksplisit di `server/utils/transactions.ts`. Tanpa itu `pg`
mengirim NUMERIC sebagai string, yang membuat rincian kategori di dashboard
menghasilkan `NaN%`.

---

## Deploy ke Vercel

Zero-config — tidak perlu `vercel.json`.

1. Import repositori di Vercel; framework Nuxt terdeteksi otomatis. Biarkan
   build command dan output directory kosong (Nitro menghasilkan
   `.vercel/output` sendiri).
2. **Node.js Version: 22.x** (Node 20 akan gagal build).
3. **Functions Region: Singapore (`sin1`)** — database Neon berada di
   `ap-southeast-1`. Region default `iad1` menambah ~200 ms per request, dan
   dashboard memanggil 4 endpoint sekaligus saat dimuat.
4. Set `DATABASE_URL` untuk Production, Preview, dan Development. Arahkan
   Preview ke branch Neon `dev` agar preview deploy tidak menyentuh data asli.

---

## Struktur

```
app/                 Vue: app.vue, layouts/, pages/, components/, composables/
server/api/          Nitro route handlers
server/utils/        Koneksi database dan proyeksi kolom
shared/              Tipe dan util yang dipakai app maupun server
db/schema.sql        Skema database
```

---

## Yang belum ada

- Autentikasi (saat ini tidak ada sama sekali — lihat bagian Akses)
- Export data (CSV / PDF)
- Anggaran dan target per kategori
