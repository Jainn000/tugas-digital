'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { formatRupiah } from '@/lib/format';
import { 
  ArrowUpRight, 
  ArrowDown, 
  Check, 
  AudioLines 
} from 'lucide-react';

const fadeUpVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.1,
      ease: [0.16, 1, 0.3, 1]
    }
  })
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
    <div data-ui="kinetik-landing" className="bg-[#171717] text-white font-inter selection:bg-[#ff6b35] selection:text-[#171717]">
      {/* 1. HERO SECTION (Figma Node 46:3287) */}
      <section className="relative w-full min-h-[580px] sm:min-h-[640px] md:h-[720px] flex flex-col justify-between px-5 sm:px-8 md:px-[72px] pt-[64px] sm:pt-[76px] pb-[30px] overflow-hidden">
        {/* Concert Photography Background with Scrim */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/figma/hero-concert.png"
            alt="Kinetik Concert Photography"
            fill
            priority
            className="object-cover object-center scale-100 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#171717]/95 via-[#171717]/70 to-[#171717]/20" /> {/* taste-skill-ignore: neutral scrim over photo */}
        </div>

        {/* Hero Content */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.12 }
            }
          }}
          className="relative z-10 max-w-[790px] flex flex-col gap-[20px] sm:gap-[24px]"
        >
          {/* Section label */}
          <motion.div variants={fadeUpVariant} custom={0} className="flex items-center gap-[12px]">
            <div className="w-[24px] h-[2px] bg-[#ff6b35]" />
            <span className="font-inter font-semibold text-[#bdbdbd] text-[11px] tracking-[1.54px]">
              EVENT PRODUCTION & ORGANIZER
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1 
            variants={fadeUpVariant}
            custom={1}
            className="font-poppins font-semibold text-[34px] xs:text-[40px] sm:text-[54px] md:text-[64px] tracking-[-1px] sm:tracking-[-1.92px] leading-[1.14] text-white"
          >
            Hidupkan setiap<br />
            momen bersama<br />
            <span className="text-[#ff6b35]">KINETIK.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            variants={fadeUpVariant}
            custom={2}
            className="font-inter text-[#bdbdbd] text-[15px] md:text-[16px] leading-[1.75] max-w-[520px]"
          >
            Dari ide pertama hingga tepuk tangan terakhir. Kami merangkai kreativitas, perencanaan, dan produksi dalam satu pengalaman berkesan.
          </motion.p>

          {/* Hero Actions */}
          <motion.div 
            variants={fadeUpVariant}
            custom={3}
            className="flex flex-wrap items-center gap-[16px] pt-[8px]"
          >
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="#layanan"
                className="bg-[#ff6b35] text-[#171717] font-inter font-semibold text-[14px] h-[56px] px-[26px] rounded-[6px] flex items-center justify-center gap-[14px] hover:bg-[#e5531e] transition-colors"
              >
                <span>Jelajahi Layanan</span>
                <ArrowUpRight className="w-[18px] h-[18px]" />
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/checkout"
                className="border border-white/40 text-white font-inter font-semibold text-[14px] h-[56px] px-[26px] rounded-[6px] flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                Rencanakan Acara
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Hero Baseline */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="relative z-10 w-full pt-[24px] border-t border-white/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[#bdbdbd]"
        >
          <p className="text-[10px] tracking-[1.2px] font-medium">
            VISI ANDA. PRODUKSI KAMI. PENGALAMAN TAK TERLUPAKAN.
          </p>
          <a
            href="#tentang"
            className="flex items-center gap-[10px] text-[11px] hover:text-white transition-colors group"
          >
            <span>Kenali KINETIK</span>
            <ArrowDown className="w-3.5 h-3.5 text-[#ff6b35] group-hover:translate-y-1 transition-transform" />
          </a>
        </motion.div>
      </section>

      {/* 2. EXPERIENCE AT A GLANCE / METRICS BAR (Figma Node 46:3308) */}
      <section className="bg-[#242424] border-y border-[#383838] px-5 sm:px-8 md:px-[72px] pt-[38px] pb-[30px]">
        <div className="max-w-[1440px] mx-auto flex flex-col gap-[22px]">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-[32px]">
            {/* Metric 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="flex flex-col gap-[6px]"
            >
              <p className="font-poppins font-medium text-[34px] md:text-[38px] text-white leading-none">
                8<span className="text-[#ff6b35]">+</span>
              </p>
              <p className="font-inter text-[13px] text-[#bdbdbd]">Tahun pengalaman</p>
            </motion.div>

            {/* Metric 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="flex flex-col gap-[6px] lg:border-l lg:border-[#383838] lg:pl-[28px]"
            >
              <p className="font-poppins font-medium text-[34px] md:text-[38px] text-white leading-none">
                150<span className="text-[#ff6b35]">+</span>
              </p>
              <p className="font-inter text-[13px] text-[#bdbdbd]">Acara ditangani</p>
            </motion.div>

            {/* Metric 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="flex flex-col gap-[6px] lg:border-l lg:border-[#383838] lg:pl-[28px]"
            >
              <p className="font-poppins font-medium text-[34px] md:text-[38px] text-white leading-none">
                85<span className="text-[#ff6b35]">+</span>
              </p>
              <p className="font-inter text-[13px] text-[#bdbdbd]">Klien berkolaborasi</p>
            </motion.div>

            {/* Metric 4 */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="flex flex-col gap-[6px] lg:border-l lg:border-[#383838] lg:pl-[28px]"
            >
              <p className="font-poppins font-medium text-[34px] md:text-[38px] text-white leading-none">
                40<span className="text-[#ff6b35]">+</span>
              </p>
              <p className="font-inter text-[13px] text-[#bdbdbd]">Profesional produksi</p>
            </motion.div>
          </div>
          <p className="text-[10px] text-[#8d8d8d]">
            Rekam jejak terverifikasi dari rangkaian produksi konser musik, gathering korporat, dan eksibisi.
          </p>
        </div>
      </section>

      {/* 3. LAYANAN KAMI (Figma Node 46:3323) */}
      <section id="layanan" className="px-5 sm:px-8 md:px-[72px] py-[88px] max-w-[1440px] mx-auto">
        <div className="flex flex-col gap-[40px]">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6"
          >
            <div className="flex flex-col gap-[16px] max-w-[760px]">
              <div className="flex items-center gap-[12px]">
                <div className="w-[24px] h-[2px] bg-[#ff6b35]" />
                <span className="font-semibold text-[#bdbdbd] text-[11px] tracking-[1.54px]">
                  LAYANAN KAMI
                </span>
              </div>
              <h2 className="font-poppins font-medium text-[32px] md:text-[38px] text-white tracking-[-1.14px] leading-[1.22]">
                Ide besar. Eksekusi luar biasa.
              </h2>
            </div>
            <p className="text-[14px] text-[#bdbdbd] max-w-[350px] leading-[1.7]">
              Setiap acara punya cerita. Kami menyiapkan setiap detail agar cerita Anda terasa hidup.
            </p>
          </motion.div>

          {/* 4 Service Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[24px]">
            {/* Service 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: 0.05 }}
              whileHover={{ y: -6 }}
              className="flex flex-col gap-[20px] group cursor-pointer"
            >
              <div className="relative h-[280px] md:h-[300px] rounded-[10px] overflow-hidden bg-[#242424] border border-[#383838] group-hover:border-[#ff6b35]/60 transition-colors">
                <Image
                  src="/figma/corporate-event.png"
                  alt="Acara Korporat"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="flex flex-col gap-[10px]">
                <span className="font-medium text-[#858585] text-[9px] tracking-[1.26px]">
                  KONEKSI & INSPIRASI
                </span>
                <div className="flex items-center justify-between">
                  <h3 className="font-poppins font-medium text-[20px] text-white tracking-[-0.42px]">
                    Acara Korporat
                  </h3>
                  <ArrowUpRight className="w-5 h-5 text-[#bdbdbd] group-hover:text-[#ff6b35] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
                <p className="text-[13px] text-[#bdbdbd] leading-[1.65]">
                  Konferensi, peluncuran produk, dan aktivasi merek yang tepat sasaran.
                </p>
              </div>
            </motion.div>

            {/* Service 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: 0.15 }}
              whileHover={{ y: -6 }}
              className="flex flex-col gap-[20px] group cursor-pointer"
            >
              <div className="relative h-[280px] md:h-[300px] rounded-[10px] overflow-hidden bg-[#242424] border border-[#383838] group-hover:border-[#ff6b35]/60 transition-colors">
                <Image
                  src="/figma/festival-event.png"
                  alt="Konser & Festival"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="flex flex-col gap-[10px]">
                <span className="font-medium text-[#858585] text-[9px] tracking-[1.26px]">
                  ENERGI TANPA BATAS
                </span>
                <div className="flex items-center justify-between">
                  <h3 className="font-poppins font-medium text-[20px] text-white tracking-[-0.42px]">
                    Konser & Festival
                  </h3>
                  <ArrowUpRight className="w-5 h-5 text-[#bdbdbd] group-hover:text-[#ff6b35] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
                <p className="text-[13px] text-[#bdbdbd] leading-[1.65]">
                  Panggung, tata suara, dan cahaya yang menyatukan seluruh penonton.
                </p>
              </div>
            </motion.div>

            {/* Service 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: 0.25 }}
              whileHover={{ y: -6 }}
              className="flex flex-col gap-[20px] group cursor-pointer"
            >
              <div className="relative h-[280px] md:h-[300px] rounded-[10px] overflow-hidden bg-[#242424] border border-[#383838] group-hover:border-[#ff6b35]/60 transition-colors">
                <Image
                  src="/figma/wedding-event.png"
                  alt="Pernikahan"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="flex flex-col gap-[10px]">
                <span className="font-medium text-[#858585] text-[9px] tracking-[1.26px]">
                  MOMEN PALING PERSONAL
                </span>
                <div className="flex items-center justify-between">
                  <h3 className="font-poppins font-medium text-[20px] text-white tracking-[-0.42px]">
                    Pernikahan
                  </h3>
                  <ArrowUpRight className="w-5 h-5 text-[#bdbdbd] group-hover:text-[#ff6b35] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
                <p className="text-[13px] text-[#bdbdbd] leading-[1.65]">
                  Perayaan yang dirancang penuh makna untuk hari istimewa Anda.
                </p>
              </div>
            </motion.div>

            {/* Service 4 */}
            <motion.div 
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: 0.35 }}
              whileHover={{ y: -6 }}
              className="flex flex-col gap-[20px] group cursor-pointer"
            >
              <div className="relative h-[280px] md:h-[300px] rounded-[10px] overflow-hidden bg-[#242424] border border-[#383838] group-hover:border-[#ff6b35]/60 transition-colors">
                <Image
                  src="/figma/private-event.png"
                  alt="Acara Privat"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="flex flex-col gap-[10px]">
                <span className="font-medium text-[#858585] text-[9px] tracking-[1.26px]">
                  RAYAKAN DENGAN CARA ANDA
                </span>
                <div className="flex items-center justify-between">
                  <h3 className="font-poppins font-medium text-[20px] text-white tracking-[-0.42px]">
                    Acara Privat
                  </h3>
                  <ArrowUpRight className="w-5 h-5 text-[#bdbdbd] group-hover:text-[#ff6b35] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
                <p className="text-[13px] text-[#bdbdbd] leading-[1.65]">
                  Pertemuan intim dan perayaan personal dengan sentuhan istimewa.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. TENTANG KINETIK (Figma Node 46:3373) */}
      <section id="tentang" className="bg-[#242424] border-y border-[#383838] px-5 sm:px-8 md:px-[72px] py-[88px]">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-[48px] lg:gap-[72px] items-center">
          {/* Left: Production BTS Photo Card */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 relative h-[380px] md:h-[450px] rounded-[12px] overflow-hidden border border-[#383838] group"
          >
            <Image
              src="/figma/bts-production.png"
              alt="KINETIK Production Story"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            {/* Photo Caption floating box */}
            <div className="absolute bottom-[24px] left-[24px] right-[24px] bg-[#171717] rounded-[6px] p-[20px] flex items-center justify-between border border-[#383838]">
              <div className="flex flex-col gap-[4px]">
                <p className="font-medium text-[14px] text-white">
                  Di balik setiap momen, ada tim yang peduli.
                </p>
                <p className="text-[11px] text-[#bdbdbd]">
                  Kreativitas. Presisi teknis. Satu visi.
                </p>
              </div>
              <AudioLines className="w-6 h-6 text-[#ff6b35] shrink-0" />
            </div>
          </motion.div>

          {/* Right: Company Introduction */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 flex flex-col gap-[22px]"
          >
            <div className="flex items-center gap-[12px]">
              <div className="w-[24px] h-[2px] bg-[#ff6b35]" />
              <span className="font-semibold text-[#bdbdbd] text-[11px] tracking-[1.54px]">
                TENTANG KINETIK
              </span>
            </div>

            <h2 className="font-poppins font-medium text-[32px] md:text-[38px] text-white tracking-[-1.14px] leading-[1.22]">
              Partner kreatif Anda,<br />
              dari konsep ke panggung.
            </h2>

            <p className="text-[15px] text-[#bdbdbd] leading-[1.7]">
              KINETIK Event Production & Organizer mengubah ide menjadi pengalaman yang menggerakkan orang. Kami menggabungkan kreativitas dengan produksi yang terencana.
            </p>

            <p className="text-[15px] text-[#bdbdbd] leading-[1.7]">
              Konsep, desain, koordinasi vendor, hingga cue terakhir: semua terhubung dalam satu tim. Anda fokus pada tujuan acara, kami mengurus detail di baliknya.
            </p>

            {/* 3 Capabilities Badges */}
            <div className="flex flex-wrap items-center gap-[24px] pt-1">
              <div className="flex items-center gap-[8px]">
                <div className="w-4 h-4 rounded-full bg-[#ff6b35]/20 flex items-center justify-center text-[#ff6b35]">
                  <Check className="w-3 h-3" />
                </div>
                <span className="text-[13px] text-white">Konsep kreatif</span>
              </div>
              <div className="flex items-center gap-[8px]">
                <div className="w-4 h-4 rounded-full bg-[#ff6b35]/20 flex items-center justify-center text-[#ff6b35]">
                  <Check className="w-3 h-3" />
                </div>
                <span className="text-[13px] text-white">Produksi teknis</span>
              </div>
              <div className="flex items-center gap-[8px]">
                <div className="w-4 h-4 rounded-full bg-[#ff6b35]/20 flex items-center justify-center text-[#ff6b35]">
                  <Check className="w-3 h-3" />
                </div>
                <span className="text-[13px] text-white">Manajemen acara</span>
              </div>
            </div>

            <div className="pt-2">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="inline-block">
                <Link
                  href="/checkout"
                  className="inline-flex items-center justify-center gap-[14px] bg-[#ff6b35] text-[#171717] font-semibold text-[14px] h-[56px] px-[26px] rounded-[6px] hover:bg-[#e5531e] transition-colors"
                >
                  <span>Kenali Tim Kami</span>
                  <ArrowUpRight className="w-[18px] h-[18px]" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 5. PORTOFOLIO PILIHAN (Figma Node 46:3402) */}
      <section id="portofolio" className="px-5 sm:px-8 md:px-[72px] py-[88px] max-w-[1440px] mx-auto">
        <div className="flex flex-col gap-[36px]">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
          >
            <div className="flex flex-col gap-[16px] max-w-[760px]">
              <div className="flex items-center gap-[12px]">
                <div className="w-[24px] h-[2px] bg-[#ff6b35]" />
                <span className="font-semibold text-[#bdbdbd] text-[11px] tracking-[1.54px]">
                  PORTOFOLIO PILIHAN
                </span>
              </div>
              <h2 className="font-poppins font-medium text-[32px] md:text-[38px] text-white tracking-[-1.14px] leading-[1.22]">
                Momen berlalu. Kesan tinggal.
              </h2>
            </div>
            <Link
              href="#paket"
              className="flex items-center gap-[8px] text-[13px] text-white hover:text-[#ff6b35] transition-colors group"
            >
              <span>Jelajahi portofolio</span>
              <ArrowUpRight className="w-4 h-4 text-[#ff6b35] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px]">
            {/* Project 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -6 }}
              className="flex flex-col gap-[16px] group cursor-pointer"
            >
              <div className="relative h-[280px] md:h-[300px] rounded-[12px] overflow-hidden bg-[#242424] border border-[#383838] group-hover:border-[#ff6b35]/60 transition-colors">
                <Image
                  src="/figma/corporate-event.png"
                  alt="Ruang untuk gagasan baru"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <span className="text-[10px] tracking-[1px] text-[#8d8d8d]">
                KORPORAT / KONFERENSI
              </span>
              <div className="flex items-center justify-between">
                <h3 className="font-poppins font-medium text-[20px] text-white">
                  Ruang untuk gagasan baru
                </h3>
                <ArrowUpRight className="w-5 h-5 text-[#bdbdbd] group-hover:text-[#ff6b35] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <p className="text-[12px] text-[#bdbdbd]">
                Konsep · Tata panggung · Audio visual
              </p>
            </motion.div>

            {/* Project 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -6 }}
              className="flex flex-col gap-[16px] group cursor-pointer"
            >
              <div className="relative h-[280px] md:h-[300px] rounded-[12px] overflow-hidden bg-[#242424] border border-[#383838] group-hover:border-[#ff6b35]/60 transition-colors">
                <Image
                  src="/figma/festival-event.png"
                  alt="Satu panggung, ribuan energi"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <span className="text-[10px] tracking-[1px] text-[#8d8d8d]">
                HIBURAN / FESTIVAL
              </span>
              <div className="flex items-center justify-between">
                <h3 className="font-poppins font-medium text-[20px] text-white">
                  Satu panggung, ribuan energi
                </h3>
                <ArrowUpRight className="w-5 h-5 text-[#bdbdbd] group-hover:text-[#ff6b35] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <p className="text-[12px] text-[#bdbdbd]">
                Stage design · Lighting · Show management
              </p>
            </motion.div>

            {/* Project 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -6 }}
              className="flex flex-col gap-[16px] group cursor-pointer"
            >
              <div className="relative h-[280px] md:h-[300px] rounded-[12px] overflow-hidden bg-[#242424] border border-[#383838] group-hover:border-[#ff6b35]/60 transition-colors">
                <Image
                  src="/figma/wedding-event.png"
                  alt="Perayaan di bawah bintang"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <span className="text-[10px] tracking-[1px] text-[#8d8d8d]">
                PERSONAL / PERNIKAHAN
              </span>
              <div className="flex items-center justify-between">
                <h3 className="font-poppins font-medium text-[20px] text-white">
                  Perayaan di bawah bintang
                </h3>
                <ArrowUpRight className="w-5 h-5 text-[#bdbdbd] group-hover:text-[#ff6b35] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <p className="text-[12px] text-[#bdbdbd]">
                Perencanaan · Dekorasi · Koordinasi hari-H
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 6. PAKET PRODUKSI & KATALOG EVENT RESMI (Figma Node 46:3435) */}
      <section id="paket" className="bg-[#242424] border-y border-[#383838] px-5 sm:px-8 md:px-[72px] py-[88px]">
        <div className="max-w-[1440px] mx-auto flex flex-col gap-[36px]">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6"
          >
            <div className="flex flex-col gap-[16px] max-w-[760px]">
              <div className="flex items-center gap-[12px]">
                <div className="w-[24px] h-[2px] bg-[#ff6b35]" />
                <span className="font-semibold text-[#bdbdbd] text-[11px] tracking-[1.54px]">
                  PAKET PRODUKSI & LAYANAN
                </span>
              </div>
              <h2 className="font-poppins font-medium text-[32px] md:text-[38px] text-white tracking-[-1.14px] leading-[1.22]">
                Rencana jelas. Ruang berkreasi.
              </h2>
            </div>
            <p className="text-[14px] text-[#bdbdbd] max-w-[350px] leading-[1.7]">
              Pilih titik awal yang sesuai. Kami menyesuaikan lingkup, skala, dan kebutuhan acara Anda.
            </p>
          </motion.div>

          {/* 3 Main Package Cards from Figma */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-[24px]">
            {/* Package 1: Essential */}
            <motion.div 
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -6 }}
              className="bg-[#171717] border border-[#383838] hover:border-neutral-600 rounded-[12px] p-[28px] flex flex-col justify-between gap-[22px] transition-colors"
            >
              <div className="flex flex-col gap-[16px]">
                <p className="text-[9px] tracking-[0.54px] text-[#bdbdbd] uppercase">
                  Acara Privat & Komunitas
                </p>
                <div>
                  <h3 className="font-poppins font-medium text-[23px] text-white">
                    Essential
                  </h3>
                  <p className="font-poppins text-white mt-1">
                    <span className="font-inter text-[12px] text-[#bdbdbd]">Mulai dari </span>
                    <span className="text-[32px] font-medium text-[#ff6b35]">Rp25</span>
                    <span className="text-[16px] text-white"> juta</span>
                  </p>
                </div>
                <p className="text-[13px] text-[#bdbdbd] leading-[1.7]">
                  Fondasi yang tepat untuk perayaan dan gathering komunitas personal.
                </p>
                <div className="border-t border-[#383838] pt-[20px] flex flex-col gap-[12px]">
                  <div className="flex items-center gap-[10px] text-[12px] text-[#bdbdbd]">
                    <Check className="w-4 h-4 text-[#ff6b35] shrink-0" />
                    <span>Konsep dan rundown acara</span>
                  </div>
                  <div className="flex items-center gap-[10px] text-[12px] text-[#bdbdbd]">
                    <Check className="w-4 h-4 text-[#ff6b35] shrink-0" />
                    <span>Koordinasi vendor inti</span>
                  </div>
                  <div className="flex items-center gap-[10px] text-[12px] text-[#bdbdbd]">
                    <Check className="w-4 h-4 text-[#ff6b35] shrink-0" />
                    <span>Tim operasional hari-H</span>
                  </div>
                  <div className="flex items-center gap-[10px] text-[12px] text-[#bdbdbd]">
                    <Check className="w-4 h-4 text-[#ff6b35] shrink-0" />
                    <span>Konsultasi pra-acara</span>
                  </div>
                </div>
              </div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/checkout?product_id=1"
                  className="w-full border border-white/40 text-white font-semibold text-[13px] h-[44px] rounded-[6px] flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  Diskusikan Paket
                </Link>
              </motion.div>
            </motion.div>

            {/* Package 2: Corporate Signature (Featured in Figma with #ff6b35 border) */}
            <motion.div 
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -6 }}
              className="bg-[#171717] border-2 border-[#ff6b35] rounded-[12px] p-[28px] flex flex-col justify-between gap-[22px] relative"
            >
              <div className="flex flex-col gap-[16px]">
                <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.54px]">
                  <span className="text-[#bdbdbd]">Korporat & Brand Experience</span>
                  <span className="text-[#ff6b35] font-semibold bg-[#38271f] px-2 py-0.5 rounded">
                    PILIHAN TIM
                  </span>
                </div>
                <div>
                  <h3 className="font-poppins font-medium text-[23px] text-white">
                    Corporate Signature
                  </h3>
                  <p className="font-poppins text-white mt-1">
                    <span className="font-inter text-[12px] text-[#bdbdbd]">Mulai dari </span>
                    <span className="text-[32px] font-medium text-[#ff6b35]">Rp60</span>
                    <span className="text-[16px] text-white"> juta</span>
                  </p>
                </div>
                <p className="text-[13px] text-[#bdbdbd] leading-[1.7]">
                  Pengalaman merek dan gathering perusahaan dengan detail yang terencana.
                </p>
                <div className="border-t border-[#383838] pt-[20px] flex flex-col gap-[12px]">
                  <div className="flex items-center gap-[10px] text-[12px] text-[#bdbdbd]">
                    <Check className="w-4 h-4 text-[#ff6b35] shrink-0" />
                    <span>Konsep kreatif & desain panggung</span>
                  </div>
                  <div className="flex items-center gap-[10px] text-[12px] text-[#bdbdbd]">
                    <Check className="w-4 h-4 text-[#ff6b35] shrink-0" />
                    <span>Perencanaan produksi menyeluruh</span>
                  </div>
                  <div className="flex items-center gap-[10px] text-[12px] text-[#bdbdbd]">
                    <Check className="w-4 h-4 text-[#ff6b35] shrink-0" />
                    <span>Project manager khusus</span>
                  </div>
                  <div className="flex items-center gap-[10px] text-[12px] text-[#bdbdbd]">
                    <Check className="w-4 h-4 text-[#ff6b35] shrink-0" />
                    <span>Koordinasi dan evaluasi acara</span>
                  </div>
                </div>
              </div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/checkout?product_id=2"
                  className="w-full bg-[#ff6b35] text-[#171717] font-semibold text-[13px] h-[44px] rounded-[6px] flex items-center justify-center hover:bg-[#e5531e] transition-colors"
                >
                  Diskusikan Paket
                </Link>
              </motion.div>
            </motion.div>

            {/* Package 3: Live Experience */}
            <motion.div 
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -6 }}
              className="bg-[#171717] border border-[#383838] hover:border-neutral-600 rounded-[12px] p-[28px] flex flex-col justify-between gap-[22px] transition-colors"
            >
              <div className="flex flex-col gap-[16px]">
                <p className="text-[9px] tracking-[0.54px] text-[#bdbdbd] uppercase">
                  Konser & Festival
                </p>
                <div>
                  <h3 className="font-poppins font-medium text-[23px] text-white">
                    Live Experience
                  </h3>
                  <p className="font-poppins text-white mt-1">
                    <span className="font-inter text-[12px] text-[#bdbdbd]">Mulai dari </span>
                    <span className="text-[32px] font-medium text-[#ff6b35]">Rp125</span>
                    <span className="text-[16px] text-white"> juta</span>
                  </p>
                </div>
                <p className="text-[13px] text-[#bdbdbd] leading-[1.7]">
                  Produksi panggung skala besar, dari backstage hingga front row.
                </p>
                <div className="border-t border-[#383838] pt-[20px] flex flex-col gap-[12px]">
                  <div className="flex items-center gap-[10px] text-[12px] text-[#bdbdbd]">
                    <Check className="w-4 h-4 text-[#ff6b35] shrink-0" />
                    <span>Desain panggung & show flow</span>
                  </div>
                  <div className="flex items-center gap-[10px] text-[12px] text-[#bdbdbd]">
                    <Check className="w-4 h-4 text-[#ff6b35] shrink-0" />
                    <span>Perencanaan teknis audio visual</span>
                  </div>
                  <div className="flex items-center gap-[10px] text-[12px] text-[#bdbdbd]">
                    <Check className="w-4 h-4 text-[#ff6b35] shrink-0" />
                    <span>Manajemen kru dan talent</span>
                  </div>
                  <div className="flex items-center gap-[10px] text-[12px] text-[#bdbdbd]">
                    <Check className="w-4 h-4 text-[#ff6b35] shrink-0" />
                    <span>Show director & stage manager</span>
                  </div>
                </div>
              </div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/checkout?product_id=3"
                  className="w-full border border-white/40 text-white font-semibold text-[13px] h-[44px] rounded-[6px] flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  Diskusikan Paket
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* Database Live Event & Equipment Catalog */}
          <div className="pt-8 border-t border-[#383838]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="font-poppins font-medium text-[20px] text-white">
                  Katalog Tiket & Penyewaan Alat Aktif
                </h3>
                <p className="text-xs text-[#bdbdbd] mt-1">
                  Pemesanan tiket festival, konser langsung, dan sistem audio visual terhubung database.
                </p>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-3 py-1.5 rounded-[6px] text-xs font-medium transition-colors ${
                    selectedCategory === null
                      ? 'bg-[#ff6b35] text-[#171717] font-semibold'
                      : 'bg-[#171717] border border-[#383838] text-[#bdbdbd] hover:text-white'
                  }`}
                >
                  Semua ({products.length})
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.id)}
                    className={`px-3 py-1.5 rounded-[6px] text-xs font-medium transition-colors ${
                      selectedCategory === c.id
                        ? 'bg-[#ff6b35] text-[#171717] font-semibold'
                        : 'bg-[#171717] border border-[#383838] text-[#bdbdbd] hover:text-white'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid of Database Items */}
            {loading ? (
              <div className="py-12 text-center text-sm text-[#8d8d8d]">
                Memuat data katalog event...
              </div>
            ) : products.length === 0 ? (
              <div className="py-12 text-center text-sm text-[#8d8d8d]">
                Belum ada produk di kategori ini.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-20px" }}
                    transition={{ duration: 0.4, delay: (idx % 4) * 0.08 }}
                    whileHover={{ y: -4 }}
                    className="bg-[#171717] border border-[#383838] rounded-[10px] overflow-hidden flex flex-col justify-between hover:border-[#ff6b35]/60 transition-colors group"
                  >
                    <div>
                      <div className="relative h-[160px] bg-[#242424] overflow-hidden">
                        <Image
                          src={item.image_url || '/figma/festival-event.png'}
                          alt={item.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2.5 right-2.5 bg-[#171717]/90 px-2 py-0.5 rounded text-[10px] font-medium text-[#e9c47d] border border-[#383838]">
                          {item.stock > 0 ? `Kuota: ${item.stock}` : 'Habis'}
                        </div>
                      </div>
                      <div className="p-4 flex flex-col gap-2">
                        <p className="text-[10px] text-[#ff6b35] font-semibold tracking-wider uppercase">
                          {item.category_name}
                        </p>
                        <h4 className="font-poppins font-medium text-[16px] text-white line-clamp-1">
                          {item.name}
                        </h4>
                        <p className="text-xs text-[#8d8d8d] line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 pt-0 border-t border-[#383838]/50 mt-3 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-[#8d8d8d] block">Harga</span>
                        <span className="font-poppins font-semibold text-white text-[15px]">
                          {formatRupiah(item.price)}
                        </span>
                      </div>
                      <Link
                        href={`/checkout?product_id=${item.id}`}
                        className="bg-[#ff6b35] text-[#171717] font-semibold text-xs px-3.5 py-2 rounded-[6px] hover:bg-[#e5531e] transition-colors"
                      >
                        Pesan
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 7. PROSES KAMI (Figma Node 46:3514) */}
      <section className="px-5 sm:px-8 md:px-[72px] py-[80px] max-w-[1440px] mx-auto">
        <div className="flex flex-col gap-[36px]">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-4"
          >
            <div className="flex flex-col gap-[16px] max-w-[750px]">
              <div className="flex items-center gap-[12px]">
                <div className="w-[24px] h-[2px] bg-[#ff6b35]" />
                <span className="font-semibold text-[#bdbdbd] text-[11px] tracking-[1.54px]">
                  PROSES KAMI
                </span>
              </div>
              <h2 className="font-poppins font-medium text-[32px] md:text-[38px] text-white tracking-[-1.14px] leading-[1.22]">
                Satu visi. Setiap tahap terarah.
              </h2>
            </div>
            <p className="text-[13px] text-[#bdbdbd]">
              Terbuka sejak brief, tenang saat hari-H.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[32px]">
            {/* Stage 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5 }}
              className="border-t border-[#383838] pt-[22px] flex flex-col gap-[14px]"
            >
              <span className="font-inter text-[#ff6b35] text-[12px] font-semibold">Tahap 1</span>
              <h3 className="font-poppins text-[21px] text-white">Dengarkan</h3>
              <p className="text-[13px] text-[#bdbdbd] leading-[1.7]">
                Ceritakan tujuan, audiens, dan anggaran. Kami menyusun brief bersama.
              </p>
            </motion.div>

            {/* Stage 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="border-t border-[#383838] pt-[22px] flex flex-col gap-[14px]"
            >
              <span className="font-inter text-[#ff6b35] text-[12px] font-semibold">Tahap 2</span>
              <h3 className="font-poppins text-[21px] text-white">Rancang</h3>
              <p className="text-[13px] text-[#bdbdbd] leading-[1.7]">
                Konsep kreatif, lingkup produksi, dan penawaran yang transparan.
              </p>
            </motion.div>

            {/* Stage 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="border-t border-[#383838] pt-[22px] flex flex-col gap-[14px]"
            >
              <span className="font-inter text-[#ff6b35] text-[12px] font-semibold">Tahap 3</span>
              <h3 className="font-poppins text-[21px] text-white">Wujudkan</h3>
              <p className="text-[13px] text-[#bdbdbd] leading-[1.7]">
                Tim teknis dan operasional menghidupkan setiap detail acara.
              </p>
            </motion.div>

            {/* Stage 4 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="border-t border-[#383838] pt-[22px] flex flex-col gap-[14px]"
            >
              <span className="font-inter text-[#ff6b35] text-[12px] font-semibold">Tahap 4</span>
              <h3 className="font-poppins text-[21px] text-white">Evaluasi</h3>
              <p className="text-[13px] text-[#bdbdbd] leading-[1.7]">
                Dokumentasi dan evaluasi bersama untuk langkah berikutnya.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 8. ACARA KAMI / AGENDA (Figma Node 46:3539) */}
      <section id="acara" className="bg-[#242424] border-y border-[#383838] px-5 sm:px-8 md:px-[72px] py-[64px]">
        <div className="max-w-[1440px] mx-auto flex flex-col gap-[30px]">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
          >
            <div className="flex flex-col gap-[14px] max-w-[800px]">
              <div className="flex items-center gap-[12px]">
                <div className="w-[24px] h-[2px] bg-[#ff6b35]" />
                <span className="font-semibold text-[#bdbdbd] text-[11px] tracking-[1.54px]">
                  ACARA KAMI
                </span>
              </div>
              <h2 className="font-poppins font-medium text-[28px] md:text-[32px] text-white tracking-[-0.96px] leading-[1.22]">
                Ruang bertemu, berbagi, dan berkolaborasi.
              </h2>
            </div>
            <p className="text-[11px] text-[#8d8d8d]">Agenda terdekat</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
            {/* Card 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -4 }}
              className="bg-[#171717] rounded-[12px] p-[20px] sm:p-[24px] flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-[24px] border border-[#383838] hover:border-[#ff6b35]/60 transition-colors cursor-pointer group"
            >
              <div className="flex sm:flex-col items-center justify-between sm:justify-center shrink-0 border-b sm:border-b-0 sm:border-r border-[#383838] pb-3 sm:pb-0 sm:pr-4 sm:w-[76px]">
                <div className="flex sm:flex-col items-baseline sm:items-center gap-2 sm:gap-0">
                  <span className="font-poppins text-[32px] sm:text-[36px] text-white leading-none">14</span>
                  <span className="text-[9px] text-[#8d8d8d] tracking-[0.54px] mt-1 font-semibold">NOV 2026</span>
                </div>
                <ArrowUpRight className="sm:hidden w-5 h-5 text-[#8d8d8d] group-hover:text-[#ff6b35] transition-colors" />
              </div>
              <div className="flex-1 flex flex-col gap-[6px]">
                <span className="text-[10px] text-[#ff6b35] font-medium">Sesi berbagi · Studio KINETIK</span>
                <h3 className="font-poppins text-[18px] sm:text-[20px] text-white">Di Balik Produksi</h3>
                <p className="text-[12px] text-[#bdbdbd] leading-[1.6]">
                  Percakapan tentang ide, panggung, dan kolaborasi.
                </p>
              </div>
              <ArrowUpRight className="hidden sm:block w-5 h-5 text-[#8d8d8d] group-hover:text-[#ff6b35] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
            </motion.div>

            {/* Card 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-[#171717] rounded-[12px] p-[20px] sm:p-[24px] flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-[24px] border border-[#383838] hover:border-[#ff6b35]/60 transition-colors cursor-pointer group"
            >
              <div className="flex sm:flex-col items-center justify-between sm:justify-center shrink-0 border-b sm:border-b-0 sm:border-r border-[#383838] pb-3 sm:pb-0 sm:pr-4 sm:w-[76px]">
                <div className="flex sm:flex-col items-baseline sm:items-center gap-2 sm:gap-0">
                  <span className="font-poppins text-[32px] sm:text-[36px] text-white leading-none">4</span>
                  <span className="text-[9px] text-[#8d8d8d] tracking-[0.54px] mt-1 font-semibold">DES 2026</span>
                </div>
                <ArrowUpRight className="sm:hidden w-5 h-5 text-[#8d8d8d] group-hover:text-[#ff6b35] transition-colors" />
              </div>
              <div className="flex-1 flex flex-col gap-[6px]">
                <span className="text-[10px] text-[#ff6b35] font-medium">Showcase produksi · Jakarta</span>
                <h3 className="font-poppins text-[18px] sm:text-[20px] text-white">KINETIK Creative Session</h3>
                <p className="text-[12px] text-[#bdbdbd] leading-[1.6]">
                  Temui tim dan eksplorasi kemungkinan acara Anda.
                </p>
              </div>
              <ArrowUpRight className="hidden sm:block w-5 h-5 text-[#8d8d8d] group-hover:text-[#ff6b35] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 9. CONSULTATION INVITATION / CTA (Figma Node 46:3566) */}
      <section className="px-5 sm:px-8 md:px-[72px] py-[80px] max-w-[1440px] mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5 }}
          className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8"
        >
          <div className="flex flex-col gap-[20px] max-w-[850px]">
            <div className="flex items-center gap-[12px]">
              <div className="w-[24px] h-[2px] bg-[#ff6b35]" />
              <span className="font-semibold text-[#bdbdbd] text-[11px] tracking-[1.54px]">
                MULAI DARI OBROLAN
              </span>
            </div>
            <h2 className="font-poppins font-medium text-[36px] md:text-[44px] text-white tracking-[-1.32px] leading-[1.22]">
              Acara hebat dimulai<br />
              dari satu percakapan.
            </h2>
            <p className="text-[15px] text-[#bdbdbd] leading-[1.7]">
              Ceritakan visi Anda. Mari kita susun pengalaman yang layak dikenang.
            </p>
          </div>

          <div className="flex flex-col items-start sm:items-center gap-[16px] shrink-0">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/checkout"
                className="bg-[#ff6b35] text-[#171717] font-semibold text-[14px] h-[56px] px-[26px] rounded-[6px] flex items-center justify-center gap-[14px] hover:bg-[#e5531e] transition-colors whitespace-nowrap"
              >
                <span>Konsultasi Sekarang</span>
                <ArrowUpRight className="w-[18px] h-[18px]" />
              </Link>
            </motion.div>
            <span className="text-[11px] text-[#8d8d8d]">
              Tanpa komitmen pemesanan.
            </span>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
