'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from './Logo';
import { Database, ShieldCheck, CreditCard, Printer, FileText } from 'lucide-react';

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
              Manajemen acara, promotor festival musik, dan penyewaan alat panggung profesional: integrasi database MySQL, multi-aktor login, payment gateway sandbox, cetak invoice/e-ticket, dan laporan keuangan SAK EMKM.
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

          {/* Fitur Terverifikasi */}
          <div>
            <h3 className="font-bold text-base mb-4 border-b-2 border-black pb-1">
              Kriteria Terpenuhi
            </h3>
            <ul className="space-y-2.5 text-xs font-bold text-neutral-800">
              <li className="flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-800 flex-shrink-0" />
                <span>Database MySQL (phpMyAdmin)</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-800 flex-shrink-0" />
                <span>Multi-Aktor Login (Admin dan User)</span>
              </li>
              <li className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-800 flex-shrink-0" />
                <span>Payment Gateway Sandbox (QRIS & VA)</span>
              </li>
              <li className="flex items-center gap-2">
                <Printer className="w-4 h-4 text-emerald-800 flex-shrink-0" />
                <span>Cetak Invoice dan Struk Kasir</span>
              </li>
              <li className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-800 flex-shrink-0" />
                <span>Laporan Omzet dan Laba Rugi PDF</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t-2 border-black flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-neutral-800">
          <p>© 2026 KINETIK Event Production & Organizer. Proyek Digital Entrepreneurship.</p>
          <p className="flex items-center gap-1">
            <span>Dijalankan di</span>
            <code className="px-1.5 py-0.5 bg-white border-2 border-black">http://localhost:3000</code>
          </p>
        </div>
      </div>
    </footer>
  );
}
