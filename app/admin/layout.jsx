'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, Package, ShoppingCart, BarChart3, 
  TrendingUp, ShieldAlert, ExternalLink, LogOut, Database, UserCheck, ChevronRight, Wrench
} from 'lucide-react';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [adminUser, setAdminUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(null);
  const [dbStatus, setDbStatus] = useState(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user && data.user.role === 'admin') {
          setIsAdmin(true);
          setAdminUser(data.user);
        } else {
          setIsAdmin(false);
        }
      })
      .catch(() => setIsAdmin(false));

    fetch('/api/status')
      .then(res => res.json())
      .then(data => setDbStatus(data))
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  if (isAdmin === null) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-[#171717] p-4 text-white">
        <div className="bg-[#242424] border border-[#383838] rounded-[10px] p-8 text-center max-w-md w-full flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#383838] border-t-[#ff6b35] rounded-full animate-spin"></div>
          <p className="font-inter text-sm text-[#bdbdbd]">Memverifikasi kredensial Administrator KINETIK...</p>
        </div>
      </div>
    );
  }

  if (isAdmin === false) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-[#171717] p-4 text-white">
        <div className="max-w-md w-full bg-[#242424] border border-[#383838] rounded-[12px] p-8 text-center flex flex-col items-center gap-4" data-ui="restricted-box">
          <div className="w-14 h-14 rounded-full bg-red-950/60 border border-red-800/80 flex items-center justify-center text-red-400">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div className="flex flex-col gap-1.5">
            <h2 className="font-poppins font-medium text-xl text-white">Portal Terproteksi Admin</h2>
            <p className="font-inter text-xs text-[#bdbdbd] leading-relaxed">
              Area ini khusus manajemen KINETIK Event Production. Klien atau pengunjung umum tidak memiliki izin akses ke data finansial dan order internal.
            </p>
          </div>
          <div className="w-full pt-2 flex flex-col gap-2.5">
            <Link
              href="/login"
              className="w-full bg-[#ff6b35] text-[#171717] font-semibold text-xs h-[42px] rounded-[6px] flex items-center justify-center gap-2 hover:bg-[#e5531e] transition-colors"
            >
              Masuk Akun Admin (admin@entrepreneur.id)
            </Link>
            <Link
              href="/"
              className="w-full bg-[#171717] border border-[#383838] text-[#bdbdbd] hover:text-white hover:border-[#ff6b35]/60 font-medium text-xs h-[42px] rounded-[6px] flex items-center justify-center gap-2 transition-colors"
            >
              Kembali ke Beranda Klien
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const navLinks = [
    { href: '/admin', label: 'Ringkasan Dashboard', icon: LayoutDashboard },
    { href: '/admin/products', label: 'Paket & Tiket', icon: Package },
    { href: '/admin/orders', label: 'Data Reservasi', icon: ShoppingCart },
    { href: '/admin/reports/sales', label: 'Laporan Penjualan', icon: BarChart3 },
    { href: '/admin/reports/financial', label: 'Laporan Keuangan', icon: TrendingUp },
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col bg-[#171717] text-white">
      {/* 1. TOP CONSOLE HEADER */}
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
                  KINETIK OPS
                </span>
                <span className="px-1.5 py-0.5 rounded-[4px] bg-[#ff6b35]/20 border border-[#ff6b35]/40 text-[#ff6b35] text-[10px] font-semibold uppercase">
                  MANAGEMENT CONSOLE
                </span>
              </div>
              <span className="font-inter text-[11px] text-[#8d8d8d] block mt-1">
                Event Production & Financial Controller
              </span>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2.5 text-xs">
            {/* Database Engine Indicator */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 bg-[#242424] border border-[#383838] rounded-[6px] text-[11px]">
              <Database className="w-3.5 h-3.5 text-[#ff6b35]" />
              <span className="text-[#8d8d8d]">Database:</span>
              <span className={dbStatus?.connected ? 'text-[#8cd6b0] font-medium' : 'text-[#ff6b35] font-medium'}>
                {dbStatus?.connected ? 'MySQL' : 'Local Store'}
              </span>
            </div>

            {/* Gateway Mode Indicator */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 bg-[#242424] border border-[#383838] rounded-[6px] text-[11px]" title="Dikonfigurasi via QRIS_PAYMENT_MODE di .env.local">
              <span className="text-[#8d8d8d]">Gateway:</span>
              <span className={`font-medium uppercase text-[10px] px-1.5 py-0.2 rounded border ${
                dbStatus?.payment_mode === 'sandbox'
                  ? 'bg-amber-950/60 text-amber-300 border-amber-500/40'
                  : 'bg-[#23372d] text-[#8cd6b0] border-[#8cd6b0]/40'
              }`}>
                {dbStatus?.payment_mode === 'sandbox' ? 'Sandbox' : 'Official Live'}
              </span>
            </div>

            {/* Admin User Profile */}
            <div className="flex items-center gap-2 bg-[#242424] px-3 py-1.5 border border-[#383838] rounded-[6px]">
              <UserCheck className="w-3.5 h-3.5 text-[#8cd6b0]" />
              <span className="text-white font-medium max-w-[130px] truncate">{adminUser?.name || 'Admin'}</span>
              <span className="px-1.5 py-0.2 bg-[#ff6b35] text-[#171717] text-[10px] font-bold rounded">
                ADMIN
              </span>
            </div>

            {/* Portal Vendor Link */}
            <Link
              href="/vendor"
              className="px-2.5 py-1.5 bg-[#393224] text-[#e9c47d] border border-[#e9c47d]/60 rounded-[6px] flex items-center gap-1.5 transition-colors font-medium text-xs"
              title="Akses Portal Mitra Vendor"
            >
              <Wrench className="w-3 h-3" />
              <span className="hidden sm:inline">Portal Vendor</span>
            </Link>

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
              title="Keluar dari sesi Admin"
              aria-label="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. SUB-NAVIGATION TABS */}
      <div className="bg-[#1c1c1c] border-b border-[#383838] no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-between gap-2 overflow-x-auto">
          <nav className="flex items-center gap-1.5 whitespace-nowrap min-w-max sm:min-w-0 sm:flex-wrap" data-ui="admin-nav-tabs">
            {navLinks.map(link => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-[6px] flex items-center gap-2 transition-colors ${
                    isActive
                      ? 'bg-[#38271f] text-white border border-[#ff6b35]'
                      : 'bg-[#242424] text-[#bdbdbd] border border-[#383838] hover:text-white hover:border-[#ff6b35]/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#ff6b35]' : 'text-[#8d8d8d]'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-1 text-[11px] font-medium text-[#8d8d8d]">
            <span>Panel</span>
            <ChevronRight className="w-3 h-3 text-[#555555]" />
            <span className="text-white font-semibold">
              {navLinks.find(l => l.href === pathname)?.label || 'Overview'}
            </span>
          </div>
        </div>
      </div>

      {/* 3. MAIN ADMIN CONTENT */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {children}
      </main>

      {/* 4. FOOTER */}
      <footer className="bg-[#171717] border-t border-[#383838] py-4 px-4 text-xs text-[#8d8d8d] no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#8cd6b0] inline-block"></span>
            <span className="font-inter">KINETIK Event Management System • Sesi Terproteksi Administrator</span>
          </div>
          <div className="text-[11px] text-[#666666]">
            Sesi aktif: <strong className="text-[#bdbdbd]">{adminUser?.email || 'admin@entrepreneur.id'}</strong>
          </div>
        </div>
      </footer>
    </div>
  );
}
