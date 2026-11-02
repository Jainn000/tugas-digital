-- ========================================================
-- Database Schema: digital_entrepreneurship
-- Platform: MySQL / MariaDB (Import via phpMyAdmin)
-- Project: Kewirausahaan Digital (KINETIK Event Production & Organizer)
-- Design Style: Neubrutalism
-- ========================================================

CREATE DATABASE IF NOT EXISTS `digital_entrepreneurship` 
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `digital_entrepreneurship`;

-- 1. Table: users
DROP TABLE IF EXISTS `order_items`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `financial_expenses`;
DROP TABLE IF EXISTS `products`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('admin', 'user') NOT NULL DEFAULT 'user',
  `phone` VARCHAR(30) NULL,
  `address` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Table: categories
CREATE TABLE `categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `description` TEXT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Table: products (Paket Layanan, Tiket, & Sewa Alat)
CREATE TABLE `products` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `category_id` INT NOT NULL,
  `name` VARCHAR(200) NOT NULL,
  `slug` VARCHAR(200) NOT NULL UNIQUE,
  `description` TEXT NULL,
  `price` DECIMAL(12,2) NOT NULL,
  `cost_price` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `stock` INT NOT NULL DEFAULT 0,
  `image_url` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_products_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Table: orders (Booking & Reservasi Event)
CREATE TABLE `orders` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_number` VARCHAR(50) NOT NULL UNIQUE,
  `user_id` INT NULL,
  `customer_name` VARCHAR(100) NOT NULL,
  `customer_email` VARCHAR(100) NOT NULL,
  `customer_phone` VARCHAR(30) NOT NULL,
  `customer_address` TEXT NOT NULL,
  `subtotal` DECIMAL(12,2) NOT NULL,
  `tax_amount` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `shipping_cost` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `total_amount` DECIMAL(12,2) NOT NULL,
  `total_cost` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `payment_method` VARCHAR(50) NOT NULL,
  `payment_status` ENUM('unpaid', 'paid', 'expired', 'failed') NOT NULL DEFAULT 'unpaid',
  `order_status` ENUM('pending', 'processing', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
  `payment_reference` VARCHAR(100) NULL,
  `paid_at` DATETIME NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_orders_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Table: order_items
CREATE TABLE `order_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  `product_name` VARCHAR(200) NOT NULL,
  `price` DECIMAL(12,2) NOT NULL,
  `cost_price` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `quantity` INT NOT NULL DEFAULT 1,
  `subtotal` DECIMAL(12,2) NOT NULL,
  CONSTRAINT `fk_order_items_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_order_items_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Table: financial_expenses (Biaya Operasional Lapangan & Kantor)
CREATE TABLE `financial_expenses` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `expense_title` VARCHAR(200) NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `amount` DECIMAL(12,2) NOT NULL,
  `expense_date` DATE NOT NULL,
  `notes` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================================
-- SEED DATA
-- ========================================================

-- Akun Default (Password: admin123 & user123)
INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `phone`, `address`) VALUES
(1, 'Director Kinetik EO', 'admin@entrepreneur.id', '$2a$10$d2ApRcVTmkNcFSEXU3GkW.6imbdJgtvibSCiwoKRzq14Bam3vEUiq', 'admin', '081234567890', 'Warehouse Kinetik Creative Studio, Kemang Raya No. 45, Jakarta Selatan'),
(2, 'Budi Pratama (PT Sinar Mandiri)', 'user@entrepreneur.id', '$2a$10$tptk0.UdollrK7qY9XXc/.4TLH74wSbdHyDHMY0FTFyRIYVJLnLaS', 'user', '085712349988', 'Gedung Wisma Nusantara Lt. 8, Jl. MH Thamrin, Jakarta Pusat'),
(3, 'Nabila Anindita', 'nabila@gmail.com', '$2a$10$tptk0.UdollrK7qY9XXc/.4TLH74wSbdHyDHMY0FTFyRIYVJLnLaS', 'user', '081900112233', 'Jl. Bintaro Sektor 9 Blok H2 No. 11, Tangerang Selatan');

