import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

const IS_VERCEL = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const BUNDLED_STORE_FILE = path.join(process.cwd(), 'data', 'store.json');
const WRITABLE_STORE_FILE = IS_VERCEL
  ? path.join('/tmp', 'kinetik_store.json')
  : path.join(process.cwd(), 'data', 'store.json');

const INITIAL_DATA = {
  users: [
    {
      id: 1,
      name: 'Director Kinetik EO',
      email: 'admin@entrepreneur.id',
      password: '$2a$10$d2ApRcVTmkNcFSEXU3GkW.6imbdJgtvibSCiwoKRzq14Bam3vEUiq',
      role: 'admin',
      phone: '081234567890',
      address: 'Warehouse Kinetik Creative Studio, Kemang Raya No. 45, Jakarta Selatan',
      created_at: '2026-10-01 10:00:00',
    },
    {
      id: 2,
      name: 'Budi Pratama (PT Sinar Mandiri)',
      email: 'user@entrepreneur.id',
      password: '$2a$10$tptk0.UdollrK7qY9XXc/.4TLH74wSbdHyDHMY0FTFyRIYVJLnLaS',
      role: 'user',
      phone: '085712349988',
      address: 'Gedung Wisma Nusantara Lt. 8, Jl. MH Thamrin, Jakarta Pusat',
      created_at: '2026-10-05 11:30:00',
    },
    {
      id: 3,
      name: 'Nabila Anindita',
      email: 'nabila@gmail.com',
      password: '$2a$10$tptk0.UdollrK7qY9XXc/.4TLH74wSbdHyDHMY0FTFyRIYVJLnLaS',
      role: 'user',
      phone: '081900112233',
      address: 'Jl. Bintaro Sektor 9 Blok H2 No. 11, Tangerang Selatan',
      created_at: '2026-10-10 14:00:00',
    },
    {
      id: 4,
      name: 'Raya Event Supply',
      email: 'vendor@entrepreneur.id',
      password: '$2a$10$n4AzH7gI1creZgP6n7GzQetObVrk8tpAKDY8uhuJqJ6tF7.tee5Ie',
      role: 'vendor',
      phone: '081399887766',
      address: 'Kawasan Industri Pulogadung Blok III No. 8, Jakarta Timur',
      created_at: '2026-10-12 09:00:00',
    },
  ],
  categories: [
    {
      id: 1,
      name: 'Paket Acara & Organizer',
      slug: 'paket-acara',
      description: 'Layanan full-service penyelenggaraan acara korporat, gathering komunitas, hingga pernikahan intimate.',
    },
    {
      id: 2,
      name: 'Tiket Event & Festival',
      slug: 'tiket-event',
      description: 'Akses tiket resmi konser musik independen, seminar creator summit, dan workshop kreatif.',
    },
    {
      id: 3,
      name: 'Sewa Alat & Produksi',
      slug: 'sewa-alat',
      description: 'Penyewaan sound system line array, stage lighting moving head, dan peralatan audio visual broadcast.',
    },
  ],
  products: [
    {
      id: 1,
      category_id: 1,
      name: 'Paket Corporate Gathering & Outbound',
      slug: 'paket-corporate-gathering-outbound',
      description: 'Manajemen acara perusahaan hingga 100 pax: fasilitator outbound bersertifikat, perlengkapan fun games, sound system 3000W, dokumentasi video cinematic, dan koordinasi lokasi.',
      price: 7500000,
      cost_price: 4200000,
      stock: 12,
      image_url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80',
      created_at: '2026-10-01 10:00:00',
    },
    {
      id: 2,
      category_id: 1,
      name: 'Paket Intimate Wedding Organizer',
      slug: 'paket-intimate-wedding-organizer',
      description: 'Koordinasi pernikahan sakral 100-200 pax: tim rundown 8 personil profesional, koordinasi vendor dekorasi/katering/MUA, panduan gladi resik, dan pendampingan keluarga.',
      price: 12800000,
      cost_price: 7500000,
      stock: 6,
      image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80',
      created_at: '2026-10-02 10:00:00',
    },
    {
      id: 3,
      category_id: 1,
      name: 'Paket Seminar & Konferensi Hybrid',
      slug: 'paket-seminar-konferensi-hybrid',
      description: 'Produksi seminar kampus atau korporasi: setup live streaming multicam 4K, audio engineer, LED screen panggung, backdrop custom, dan sistem absensi QR code peserta.',
      price: 5600000,
      cost_price: 3100000,
      stock: 8,
      image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
      created_at: '2026-10-03 10:00:00',
    },
    {
      id: 4,
      category_id: 2,
      name: 'Tiket VIP Youth Creator Summit 2026',
      slug: 'tiket-vip-youth-creator-summit-2026',
      description: 'Akses kursi baris terdepan, lounge eksklusif ber-AC, sesi networking khusus bersama pembicara industri, ID pass lanyard akrilik, dan merchandise package.',
      price: 350000,
      cost_price: 140000,
      stock: 45,
      image_url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80',
      created_at: '2026-10-04 10:00:00',
    },
    {
      id: 5,
      category_id: 2,
      name: 'Tiket Reguler Youth Creator Summit 2026',
      slug: 'tiket-reguler-youth-creator-summit-2026',
      description: 'Tiket masuk seluruh sesi panel diskusi, sertifikat digital berbobot SKPI, lunch box, dan e-book materi presentasi lengkap.',
      price: 150000,
      cost_price: 60000,
      stock: 180,
      image_url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop&q=80',
      created_at: '2026-10-05 10:00:00',
    },
    {
      id: 6,
      category_id: 2,
      name: 'Tiket Presale Indie Wave Music Fest',
      slug: 'tiket-presale-indie-wave-music-fest',
      description: 'Pass masuk festival musik indie outdoor (1 hari), gelang barcode waterproof anti-rusak, gratis minuman selamat datang, dan akses area festival food court.',
      price: 125000,
      cost_price: 45000,
      stock: 120,
      image_url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80',
      created_at: '2026-10-06 10:00:00',
    },
    {
      id: 7,
      category_id: 3,
      name: 'Sewa Sound System 5000W + Mixer Digital',
      slug: 'sewa-sound-system-5000w-mixer-digital',
      description: 'Konfigurasi 4 speaker line array + 2 subwoofer 18 inch, mixer digital 16 channel, 4 unit wireless microphone UHF, kabel audio, serta 1 soundman standby 8 jam.',
      price: 2500000,
      cost_price: 950000,
      stock: 4,
      image_url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&auto=format&fit=crop&q=80',
      created_at: '2026-10-07 10:00:00',
    },
    {
      id: 8,
      category_id: 3,
      name: 'Paket Panggung Lighting & Special FX',
      slug: 'paket-panggung-lighting-special-fx',
      description: '8 unit moving head beam 230W, 12 unit par LED RGBW full colour, 2 unit smoke hazzer machine, DMX controller, dan operator lighting profesional.',
      price: 3200000,
      cost_price: 1200000,
      stock: 3,
      image_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80',
      created_at: '2026-10-08 10:00:00',
    },
  ],
  orders: [
    {
      id: 1,
      order_number: 'INV-20261012-001',
      user_id: 2,
      customer_name: 'Budi Pratama (PT Sinar Mandiri)',
      customer_email: 'user@entrepreneur.id',
      customer_phone: '085712349988',
      customer_address: 'Puncak Resort Highland, Bogor (Venue Outbound)',
      subtotal: 7500000,
      tax_amount: 0,
      shipping_cost: 0,
      total_amount: 7500000,
      total_cost: 4200000,
      payment_method: 'BCA_VA',
      payment_status: 'paid',
      order_status: 'completed',
      payment_reference: 'BCA-88901234001',
      paid_at: '2026-10-12 14:32:00',
      created_at: '2026-10-12 14:28:10',
    },
    {
      id: 2,
      order_number: 'INV-20261020-002',
      user_id: 3,
      customer_name: 'Farhan & Nabila',
      customer_email: 'nabila@gmail.com',
      customer_phone: '081900112233',
      customer_address: 'Gedung Arsip Nasional RI, Jl. Gajah Mada No. 111, Jakarta Barat',
      subtotal: 12800000,
      tax_amount: 0,
      shipping_cost: 0,
      total_amount: 12800000,
      total_cost: 7500000,
      payment_method: 'MANDIRI_VA',
      payment_status: 'paid',
      order_status: 'completed',
      payment_reference: 'MDR-77889922001',
      paid_at: '2026-10-20 09:15:20',
      created_at: '2026-10-20 09:10:00',
    },
    {
      id: 3,
      order_number: 'INV-20261027-003',
      user_id: 2,
      customer_name: 'BEM FEB Universitas Indonesia',
      customer_email: 'user@entrepreneur.id',
      customer_phone: '085712349988',
      customer_address: 'Auditorium Gd. Prof. Sumitro Djojohadikusumo, Kampus UI Depok',
      subtotal: 3200000,
      tax_amount: 0,
      shipping_cost: 0,
      total_amount: 3200000,
      total_cost: 1230000,
      payment_method: 'QRIS',
      payment_status: 'paid',
      order_status: 'completed',
      payment_reference: 'QRIS-REF-998127',
      paid_at: '2026-10-27 16:45:00',
      created_at: '2026-10-27 16:40:00',
    },
    {
      id: 4,
      order_number: 'INV-20261101-004',
      user_id: 3,
      customer_name: 'Danu Prasetyo',
      customer_email: 'danu@gmail.com',
      customer_phone: '081822334455',
      customer_address: 'Jl. Tebet Timur Dalam No. 12, Jakarta Selatan',
      subtotal: 600000,
      tax_amount: 0,
      shipping_cost: 0,
      total_amount: 600000,
      total_cost: 240000,
      payment_method: 'GOPAY',
      payment_status: 'paid',
      order_status: 'completed',
      payment_reference: 'GOPAY-SETTLED-882',
      paid_at: '2026-11-01 11:20:00',
      created_at: '2026-11-01 11:12:00',
    },
    {
      id: 5,
      order_number: 'INV-20261102-005',
      user_id: 2,
      customer_name: 'Komunitas Desain Kreatif',
      customer_email: 'user@entrepreneur.id',
      customer_phone: '085712349988',
      customer_address: 'Creative Hub Block M, Jakarta Selatan',
      subtotal: 5600000,
      tax_amount: 0,
      shipping_cost: 0,
      total_amount: 5600000,
      total_cost: 3100000,
      payment_method: 'QRIS',
      payment_status: 'paid',
      order_status: 'completed',
      payment_reference: 'QRIS-SETTLED-441',
      paid_at: '2026-11-02 20:15:00',
      created_at: '2026-11-02 20:10:00',
    },
    {
      id: 6,
      order_number: 'INV-20261103-006',
      user_id: 2,
      customer_name: 'PT Mega Finansial Prima',
      customer_email: 'corporate.event@megafinansial.co.id',
      customer_phone: '081288992211',
      customer_address: 'Grand Ballroom Hotel Ritz Carlton Pacific Place, Jakarta Selatan',
      subtotal: 10000000,
      tax_amount: 0,
      shipping_cost: 0,
      total_amount: 10000000,
      total_cost: 5150000,
      payment_method: 'BCA_VA',
      payment_status: 'paid',
      order_status: 'completed',
      payment_reference: 'BCA-88901234006',
      paid_at: '2026-11-03 10:22:00',
      created_at: '2026-11-03 10:15:00',
    },
    {
      id: 7,
      order_number: 'INV-20261104-007',
      user_id: 3,
      customer_name: 'Rian Pratama',
      customer_email: 'rian.pratama@gmail.com',
      customer_phone: '081377889900',
      customer_address: 'Apartemen Sudirman Park Tower A, Jakarta Pusat',
      subtotal: 1500000,
      tax_amount: 0,
      shipping_cost: 0,
      total_amount: 1500000,
      total_cost: 600000,
      payment_method: 'QRIS',
      payment_status: 'paid',
      order_status: 'completed',
      payment_reference: 'QRIS-SETTLED-902',
      paid_at: '2026-11-04 14:08:00',
      created_at: '2026-11-04 14:05:00',
    },
    {
      id: 8,
      order_number: 'INV-20261105-008',
      user_id: 2,
      customer_name: 'Dokter & Tenaga Medis Jakarta',
      customer_email: 'hendra.medika@gmail.com',
      customer_phone: '081122334455',
      customer_address: 'Hotel Shangri-La Jakarta, Kota BNI, Jl. Jend. Sudirman',
      subtotal: 5600000,
      tax_amount: 0,
      shipping_cost: 0,
      total_amount: 5600000,
      total_cost: 3100000,
      payment_method: 'MANDIRI_VA',
      payment_status: 'paid',
      order_status: 'completed',
      payment_reference: 'MDR-77889922008',
      paid_at: '2026-11-05 08:38:00',
      created_at: '2026-11-05 08:30:00',
    },
    {
      id: 9,
      order_number: 'INV-20261106-009',
      user_id: 3,
      customer_name: 'Clarissa & Hendra',
      customer_email: 'clarissa.wedding@gmail.com',
      customer_phone: '081988776655',
      customer_address: 'Plataran Kinandari, Jl. Jagakarsa Raya, Jakarta Selatan',
      subtotal: 12800000,
      tax_amount: 0,
      shipping_cost: 0,
      total_amount: 12800000,
      total_cost: 7500000,
      payment_method: 'BRI_VA',
      payment_status: 'paid',
      order_status: 'completed',
      payment_reference: 'BRI-33445566009',
      paid_at: '2026-11-06 13:25:00',
      created_at: '2026-11-06 13:20:00',
    },
    {
      id: 10,
      order_number: 'INV-20261107-010',
      user_id: 2,
      customer_name: 'KINETIK Music Fest Community',
      customer_email: 'community@kinetik.id',
      customer_phone: '081299001122',
      customer_address: 'Plaza Parkir Timur Senayan, Gelora Bung Karno, Jakarta',
      subtotal: 3500000,
      tax_amount: 0,
      shipping_cost: 0,
      total_amount: 3500000,
      total_cost: 1400000,
      payment_method: 'BNI_VA',
      payment_status: 'paid',
      order_status: 'completed',
      payment_reference: 'BNI-55667788010',
      paid_at: '2026-11-07 11:05:00',
      created_at: '2026-11-07 11:00:00',
    },
    {
      id: 11,
      order_number: 'INV-20261108-011',
      user_id: 2,
      customer_name: 'PT Telko Nusantara Jaya',
      customer_email: 'procurement@telkonusantara.co.id',
      customer_phone: '081199332211',
      customer_address: 'Auditorium Gd. Telko Smart Hub Lt. 5, Jl. Gatot Subroto',
      subtotal: 5700000,
      tax_amount: 0,
      shipping_cost: 0,
      total_amount: 5700000,
      total_cost: 2150000,
      payment_method: 'BCA_VA',
      payment_status: 'paid',
      order_status: 'completed',
      payment_reference: 'BCA-88901234011',
      paid_at: '2026-11-08 09:46:00',
      created_at: '2026-11-08 09:40:00',
    },
    {
      id: 12,
      order_number: 'INV-20261109-012',
      user_id: 3,
      customer_name: 'Aliansi Mahasiswa Kreatif',
      customer_email: 'aliansi.kreatif@gmail.com',
      customer_phone: '085611223344',
      customer_address: 'Kampus Trisakti, Jl. Kyai Tapa Grogol, Jakarta Barat',
      subtotal: 1750000,
      tax_amount: 0,
      shipping_cost: 0,
      total_amount: 1750000,
      total_cost: 700000,
      payment_method: 'GOPAY',
      payment_status: 'paid',
      order_status: 'completed',
      payment_reference: 'GOPAY-SETTLED-912',
      paid_at: '2026-11-09 15:14:00',
      created_at: '2026-11-09 15:10:00',
    },
    {
      id: 13,
      order_number: 'INV-20261110-013',
      user_id: 2,
      customer_name: 'PT Astra Graphia Kreasi',
      customer_email: 'procurement@astragraphia.co.id',
      customer_phone: '081299884433',
      customer_address: 'Kramat Raya No. 43, Senen, Jakarta Pusat',
      subtotal: 5700000,
      tax_amount: 0,
      shipping_cost: 0,
      total_amount: 5700000,
      total_cost: 2150000,
      payment_method: 'MANDIRI_VA',
      payment_status: 'paid',
      order_status: 'completed',
      payment_reference: 'MDR-77889922013',
      paid_at: '2026-11-10 10:58:00',
      created_at: '2026-11-10 10:50:00',
    },
    {
      id: 14,
      order_number: 'INV-20261111-014',
      user_id: 3,
      customer_name: 'Arya & Stephanie Wedding',
      customer_email: 'arya.stephanie@gmail.com',
      customer_phone: '081833445566',
      customer_address: 'The Tribrata Grand Ballroom Darmawangsa, Jakarta Selatan',
      subtotal: 15300000,
      tax_amount: 0,
      shipping_cost: 0,
      total_amount: 15300000,
      total_cost: 8450000,
      payment_method: 'BCA_VA',
      payment_status: 'paid',
      order_status: 'completed',
      payment_reference: 'BCA-88901234014',
      paid_at: '2026-11-11 11:20:00',
      created_at: '2026-11-11 11:15:00',
    },
    {
      id: 15,
      order_number: 'INV-20261111-015',
      user_id: 3,
      customer_name: 'Dhimas Arya Putra',
      customer_email: 'dhimas.arya@gmail.com',
      customer_phone: '081911224455',
      customer_address: 'Jl. Radio Dalam No. 18, Gandaria, Jakarta Selatan',
      subtotal: 900000,
      tax_amount: 0,
      shipping_cost: 0,
      total_amount: 900000,
      total_cost: 360000,
      payment_method: 'QRIS',
      payment_status: 'paid',
      order_status: 'completed',
      payment_reference: 'QRIS-SETTLED-915',
      paid_at: '2026-11-11 16:34:00',
      created_at: '2026-11-11 16:30:00',
    },
    {
      id: 16,
      order_number: 'INV-20261112-016',
      user_id: 2,
      customer_name: 'Bank Mandiri Kanwil Jakarta',
      customer_email: 'event.mandiri@bankmandiri.co.id',
      customer_phone: '081244556677',
      customer_address: 'Plaza Mandiri Lt. 3, Jl. Gatot Subroto Kav. 36-38, Jakarta',
      subtotal: 5600000,
      tax_amount: 0,
      shipping_cost: 0,
      total_amount: 5600000,
      total_cost: 3100000,
      payment_method: 'MANDIRI_VA',
      payment_status: 'paid',
      order_status: 'completed',
      payment_reference: 'MDR-77889922016',
      paid_at: '2026-11-12 09:28:00',
      created_at: '2026-11-12 09:20:00',
    },
    {
      id: 17,
      order_number: 'INV-20261112-017',
      user_id: 2,
      customer_name: 'Komunitas Startup Batavia',
      customer_email: 'halo@startupbatavia.id',
      customer_phone: '081700998877',
      customer_address: 'GoWork Coworking Space fX Sudirman Lt. 7, Jakarta Pusat',
      subtotal: 7500000,
      tax_amount: 0,
      shipping_cost: 0,
      total_amount: 7500000,
      total_cost: 4200000,
      payment_method: 'BNI_VA',
      payment_status: 'paid',
      order_status: 'completed',
      payment_reference: 'BNI-55667788017',
      paid_at: '2026-11-12 14:45:00',
      created_at: '2026-11-12 14:40:00',
    },
    {
      id: 18,
      order_number: 'INV-20261113-018',
      user_id: 2,
      customer_name: 'Yayasan Cinta Seni Budaya',
      customer_email: 'harmoni.nusantara@gmail.com',
      customer_phone: '081388001122',
      customer_address: 'Gedung Kesenian Jakarta, Jl. Gedung Kesenian No. 1, Pasar Baru',
      subtotal: 5700000,
      tax_amount: 0,
      shipping_cost: 0,
      total_amount: 5700000,
      total_cost: 2150000,
      payment_method: 'QRIS',
      payment_status: 'unpaid',
      order_status: 'pending',
      payment_reference: 'QRIS-PENDING-918',
      paid_at: null,
      created_at: '2026-11-13 00:10:00',
    },
  ],
  order_items: [
    { id: 1, order_id: 1, product_id: 1, product_name: 'Paket Corporate Gathering & Outbound', price: 7500000, cost_price: 4200000, quantity: 1, subtotal: 7500000 },
    { id: 2, order_id: 2, product_id: 2, product_name: 'Paket Intimate Wedding Organizer', price: 12800000, cost_price: 7500000, quantity: 1, subtotal: 12800000 },
    { id: 3, order_id: 3, product_id: 7, product_name: 'Sewa Sound System 5000W + Mixer Digital', price: 2500000, cost_price: 950000, quantity: 1, subtotal: 2500000 },
    { id: 4, order_id: 3, product_id: 4, product_name: 'Tiket VIP Youth Creator Summit 2026', price: 350000, cost_price: 140000, quantity: 2, subtotal: 700000 },
    { id: 5, order_id: 4, product_id: 5, product_name: 'Tiket Reguler Youth Creator Summit 2026', price: 150000, cost_price: 60000, quantity: 4, subtotal: 600000 },
    { id: 6, order_id: 5, product_id: 3, product_name: 'Paket Seminar & Konferensi Hybrid', price: 5600000, cost_price: 3100000, quantity: 1, subtotal: 5600000 },
    { id: 7, order_id: 6, product_id: 1, product_name: 'Paket Corporate Gathering & Outbound', price: 7500000, cost_price: 4200000, quantity: 1, subtotal: 7500000 },
    { id: 8, order_id: 6, product_id: 7, product_name: 'Sewa Sound System 5000W + Mixer Digital', price: 2500000, cost_price: 950000, quantity: 1, subtotal: 2500000 },
    { id: 9, order_id: 7, product_id: 5, product_name: 'Tiket Reguler Youth Creator Summit 2026', price: 150000, cost_price: 60000, quantity: 10, subtotal: 1500000 },
    { id: 10, order_id: 8, product_id: 3, product_name: 'Paket Seminar & Konferensi Hybrid', price: 5600000, cost_price: 3100000, quantity: 1, subtotal: 5600000 },
    { id: 11, order_id: 9, product_id: 2, product_name: 'Paket Intimate Wedding Organizer', price: 12800000, cost_price: 7500000, quantity: 1, subtotal: 12800000 },
    { id: 12, order_id: 10, product_id: 4, product_name: 'Tiket VIP Youth Creator Summit 2026', price: 350000, cost_price: 140000, quantity: 10, subtotal: 3500000 },
    { id: 13, order_id: 11, product_id: 8, product_name: 'Paket Panggung Lighting & Special FX', price: 3200000, cost_price: 1200000, quantity: 1, subtotal: 3200000 },
    { id: 14, order_id: 11, product_id: 7, product_name: 'Sewa Sound System 5000W + Mixer Digital', price: 2500000, cost_price: 950000, quantity: 1, subtotal: 2500000 },
    { id: 15, order_id: 12, product_id: 4, product_name: 'Tiket VIP Youth Creator Summit 2026', price: 350000, cost_price: 140000, quantity: 5, subtotal: 1750000 },
    { id: 16, order_id: 13, product_id: 8, product_name: 'Paket Panggung Lighting & Special FX', price: 3200000, cost_price: 1200000, quantity: 1, subtotal: 3200000 },
    { id: 17, order_id: 13, product_id: 7, product_name: 'Sewa Sound System 5000W + Mixer Digital', price: 2500000, cost_price: 950000, quantity: 1, subtotal: 2500000 },
    { id: 18, order_id: 14, product_id: 2, product_name: 'Paket Intimate Wedding Organizer', price: 12800000, cost_price: 7500000, quantity: 1, subtotal: 12800000 },
    { id: 19, order_id: 14, product_id: 7, product_name: 'Sewa Sound System 5000W + Mixer Digital', price: 2500000, cost_price: 950000, quantity: 1, subtotal: 2500000 },
    { id: 20, order_id: 15, product_id: 5, product_name: 'Tiket Reguler Youth Creator Summit 2026', price: 150000, cost_price: 60000, quantity: 6, subtotal: 900000 },
    { id: 21, order_id: 16, product_id: 3, product_name: 'Paket Seminar & Konferensi Hybrid', price: 5600000, cost_price: 3100000, quantity: 1, subtotal: 5600000 },
    { id: 22, order_id: 17, product_id: 1, product_name: 'Paket Corporate Gathering & Outbound', price: 7500000, cost_price: 4200000, quantity: 1, subtotal: 7500000 },
    { id: 23, order_id: 18, product_id: 8, product_name: 'Paket Panggung Lighting & Special FX', price: 3200000, cost_price: 1200000, quantity: 1, subtotal: 3200000 },
    { id: 24, order_id: 18, product_id: 7, product_name: 'Sewa Sound System 5000W + Mixer Digital', price: 2500000, cost_price: 950000, quantity: 1, subtotal: 2500000 },
  ],
  expenses: [
    {
      id: 1,
      expense_title: 'Honor 6 Kru Lapangan & Soundman (Event PT Sinar Mandiri)',
      category: 'Honor Kru & SDM',
      amount: 1800000,
      expense_date: '2026-10-12',
      notes: 'Honor kerja 2 hari 1 malam di lokasi outbound Puncak',
    },
    {
      id: 2,
      expense_title: 'Sewa Genset Silent 40 KVA + Solar 50 Liter',
      category: 'Sewa Alat & Genset',
      amount: 1250000,
      expense_date: '2026-10-19',
      notes: 'Genset cadangan listrik venue outdoor Gedung Arsip',
    },
    {
      id: 3,
      expense_title: 'Cetak 300 Gelang Barcode & ID Card Panitia',
      category: 'Produksi & Perlengkapan',
      amount: 450000,
      expense_date: '2026-10-25',
      notes: 'Gelang synthetic anti-sobek untuk gate masuk tiket',
    },
    {
      id: 4,
      expense_title: 'Biaya Perizinan Keramaian Polsek & Satpol PP',
      category: 'Perizinan & Administrasi',
      amount: 500000,
      expense_date: '2026-10-28',
      notes: 'Surat izin izin keramaian konser musik festival',
    },
    {
      id: 5,
      expense_title: 'Promosi Iklan Instagram Ads Tiket Youth Summit',
      category: 'Pemasaran & Promosi',
      amount: 350000,
      expense_date: '2026-11-01',
      notes: 'Iklan bersponsor 7 hari penargetan mahasiswa Jabodetabek',
    },
    {
      id: 6,
      expense_title: 'Fee Transaksi Payment Gateway KINETIK Pay Periode Okt',
      category: 'Finansial & Biaya Admin',
      amount: 65000,
      expense_date: '2026-11-01',
      notes: 'Biaya administrasi MDR QRIS dan Virtual Account',
    },
  ],
  vendor_jobs: [
    {
      id: 1,
      spk_number: 'SPK-VND-2026-001',
      event_name: 'Synchronize Indie Music Festival 2026',
      client_name: 'KINETIK Festival Production',
      venue: 'Tribrata Grand Ballroom & Outdoor Stage, Jakarta',
      load_in_date: '2026-11-18 08:00',
      show_date: '2026-11-20 16:00',
      scope_work: 'Sewa Sound System Line Array 20.000W, Rigging Stage 14x10m, dan Lighting Moving Head Beam 230',
      crew_assigned: '6 Teknisi Rigging & 2 Sound Engineers',
      po_amount: 18500000,
      paid_amount: 9250000,
      payment_status: 'DP 50% Lunas',
      job_status: 'loading_venue',
      notes: 'Genset 80 kVA standby H-1 pukul 14.00 WIB untuk soundcheck artis utama.'
    },
    {
      id: 2,
      spk_number: 'SPK-VND-2026-002',
      event_name: 'Corporate Signature Gathering PT Sinar Mandiri',
      client_name: 'PT Sinar Mandiri',
      venue: 'Grand Ballroom Hotel Mulia Senayan, Jakarta',
      load_in_date: '2026-11-24 22:00',
      show_date: '2026-11-25 09:00',
      scope_work: 'LED Videotron P3.9 Indoor 6x3.5m, Audio Conference 4.000W, Wireless Mic Shure 8 Channel',
      crew_assigned: '3 Teknisi LED Broadcast & 1 Operator Mixer',
      po_amount: 12000000,
      paid_amount: 12000000,
      payment_status: 'Lunas 100%',
      job_status: 'persiapan_alat',
      notes: 'Loading in malam hari setelah ballroom selesai dibersihkan oleh pihak hotel.'
    },
    {
      id: 3,
      spk_number: 'SPK-VND-2026-003',
      event_name: 'Wedding Gathering & Intimate Showcase',
      client_name: 'Nabila Anindita',
      venue: 'Plataran Dharmawangsa, Jakarta Selatan',
      load_in_date: '2026-12-04 06:00',
      show_date: '2026-12-04 18:00',
      scope_work: 'Acoustic Sound System FOH 5000W, Warm White Fairy Lighting & Ambient Pinspot',
      crew_assigned: '4 Kru Audio Visual & Dekorasi Rigging',
      po_amount: 8500000,
      paid_amount: 4250000,
      payment_status: 'DP 50% Lunas',
      job_status: 'menunggu_konfirmasi',
      notes: 'Kabel instalasi wajib ditutup carpet tape hitam rapi sesuai standar venue Plataran.'
    }
  ],
  vendor_stock: [
    {
      id: 1,
      name: 'LED Moving Head 350W Beam',
      category: 'Lighting',
      total_qty: 24,
      available_qty: 2,
      status: 'low_stock',
      daily_rate: 350000,
      image: '/figma/stage-lighting.png',
      notes: 'Stock is running low (2 left)',
      updated_at: '2h ago'
    },
    {
      id: 2,
      name: 'Wireless Microphone Shure Axient (Pair)',
      category: 'Audio',
      total_qty: 16,
      available_qty: 3,
      status: 'low_stock',
      daily_rate: 450000,
      image: '/figma/audio-equipment.png',
      notes: 'Stock is running low (3 left)',
      updated_at: '3h ago'
    },
    {
      id: 3,
      name: 'Stage Truss 2m Box Aluminium',
      category: 'Rigging',
      total_qty: 18,
      available_qty: 0,
      status: 'out_of_stock',
      daily_rate: 150000,
      image: '/figma/stage-rigging.png',
      notes: 'Out of stock (Tersewa di Tribrata)',
      updated_at: '5h ago'
    },
    {
      id: 4,
      name: 'L-Acoustics K2 Line Array Speaker',
      category: 'Audio',
      total_qty: 26,
      available_qty: 24,
      status: 'available',
      daily_rate: 1500000,
      image: '/figma/audio-equipment.png',
      notes: 'Available siap sewa',
      updated_at: '1d ago'
    },
    {
      id: 5,
      name: 'Videotron LED P3.9 Indoor Cabinet',
      category: 'Visual',
      total_qty: 28,
      available_qty: 24,
      status: 'available',
      daily_rate: 250000,
      image: '/figma/visual-led.png',
      notes: 'Available siap sewa',
      updated_at: '2d ago'
    },
    {
      id: 6,
      name: 'Genset Silent Perkins 80 kVA',
      category: 'Power',
      total_qty: 8,
      available_qty: 6,
      status: 'available',
      daily_rate: 2500000,
      image: '/figma/power-genset.png',
      notes: 'Available siap kirim',
      updated_at: '3d ago'
    }
  ],
  rental_orders: [
    {
      id: 1,
      order_id: '#RNT-20261107',
      event_name: 'KINETIK Music Festival',
      eo_name: 'KINETIK Festival Production',
      eo_contact: 'Reza (Director EO) • 081234567890',
      rental_date: 'Nov 15, 2026',
      duration: '3 Hari',
      status: 'Pending',
      total_amount: 18500000,
      items: 'Line Array 20kW, Moving Head 16x, Stage Rigging 14x10m',
      venue: 'Tribrata Grand Ballroom & Outdoor Stage, Jakarta',
      notes: 'Loading tgl 14 Nov pukul 21.00 WIB'
    },
    {
      id: 2,
      order_id: '#RNT-20261106',
      event_name: 'Tech Summit 2025',
      eo_name: 'Nusantara Creative EO',
      eo_contact: 'Dimas Pratama • 081388776655',
      rental_date: 'Nov 14, 2026',
      duration: '2 Hari',
      status: 'Confirmed',
      total_amount: 14000000,
      items: 'LED Videotron 6x3.5m, Audio Conference 4000W, Mic Wireless 8 Unit',
      venue: 'Grand Ballroom Hotel Mulia Senayan, Jakarta',
      notes: 'Rigging LED screen center stage'
    },
    {
      id: 3,
      order_id: '#RNT-20261105',
      event_name: 'Wedding Expo',
      eo_name: 'Royal Wedding Planner',
      eo_contact: 'Clara Wijaya • 081922334411',
      rental_date: 'Nov 13, 2026',
      duration: '4 Hari',
      status: 'Processing',
      total_amount: 9500000,
      items: 'Warm White Fairy Lighting & Ambient Pinspot, FOH Acoustic Audio',
      venue: 'Jakarta Convention Center (JCC) Hall B',
      notes: 'Pemasangan kabel rapih lantai'
    },
    {
      id: 4,
      order_id: '#RNT-20261104',
      event_name: 'Corporate Gathering',
      eo_name: 'Sinar Mandiri Enterprise',
      eo_contact: 'Budi Santoso • 085712349988',
      rental_date: 'Nov 12, 2026',
      duration: '1 Hari',
      status: 'Confirmed',
      total_amount: 11200000,
      items: 'Sound System 5000W, Lighting Par LED 12x, Genset 60kVA',
      venue: 'Pullman Ballroom Thamrin, Jakarta Pusat',
      notes: 'Soundcheck H-4 jam sebelum gala dinner'
    },
    {
      id: 5,
      order_id: '#RNT-20261103',
      event_name: 'Charity Concert',
      eo_name: 'Yayasan Harmoni Nusantara',
      eo_contact: 'Indah Kusuma • 081199882233',
      rental_date: 'Nov 11, 2026',
      duration: '1 Hari',
      status: 'Completed',
      total_amount: 7800000,
      items: 'Line Array Mini, Mixer Digital 32Ch, Microphone Set',
      venue: 'Teater Besar Taman Ismail Marzuki, Jakarta',
      notes: 'Bongkaran selesai tgl 12 Nov dini hari'
    }
  ],
  vendor_messages: [
    {
      id: 1,
      thread_id: 'thread-kinetik-fest',
      eo_name: 'KINETIK Festival Production',
      event_name: 'KINETIK Music Festival',
      last_message: 'Mantap, terima kasih konfirmasinya. SPK dan PO DP 50% sudah ditransfer finance.',
      last_time: '10:30 WIB',
      unread_count: 1,
      messages: [
        {
          id: 1,
          sender: 'admin',
          sender_name: 'Director Kinetik EO',
          message: 'Halo Raya Event Supply, untuk jadwal loading-in panggung utama festival kita majukan jadi tanggal 14 Nov malam jam 21.00 ya, apakah tim rigging siap?',
          time: '10:15 WIB'
        },
        {
          id: 2,
          sender: 'vendor',
          sender_name: 'Raya Event Supply',
          message: 'Siap Pak! Armada logistik truk dan kru rigging standby di lokasi Tribrata mulai pukul 20.30 WIB. Genset 80kVA juga sudah terkalibrasi siap jalan.',
          time: '10:22 WIB'
        },
        {
          id: 3,
          sender: 'admin',
          sender_name: 'Director Kinetik EO',
          message: 'Mantap, terima kasih konfirmasinya. SPK dan PO DP 50% sudah ditransfer finance.',
          time: '10:30 WIB'
        }
      ]
    },
    {
      id: 2,
      thread_id: 'thread-tech-summit',
      eo_name: 'Nusantara Creative EO',
      event_name: 'Tech Summit 2025',
      last_message: 'Sudah masuk checklist tim broadcast kami pak. Unit backup siap.',
      last_time: '09:05 WIB',
      unread_count: 0,
      messages: [
        {
          id: 1,
          sender: 'admin',
          sender_name: 'Dimas (Nusantara Creative)',
          message: 'Pagi tim Raya, mohon kabel HDMI fiber optik 50m dan switcher video disiapkan 1 unit cadangan di Hotel Mulia ya.',
          time: '08:45 WIB'
        },
        {
          id: 2,
          sender: 'vendor',
          sender_name: 'Raya Event Supply',
          message: 'Sudah masuk checklist tim broadcast kami pak. Unit backup siap.',
          time: '09:05 WIB'
        }
      ]
    },
    {
      id: 3,
      thread_id: 'thread-wedding-expo',
      eo_name: 'Royal Wedding Planner',
      event_name: 'Wedding Expo',
      last_message: 'Sudah dites di workshop, 10 roll lampu nyala sempurna dengan dimmer.',
      last_time: 'Kemarin',
      unread_count: 0,
      messages: [
        {
          id: 1,
          sender: 'admin',
          sender_name: 'Clara Wijaya (Royal Wedding)',
          message: 'Mohon update apakah fairy ambient lighting warm white sudah selesai uji coba?',
          time: 'Kemarin 16:30'
        },
        {
          id: 2,
          sender: 'vendor',
          sender_name: 'Raya Event Supply',
          message: 'Sudah dites di workshop, 10 roll lampu nyala sempurna dengan dimmer.',
          time: 'Kemarin 17:10'
        }
      ]
    }
  ],
};

