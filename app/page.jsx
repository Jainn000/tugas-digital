'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { formatRupiah } from '@/lib/format';
import { 
  ArrowDown, 
  Filter, 
  PackageCheck, 
  Zap, 
  ShieldCheck, 
  Ticket, 
  Sparkles, 
  Music, 
  Radio, 
  CheckCircle2,
  FileText
} from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05
    }
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

  return (
    <div className="space-y-16 overflow-hidden">
      {/* Hero Section — Asymmetric Neubrutalism with Fluid Motion */}
      <section className="border-b-2 border-black bg-[#FFE600] py-14 md:py-24 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          
          {/* Hero Left Column */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="lg:col-span-7 space-y-6"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1 bg-white border-2 border-black font-black text-xs uppercase">
              <Sparkles className="w-4 h-4 text-[#FF5C00]" />
              <span>KINETIK Event Production House & Creative Organizer</span>
            </motion.div>

            <motion.h1 
              variants={fadeInUp}
              className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-black leading-none"
            >
              Eksekusi Panggung. <br />
              <motion.span 
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="bg-white px-2 py-0.5 border-2 border-black inline-block my-1"
              >
                Produksi Acara.
              </motion.span><br />
              Tiket Konser.
            </motion.h1>

            <motion.p 
              variants={fadeInUp}
              className="text-base sm:text-lg font-bold text-neutral-900 max-w-xl leading-relaxed"
            >
              Event organizer dan creative production house untuk acara korporat, gathering komunitas, festival musik, dan intimate wedding. Layanan terpadu mencakup produksi panggung, sistem tiket konser ber-barcode, faktur resmi institusi, serta laporan rekonsiliasi keuangan lengkap.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 pt-2">
              <motion.a
                href="#katalog"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="nb-btn nb-btn-orange px-6 py-3.5 text-base sm:text-lg flex items-center gap-2"
              >
                <Ticket className="w-5 h-5 stroke-[2.5]" />
                Lihat Paket & Tiket
                <ArrowDown className="w-5 h-5 stroke-[2.5]" />
              </motion.a>
              <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/login"
                  className="nb-btn nb-btn-white px-6 py-3.5 text-base sm:text-lg flex items-center gap-2 font-bold"
                >
                  Masuk Akun Demo
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Hero Right Column: Event Capabilities Card */}
          <motion.div 
            initial={{ opacity: 0, x: 30, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <div 
              className="nb-card bg-white p-6 space-y-4" 
              data-ui="hero-spec"
            >
              <div className="border-b-2 border-black pb-3 flex justify-between items-center">
                <span className="font-bold text-sm">Standar Produksi & Layanan</span>
                <span className="nb-tag bg-[#A3E635] text-black">Siap Acara 2026</span>
              </div>

              <div className="space-y-3 text-xs sm:text-sm font-bold">
                <motion.div 
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="flex items-start gap-2.5 p-3 bg-[#FFFDF0] border-2 border-black"
                >
                  <Music className="w-5 h-5 text-emerald-800 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Audio Line-Array & Rigging Panggung</p>
                    <p className="text-neutral-700 font-medium text-xs mt-0.5">Tata suara 5.000W s/d 20.000W, lighting DMX beam bergerak, dan konstruksi rigging panggung aman.</p>
                  </div>
                </motion.div>

                <motion.div 
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="flex items-start gap-2.5 p-3 bg-[#FFFDF0] border-2 border-black"
                >
                  <Ticket className="w-5 h-5 text-blue-800 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">E-Ticket Barcode & Gate Scanner</p>
                    <p className="text-neutral-700 font-medium text-xs mt-0.5">Penerbitan pass masuk digital dengan QR unik anti-duplikasi untuk verifikasi gerbang cepat.</p>
                  </div>
                </motion.div>

                <motion.div 
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="flex items-start gap-2.5 p-3 bg-[#FFFDF0] border-2 border-black"
                >
                  <FileText className="w-5 h-5 text-orange-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Faktur & Kwitansi Resmi Standar SPJ</p>
                    <p className="text-neutral-700 font-medium text-xs mt-0.5">Dokumen reservasi resmi berformat cetak A4 lengkap rincian termin pembayaran untuk instansi/korporat.</p>
                  </div>
                </motion.div>
              </div>

              <div className="p-2.5 bg-neutral-100 border-2 border-black text-center text-xs font-bold">
                Melayani Produksi Acara Skala 100 s.d. 10.000 Audiens
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Infinite Live Production Marquee Ticker */}
      <div className="border-y-2 border-black bg-black text-white py-3 overflow-hidden select-none">
        <div className="animate-marquee font-black uppercase text-sm tracking-wider flex items-center gap-8">
          <span className="flex items-center gap-2 text-[#FFE600]"><Sparkles className="w-4 h-4" /> FESTIVAL TIKET LIVE</span>
          <span className="w-1.5 h-1.5 bg-neutral-400 inline-block rotate-45" />
          <span className="flex items-center gap-2"><Music className="w-4 h-4" /> RIGGING SOUND 5000W</span>
          <span className="w-1.5 h-1.5 bg-neutral-400 inline-block rotate-45" />
          <span className="flex items-center gap-2 text-[#38BDF8]"><Radio className="w-4 h-4" /> LIGHTING DMX 512</span>
          <span className="w-1.5 h-1.5 bg-neutral-400 inline-block rotate-45" />
          <span className="flex items-center gap-2 text-[#A3E635]"><CheckCircle2 className="w-4 h-4" /> MULTICAM 4K BROADCAST</span>
          <span className="w-1.5 h-1.5 bg-neutral-400 inline-block rotate-45" />
          <span className="flex items-center gap-2 text-[#FF5C00]"><Zap className="w-4 h-4" /> SETTLEMENT QRIS INSTAN</span>
          <span className="w-1.5 h-1.5 bg-neutral-400 inline-block rotate-45" />
          <span>INVOICE RESMI STANDAR SPJ</span>
          <span className="w-1.5 h-1.5 bg-neutral-400 inline-block rotate-45" />
          <span className="flex items-center gap-2 text-[#FFE600]"><Sparkles className="w-4 h-4" /> FESTIVAL TIKET LIVE</span>
          <span className="w-1.5 h-1.5 bg-neutral-400 inline-block rotate-45" />
          <span className="flex items-center gap-2"><Music className="w-4 h-4" /> RIGGING SOUND 5000W</span>
          <span className="w-1.5 h-1.5 bg-neutral-400 inline-block rotate-45" />
          <span className="flex items-center gap-2 text-[#38BDF8]"><Radio className="w-4 h-4" /> LIGHTING DMX 512</span>
          <span className="w-1.5 h-1.5 bg-neutral-400 inline-block rotate-45" />
          <span className="flex items-center gap-2 text-[#A3E635]"><CheckCircle2 className="w-4 h-4" /> MULTICAM 4K BROADCAST</span>
          <span className="w-1.5 h-1.5 bg-neutral-400 inline-block rotate-45" />
          <span className="flex items-center gap-2 text-[#FF5C00]"><Zap className="w-4 h-4" /> SETTLEMENT QRIS INSTAN</span>
          <span className="w-1.5 h-1.5 bg-neutral-400 inline-block rotate-45" />
          <span>INVOICE RESMI STANDAR SPJ</span>
          <span className="w-1.5 h-1.5 bg-neutral-400 inline-block rotate-45" />
        </div>
      </div>

      {/* Catalog Section with Scroll Reveal */}
      <section id="katalog" className="max-w-7xl mx-auto px-4 scroll-mt-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8"
        >
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
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(null)}
              className={`px-3 py-1.5 text-xs font-bold border-2 border-black transition-colors duration-150 ${
                selectedCategory === null
                  ? 'bg-black text-white'
                  : 'bg-white hover:bg-neutral-100'
              }`}
            >
              Semua ({products.length})
            </motion.button>
            {categories.map(cat => (
              <motion.button
                key={cat.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-bold border-2 border-black transition-colors duration-150 ${
                  selectedCategory === cat.id
                    ? 'bg-[#FFE600] text-black'
                    : 'bg-white hover:bg-neutral-100'
                }`}
              >
                {cat.name}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Product Cards Grid with Staggered Scroll Entrance */}
        {loading ? (
          <div className="py-20 text-center border-2 border-black bg-white">
            <p className="font-bold text-lg">Memuat data paket acara dari database...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center border-2 border-black bg-white">
            <p className="font-bold text-lg">Tidak ada item dalam kategori ini.</p>
          </div>
        ) : (
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.45, delay: index * 0.05 }}
                whileHover={{ y: -6 }}
                className="nb-card flex flex-col justify-between overflow-hidden group transition-transform duration-200"
                data-ui="product-card"
              >
                {/* Product Image */}
                <div className="relative aspect-square w-full border-b-2 border-black bg-neutral-100 overflow-hidden">
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
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
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link
                          href={`/checkout?product_id=${product.id}&qty=1`}
                          className="nb-btn nb-btn-yellow px-3 py-2 text-xs flex items-center gap-1.5 font-bold"
                        >
                          <Ticket className="w-3.5 h-3.5 stroke-[2.5]" /> Booking Sekarang
                        </Link>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* Production Workflow Pipeline Steps */}
      <section className="max-w-7xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="border-b-2 border-black pb-4 mb-8"
        >
          <span className="nb-tag bg-[#FF5C00] text-white font-bold text-xs uppercase mb-2">
            SOP Pelaksanaan
          </span>
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight mt-1">
            Alur Eksekusi Acara Terstandarisasi
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: 'Tahap 1',
              title: 'Booking & Rundown',
              desc: 'Klien memilih paket atau tiket konser, menetapkan tanggal acara, dan rundown dikonfirmasi tim director.',
              bg: 'bg-white'
            },
            {
              step: 'Tahap 2',
              title: 'Instalasi Teknis',
              desc: 'Pemasangan rigging panggung, soundcheck speaker line array, dan sinkronisasi sistem pencahayaan DMX.',
              bg: 'bg-[#FFFDF0]'
            },
            {
              step: 'Tahap 3',
              title: 'Gate Pass & Eksekusi',
              desc: 'Verifikasi barcode tiket masuk oleh tim usher gate venue, serta live monitoring jalannya penampilan panggung.',
              bg: 'bg-white'
            },
            {
              step: 'Tahap 4',
              title: 'Rekonsiliasi & SPJ',
              desc: 'Pelaporan realisasi biaya operasional, laba kotor acara, dan penyerahan invoice resmi format A4.',
              bg: 'bg-[#A3E635]'
            }
          ].map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className={`nb-card ${item.bg} p-6 space-y-3`}
            >
              <div className="flex items-center justify-between border-b-2 border-black pb-2">
                <span className="text-lg font-black text-neutral-900">{item.step}</span>
                <span className="nb-tag bg-black text-white text-xs font-bold">Fase {i + 1}</span>
              </div>
              <h3 className="text-lg font-bold uppercase">{item.title}</h3>
              <p className="text-xs font-medium text-neutral-800 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Asymmetric Split Showcase with Scroll Animation */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 nb-card bg-[#38BDF8] p-8 md:p-10 space-y-4"
          >
            <h3 className="text-3xl font-black uppercase tracking-tight">Produksi Panggung & Manajemen Lapangan</h3>
            <p className="text-sm font-bold text-neutral-900 leading-relaxed max-w-xl">
              Dari perizinan keramaian, instalasi rigging sound system 5000 watt, koordinasi rundown panggung, hingga live streaming multicam 4K. Seluruh pengeluaran operasional tercatat akurat dalam standar pembukuan SAK EMKM.
            </p>
            <div className="pt-2">
              <span className="nb-tag bg-white font-bold">Kru Bersertifikat & Alat Terkalibrasi</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 nb-card bg-[#A3E635] p-8 md:p-10 space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <h3 className="text-2xl font-black uppercase tracking-tight">E-Ticket Barcode & Faktur Booking A4</h3>
              <p className="text-sm font-bold text-neutral-900 leading-relaxed">
                Setiap reservasi paket dan pembelian tiket festival menerbitkan dua format cetak: e-ticket thermal 80mm untuk pass masuk gate venue dan invoice resmi A4 untuk SPJ korporat.
              </p>
            </div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="self-start mt-2">
              <Link
                href="/login"
                className="nb-btn nb-btn-white py-2.5 px-4 text-xs font-bold"
              >
                Uji Coba Panel Pengelola
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
