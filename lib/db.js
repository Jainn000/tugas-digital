import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

const STORE_FILE = path.join(process.cwd(), 'data', 'store.json');

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
      order_status: 'processing',
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
      payment_status: 'unpaid',
      order_status: 'pending',
      payment_reference: 'QRIS-PENDING-441',
      paid_at: null,
      created_at: '2026-11-02 20:10:00',
    },
  ],
  order_items: [
    { id: 1, order_id: 1, product_id: 1, product_name: 'Paket Corporate Gathering & Outbound', price: 7500000, cost_price: 4200000, quantity: 1, subtotal: 7500000 },
    { id: 2, order_id: 2, product_id: 2, product_name: 'Paket Intimate Wedding Organizer', price: 12800000, cost_price: 7500000, quantity: 1, subtotal: 12800000 },
    { id: 3, order_id: 3, product_id: 7, product_name: 'Sewa Sound System 5000W + Mixer Digital', price: 2500000, cost_price: 950000, quantity: 1, subtotal: 2500000 },
    { id: 4, order_id: 3, product_id: 4, product_name: 'Tiket VIP Youth Creator Summit 2026', price: 350000, cost_price: 140000, quantity: 2, subtotal: 700000 },
    { id: 5, order_id: 4, product_id: 5, product_name: 'Tiket Reguler Youth Creator Summit 2026', price: 150000, cost_price: 60000, quantity: 4, subtotal: 600000 },
    { id: 6, order_id: 5, product_id: 3, product_name: 'Paket Seminar & Konferensi Hybrid', price: 5600000, cost_price: 3100000, quantity: 1, subtotal: 5600000 },
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
      expense_title: 'Fee Transaksi Payment Gateway Sandbox Periode Okt',
      category: 'Finansial & Biaya Admin',
      amount: 65000,
      expense_date: '2026-11-01',
      notes: 'Biaya administrasi MDR QRIS dan Virtual Account',
    },
  ],
};

function ensureStoreFile() {
  const dir = path.dirname(STORE_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(STORE_FILE)) {
    fs.writeFileSync(STORE_FILE, JSON.stringify(INITIAL_DATA, null, 2), 'utf-8');
    return INITIAL_DATA;
  }
  try {
    const raw = fs.readFileSync(STORE_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (!parsed.order_items) parsed.order_items = INITIAL_DATA.order_items;
    if (!parsed.expenses) parsed.expenses = INITIAL_DATA.expenses;
    return parsed;
  } catch (err) {
    fs.writeFileSync(STORE_FILE, JSON.stringify(INITIAL_DATA, null, 2), 'utf-8');
    return INITIAL_DATA;
  }
}

function saveStoreFile(data) {
  const dir = path.dirname(STORE_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), 'utf-8');
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