let memoryStore = global._kinetikMemoryStore || null;

function ensureStoreFile() {
  if (memoryStore) {
    return memoryStore;
  }

  // 1. Try reading existing writable store file
  if (fs.existsSync(WRITABLE_STORE_FILE)) {
    try {
      const raw = fs.readFileSync(WRITABLE_STORE_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (!parsed.order_items) parsed.order_items = INITIAL_DATA.order_items;
      if (!parsed.expenses) parsed.expenses = INITIAL_DATA.expenses;
      if (!parsed.vendor_jobs) parsed.vendor_jobs = INITIAL_DATA.vendor_jobs;
      if (!parsed.vendor_stock) parsed.vendor_stock = INITIAL_DATA.vendor_stock;
      if (!parsed.rental_orders) parsed.rental_orders = INITIAL_DATA.rental_orders;
      if (!parsed.vendor_messages) parsed.vendor_messages = INITIAL_DATA.vendor_messages;
      if (!parsed.users.some(u => u.email === 'vendor@entrepreneur.id')) {
        const vendorUser = INITIAL_DATA.users.find(u => u.email === 'vendor@entrepreneur.id');
        if (vendorUser) parsed.users.push(vendorUser);
      }
      memoryStore = parsed;
      global._kinetikMemoryStore = memoryStore;
      return memoryStore;
    } catch (err) {
      // Fall through to seed reading
    }
  }

  // 2. Try reading bundled seed file if different
  let seed = INITIAL_DATA;
  if (WRITABLE_STORE_FILE !== BUNDLED_STORE_FILE && fs.existsSync(BUNDLED_STORE_FILE)) {
    try {
      const raw = fs.readFileSync(BUNDLED_STORE_FILE, 'utf-8');
      seed = JSON.parse(raw);
    } catch (err) {
      seed = INITIAL_DATA;
    }
  }

  memoryStore = JSON.parse(JSON.stringify(seed));
  global._kinetikMemoryStore = memoryStore;

  // 3. Attempt to persist seed to WRITABLE_STORE_FILE (e.g. in /tmp)
  try {
    const dir = path.dirname(WRITABLE_STORE_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(WRITABLE_STORE_FILE, JSON.stringify(memoryStore, null, 2), 'utf-8');
  } catch (err) {
    // Read-only filesystem, memoryStore keeps state safe
  }

  return memoryStore;
}

function saveStoreFile(data) {
  memoryStore = data;
  global._kinetikMemoryStore = data;
  try {
    const dir = path.dirname(WRITABLE_STORE_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(WRITABLE_STORE_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    // If disk write is prevented (EROFS), memoryStore in global object keeps state intact
  }
}

let mysqlPool = null;
let isMysqlAvailable = null;

export async function getDbConnection() {
  if (isMysqlAvailable === false) {
    return null;
  }

  if (!mysqlPool) {
    try {
      mysqlPool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'digital_entrepreneurship',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        connectTimeout: 2000,
      });

      await mysqlPool.query('SELECT 1 as test');
      isMysqlAvailable = true;
      return mysqlPool;
    } catch (err) {
      isMysqlAvailable = false;
      mysqlPool = null;
      return null;
    }
  }

  return mysqlPool;
}

export async function getDatabaseStatus() {
  try {
    const pool = await getDbConnection();
    if (pool && isMysqlAvailable) {
      return {
        connected: true,
        engine: 'MySQL (phpMyAdmin)',
        message: 'Terhubung langsung ke MySQL Database (localhost:3306).',
      };
    }
  } catch (err) {
    // ignore
  }

  return {
    connected: false,
    engine: 'JSON Store Fallback',
    message: 'MySQL belum aktif. Menggunakan data store lokal otomatis. Silakan import database.sql ke phpMyAdmin untuk sinkronisasi penuh.',
  };
}

export async function getAllCategories() {
  const pool = await getDbConnection();
  if (pool && isMysqlAvailable) {
    try {
      const [rows] = await pool.query('SELECT * FROM categories ORDER BY id ASC');
      return rows;
    } catch (err) {
      // fallback
    }
  }
  const store = ensureStoreFile();
  return store.categories;
}

export async function getAllProducts(categoryId) {
  const pool = await getDbConnection();
  if (pool && isMysqlAvailable) {
    try {
      let query = `
        SELECT p.*, c.name as category_name 
        FROM products p 
        LEFT JOIN categories c ON p.category_id = c.id
      `;
      const params = [];
      if (categoryId) {
        query += ' WHERE p.category_id = ?';
        params.push(categoryId);
      }
      query += ' ORDER BY p.id ASC';
      const [rows] = await pool.query(query, params);
      return rows;
    } catch (err) {
      // fallback
    }
  }
  const store = ensureStoreFile();
  let list = store.products.map(p => {
    const cat = store.categories.find(c => c.id === p.category_id);
    return { ...p, category_name: cat ? cat.name : 'Umum' };
  });
  if (categoryId) {
    list = list.filter(p => p.category_id === Number(categoryId));
  }
  return list;
}

export async function getProductById(id) {
  const pool = await getDbConnection();
  if (pool && isMysqlAvailable) {
    try {
      const [rows] = await pool.query('SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ?', [id]);
      return rows[0] || null;
    } catch (err) {
      // fallback
    }
  }
  const store = ensureStoreFile();
  const prod = store.products.find(p => p.id === Number(id));
  if (!prod) return null;
  const cat = store.categories.find(c => c.id === prod.category_id);
  return { ...prod, category_name: cat ? cat.name : 'Umum' };
}

export async function createProduct(prod) {
  const pool = await getDbConnection();
  if (pool && isMysqlAvailable) {
    try {
      const [res] = await pool.query(
        'INSERT INTO products (category_id, name, slug, description, price, cost_price, stock, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [prod.category_id, prod.name, prod.slug, prod.description || '', prod.price, prod.cost_price, prod.stock, prod.image_url || '']
      );
      return { ...prod, id: res.insertId, created_at: new Date().toISOString() };
    } catch (err) {
      // fallback
    }
  }
  const store = ensureStoreFile();
  const newId = store.products.length > 0 ? Math.max(...store.products.map(p => p.id)) + 1 : 1;
  const newProduct = {
    ...prod,
    id: newId,
    created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
  };
  store.products.push(newProduct);
  saveStoreFile(store);
  return newProduct;
}

export async function updateProduct(id, prod) {
  const numId = Number(id);
  const pool = await getDbConnection();
  if (pool && isMysqlAvailable) {
    try {
      await pool.query(
        'UPDATE products SET category_id = COALESCE(?, category_id), name = COALESCE(?, name), price = COALESCE(?, price), cost_price = COALESCE(?, cost_price), stock = COALESCE(?, stock), description = COALESCE(?, description), image_url = COALESCE(?, image_url) WHERE id = ?',
        [prod.category_id, prod.name, prod.price, prod.cost_price, prod.stock, prod.description, prod.image_url, numId]
      );
      return getProductById(numId);
    } catch (err) {
      // fallback
    }
  }
  const store = ensureStoreFile();
  const index = store.products.findIndex(p => p.id === numId);
  if (index === -1) return null;
  store.products[index] = { ...store.products[index], ...prod };
  saveStoreFile(store);
  return store.products[index];
}

export async function deleteProduct(id) {
  const numId = Number(id);
  const pool = await getDbConnection();
  if (pool && isMysqlAvailable) {
    try {
      await pool.query('DELETE FROM products WHERE id = ?', [numId]);
      return true;
    } catch (err) {
      // fallback
    }
  }
  const store = ensureStoreFile();
  store.products = store.products.filter(p => p.id !== numId);
  saveStoreFile(store);
  return true;
}

export async function getUserByEmail(email) {
  const pool = await getDbConnection();
  if (pool && isMysqlAvailable) {
    try {
      const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
      return rows[0] || null;
    } catch (err) {
      // fallback
    }
  }
  const store = ensureStoreFile();
  return store.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
}

export async function getUserById(id) {
  const numId = Number(id);
  const pool = await getDbConnection();
  if (pool && isMysqlAvailable) {
    try {
      const [rows] = await pool.query('SELECT id, name, email, role, phone, address, created_at FROM users WHERE id = ?', [numId]);
      return rows[0] || null;
    } catch (err) {
      // fallback
    }
  }
  const store = ensureStoreFile();
  const u = store.users.find(user => user.id === numId);
  if (!u) return null;
  const { password, ...safeUser } = u;
  return safeUser;
}

export async function createUser(userData) {
  const pool = await getDbConnection();
  if (pool && isMysqlAvailable) {
    try {
      const [res] = await pool.query(
        'INSERT INTO users (name, email, password, role, phone, address) VALUES (?, ?, ?, ?, ?, ?)',
        [userData.name, userData.email, userData.password, userData.role, userData.phone || '', userData.address || '']
      );
      return { ...userData, id: res.insertId, created_at: new Date().toISOString() };
    } catch (err) {
      // fallback
    }
  }
  const store = ensureStoreFile();
  const newId = store.users.length > 0 ? Math.max(...store.users.map(u => u.id)) + 1 : 1;
  const newUser = {
    ...userData,
    id: newId,
    created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
  };
  store.users.push(newUser);
  saveStoreFile(store);
  return newUser;
}

export async function getAllOrders(userId) {
  const pool = await getDbConnection();
  if (pool && isMysqlAvailable) {
    try {
      let query = 'SELECT * FROM orders';
      const params = [];
      if (userId) {
        query += ' WHERE user_id = ?';
        params.push(userId);
      }
      query += ' ORDER BY id DESC';
      const [orderRows] = await pool.query(query, params);

      const ordersWithItems = [];
      for (const ord of orderRows) {
        const [itemRows] = await pool.query('SELECT * FROM order_items WHERE order_id = ?', [ord.id]);
        ordersWithItems.push({ ...ord, items: itemRows });
      }
      return ordersWithItems;
    } catch (err) {
      // fallback
    }
  }
  const store = ensureStoreFile();
  let list = [...store.orders].reverse();
  if (userId) {
    list = list.filter(o => o.user_id === Number(userId));
  }
  const orderItemsList = store.order_items || [];
  return list.map(o => ({
    ...o,
    items: orderItemsList.filter(item => item.order_id === o.id),
  }));
}

export async function getOrderByNumber(orderNumber) {
  const pool = await getDbConnection();
  if (pool && isMysqlAvailable) {
    try {
      const [orderRows] = await pool.query('SELECT * FROM orders WHERE order_number = ?', [orderNumber]);
      if (!orderRows[0]) return null;
      const order = orderRows[0];
      const [itemRows] = await pool.query('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
      return { ...order, items: itemRows };
    } catch (err) {
      // fallback
    }
  }
  const store = ensureStoreFile();
  const order = store.orders.find(o => o.order_number === orderNumber);
  if (!order) return null;
  const orderItemsList = store.order_items || [];
  const items = orderItemsList.filter(i => i.order_id === order.id);
  return { ...order, items };
}

export async function createOrder(orderData, items) {
  const pool = await getDbConnection();
  if (pool && isMysqlAvailable) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      const [orderRes] = await conn.query(
        `INSERT INTO orders 
        (order_number, user_id, customer_name, customer_email, customer_phone, customer_address, 
         subtotal, tax_amount, shipping_cost, total_amount, total_cost, payment_method, 
         payment_status, order_status, payment_reference, paid_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          orderData.order_number,
          orderData.user_id || null,
          orderData.customer_name,
          orderData.customer_email,
          orderData.customer_phone,
          orderData.customer_address,
          orderData.subtotal,
          orderData.tax_amount,
          orderData.shipping_cost,
          orderData.total_amount,
          orderData.total_cost,
          orderData.payment_method,
          orderData.payment_status,
          orderData.order_status,
          orderData.payment_reference || null,
          orderData.paid_at || null,
        ]
      );

      const orderId = orderRes.insertId;
      const createdItems = [];

      for (const it of items) {
        const subtotal = it.price * it.quantity;
        const [itemRes] = await conn.query(
          'INSERT INTO order_items (order_id, product_id, product_name, price, cost_price, quantity, subtotal) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [orderId, it.product_id, it.product_name, it.price, it.cost_price, it.quantity, subtotal]
        );
        createdItems.push({
          id: itemRes.insertId,
          order_id: orderId,
          product_id: it.product_id,
          product_name: it.product_name,
          price: it.price,
          cost_price: it.cost_price,
          quantity: it.quantity,
          subtotal,
        });

        await conn.query('UPDATE products SET stock = GREATEST(0, stock - ?) WHERE id = ?', [it.quantity, it.product_id]);
      }

      await conn.commit();
      conn.release();

      return {
        ...orderData,
        id: orderId,
        created_at: new Date().toISOString(),
        items: createdItems,
      };
    } catch (err) {
      await conn.rollback();
      conn.release();
    }
  }

  const store = ensureStoreFile();
  const newOrderId = store.orders.length > 0 ? Math.max(...store.orders.map(o => o.id)) + 1 : 1;
  const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

  const newOrder = {
    ...orderData,
    id: newOrderId,
    created_at: now,
  };

  const createdItems = [];
  let nextItemId = store.order_items.length > 0 ? Math.max(...store.order_items.map(i => i.id)) + 1 : 1;

  for (const it of items) {
    const itemSubtotal = it.price * it.quantity;
    const oi = {
      id: nextItemId++,
      order_id: newOrderId,
      product_id: it.product_id,
      product_name: it.product_name,
      price: it.price,
      cost_price: it.cost_price,
      quantity: it.quantity,
      subtotal: itemSubtotal,
    };
    createdItems.push(oi);
    store.order_items.push(oi);

    const pIndex = store.products.findIndex(p => p.id === it.product_id);
    if (pIndex !== -1) {
      store.products[pIndex].stock = Math.max(0, store.products[pIndex].stock - it.quantity);
    }
  }

  store.orders.push(newOrder);
  saveStoreFile(store);

  return { ...newOrder, items: createdItems };
}

export async function updateOrderStatus(orderNumber, paymentStatus, orderStatus) {
  const pool = await getDbConnection();
  const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
  const paidAt = paymentStatus === 'paid' ? now : null;

  if (pool && isMysqlAvailable) {
    try {
      await pool.query(
        'UPDATE orders SET payment_status = ?, order_status = ?, paid_at = COALESCE(?, paid_at) WHERE order_number = ?',
        [paymentStatus, orderStatus, paidAt, orderNumber]
      );
      return getOrderByNumber(orderNumber);
    } catch (err) {
      // fallback
    }
  }

  const store = ensureStoreFile();
  const order = store.orders.find(o => o.order_number === orderNumber);
  if (!order) return null;

  order.payment_status = paymentStatus;
  order.order_status = orderStatus;
  if (paidAt && !order.paid_at) {
    order.paid_at = paidAt;
  }
  saveStoreFile(store);

  const orderItemsList = store.order_items || [];
  const items = orderItemsList.filter(i => i.order_id === order.id);
  return { ...order, items };
}

export async function getSalesReport(filter = {}) {
  const allOrders = await getAllOrders();
  
  let filtered = allOrders.filter(o => {
    const orderDate = (o.created_at || '').split(' ')[0];
    if (filter.startDate && orderDate < filter.startDate) return false;
    if (filter.endDate && orderDate > filter.endDate) return false;
    if (filter.paymentStatus && o.payment_status !== filter.paymentStatus) return false;
    return true;
  });

  const paidOrdersList = filtered.filter(o => o.payment_status === 'paid');
  const unpaidOrdersList = filtered.filter(o => o.payment_status !== 'paid');

  const totalOmzet = paidOrdersList.reduce((acc, o) => acc + Number(o.total_amount), 0);
  const totalHPP = paidOrdersList.reduce((acc, o) => acc + Number(o.total_cost), 0);
  const labaKotor = totalOmzet - totalHPP;

  return {
    totalOrders: filtered.length,
    paidOrders: paidOrdersList.length,
    unpaidOrders: unpaidOrdersList.length,
    totalOmzet,
    totalHPP,
    labaKotor,
    orders: filtered,
  };
}

export async function getFinancialStatement(startDate, endDate) {
  const store = ensureStoreFile();
  const sales = await getSalesReport({ startDate, endDate, paymentStatus: 'paid' });

  let expenses = store.expenses || store.financial_expenses || [];
  if (startDate) {
    expenses = expenses.filter(e => e.expense_date >= startDate);
  }
  if (endDate) {
    expenses = expenses.filter(e => e.expense_date <= endDate);
  }

  const totalBeban = expenses.reduce((acc, e) => acc + Number(e.amount), 0);
  const penjualanBersih = sales.totalOmzet;
  const labaKotor = sales.labaKotor;
  const labaBersihOperasional = labaKotor - totalBeban;

  return {
    period: {
      start: startDate || 'Awal Beroperasi',
      end: endDate || new Date().toISOString().split('T')[0],
    },
    pendapatan: {
      penjualanKotor: sales.totalOmzet,
      diskonPenjualan: 0,
      penjualanBersih,
    },
    hargaPokokPenjualan: {
      totalHPP: sales.totalHPP,
    },
    labaKotor,
    bebanOperasional: {
      items: expenses,
      totalBeban,
    },
    labaBersihOperasional,
  };
}

export async function addExpense(expense) {
  const store = ensureStoreFile();
  if (!store.expenses) store.expenses = [];
  const newId = store.expenses.length > 0 ? Math.max(...store.expenses.map(e => e.id)) + 1 : 1;
  const newExp = {
    ...expense,
    id: newId,
    created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
  };
  store.expenses.push(newExp);
  saveStoreFile(store);
  return newExp;
}

export async function getVendorJobs() {
  const store = ensureStoreFile();
  if (!store.vendor_jobs) {
    store.vendor_jobs = INITIAL_DATA.vendor_jobs;
    saveStoreFile(store);
  }
  return store.vendor_jobs;
}

export async function updateVendorJobStatus(id, newStatus) {
  const store = ensureStoreFile();
  if (!store.vendor_jobs) store.vendor_jobs = INITIAL_DATA.vendor_jobs;
  const numId = Number(id);
  const jobIndex = store.vendor_jobs.findIndex(j => j.id === numId);
  if (jobIndex === -1) return null;
  store.vendor_jobs[jobIndex].job_status = newStatus;
  store.vendor_jobs[jobIndex].updated_at = new Date().toISOString();
  saveStoreFile(store);
  return store.vendor_jobs[jobIndex];
}

export async function addVendorClaim({ spk_number, event_name, claim_title, amount, notes }) {
  const store = ensureStoreFile();
  if (!store.expenses) store.expenses = [];
  const newExp = await addExpense({
    expense_title: `[Vendor Claim] ${claim_title} (${spk_number})`,
    category: 'Biaya Produksi & Vendor',
    amount: Number(amount) || 0,
    expense_date: new Date().toISOString().split('T')[0],
    notes: `Klaim operasional vendor untuk ${event_name}: ${notes || '-'}`,
  });
  return newExp;
}

export async function getVendorStock() {
  const store = ensureStoreFile();
  if (!store.vendor_stock) {
    store.vendor_stock = INITIAL_DATA.vendor_stock;
    saveStoreFile(store);
  }
  return store.vendor_stock;
}

export async function updateVendorStock(id, data) {
  const store = ensureStoreFile();
  if (!store.vendor_stock) store.vendor_stock = INITIAL_DATA.vendor_stock;
  const numId = Number(id);
  const index = store.vendor_stock.findIndex(s => s.id === numId);
  if (index === -1) return null;
  store.vendor_stock[index] = { ...store.vendor_stock[index], ...data };
  saveStoreFile(store);
  return store.vendor_stock[index];
}

export async function addVendorStock(item) {
  const store = ensureStoreFile();
  if (!store.vendor_stock) store.vendor_stock = INITIAL_DATA.vendor_stock;
  const newId = store.vendor_stock.length > 0 ? Math.max(...store.vendor_stock.map(s => s.id)) + 1 : 1;
  const newItem = {
    ...item,
    id: newId,
    updated_at: 'Baru saja',
  };
  store.vendor_stock.unshift(newItem);
  saveStoreFile(store);
  return newItem;
}

export async function getRentalOrders() {
  const store = ensureStoreFile();
  if (!store.rental_orders) {
    store.rental_orders = INITIAL_DATA.rental_orders;
    saveStoreFile(store);
  }
  return store.rental_orders;
}

export async function updateRentalOrderStatus(orderId, status) {
  const store = ensureStoreFile();
  if (!store.rental_orders) store.rental_orders = INITIAL_DATA.rental_orders;
  const index = store.rental_orders.findIndex(o => o.order_id === orderId || o.id === Number(orderId));
  if (index === -1) return null;
  store.rental_orders[index].status = status;
  saveStoreFile(store);
  return store.rental_orders[index];
}

export async function getVendorMessages() {
  const store = ensureStoreFile();
  if (!store.vendor_messages) {
    store.vendor_messages = INITIAL_DATA.vendor_messages;
    saveStoreFile(store);
  }
  return store.vendor_messages;
}

export async function sendVendorMessage(threadId, sender, senderName, messageText) {
  const store = ensureStoreFile();
  if (!store.vendor_messages) store.vendor_messages = INITIAL_DATA.vendor_messages;
  const thread = store.vendor_messages.find(t => t.thread_id === threadId);
  if (!thread) return null;

  const now = new Date();
  const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
  const newMsg = {
    id: thread.messages.length + 1,
    sender,
    sender_name: senderName,
    message: messageText,
    time: timeStr,
  };

  thread.messages.push(newMsg);
  thread.last_message = messageText;
  thread.last_time = timeStr;
  saveStoreFile(store);
  return newMsg;
}
