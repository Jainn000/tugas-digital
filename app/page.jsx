'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatRupiah } from '@/lib/format';
import { ArrowDown, Filter, PackageCheck, Zap, ShieldCheck, Ticket } from 'lucide-react';

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

  return (
    <div className="space-y-16">
      {/* Hero Section — Asymmetric Neubrutalism */}
      <section className="border-b-2 border-black bg-[#FFE600] py-14 md:py-20 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-black leading-none">
              Eksekusi Panggung. <br />
              <span className="bg-white px-2 py-0.5 border-2 border-black inline-block my-1">
                Produksi Acara.
              </span><br />
              Tiket Konser.
            </h1>

            <p className="text-base sm:text-lg font-bold text-neutral-900 max-w-xl leading-relaxed">
              Event organizer dan creative production house untuk acara korporat, gathering komunitas, festival musik, dan intimate wedding. Sistem terintegrasi database MySQL, payment gateway sandbox, cetak invoice resmi, dan laporan laba rugi.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href="#katalog"
                className="nb-btn nb-btn-orange px-6 py-3.5 text-base sm:text-lg flex items-center gap-2"
              >
                <Ticket className="w-5 h-5 stroke-[2.5]" />
                Lihat Paket & Tiket
                <ArrowDown className="w-5 h-5 stroke-[2.5]" />
              </a>
              <Link
                href="/login"
                className="nb-btn nb-btn-white px-6 py-3.5 text-base sm:text-lg flex items-center gap-2 font-bold"
              >
                Masuk Akun Demo
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="nb-card bg-white p-6 space-y-4" data-ui="hero-spec">
              <div className="border-b-2 border-black pb-3 flex justify-between items-center">
                <span className="font-bold text-sm">Spesifikasi Sistem EO</span>
                <span className="nb-tag bg-[#A3E635] text-black">Verifikasi Penuh</span>
              </div>

              <div className="space-y-3 text-xs sm:text-sm font-bold">
                <div className="flex items-start gap-2.5 p-3 bg-[#FFFDF0] border-2 border-black">
                  <PackageCheck className="w-5 h-5 text-emerald-800 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Database MySQL dan phpMyAdmin</p>
                    <p className="text-neutral-700 font-medium text-xs mt-0.5">Skema tabel terstruktur untuk paket event, tiket festival, dan pencatatan beban panggung.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 bg-[#FFFDF0] border-2 border-black">
                  <ShieldCheck className="w-5 h-5 text-blue-800 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Multi-Aktor Login (Admin dan Klien)</p>
                    <p className="text-neutral-700 font-medium text-xs mt-0.5">Akses terpisah antara tim event director dan klien pemesan tiket/layanan.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 bg-[#FFFDF0] border-2 border-black">
                  <Zap className="w-5 h-5 text-orange-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Payment Gateway Simulator</p>
                    <p className="text-neutral-700 font-medium text-xs mt-0.5">Mendukung QRIS nasional, Virtual Account BCA/Mandiri, dan GoPay dengan settlement instan.</p>
                  </div>
                </div>
              </div>

              <div className="p-2.5 bg-neutral-100 border-2 border-black text-center text-xs font-bold">
                Dijalankan lokal pada port localhost:3000
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog Section */}
      <section id="katalog" className="max-w-7xl mx-auto px-4 scroll-mt-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">
              Katalog Layanan & Tiket Event
            </h2>
            <p className="text-sm font-bold text-neutral-700 mt-1">
              Pilihan paket all-in event organizer, tiket festival musik, dan sewa sound lighting profesional.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-bold flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" /> Kategori:
            </span>
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 py-1.5 text-xs font-bold border-2 border-black transition-colors duration-150 ${
                selectedCategory === null
                  ? 'bg-black text-white'
                  : 'bg-white hover:bg-neutral-100'
              }`}
            >
              Semua ({products.length})
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-bold border-2 border-black transition-colors duration-150 ${
                  selectedCategory === cat.id
                    ? 'bg-[#FFE600] text-black'
                    : 'bg-white hover:bg-neutral-100'
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
            <p className="font-bold text-lg">Memuat data paket acara dari database...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center border-2 border-black bg-white">
            <p className="font-bold text-lg">Tidak ada item dalam kategori ini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <div
                key={product.id}
                className="nb-card flex flex-col justify-between overflow-hidden group"
                data-ui="product-card"
              >
                {/* Product Image */}
                <div className="relative aspect-square w-full border-b-2 border-black bg-neutral-100 overflow-hidden">
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-neutral-400">
                      No Image
                    </div>
                  )}
                  <div className="absolute top-2 left-2">
                    <span className="nb-tag bg-white text-black text-xs font-bold">
                      {product.category_name || 'Event Service'}
                    </span>
                  </div>
                  <div className="absolute top-2 right-2">
                    <span className={`nb-tag text-xs font-bold ${product.stock > 5 ? 'bg-[#A3E635] text-black' : 'bg-red-300 text-black'}`}>
                      Slot: {product.stock}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-bold text-lg leading-snug line-clamp-1 group-hover:text-[#FF5C00] transition-colors duration-150">
                      {product.name}
                    </h3>
                    <p className="text-xs text-neutral-700 mt-1 line-clamp-2 leading-relaxed font-medium">
                      {product.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t-2 border-black flex items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold text-neutral-600 block">Investasi / Tiket</span>
                      <span className="text-lg font-black text-black">
                        {formatRupiah(product.price)}
                      </span>
                    </div>

                    {product.stock <= 0 ? (
                      <span className="nb-btn px-3 py-2 text-xs font-bold bg-neutral-300 text-neutral-500 cursor-not-allowed border-neutral-400">
                        Slot Penuh
                      </span>
                    ) : (
                      <Link
                        href={`/checkout?product_id=${product.id}&qty=1`}
                        className="nb-btn nb-btn-yellow px-3 py-2 text-xs flex items-center gap-1.5 font-bold"
                      >
                        <Ticket className="w-3.5 h-3.5 stroke-[2.5]" /> Booking Sekarang
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Asymmetric Split Showcase */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 nb-card bg-[#38BDF8] p-8 md:p-10 space-y-4">
            <h3 className="text-3xl font-black uppercase tracking-tight">Produksi Panggung & Manajemen Lapangan</h3>
            <p className="text-sm font-bold text-neutral-900 leading-relaxed max-w-xl">
              Dari perizinan keramaian, instalasi rigging sound system 5000 watt, koordinasi rundown panggung, hingga live streaming multicam 4K. Seluruh pengeluaran operasional tercatat akurat dalam standar pembukuan SAK EMKM.
            </p>
            <div className="pt-2">
              <span className="nb-tag bg-white font-bold">Kru Bersertifikat & Alat Terkalibrasi</span>
            </div>
          </div>

          <div className="lg:col-span-5 nb-card bg-[#A3E635] p-8 md:p-10 space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <h3 className="text-2xl font-black uppercase tracking-tight">E-Ticket Barcode & Faktur Booking A4</h3>
              <p className="text-sm font-bold text-neutral-900 leading-relaxed">
                Setiap reservasi paket dan pembelian tiket festival menerbitkan dua format cetak: e-ticket thermal 80mm untuk pass masuk gate venue dan invoice resmi A4 untuk SPJ korporat.
              </p>
            </div>
            <Link
              href="/login"
              className="nb-btn nb-btn-white py-2.5 px-4 text-xs font-bold self-start mt-2"
            >
              Uji Coba Panel Pengelola
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
