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
- **Responsif** — sidebar menjadi drawer di layar kecil

---

## Tech Stack

| Layer | Teknologi |
|---|---|
| Framework | Nuxt 4 (Vue 3, SPA mode — `ssr: false`) |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) |
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
| `APP_PASSCODE` | Passcode untuk masuk. Tidak punya default — jika kosong, server menolak semua request. |
| `AUTH_SECRET` | Kunci HMAC untuk menandatangani cookie sesi. |

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

## Autentikasi

Aplikasi ini **single-tenant**: tidak ada tabel `users`, tidak ada kolom
`user_id`, dan semua data dimiliki bersama. Yang ada adalah **satu passcode
bersama** (`APP_PASSCODE`).

Cara kerjanya: `POST /api/auth/login` membandingkan passcode secara
constant-time, lalu memasang cookie httpOnly berisi token
`<issuedAt>.<nonce>.<hmac>` yang ditandatangani dengan `AUTH_SECRET` dan berlaku
30 hari. Middleware `server/middleware/auth.ts` menolak setiap request ke
`/api/**` tanpa cookie yang sah.

**Batasannya, supaya jelas:** tidak ada rate limiting — hanya jeda 600 ms pada
setiap login gagal. Passcode pendek karenanya bisa di-brute-force. Pakai
passcode yang panjang, dan perlakukan ini sebagai pintu sederhana, bukan sistem
autentikasi penuh. Multi-user adalah pekerjaan berikutnya.

---

## API

Semua endpoint memerlukan cookie sesi kecuali `/api/auth/*`.

| Method | Endpoint | Keterangan |
|---|---|---|
| `GET` | `/api/transactions` | Opsional `?month=YYYY-MM`, `?wallet=cash\|digital` |
| `POST` | `/api/transactions` | Membuat transaksi |
| `PUT` | `/api/transactions/:id` | Mengubah transaksi |
| `DELETE` | `/api/transactions/:id` | Menghapus transaksi |
| `GET` | `/api/summary` | Opsional `?month`, `?wallet` |
| `GET` | `/api/summary/wallets` | Saldo per dompet |
| `GET` | `/api/summary/monthly` | 12 bulan terakhir |
| `POST` | `/api/auth/login` | Body `{ passcode }` |
| `POST` | `/api/auth/logout` | Menghapus cookie |
| `GET` | `/api/auth/session` | `{ authenticated: boolean }` |

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
4. Set `DATABASE_URL`, `APP_PASSCODE`, `AUTH_SECRET` untuk Production, Preview,
   dan Development. Arahkan Preview ke branch Neon `dev` agar preview deploy
   tidak menyentuh data asli.

---

## Struktur

```
app/                 Vue: app.vue, layouts/, pages/, components/, composables/
server/api/          Nitro route handlers
server/middleware/   Gerbang passcode
server/utils/        Koneksi database, proyeksi kolom, helper auth
shared/              Tipe dan util yang dipakai app maupun server
db/schema.sql        Skema database
```

---

## Yang belum ada

- Autentikasi multi-user (tabel `users`, `user_id` pada transaksi)
- Rate limiting pada endpoint login
- Export data (CSV / PDF)
- Anggaran dan target per kategori
