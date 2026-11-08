'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  Wrench, ShieldAlert, ExternalLink, LogOut, 
  Building2, CheckCircle2, ChevronRight
} from 'lucide-react';

export default function VendorLayout({ children }) {
  const router = useRouter();
  const [vendorUser, setVendorUser] = useState(null);
  const [isVendor, setIsVendor] = useState(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user && (data.user.role === 'vendor' || data.user.role === 'admin')) {
          setIsVendor(true);
          setVendorUser(data.user);
        } else {
          setIsVendor(false);
        }
      })
      .catch(() => setIsVendor(false));
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  if (isVendor === null) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-[#171717] p-4 text-white">
        <div className="bg-[#242424] border border-[#383838] rounded-[10px] p-8 text-center max-w-md w-full flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#383838] border-t-[#e9c47d] rounded-full animate-spin"></div>
          <p className="font-inter text-sm text-[#bdbdbd]">Memverifikasi kredensial Mitra Vendor KINETIK...</p>
        </div>
      </div>
    );
  }

  if (isVendor === false) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-[#171717] p-4 text-white">
        <div className="max-w-md w-full bg-[#242424] border border-[#383838] rounded-[12px] p-8 text-center flex flex-col items-center gap-4" data-ui="restricted-box">
          <div className="w-14 h-14 rounded-full bg-[#393224] border border-[#e9c47d]/60 flex items-center justify-center text-[#e9c47d]">
            <Wrench className="w-7 h-7" />
          </div>
          <div className="flex flex-col gap-1.5">
            <h2 className="font-poppins font-medium text-xl text-white">Portal Terproteksi Mitra Vendor</h2>
            <p className="font-inter text-xs text-[#bdbdbd] leading-relaxed">
              Area ini khusus mitra penyedia peralatan panggung, sound, lighting, dan logistik produksi resmi KINETIK Event Production.
            </p>
          </div>
          <div className="w-full pt-2 flex flex-col gap-2.5">
            <Link
              href="/login"
              className="w-full bg-[#ff6b35] text-[#171717] font-semibold text-xs h-[42px] rounded-[6px] flex items-center justify-center gap-2 hover:bg-[#e5531e] transition-colors"
            >
              Masuk Akun Vendor
            </Link>
            <Link
              href="/"
              className="w-full bg-[#171717] border border-[#383838] text-[#bdbdbd] hover:text-white hover:border-[#ff6b35]/60 font-medium text-xs h-[42px] rounded-[6px] flex items-center justify-center gap-2 transition-colors"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] flex flex-col bg-[#171717] text-white">
      {/* 1. TOP VENDOR CONSOLE HEADER */}
      <header className="bg-[#171717] border-b border-[#383838] sticky top-0 z-40 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          {/* Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="relative w-[28px] h-[32px] shrink-0">
              <Image
                src="/figma/kinetik-symbol.svg"
                alt="KINETIK Symbol"
                width={28}
                height={32}
                className="object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 leading-none">
                <span className="font-poppins font-bold text-sm tracking-wider text-white">
                  KINETIK VENDOR
                </span>
                <span className="px-1.5 py-0.5 rounded-[4px] bg-[#e9c47d]/20 border border-[#e9c47d]/50 text-[#e9c47d] text-[10px] font-semibold uppercase">
                  PRODUCTION PARTNER
                </span>
              </div>
              <span className="font-inter text-[11px] text-[#8d8d8d] block mt-1">
                Portal Manajemen SPK, Rigging & Peralatan Acara
              </span>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2.5 text-xs">
            {/* Vendor Identity Badge */}
            <div className="flex items-center gap-2 bg-[#242424] px-3 py-1.5 border border-[#383838] rounded-[6px]">
              <Building2 className="w-3.5 h-3.5 text-[#e9c47d]" />
              <span className="text-white font-medium max-w-[160px] sm:max-w-[200px] truncate">
                {vendorUser?.name || 'Mitra Vendor Produksi'}
              </span>
              <span className="px-1.5 py-0.2 bg-[#e9c47d] text-[#171717] text-[10px] font-bold rounded">
                VENDOR
              </span>
            </div>

            {/* Admin Backlink (if user is admin viewing vendor portal) */}
            {vendorUser?.role === 'admin' && (
              <Link
                href="/admin"
                className="px-2.5 py-1.5 bg-[#38271f] text-[#ff6b35] border border-[#ff6b35]/60 rounded-[6px] flex items-center gap-1 font-semibold text-[11px]"
                title="Kembali ke Konsol Admin"
              >
                <ShieldAlert className="w-3 h-3" />
                <span className="hidden sm:inline">Ke Panel Admin</span>
              </Link>
            )}

            {/* Web Klien Link */}
            <Link
              href="/"
              target="_blank"
              className="px-3 py-1.5 bg-[#242424] hover:bg-[#2e2e2e] text-[#bdbdbd] hover:text-white border border-[#383838] rounded-[6px] flex items-center gap-1.5 transition-colors"
              title="Buka Website Klien di tab baru"
            >
              <span>Web Klien</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="p-2 bg-[#242424] hover:bg-red-950/60 hover:text-red-400 hover:border-red-800 text-[#8d8d8d] border border-[#383838] rounded-[6px] transition-colors"
              title="Keluar dari sesi Vendor"
              aria-label="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. SUB-BAR INFORMASI MITRA */}
      <div className="bg-[#1c1c1c] border-b border-[#383838] no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-between text-xs text-[#8d8d8d]">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#8cd6b0]" />
            <span>Kemitraan Resmi KINETIK: Audio Line Array, Panggung Rigging & Tata Cahaya</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-[11px]">
            <span>Status Verifikasi:</span>
            <span className="text-[#8cd6b0] font-semibold">Aktif & Siap Penugasan</span>
          </div>
        </div>
      </div>

      {/* 3. MAIN CONTENT */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {children}
      </main>

      {/* 4. FOOTER */}
      <footer className="bg-[#171717] border-t border-[#383838] py-4 px-4 text-xs text-[#8d8d8d] no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#e9c47d] inline-block"></span>
            <span className="font-inter">KINETIK Vendor Operations • Sistem Surat Perintah Kerja & Logistik Lapangan</span>
          </div>
          <div className="text-[11px] text-[#666666]">
            Sesi aktif: <strong className="text-[#bdbdbd]">{vendorUser?.email}</strong>
          </div>
        </div>
      </footer>
    </div>
  );
}
