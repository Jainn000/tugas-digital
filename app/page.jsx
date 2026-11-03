'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { formatRupiah } from '@/lib/format';
import { 
  ArrowDown, 
  ArrowRight,
  Filter, 
  Ticket, 
  Sparkles, 
  Music, 
  Calendar,
  MapPin,
  CalendarCheck,
  Speaker,
  Users,
  ShieldCheck,
  CheckCircle2,
  FileText
} from 'lucide-react';

const EVENT_DETAILS = {
  1: {
    venue: 'Jabodetabek & Puncak',
    schedule: 'Jadwal Fleksibel',
    badge: 'All-In Service',
    action: 'Booking Paket'
  },
  2: {
    venue: 'Indoor / Garden Venue',
    schedule: 'Jadwal Fleksibel',
    badge: 'Full Coordination',
    action: 'Booking Paket'
  },
  3: {
    venue: 'Hotel Ballroom & Auditorium',
    schedule: 'Jadwal Fleksibel',
    badge: 'Broadcast 4K',
    action: 'Booking Paket'
  },
  4: {
    venue: 'Balai Kartini Convention, Jakarta',
    schedule: '28 Nov 2026 • 09:00 WIB',
    badge: 'VIP Pass & Lounge',
    action: 'Beli Tiket VIP'
  },
  5: {
    venue: 'Balai Kartini Convention, Jakarta',
    schedule: '28 Nov 2026 • 09:00 WIB',
    badge: 'General Admission',
    action: 'Beli Tiket'
  },
  6: {
    venue: 'Istora Senayan Park, Jakarta',
    schedule: '05 Des 2026 • 15:00 WIB',
    badge: 'Presale Phase 1',
    action: 'Beli Tiket Presale'
  },
  7: {
    venue: 'Layanan Antar & Setup Jabodetabek',
    schedule: 'Sewa Harian / Shift',
    badge: 'Line-Array 5000W',
    action: 'Sewa Sound'
  },
  8: {
    venue: 'Layanan Antar & Setup Jabodetabek',
    schedule: 'Sewa Harian / Shift',
    badge: 'Moving Beam DMX',
    action: 'Sewa Lighting'
  }
};

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const url = selectedCategory ? `/api/products?category=${selectedCategory}` : '/api/products';
      const res = await fetch(url);
      const data = await res.json();
      if (data.products) setProducts(data.products);
      if (data.categories) setCategories(data.categories);
    } catch (err) {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const getEventMeta = (productId) => {
    return EVENT_DETAILS[productId] || {
      venue: 'Jakarta & Sekitarnya',
      schedule: 'Sesuai Reservasi',
      badge: 'Layanan Resmi',
      action: 'Booking Sekarang'
    };
  };

  return (
    <div className="space-y-20 md:space-y-28 overflow-hidden">
      
      {/* 1. Hero Section — Dominant Event Photography with Editorial Balance */}
      <section className="border-b-2 border-black bg-white py-12 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Hero Left: Assertive Typography & Clear Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#FFFDF0] border-2 border-black font-bold text-xs text-black">
              <Sparkles className="w-3.5 h-3.5 text-[#FF5C00]" />
              <span>Promoter Konser & Production House Jakarta</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-black leading-[1.05]">
              Eksekusi Panggung. <br />
              Festival Musik. <br />
              <span className="text-[#FF5C00] underline decoration-4 decoration-black underline-offset-4">
                Produksi Acara.
              </span>
            </h1>

            <p className="text-base sm:text-lg font-bold text-neutral-800 max-w-xl leading-relaxed">
              Platform terpadu untuk pemesanan tiket konser festival, pengorganisasian acara korporat, dan penyewaan rigging panggung bersertifikasi. Seluruh pemesanan menerbitkan pass e-ticket barcode dan faktur resmi standar SPJ.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
              <motion.a
                href="#katalog"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="nb-btn nb-btn-orange px-6 py-3.5 text-base sm:text-lg flex items-center gap-2"
              >
                <Ticket className="w-5 h-5 stroke-[2.5]" />
                Buka Katalog & Tiket
                <ArrowDown className="w-5 h-5 stroke-[2.5]" />
              </motion.a>

              <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/checkout"
                  className="nb-btn nb-btn-white px-6 py-3.5 text-base sm:text-lg flex items-center gap-2 font-bold"
                >
                  <CalendarCheck className="w-5 h-5" />
                  Reservasi Paket Acara
                </Link>
              </motion.div>
            </div>

            {/* Trust Indicator Metrics */}
            <div className="pt-4 border-t-2 border-black grid grid-cols-3 gap-4 text-xs font-bold">
              <div>
                <p className="text-xl sm:text-2xl font-black text-black">250+</p>
                <p className="text-neutral-600 mt-0.5">Produksi Acara Sukses</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-black">100%</p>
                <p className="text-neutral-600 mt-0.5">Faktur Resmi Standar SPJ</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-black">Instant</p>
                <p className="text-neutral-600 mt-0.5">Gate E-Ticket QR Code</p>
              </div>
            </div>
          </div>

          {/* Hero Right: Dominant High-Impact Event Showcase Photo */}
          <div className="lg:col-span-5">
            <div className="nb-card bg-white overflow-hidden border-2 border-black group">
              {/* Event Cover Image */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-900 border-b-2 border-black">
                <Image
                  src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=85"
                  alt="Live Concert Production KINETIK"
                  fill
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className="nb-tag bg-[#FFE600] text-black text-xs font-bold uppercase">
                    Stage Spotlight 2026
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="nb-tag bg-white text-black text-xs font-bold">
                    Official Promoter
                  </span>
                </div>
              </div>

              {/* Event Caption & Direct Action */}
              <div className="p-5 space-y-3 bg-[#FFFDF0]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-600 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#FF5C00]" /> 05 Desember 2026
                  </span>
                  <span className="nb-tag bg-[#A3E635] text-black text-xs font-bold">
                    Presale Aktif
                  </span>
                </div>

                <div>
                  <h3 className="font-black text-lg text-black leading-snug">
                    Indie Wave Music Festival 2026
                  </h3>
                  <p className="text-xs font-medium text-neutral-700 flex items-center gap-1.5 mt-1">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-neutral-500" />
                    Istora Senayan Park, Jakarta Pusat
                  </p>
                </div>

                <div className="pt-3 border-t-2 border-black flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-bold text-neutral-600 block">Tiket Mulai Dari</span>
                    <span className="text-lg font-black text-black">Rp 125.000</span>
                  </div>

                  <Link
                    href="/checkout?product_id=6&qty=1"
                    className="nb-btn nb-btn-orange px-4 py-2 text-xs font-bold flex items-center gap-1.5"
                  >
                    Beli Tiket <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Core Focus: Tiga Pilar Layanan Utama KINETIK */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b-2 border-black pb-4 mb-8">
          <span className="nb-tag bg-[#FFE600] text-black font-bold text-xs uppercase mb-2">
            Fokus Layanan
          </span>
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight mt-1">
            Tiga Layanan Utama Produksi Acara
          </h2>
          <p className="text-sm font-bold text-neutral-600 mt-1 max-w-2xl leading-relaxed">
            Menyatukan alur pemesanan tiket penonton, paket pengorganisasian acara perusahaan, dan rental perlengkapan panggung dalam satu platform terintegrasi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pilar 1: Tiket Event & Festival */}
          <div className="nb-card bg-white flex flex-col justify-between overflow-hidden border-2 border-black group">
            <div>
              <div className="relative aspect-[16/9] w-full border-b-2 border-black overflow-hidden bg-neutral-100">
                <Image
                  src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80"
                  alt="Tiket Event dan Festival Musik"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2">
                  <span className="nb-tag bg-[#FFE600] text-black text-xs font-bold">Pilar 1</span>
                </div>
              </div>

              <div className="p-5 space-y-2">
                <h3 className="text-xl font-black uppercase text-black flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-[#FF5C00]" />
                  Tiket Event & Festival
                </h3>
                <p className="text-xs font-medium text-neutral-700 leading-relaxed">
                  Pemesanan tiket konser musik, festival indie, dan creator summit. Setiap tiket menerbitkan QR barcode unik untuk scanning cepat di gerbang venue.
                </p>
              </div>
            </div>

            <div className="p-5 pt-0">
              <button
                type="button"
                onClick={() => setSelectedCategory(2)}
                className="nb-btn nb-btn-white w-full py-2.5 text-xs font-bold flex items-center justify-center gap-1.5"
              >
                Buka Kategori Tiket <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Pilar 2: Paket All-in Event Organizer */}
          <div className="nb-card bg-white flex flex-col justify-between overflow-hidden border-2 border-black group">
            <div>
              <div className="relative aspect-[16/9] w-full border-b-2 border-black overflow-hidden bg-neutral-100">
                <Image
                  src="https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80"
                  alt="Paket All-in Event Organizer"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2">
                  <span className="nb-tag bg-[#FFE600] text-black text-xs font-bold">Pilar 2</span>
                </div>
              </div>

              <div className="p-5 space-y-2">
                <h3 className="text-xl font-black uppercase text-black flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-700" />
                  Paket All-In Organizer
                </h3>
                <p className="text-xs font-medium text-neutral-700 leading-relaxed">
                  Penyelenggaraan menyeluruh untuk corporate gathering, outbound instansi, intimate wedding, dan seminar hybrid lengkap perizinan dan rundown tim director.
                </p>
              </div>
            </div>

            <div className="p-5 pt-0">
              <button
                type="button"
                onClick={() => setSelectedCategory(1)}
                className="nb-btn nb-btn-white w-full py-2.5 text-xs font-bold flex items-center justify-center gap-1.5"
              >
                Pilih Paket Organizer <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Pilar 3: Rental Alat & Produksi Panggung */}
          <div className="nb-card bg-white flex flex-col justify-between overflow-hidden border-2 border-black group">
            <div>
              <div className="relative aspect-[16/9] w-full border-b-2 border-black overflow-hidden bg-neutral-100">
                <Image
                  src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&auto=format&fit=crop&q=80"
                  alt="Rental Alat dan Sound System Panggung"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2">
                  <span className="nb-tag bg-[#FFE600] text-black text-xs font-bold">Pilar 3</span>
                </div>
              </div>

              <div className="p-5 space-y-2">
                <h3 className="text-xl font-black uppercase text-black flex items-center gap-2">
                  <Speaker className="w-5 h-5 text-emerald-700" />
                  Rental Sound & Rigging
                </h3>
                <p className="text-xs font-medium text-neutral-700 leading-relaxed">
                  Penyewaan sound system line-array 5000W s/d 20000W, lighting DMX moving head, dan genset siap pakai dengan operator sound engineer bersertifikat.
                </p>
              </div>
            </div>

            <div className="p-5 pt-0">
              <button
                type="button"
                onClick={() => setSelectedCategory(3)}
                className="nb-btn nb-btn-white w-full py-2.5 text-xs font-bold flex items-center justify-center gap-1.5"
              >
                Lihat Peralatan Panggung <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Catalog Section — Premier Event Poster Cards with Schedule & Venue */}
      <section id="katalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 border-b-2 border-black pb-4">
          <div>
            <span className="nb-tag bg-black text-white font-bold text-xs uppercase mb-2">
              Katalog Resmi
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight mt-1">
              Katalog Tiket & Paket Acara
            </h2>
            <p className="text-sm font-bold text-neutral-600 mt-1">
              Pilih tiket festival atau paket layanan acara untuk langsung menerbitkan faktur reservasi.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-bold flex items-center gap-1 mr-1 text-neutral-700">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 py-1.5 text-xs font-bold border-2 border-black transition-colors duration-150 ${
                selectedCategory === null
                  ? 'bg-black text-white'
                  : 'bg-white hover:bg-neutral-100 text-black'
              }`}
            >
              Semua Item ({products.length})
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-bold border-2 border-black transition-colors duration-150 ${
                  selectedCategory === cat.id
                    ? 'bg-[#FFE600] text-black font-black'
                    : 'bg-white hover:bg-neutral-100 text-black'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        {loading ? (
          <div className="py-20 text-center border-2 border-black bg-white">
            <p className="font-bold text-lg">Memuat data paket acara dan tiket dari server...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center border-2 border-black bg-white">
            <p className="font-bold text-lg">Tidak ada item dalam kategori ini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => {
              const meta = getEventMeta(product.id);
              const isTicket = product.category_id === 2;

              return (
                <div
                  key={product.id}
                  className="nb-card bg-white flex flex-col justify-between overflow-hidden group border-2 border-black transition-transform duration-200 hover:-translate-y-1.5"
                  data-ui="product-card"
                >
                  {/* Poster Image */}
                  <div>
                    <div className="relative aspect-[4/3] w-full border-b-2 border-black bg-neutral-100 overflow-hidden">
                      {product.image_url ? (
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-neutral-400">
                          Foto Belum Tersedia
                        </div>
                      )}
                      <div className="absolute top-2 left-2">
                        <span className="nb-tag bg-white text-black text-xs font-bold">
                          {product.category_name || 'Event'}
                        </span>
                      </div>
                      <div className="absolute top-2 right-2">
                        <span className={`nb-tag text-xs font-bold ${product.stock > 5 ? 'bg-[#A3E635] text-black' : 'bg-red-200 text-black'}`}>
                          Slot: {product.stock}
                        </span>
                      </div>
                    </div>

                    {/* Event Schedule & Venue Information Bar */}
                    <div className="p-4 pb-2 space-y-2 bg-[#FFFDF0]">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-800">
                        <Calendar className="w-3.5 h-3.5 text-[#FF5C00] flex-shrink-0" />
                        <span className="truncate">{meta.schedule}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-600">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-neutral-500" />
                        <span className="truncate">{meta.venue}</span>
                      </div>
                    </div>

                    {/* Title & Short Description */}
                    <div className="p-4 space-y-2">
                      <h3 className="font-bold text-base leading-snug line-clamp-2 text-black group-hover:text-[#FF5C00] transition-colors duration-150">
                        {product.name}
                      </h3>
                      <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed font-medium">
                        {product.description}
                      </p>
                    </div>
                  </div>

                  {/* Price & Direct Booking CTA */}
                  <div className="p-4 pt-2 border-t-2 border-black bg-white flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-bold text-neutral-500 block">
                        {isTicket ? 'Harga Tiket' : 'Mulai Dari'}
                      </span>
                      <span className="text-base font-black text-black">
                        {formatRupiah(product.price)}
                      </span>
                    </div>

                    {product.stock <= 0 ? (
                      <span className="nb-btn px-3 py-2 text-xs font-bold bg-neutral-200 text-neutral-500 cursor-not-allowed border-neutral-400">
                        Slot Penuh
                      </span>
                    ) : (
                      <Link
                        href={`/checkout?product_id=${product.id}&qty=1`}
                        className="nb-btn nb-btn-orange px-3.5 py-2 text-xs flex items-center gap-1 font-bold"
                      >
                        {isTicket ? (
                          <Ticket className="w-3.5 h-3.5 stroke-[2.5]" />
                        ) : (
                          <CalendarCheck className="w-3.5 h-3.5 stroke-[2.5]" />
                        )}
                        <span>{meta.action}</span>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. Production Reliability & Official Compliance Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="nb-card bg-white p-8 md:p-12 border-2 border-black grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <span className="nb-tag bg-[#A3E635] text-black font-bold text-xs uppercase">
              Standar Operasional Industri
            </span>
            <h3 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-black">
              Eksekusi Panggung Terstandarisasi & SPJ Finansial Lengkap
            </h3>
            <p className="text-sm font-bold text-neutral-700 leading-relaxed max-w-2xl">
              Setiap produksi panggung didukung kru berpengalaman, sertifikasi keselamatan kerja, dan sistem verifikasi gate tiket digital. Seluruh pengeluaran dan omzet tersaji dalam laporan laba rugi resmi standar SAK EMKM.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <span className="nb-tag bg-neutral-100 text-neutral-800 font-bold text-xs">
                Perizinan Keramaian & Keamanan
              </span>
              <span className="nb-tag bg-neutral-100 text-neutral-800 font-bold text-xs">
                E-Ticket Thermal 80mm & Faktur A4
              </span>
              <span className="nb-tag bg-neutral-100 text-neutral-800 font-bold text-xs">
                Rekonsiliasi Laba Rugi Acara
              </span>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-3">
            <Link
              href="/checkout"
              className="nb-btn nb-btn-orange py-3.5 px-6 text-sm font-bold text-center flex items-center justify-center gap-2"
            >
              <CalendarCheck className="w-4 h-4 stroke-[2.5]" />
              Buat Reservasi Acara Sekarang
            </Link>
            <Link
              href="/login"
              className="nb-btn nb-btn-white py-2.5 px-4 text-xs font-bold text-center"
            >
              Uji Coba Panel Pengelola (Admin)
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
