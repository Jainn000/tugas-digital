'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import { 
  LayoutDashboard, Package, ShoppingCart, BarChart3, 
  TrendingUp, ShieldAlert, ExternalLink, LogOut, Database, UserCheck, ChevronRight
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
      <div className="min-h-[100dvh] flex items-center justify-center bg-[#F4EFE6] p-4">
        <div className="nb-card bg-white p-8 text-center max-w-md w-full space-y-3">
          <div className="w-8 h-8 border-4 border-black border-t-[#FFE600] animate-spin mx-auto"></div>
          <p className="font-bold text-sm">Memverifikasi kredensial Administrator...</p>
        </div>
      </div>
    );
  }

  if (isAdmin === false) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-[#F4EFE6] p-4">
        <div className="max-w-md w-full nb-card bg-white p-8 text-center space-y-5" data-ui="restricted-box">
          <div className="w-16 h-16 bg-red-100 border-2 border-black flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8 text-red-600 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight">Portal Khusus Admin</h2>
            <p className="text-xs font-bold text-neutral-600 mt-1 leading-relaxed">
              Halaman ini terisolasi untuk tim manajemen KINETIK Event Production. Klien atau tamu tidak dapat mengakses data transaksi dan keuangan di sini.
            </p>
          </div>
          <div className="pt-2 space-y-2">
            <Link
              href="/login"
              className="nb-btn nb-btn-yellow w-full py-2.5 text-xs font-bold flex items-center justify-center gap-2"
            >
              Masuk Akun Admin (admin@entrepreneur.id)
            </Link>
            <Link
              href="/"
              className="nb-btn nb-btn-white w-full py-2.5 text-xs font-bold flex items-center justify-center gap-2"
            >
              Kembali ke Halaman Klien / Katalog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const navLinks = [
    { href: '/admin', label: 'Ringkasan Dashboard', icon: LayoutDashboard },
    { href: '/admin/products', label: 'Paket & Tiket Acara', icon: Package },
    { href: '/admin/orders', label: 'Data Reservasi & Booking', icon: ShoppingCart },
    { href: '/admin/reports/sales', label: 'Laporan Penjualan (Omzet)', icon: BarChart3 },
    { href: '/admin/reports/financial', label: 'Laporan Keuangan (Laba Rugi)', icon: TrendingUp },
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col bg-[#F4EFE6] text-[#121212]">
      {/* 1. DEDICATED ADMIN TOP HEADER */}
      <header className="bg-black text-white border-b-2 border-black sticky top-0 z-40 no-print">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
          {/* Admin Identity */}
          <div className="flex items-center gap-3">
            <Logo variant="icon" />
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-sm font-black uppercase text-white tracking-wide">
                  KINETIK ENTERPRISE OPS
                </span>
                <span className="px-1 py-0.5 bg-[#A3E635] text-black text-[9px] font-black uppercase">
                  CONSOLE
                </span>
              </div>
              <span className="text-xs text-neutral-400 block mt-0.5">
                Internal Production & Financial Controller
              </span>
            </div>
          </div>

          {/* Right Utility: DB Indicator, User Info & Links */}
          <div className="flex items-center gap-3 text-xs font-bold">
            {/* Database Engine Indicator */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-neutral-900 border border-neutral-700 text-[11px]">
              <Database className="w-3.5 h-3.5 text-[#FFE600]" />
              <span className="text-neutral-400">Database:</span>
              <span className={dbStatus?.connected ? 'text-[#A3E635]' : 'text-[#FFE600]'}>
                {dbStatus?.connected ? 'MySQL (phpMyAdmin)' : 'Local JSON Store'}
              </span>
            </div>

            {/* Admin Profile Pill */}
            <div className="flex items-center gap-1.5 bg-neutral-900 px-2.5 py-1 border border-neutral-700">
              <UserCheck className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span className="text-white max-w-[120px] truncate">{adminUser?.name || 'Admin'}</span>
              <span className="px-1 py-0.2 bg-[#A3E635] text-black text-[10px] font-black uppercase">
                ADMIN
              </span>
            </div>

            {/* Switch to Client View Link */}
            <Link
              href="/"
              target="_blank"
              className="px-2.5 py-1 bg-white hover:bg-[#FFE600] text-black border border-black flex items-center gap-1 transition-colors duration-150"
              title="Buka Website Klien di tab baru"
            >
              <span>Web Klien</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="p-1 hover:bg-red-600 hover:text-white border border-neutral-700 transition-colors duration-150"
              title="Keluar dari sesi Admin"
              aria-label="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. DEDICATED ADMIN NAVIGATION BAR */}
      <div className="bg-[#FFE600] border-b-2 border-black no-print">
        <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-2">
          <nav className="flex flex-wrap items-center gap-1.5" data-ui="admin-nav-tabs">
            {navLinks.map(link => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 text-xs font-black uppercase border-2 border-black flex items-center gap-1.5 transition-colors duration-150 ${
                    isActive
                      ? 'bg-black text-white'
                      : 'bg-white hover:bg-neutral-100 text-black'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-1 text-[11px] font-bold text-neutral-800">
            <span>Admin</span>
            <ChevronRight className="w-3 h-3" />
            <span className="font-black underline">
              {navLinks.find(l => l.href === pathname)?.label || 'Overview'}
            </span>
          </div>
        </div>
      </div>

      {/* 3. ADMIN CONTENT AREA */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {children}
      </main>

      {/* 4. DEDICATED ADMIN FOOTER */}
      <footer className="bg-white border-t-2 border-black py-4 px-4 text-xs font-bold text-neutral-700 no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#A3E635] border border-black inline-block"></span>
            <span>KINETIK Event Management System • Hak Akses Terproteksi Administrator</span>
          </div>
          <div className="text-[11px] text-neutral-500">
            Sesi aktif: <strong>{adminUser?.email || 'admin@entrepreneur.id'}</strong> • Jalur Lokal: localhost:3000/admin
          </div>
        </div>
      </footer>
    </div>
  );
}
