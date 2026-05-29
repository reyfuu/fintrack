# 💰 Fintrack

Aplikasi manajemen keuangan pribadi berbasis web yang membantu Anda mencatat, memantau, dan menganalisis pemasukan serta pengeluaran secara real-time.

---

## ✨ Fitur Saat Ini

- **Dashboard Overview** — Ringkasan saldo, total pemasukan, dan total pengeluaran dalam format Rupiah (IDR)
- **Tambah Transaksi** — Catat pemasukan/pengeluaran dengan kategori, tanggal, dan catatan
- **Riwayat Transaksi** — Lihat, filter (semua/pemasukan/pengeluaran), dan cari seluruh catatan transaksi
- **Rincian Pengeluaran** — Breakdown pengeluaran per kategori dengan progress bar visual
- **Aktivitas Terkini** — Tampilan 7 transaksi terakhir di halaman utama
- **Responsif** — Tampilan optimal di desktop, tablet, maupun smartphone

---

## 🛠️ Tech Stack

| Layer | Teknologi |
|---|---|
| Frontend | Vue 3 (Composition API) + Vite |
| Styling | Tailwind CSS v4 |
| Backend | Node.js + Express.js |
| Database | JSON file-based (MVP) |
| Font | Inter (Google Fonts) |

---

## 🚀 Cara Menjalankan

### Prasyarat
- Node.js `>= 20.19.0`
- npm

### Instalasi

```bash
# Clone repositori
git clone <repo-url>
cd fintrack

# Install dependencies
npm install
```

### Jalankan Aplikasi

```bash
# Terminal 1 — Backend API (port 3000)
node server.js

# Terminal 2 — Frontend Dev Server (port 5173)
npm run dev
```

Buka browser di **[http://localhost:5173](http://localhost:5173)**

### Build Production

```bash
npm run build
```

---

## 📁 Struktur Proyek

```
fintrack/
├── src/
│   ├── assets/
│   │   └── main.css          # Global styles + Tailwind import
│   ├── components/
│   │   ├── Dashboard.vue     # Halaman overview & KPI cards
│   │   ├── TransactionForm.vue  # Form tambah transaksi
│   │   └── TransactionList.vue  # Tabel & filter transaksi
│   ├── App.vue               # Root layout (sidebar + topbar)
│   └── main.ts               # Entry point Vue
├── server.js                 # Express API server
├── vite.config.ts            # Konfigurasi Vite + Tailwind
└── package.json
```

---

## 🗺️ Future Plan

### 📊 Integrasi Google Sheets
> *Direncanakan untuk versi berikutnya*

- Export otomatis transaksi ke **Google Sheets** sebagai database cloud
- Sinkronisasi dua arah: data di Sheets ↔ aplikasi Fintrack
- Sheet terpisah per bulan untuk kemudahan audit
- Memanfaatkan **Google Sheets API v4** via OAuth 2.0

### 📄 Laporan Bulanan via Google Docs
> *Direncanakan untuk versi berikutnya*

- Generate **laporan keuangan bulanan otomatis** ke Google Docs
- Template laporan mencakup: ringkasan saldo, grafik pengeluaran per kategori, tren bulanan, dan rekomendasi penghematan
- Laporan bisa langsung di-share atau dicetak dari Google Docs
- Memanfaatkan **Google Docs API** untuk mengisi template secara programatik

### 🔮 Roadmap Lainnya
- [ ] Autentikasi pengguna (multi-user support)
- [ ] Upgrade database ke SQLite / PostgreSQL
- [ ] Grafik tren keuangan bulanan (Chart.js)
- [ ] Notifikasi batas anggaran per kategori
- [ ] PWA (Progressive Web App) untuk akses offline

---

## 📄 Lisensi

MIT License © 2026 Fintrack