-- Kategori Layanan Event
INSERT INTO `categories` (`id`, `name`, `slug`, `description`) VALUES
(1, 'Paket Acara & Organizer', 'paket-acara', 'Layanan full-service penyelenggaraan acara korporat, gathering komunitas, hingga pernikahan intimate.'),
(2, 'Tiket Event & Festival', 'tiket-event', 'Akses tiket resmi konser musik independen, seminar creator summit, dan workshop kreatif.'),
(3, 'Sewa Alat & Produksi', 'sewa-alat', 'Penyewaan sound system line array, stage lighting moving head, dan peralatan audio visual broadcast.');

-- Data Produk & Paket
INSERT INTO `products` (`id`, `category_id`, `name`, `slug`, `description`, `price`, `cost_price`, `stock`, `image_url`) VALUES
(1, 1, 'Paket Corporate Gathering & Outbound', 'paket-corporate-gathering-outbound', 'Manajemen acara perusahaan hingga 100 pax: fasilitator outbound bersertifikat, perlengkapan fun games, sound system 3000W, dokumentasi video cinematic, dan koordinasi lokasi.', 7500000.00, 4200000.00, 12, 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80'),
(2, 1, 'Paket Intimate Wedding Organizer', 'paket-intimate-wedding-organizer', 'Koordinasi pernikahan sakral 100-200 pax: tim rundown 8 personil profesional, koordinasi vendor dekorasi/katering/MUA, panduan gladi resik, dan pendampingan keluarga.', 12800000.00, 7500000.00, 6, 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80'),
(3, 1, 'Paket Seminar & Konferensi Hybrid', 'paket-seminar-konferensi-hybrid', 'Produksi seminar kampus atau korporasi: setup live streaming multicam 4K, audio engineer, LED screen panggung, backdrop custom, dan sistem absensi QR code peserta.', 5600000.00, 3100000.00, 8, 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80'),
(4, 2, 'Tiket VIP Youth Creator Summit 2026', 'tiket-vip-youth-creator-summit-2026', 'Akses kursi baris terdepan, lounge eksklusif ber-AC, sesi networking khusus bersama pembicara industri, ID pass lanyard akrilik, dan merchandise package.', 350000.00, 140000.00, 45, 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80'),
(5, 2, 'Tiket Reguler Youth Creator Summit 2026', 'tiket-reguler-youth-creator-summit-2026', 'Tiket masuk seluruh sesi panel diskusi, sertifikat digital berbobot SKPI, lunch box, dan e-book materi presentasi lengkap.', 150000.00, 60000.00, 180, 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop&q=80'),
(6, 2, 'Tiket Presale Indie Wave Music Fest', 'tiket-presale-indie-wave-music-fest', 'Pass masuk festival musik indie outdoor (1 hari), gelang barcode waterproof anti-rusak, gratis minuman selamat datang, dan akses area festival food court.', 125000.00, 45000.00, 120, 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80'),
(7, 3, 'Sewa Sound System 5000W + Mixer Digital', 'sewa-sound-system-5000w-mixer-digital', 'Konfigurasi 4 speaker line array + 2 subwoofer 18 inch, mixer digital 16 channel, 4 unit wireless microphone UHF, kabel audio, serta 1 soundman standby 8 jam.', 2500000.00, 950000.00, 4, 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&auto=format&fit=crop&q=80'),
(8, 3, 'Paket Panggung Lighting & Special FX', 'paket-panggung-lighting-special-fx', '8 unit moving head beam 230W, 12 unit par LED RGBW full colour, 2 unit smoke hazzer machine, DMX controller, dan operator lighting profesional.', 3200000.00, 1200000.00, 3, 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80');

-- Data Transaksi Booking Sample
INSERT INTO `orders` (`id`, `order_number`, `user_id`, `customer_name`, `customer_email`, `customer_phone`, `customer_address`, `subtotal`, `tax_amount`, `shipping_cost`, `total_amount`, `total_cost`, `payment_method`, `payment_status`, `order_status`, `payment_reference`, `paid_at`, `created_at`) VALUES
(1, 'INV-20261012-001', 2, 'Budi Pratama (PT Sinar Mandiri)', 'user@entrepreneur.id', '085712349988', 'Puncak Resort Highland, Bogor (Venue Outbound)', 7500000.00, 0.00, 0.00, 7500000.00, 4200000.00, 'BCA_VA', 'paid', 'completed', 'BCA-88901234001', '2026-10-12 14:32:00', '2026-10-12 14:28:10'),
(2, 'INV-20261020-002', 3, 'Farhan & Nabila', 'nabila@gmail.com', '081900112233', 'Gedung Arsip Nasional RI, Jl. Gajah Mada No. 111, Jakarta Barat', 12800000.00, 0.00, 0.00, 12800000.00, 7500000.00, 'MANDIRI_VA', 'paid', 'completed', 'MDR-77889922001', '2026-10-20 09:15:20', '2026-10-20 09:10:00'),
(3, 'INV-20261027-003', 2, 'BEM FEB Universitas Indonesia', 'user@entrepreneur.id', '085712349988', 'Auditorium Gd. Prof. Sumitro Djojohadikusumo, Kampus UI Depok', 3200000.00, 0.00, 0.00, 3200000.00, 1230000.00, 'QRIS', 'paid', 'completed', 'QRIS-REF-998127', '2026-10-27 16:45:00', '2026-10-27 16:40:00'),
(4, 'INV-20261101-004', 3, 'Danu Prasetyo', 'danu@gmail.com', '081822334455', 'Jl. Tebet Timur Dalam No. 12, Jakarta Selatan', 600000.00, 0.00, 0.00, 600000.00, 240000.00, 'GOPAY', 'paid', 'processing', 'GOPAY-SETTLED-882', '2026-11-01 11:20:00', '2026-11-01 11:12:00'),
(5, 'INV-20261102-005', 2, 'Komunitas Desain Kreatif', 'user@entrepreneur.id', '085712349988', 'Creative Hub Block M, Jakarta Selatan', 5600000.00, 0.00, 0.00, 5600000.00, 3100000.00, 'QRIS', 'unpaid', 'pending', 'QRIS-PENDING-441', NULL, '2026-11-02 20:10:00');

-- Item Transaksi Booking Sample
INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `product_name`, `price`, `cost_price`, `quantity`, `subtotal`) VALUES
(1, 1, 1, 'Paket Corporate Gathering & Outbound', 7500000.00, 4200000.00, 1, 7500000.00),
(2, 2, 2, 'Paket Intimate Wedding Organizer', 12800000.00, 7500000.00, 1, 12800000.00),
(3, 3, 7, 'Sewa Sound System 5000W + Mixer Digital', 2500000.00, 950000.00, 1, 2500000.00),
(4, 3, 4, 'Tiket VIP Youth Creator Summit 2026', 350000.00, 140000.00, 2, 700000.00),
(5, 4, 5, 'Tiket Reguler Youth Creator Summit 2026', 150000.00, 60000.00, 4, 600000.00),
(6, 5, 3, 'Paket Seminar & Konferensi Hybrid', 5600000.00, 3100000.00, 1, 5600000.00);

-- Data Biaya Pengeluaran Operasional Event (Sample Laporan Keuangan)
INSERT INTO `financial_expenses` (`id`, `expense_title`, `category`, `amount`, `expense_date`, `notes`) VALUES
(1, 'Honor 6 Kru Lapangan & Soundman (Event PT Sinar Mandiri)', 'Honor Kru & SDM', 1800000.00, '2026-10-12', 'Honor kerja 2 hari 1 malam di lokasi outbound Puncak'),
(2, 'Sewa Genset Silent 40 KVA + Solar 50 Liter', 'Sewa Alat & Genset', 1250000.00, '2026-10-19', 'Genset cadangan listrik venue outdoor Gedung Arsip'),
(3, 'Cetak 300 Gelang Barcode & ID Card Panitia', 'Produksi & Perlengkapan', 450000.00, '2026-10-25', 'Gelang synthetic anti-sobek untuk gate masuk tiket'),
(4, 'Biaya Perizinan Keramaian Polsek & Satpol PP', 'Perizinan & Administrasi', 500000.00, '2026-10-28', 'Surat izin izin keramaian konser musik festival'),
(5, 'Promosi Iklan Instagram Ads Tiket Youth Summit', 'Pemasaran & Promosi', 350000.00, '2026-11-01', 'Iklan bersponsor 7 hari penargetan mahasiswa Jabodetabek'),
(6, 'Fee Transaksi Payment Gateway Sandbox Periode Okt', 'Finansial & Biaya Admin', 65000.00, '2026-11-01', 'Biaya administrasi MDR QRIS dan Virtual Account');
