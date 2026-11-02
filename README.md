# KINETIK Event Production & Creative Organizer — Proyek Kewirausahaan Digital

Aplikasi website manajemen acara, promotor festival musik, dan penyewaan alat panggung profesional untuk memenuhi seluruh indikator penilaian mata kuliah **Kewirausahaan Digital / Digital Entrepreneurship**.

Aplikasi dibangun dengan gaya desain **Neubrutalism** berkarakter tegas (kontras tinggi, tipografi bold, solid ink, bebas AI slop dan gradien ungu generik) serta mematuhi seluruh standar *Taste Skill*, *Impeccable*, *Anti-Slop*, dan *Humanizer Writing*.

Dokumentasi arsitektur database, multi-aktor auth, dan webhook dapat dibaca di [`SYSTEM_SPEC.md`](./SYSTEM_SPEC.md).

---

## 📌 Checklist Rubrik & Pemenuhan Ketentuan Proyek

| Ketentuan Proyek | Status | Penjelasan Implementasi |
| :--- | :---: | :--- |
| **Bentuk Website / Mobile** | ✅ Selesai | Responsif desktop dan mobile menggunakan Next.js 14 App Router, pure JavaScript, dan Tailwind CSS. |
| **Wajib Menggunakan Database** | ✅ Selesai | File `database.sql` lengkap siap di-import ke **phpMyAdmin (MySQL/MariaDB)** dengan 6 tabel relasional dan data awal. Dilengkapi sistem *zero-failure fallback data store*. |
| **Login Min. 2 Peran (Admin & User)** | ✅ Selesai | Multi-role authentication terpisah antara portal publik klien (`/`) dan portal pengelola (`/admin`) menggunakan JWT stateles cookies. |
| **Fitur Payment Gateway** | ✅ Selesai | Terintegrasi AkuQRIS sandbox (`/api/payment/webhook`) dengan verifikasi HMAC-SHA256 signature, QRIS dinamis, Virtual Account BCA/Mandiri, dan GoPay. |
| **Transaksi & Cetak Invoice/Struk** | ✅ Selesai | Alur reservasi langsung tanpa keranjang (`/checkout`), otomatisasi invoice resmi A4 untuk SPJ dan e-ticket thermal 80mm ber-barcode unik. |
| **Laporan Penjualan (Omzet)** | ✅ Selesai | Halaman laporan penjualan tiket dan paket acara dengan metrik omzet, laba kotor, dan ekspor cetak PDF. |
| **Laporan Keuangan (Laba Rugi)** | ✅ Selesai | Laporan laba rugi standar SAK EMKM: menghitung pendapatan kotor dikurangi beban operasional panggung (rigging, lighting, kru, sound engineer). |
| **Filter Berdasarkan Tanggal** | ✅ Selesai | Kedua laporan dilengkapi date picker `Dari Tanggal` s/d `Sampai Tanggal` serta shortcut preset periode. |
| **Dijalankan di Localhost & Vercel** | ✅ Selesai | Berjalan di `http://localhost:3000` dan live di `https://digital-entrepreneurship-five.vercel.app`. |

---

## 🚀 Panduan Menjalankan Aplikasi di Localhost

### 1. Menjalankan Server Aplikasi
Pastikan Node.js (v18+) sudah terpasang. Di terminal proyek, jalankan:

```bash
# Menjalankan server development
npm run dev
```

Buka peramban (browser) dan akses: **`http://localhost:3000`**

---

### 2. Panduan Import Database ke phpMyAdmin (MySQL)

1. Buka **XAMPP / Laragon** dan nyalakan service **Apache** dan **MySQL**.
2. Buka browser dan masuk ke **phpMyAdmin**: `http://localhost/phpmyadmin`
3. Buat database baru bernama: `digital_entrepreneurship` (atau lewati jika menggunakan file SQL langsung).
4. Klik tab **Import** pada menu atas phpMyAdmin.
5. Klik **Choose File** lalu pilih file [`database.sql`](./database.sql) yang berada di root folder proyek ini.
6. Klik tombol **Import / Kirim** di bagian bawah.
7. Semua tabel (`users`, `categories`, `products`, `orders`, `order_items`, `financial_expenses`) beserta relasi dan data awal akan otomatis terisi!

> **Catatan Resiliensi Sistem:** Jika service MySQL belum dinyalakan atau phpMyAdmin belum di-import, aplikasi otomatis menggunakan local store fallback (`data/store.json`) sehingga Anda tetap bisa mendemokan seluruh fitur login, transaksi, dan cetak invoice tanpa kendala server mati.

---

## 🔑 Akun Demo Siap Pakai

Tersedia tombol satu-klik (**Shortcut Akun Demo**) di halaman login:

| Peran (Role) | Email | Password | Akses & Wewenang |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@entrepreneur.id` | `admin123` | Mengakses Admin Dashboard, Mengelola Katalog Produk & Stok, Mengubah Status Transaksi, Melihat Laporan Penjualan & Laba Rugi, Cetak PDF. |
| **User (Pelanggan)** | `user@entrepreneur.id` | `user123` | Menjelajah katalog, menambah ke keranjang belanja, checkout, memilih payment gateway simulator, melihat riwayat transaksi & cetak struk/invoice sendiri. |

---

## 📦 Struktur Direktori Proyek

```
DIGITAL-ENTREPRENEURSHIP/
├── app/
│   ├── admin/
│   │   ├── orders/page.tsx           # Kelola transaksi masuk
│   │   ├── products/page.tsx         # Kelola stok & HPP produk
│   │   ├── reports/
│   │   │   ├── financial/page.tsx    # Laporan Laba Rugi + Cetak PDF
│   │   │   └── sales/page.tsx        # Laporan Penjualan (Omzet) + Filter Tanggal
│   │   ├── layout.tsx                # Guard hak akses admin & tab navigasi
│   │   └── page.tsx                  # Dashboard overview & KPI bisnis
│   ├── api/                          # REST API routes (Auth, Products, Orders, Reports, Payment)
│   ├── checkout/page.tsx             # Kasir & form order
│   ├── login/page.tsx                # Halaman login multi-aktor
│   ├── my-orders/page.tsx            # Riwayat transaksi pelanggan
│   ├── orders/[orderNumber]/page.tsx # Payment sandbox & cetak invoice/struk
│   ├── register/page.tsx             # Registrasi pelanggan baru
│   ├── globals.css                   # Tailwind & styling neubrutalisme + print CSS
│   ├── layout.tsx                    # Root layout
│   └── page.tsx                      # Toko publik (storefront)
├── components/                       # Navbar, Footer, CartDrawer, CartContext
├── data/                             # Data store fallback lokal
├── lib/
│   ├── auth.ts                       # JWT & password hashing
│   ├── db.ts                         # Driver database MySQL + local fallback
│   └── format.ts                     # Format Rupiah & tanggal Indonesia
├── database.sql                      # SQL Dump siap import phpMyAdmin
└── package.json
```
