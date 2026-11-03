'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Instagram, Linkedin, Youtube } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();

  // Jangan tampilkan footer publik di portal admin
  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-[#242424] border-t border-[#383838] pt-[60px] pb-[28px] px-5 sm:px-8 md:px-[72px] text-[#bdbdbd] no-print">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12 pb-[44px]">
          {/* Agency Summary (col-span-2) */}
          <div className="lg:col-span-2 flex flex-col gap-[22px]">
            <Link href="/" className="flex items-center gap-[10px] group">
              <div className="relative w-[30px] h-[34px] shrink-0">
                <Image
                  src="/figma/kinetik-symbol.svg"
                  alt="KINETIK Symbol"
                  width={30}
                  height={34}
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-poppins font-bold text-[25px] text-white tracking-[1.25px]">
                  KINETIK
                </span>
                <span className="font-inter text-[#bdbdbd] text-[6.5px] tracking-[0.65px] mt-[3px]">
                  EVENT PRODUCTION & ORGANIZER
                </span>
              </div>
            </Link>

            <p className="font-inter text-[13px] leading-[1.7] text-[#bdbdbd] max-w-[360px]">
              Partner kreatif untuk produksi acara yang bermakna. Dari visi Anda, menjadi pengalaman bersama.
            </p>

            <div className="flex items-center gap-[12px]">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-[34px] h-[34px] rounded-[6px] border border-[#383838] bg-[#171717] flex items-center justify-center text-[#bdbdbd] hover:text-[#ff6b35] hover:border-[#ff6b35] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-[34px] h-[34px] rounded-[6px] border border-[#383838] bg-[#171717] flex items-center justify-center text-[#bdbdbd] hover:text-[#ff6b35] hover:border-[#ff6b35] transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-[34px] h-[34px] rounded-[6px] border border-[#383838] bg-[#171717] flex items-center justify-center text-[#bdbdbd] hover:text-[#ff6b35] hover:border-[#ff6b35] transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Nav: Jelajahi */}
          <div className="flex flex-col gap-[18px]">
            <p className="font-inter font-semibold text-[13px] text-white">
              Jelajahi
            </p>
            <ul className="flex flex-col gap-[12px] font-inter text-[12px]">
              <li>
                <Link href="/#tentang" className="hover:text-white transition-colors">Tentang KINETIK</Link>
              </li>
              <li>
                <Link href="/#layanan" className="hover:text-white transition-colors">Layanan</Link>
              </li>
              <li>
                <Link href="/#portofolio" className="hover:text-white transition-colors">Portofolio</Link>
              </li>
              <li>
                <Link href="/#paket" className="hover:text-white transition-colors">Paket Produksi</Link>
              </li>
              <li>
                <Link href="/#acara" className="hover:text-white transition-colors">Acara Kami</Link>
              </li>
            </ul>
          </div>

          {/* Nav: Untuk Klien */}
          <div className="flex flex-col gap-[18px]">
            <p className="font-inter font-semibold text-[13px] text-white">
              Untuk Klien
            </p>
            <ul className="flex flex-col gap-[12px] font-inter text-[12px]">
              <li>
                <Link href="/checkout" className="hover:text-white transition-colors">Konsultasi Acara</Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">Masuk ke Panel Klien</Link>
              </li>
              <li>
                <Link href="/my-orders" className="hover:text-white transition-colors">Booking & Pembayaran</Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-[#ff6b35] transition-colors">Portal Pengelola (Admin)</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col gap-[18px]">
            <p className="font-inter font-semibold text-[13px] text-white">
              Mari Terhubung
            </p>
            <div className="flex flex-col gap-[10px] font-inter text-[12px] text-[#bdbdbd]">
              <p>halo@kinetik.example</p>
              <p>+62 812 0000 0000</p>
              <p>Jakarta, Indonesia</p>
              <p className="text-[11px] text-[#8d8d8d]">Senin–Jumat · 09.00–18.00 WIB</p>
            </div>
          </div>
        </div>

        {/* Legal Row */}
        <div className="border-t border-[#383838] pt-[24px] flex flex-col sm:flex-row items-center justify-between gap-4 font-inter text-[10px] text-[#8d8d8d]">
          <p>© 2026 KINETIK Event Production & Organizer. Seluruh hak dilindungi.</p>
          <div className="flex items-center gap-[24px]">
            <Link href="/" className="hover:text-white transition-colors">Kebijakan Privasi</Link>
            <Link href="/" className="hover:text-white transition-colors">Syarat Layanan</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
