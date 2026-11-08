'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Home, Box, Calendar, MessageSquare, Store, 
  Settings, LogOut, Bell, Menu, X, ChevronDown, 
  ShieldAlert, ExternalLink, Wrench
} from 'lucide-react';

export default function VendorLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [vendorUser, setVendorUser] = useState(null);
  const [isVendor, setIsVendor] = useState(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState({ orders: 3, messages: 1 });

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

    // Fetch live badges
    fetch('/api/vendor/orders')
      .then(res => res.json())
      .then(data => {
        if (data.counts) {
          setUnreadCounts(prev => ({ ...prev, orders: data.counts.pending || 3 }));
        }
      })
      .catch(() => {});
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
          <div className="w-8 h-8 border-2 border-[#383838] border-t-[#ff6b35] rounded-full animate-spin"></div>
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
              Area ini khusus mitra penyedia stock alat, rental orders, dan logistik panggung KINETIK.
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
              className="w-full bg-[#171717] border border-[#383838] text-[#bdbdbd] hover:text-white font-medium text-xs h-[42px] rounded-[6px] flex items-center justify-center gap-2 transition-colors"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const navMenuItems = [
    { label: 'Dashboard', href: '/vendor', icon: Home, exact: true },
    { label: 'Stock Management', href: '/vendor/stock', icon: Box },
    { label: 'Rental Orders', href: '/vendor/orders', icon: Calendar, badge: unreadCounts.orders },
    { label: 'Messages', href: '/vendor/messages', icon: MessageSquare, badge: unreadCounts.messages },
    { label: 'Profile & Business', href: '/vendor/profile', icon: Store },
    { label: 'Settings', href: '/vendor/settings', icon: Settings },
  ];

  return (
    <div className="min-h-[100dvh] flex bg-[#121212] text-white">
      {/* 1. DESKTOP & MOBILE SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[270px] bg-[#1a1a1a] border-r border-[#2e2e2e] flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Logo brand */}
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="relative w-[28px] h-[32px] shrink-0">
                <Image
                  src="/figma/kinetik-symbol.svg"
                  alt="KINETIK"
                  width={28}
                  height={32}
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-poppins font-bold text-lg tracking-wider text-white">
                  KINETIK
                </span>
                <span className="text-[9px] text-[#8d8d8d] tracking-[0.8px] uppercase mt-0.5">
                  Event Organizer
                </span>
              </div>
            </Link>

            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded text-[#8d8d8d] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Vendor Profile Card (Matches Screenshot) */}
          <div className="bg-[#242424] border border-[#333333] rounded-[10px] p-2.5 flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0 border border-[#444444] bg-[#2a2a2a]">
                <Image
                  src="/figma/hero-concert.png"
                  alt="Vendor Avatar"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-medium text-xs text-white truncate">
                  {vendorUser?.name || 'Raya Event Supply'}
                </span>
                <span className="w-fit text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#ff6b35] text-[#171717] uppercase mt-0.5">
                  Vendor
                </span>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-[#8d8d8d] shrink-0" />
          </div>

          {/* Nav Menu */}
          <nav className="space-y-1.5 pt-2">
            {navMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact 
                ? pathname === item.href 
                : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-[8px] text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#ff6b35] text-white shadow-md shadow-[#ff6b35]/20 font-semibold'
                      : 'text-[#bdbdbd] hover:text-white hover:bg-[#242424]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isActive ? 'bg-white text-[#ff6b35]' : 'bg-[#e53935] text-white'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-6 space-y-4 border-t border-[#2e2e2e]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2 text-xs text-[#8d8d8d] hover:text-red-400 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>

          {/* Inspirational Banner from Screenshot */}
          <div className="relative rounded-[10px] overflow-hidden p-3.5 border border-[#333333] bg-[#222222]">
            <div className="absolute inset-0 z-0 opacity-40">
              <Image
                src="/figma/hero-concert.png"
                alt="Concert"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative z-10 space-y-2">
              <p className="text-[11px] text-white font-medium leading-tight">
                Together, we make events unforgettable.
              </p>
              <div className="flex items-center gap-1.5 pt-1">
                <div className="w-3.5 h-4 relative">
                  <Image src="/figma/kinetik-symbol.svg" alt="K" fill className="object-contain" />
                </div>
                <span className="font-poppins font-bold text-[11px] tracking-wider text-white">
                  KINETIK
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
        />
      )}

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-[270px]">
        {/* Top Header Bar */}
        <header className="h-[64px] border-b border-[#2e2e2e] bg-[#171717] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded text-[#bdbdbd] hover:text-white hover:bg-[#242424]"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <span className="text-xs text-[#8d8d8d] hidden sm:inline">
              Mitra Produksi Resmi KINETIK • Status: <strong className="text-[#8cd6b0]">Aktif</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Link to Web or Admin if Admin */}
            {vendorUser?.role === 'admin' && (
              <Link
                href="/admin"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] bg-[#38271f] text-[#ff6b35] border border-[#ff6b35]/60 text-xs font-semibold"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Panel Admin</span>
              </Link>
            )}

            <Link
              href="/"
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] bg-[#242424] text-[#bdbdbd] hover:text-white border border-[#383838] text-xs transition-colors"
            >
              <span>Web Klien</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            {/* Notification Bell */}
            <Link
              href="/vendor/messages"
              className="relative p-2 rounded-full bg-[#242424] text-[#bdbdbd] hover:text-white border border-[#383838] transition-colors"
              title="Notifikasi & Pesan"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#e53935]" />
            </Link>

            {/* User Avatar Circle */}
            <div className="w-8 h-8 rounded-full bg-[#242424] border border-[#444444] text-[#ff6b35] font-poppins font-bold text-xs flex items-center justify-center">
              {vendorUser?.name ? vendorUser.name.charAt(0).toUpperCase() : 'R'}
            </div>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
