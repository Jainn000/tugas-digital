'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from './Logo';
import { ShieldCheck, CreditCard, Printer, FileText, Ticket } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();

  // Jangan tampilkan footer publik di portal admin
  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="mt-20 border-t-2 border-black bg-[#F4EFE6] no-print">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <Logo variant="full" />
            <p className="text-sm font-medium text-neutral-800 leading-relaxed max-w-md">
              Manajemen acara, promotor festival musik, dan penyewaan alat panggung profesional dengan sistem reservasi terpadu, e-ticket digital ber-barcode unik, faktur resmi A4 standar institusi, serta laporan keuangan akurat.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="nb-tag bg-white font-bold">Event Organizer</span>
              <span className="nb-tag bg-[#A3E635] font-bold">MySQL Database</span>
              <span className="nb-tag bg-[#38BDF8] font-bold">Neubrutalism UI</span>
              <span className="nb-tag bg-[#FF5C00] text-white font-bold">Payment Sandbox</span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-bold text-base mb-4 border-b-2 border-black pb-1">
              Navigasi Halaman
            </h3>
            <ul className="space-y-2 text-sm font-bold">
              <li>
                <Link href="/" className="hover:underline hover:text-[#FF5C00]">Paket Acara & Tiket</Link>
              </li>
              <li>
                <Link href="/my-orders" className="hover:underline hover:text-[#FF5C00]">Reservasi dan Tiket Saya</Link>
              </li>
              <li>
                <Link href="/login" className="hover:underline hover:text-[#FF5C00]">Masuk Akun (Admin / User)</Link>
              </li>
              <li>
                <Link href="/admin" className="hover:underline hover:text-[#FF5C00]">Portal Pengelola</Link>
              </li>
            </ul>
          </div>

          {/* Layanan & Kapabilitas */}
          <div>
            <h3 className="font-bold text-base mb-4 border-b-2 border-black pb-1">
              Kapabilitas Layanan
            </h3>
            <ul className="space-y-2.5 text-xs font-bold text-neutral-800">
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-800 flex-shrink-0" />
                <span>Tata Suara Line-Array & Rigging Panggung</span>
              </li>
              <li className="flex items-center gap-2">
                <Ticket className="w-4 h-4 text-emerald-800 flex-shrink-0" />
                <span>E-Ticket Barcode & Gate Scanner Gate Venue</span>
              </li>
              <li className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-800 flex-shrink-0" />
                <span>Pembayaran Instan QRIS & Virtual Account</span>
              </li>
              <li className="flex items-center gap-2">
                <Printer className="w-4 h-4 text-emerald-800 flex-shrink-0" />
                <span>Faktur Resmi A4 & Pass E-Ticket Masuk</span>
              </li>
              <li className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-800 flex-shrink-0" />
                <span>Dokumentasi SPJ & Rekonsiliasi Acara</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t-2 border-black flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-neutral-800">
          <p>© 2026 KINETIK Event Production & Creative Organizer.</p>
          <p className="text-neutral-700">
            Jakarta & Bandung Service Hub • Melayani Acara Skala Nasional
          </p>
        </div>
      </div>
    </footer>
  );
}
