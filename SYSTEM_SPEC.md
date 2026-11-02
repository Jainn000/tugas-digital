# Spesifikasi Sistem & Arsitektur Mesin KINETIK Event Platform

Dokumen teknis arsitektur sistem, database, multi-aktor login, payment gateway webhook, dan pelaporan keuangan platform **KINETIK Event Production & Creative Organizer**.

---

## 1. Arsitektur Database & Dual-Engine Fallback

Platform ini menggunakan sistem database berdaya tahan tinggi (*dual-engine fallback*) yang didefinisikan pada [`lib/db.js`](file:///home/zain/Documents/DIGITAL-ENTREPRENEURSHIP/lib/db.js):

### A. Mesin Utama: MySQL & phpMyAdmin
* **File Skema SQL:** [`database.sql`](file:///home/zain/Documents/DIGITAL-ENTREPRENEURSHIP/database.sql)
* **Koneksi:** Menggunakan pooling `mysql2/promise` dengan konfigurasi di `.env.local`:
  * `DB_HOST=localhost`
  * `DB_PORT=3306`
  * `DB_USER=root`
  * `DB_PASSWORD=`
  * `DB_NAME=digital_entrepreneurship`
* **Struktur 6 Tabel Utama:**
  1. `users`: Menyimpan data kredensial, hashing password bcrypt, dan pemisahan role (`admin` vs `user`).
  2. `categories`: Kategori layanan event (`Paket Acara & Organizer`, `Tiket Event & Festival`, `Produksi Panggung & Sound`).
  3. `products`: Katalog paket acara dan tiket konser lengkap dengan kuota/slot ketersediaan.
  4. `orders`: Transaksi pemesanan, tanggal pelaksanaan event, status pembayaran (`pending`, `paid`, `cancelled`), dan payment channel (QRIS, VA BCA, Mandiri, GoPay).
  5. `order_items`: Rincian item per transaksi.
  6. `financial_expenses`: Pencatatan beban operasional panggung (sewa rigging, fee artis, konsumsi kru, sound engineer) untuk pembukuan laba rugi.

### B. Mesin Fallback: Local JSON Store
* **File Data:** [`data/store.json`](file:///home/zain/Documents/DIGITAL-ENTREPRENEURSHIP/data/store.json)
* **Mekanisme Otomatis:** Apabila server MySQL lokal (XAMPP / Laragon / Docker) sedang tidak berjalan atau saat dideploy ke lingkungan serverless seperti Vercel, fungsi `query()` di `lib/db.js` otomatis beralih membaca dan menulis ke `data/store.json`. Hal ini menjamin aplikasi tidak pernah mengalami HTTP 500 (*zero-downtime*).

---

## 2. Multi-Aktor Authentication (Role-Based Access Control)

Sistem membedakan secara tegas alur interaksi antara **Klien / Pemesan Tiket** dan **Event Director / Admin**:

* **Implementasi:** [`lib/auth.js`](file:///home/zain/Documents/DIGITAL-ENTREPRENEURSHIP/lib/auth.js)
* **Metode:** JSON Web Token (JWT) stateless tersimpan dalam HTTP-only cookie dengan enkripsi `HS256` menggunakan library `jose`.
* **Kredensial Default:**
  * **Role Admin:**
    * Email: `admin@entrepreneur.id`
    * Password: `password123`
    * Area Akses: `/admin`, `/admin/orders`, `/admin/products`, `/admin/reports/sales`, `/admin/reports/financial`
  * **Role Klien / User:**
    * Email: `user@example.com`
    * Password: `password123`
    * Area Akses: `/`, `/checkout`, `/my-orders`, `/orders/[orderNumber]`

---

## 3. Integrasi Payment Gateway & AkuQRIS Sandbox

Platform terintegrasi langsung dengan payment gateway nasional (QRIS, Virtual Account BCA, Mandiri, dan GoPay).

* **Endpoint Webhook:** [`app/api/payment/webhook/route.js`](file:///home/zain/Documents/DIGITAL-ENTREPRENEURSHIP/app/api/payment/webhook/route.js)
* **Kredensial Sandbox (Autoko / AkuQRIS):**
  * `AKUQRIS_API_KEY`: `pk_test_2c11cd6b9062c2074f9a39a1f715b95e`
  * `AKUQRIS_WEBHOOK_SECRET`: `bd9dd1b1699672c02c5c246c742d47cc9c533389cffb0f502ac95c44c86740cc`
  * `AKUQRIS_BASE_URL`: `https://store.ku.anjay.fun/api/v1`
* **Verifikasi Keamanan Signature:**
  * Webhook memverifikasi header `X-Webhook-Signature` dengan hash HMAC-SHA256 berdasarkan raw body dan webhook secret.
* **Penanganan Event:**
  * `payment.test`: Merespons status sukses 200 saat tombol "Tes" di dashboard AkuQRIS diklik.
  * `payment.paid`: Otomatis memperbarui status pesanan menjadi `paid`, mencatat settlement timestamp, dan mengurangi stok slot secara real-time.

---

## 4. Format Dokumen & Cetak Resmi

Halaman pesanan ([`app/orders/[orderNumber]/page.jsx`](file:///home/zain/Documents/DIGITAL-ENTREPRENEURSHIP/app/orders/[orderNumber]/page.jsx)) menyediakan dua mode cetak berstandar industri dengan CSS `@media print`:

1. **Faktur / Invoice Resmi A4:**
   * Ditujukan untuk SPJ korporat, instansi pemerintah, dan institusi.
   * Dilengkapi nomor faktur resmi, rincian termin pembayaran, NPWP perusahaan, dan stempel digital validasi.
2. **E-Ticket Pass Masuk Gate Venue (Thermal 80mm):**
   * Format ringkas khusus printer thermal mini untuk gate masuk konser/festival.
   * Dilengkapi barcode QR SVG unik anti-duplikasi untuk verifikasi cepat tim usher.

---

## 5. Laporan Keuangan SAK EMKM

Panel admin menyediakan pelaporan komprehensif:
* **Laporan Penjualan Tiket & Paket:** Menghitung total omzet kotor, distribusi metode pembayaran, dan volume pesanan.
* **Laporan Laba Rugi Operasional Panggung:** Menghitung laba bersih riil setelah dikurangi beban sewa rigging panggung, genset, sound engineer, tim usher gate, dan biaya promosi.
* Format cetak bersih (`no-print` filter) siap diunduh menjadi PDF atau dicetak fisik untuk laporan pertanggungjawaban.
