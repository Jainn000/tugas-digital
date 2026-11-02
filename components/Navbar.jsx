'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import Logo from './Logo';
import { User as UserIcon, ShieldAlert, LogOut, Database, Menu, X, Ticket, CalendarCheck } from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [dbStatus, setDbStatus] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) setUser(data.user);
      })
      .catch(() => {});

    fetch('/api/status')
      .then(res => res.json())
      .then(data => setDbStatus(data))
      .catch(() => {});
  }, [pathname]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/login');
    router.refresh();
  };

  // Jangan tampilkan navbar klien di dalam portal admin
  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 bg-[#FFFDF9] border-b-2 border-black no-print">
      {/* Top Utility Bar */}
      <div className="bg-black text-white px-4 py-1.5 text-xs flex justify-between items-center font-bold">
        <div className="flex items-center gap-2">
          <span>Kewirausahaan Digital</span>
          <span className="hidden sm:inline text-neutral-400">/</span>
          <span className="hidden sm:inline text-neutral-300">KINETIK Event Production & Creative Organizer</span>
        </div>
        <div className="flex items-center gap-2">
          <Database className="w-3.5 h-3.5" />
          <span>Status Sistem:</span>
          {dbStatus?.connected ? (
            <span className="text-[#A3E635] flex items-center gap-1 font-bold">
              MySQL Aktif
            </span>
          ) : (
            <span className="text-[#FFE600] flex items-center gap-1 font-bold" title="Data berjalan otomatis via store lokal. Import database.sql ke phpMyAdmin untuk MySQL">
              Local DB Engine
            </span>
          )}
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Logo variant="full" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-3">
          <Link
            href="/"
            className={`font-bold px-3 py-1.5 border-2 border-black transition-colors duration-150 ${
              pathname === '/'
                ? 'bg-black text-white'
                : 'bg-white text-black hover:bg-neutral-100'
            }`}
          >
            Katalog Layanan & Tiket
          </Link>

          <Link
            href="/checkout"
            className={`font-bold px-3 py-1.5 border-2 border-black transition-colors duration-150 flex items-center gap-1.5 ${
              pathname === '/checkout'
                ? 'bg-black text-white'
                : 'bg-white text-black hover:bg-neutral-100'
            }`}
          >
            <CalendarCheck className="w-4 h-4 stroke-[2.5]" />
            <span>Reservasi Langsung</span>
          </Link>

          {user && (
            <Link
              href="/my-orders"
              className={`font-bold px-3 py-1.5 border-2 border-black transition-colors duration-150 ${
                pathname === '/my-orders'
                  ? 'bg-black text-white'
                  : 'bg-white text-black hover:bg-neutral-100'
              }`}
            >
              Faktur & Tiket Saya
            </Link>
          )}

          {user?.role === 'admin' && (
            <Link
              href="/admin"
              className={`font-black px-3 py-1.5 border-2 border-black bg-[#A3E635] text-black transition-colors duration-150 flex items-center gap-1.5 ${
                pathname.startsWith('/admin') ? 'ring-2 ring-black' : ''
              }`}
            >
              <ShieldAlert className="w-4 h-4 stroke-[2.5]" />
              Console Admin
            </Link>
          )}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Quick Direct Booking Button */}
          <Link
            href="/checkout"
            className="nb-btn nb-btn-orange px-3.5 py-1.5 text-xs font-black uppercase flex items-center gap-1.5"
          >
            <Ticket className="w-4 h-4 stroke-[2.5]" />
            <span>Pesan Sekarang</span>
          </Link>

          {/* User Auth Info */}
          {user ? (
            <div className="hidden sm:flex items-center gap-2">
              <div className="border-2 border-black bg-white px-3 py-1 text-xs font-bold flex items-center gap-2">
                <UserIcon className="w-3.5 h-3.5" />
                <span className="truncate max-w-[120px]">{user.name}</span>
                <span className="px-1.5 py-0.5 bg-black text-white text-[11px] font-bold uppercase">
                  {user.role}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="p-1.5 border-2 border-black bg-white hover:bg-red-500 hover:text-white transition-colors duration-150"
                title="Keluar"
                aria-label="Keluar"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="nb-btn nb-btn-white px-3 py-1.5 text-xs font-bold flex items-center gap-1.5"
            >
              <UserIcon className="w-4 h-4" />
              <span>Masuk Portal</span>
            </Link>
          )}

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 border-2 border-black bg-white"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t-2 border-black bg-white p-4 space-y-3">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block font-bold p-2 border-2 border-black bg-neutral-100"
          >
            Katalog Layanan & Tiket
          </Link>
          <Link
            href="/checkout"
            onClick={() => setMobileMenuOpen(false)}
            className="block font-bold p-2 border-2 border-black bg-neutral-100"
          >
            Reservasi Langsung
          </Link>
          {user && (
            <Link
              href="/my-orders"
              onClick={() => setMobileMenuOpen(false)}
              className="block font-bold p-2 border-2 border-black bg-neutral-100"
            >
              Faktur & Tiket Saya
            </Link>
          )}
          {user?.role === 'admin' && (
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block font-black p-2 border-2 border-black bg-[#A3E635]"
            >
              Console Admin & Laporan
            </Link>
          )}
          {user ? (
            <div className="pt-2 border-t-2 border-black flex justify-between items-center">
              <div>
                <p className="font-bold text-sm">{user.name}</p>
                <p className="text-xs text-neutral-600">{user.email} ({user.role})</p>
              </div>
              <button
                onClick={handleLogout}
                className="nb-btn bg-red-400 text-black px-3 py-1 text-xs font-bold"
              >
                Keluar
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block nb-btn nb-btn-yellow text-center py-2 text-sm font-bold"
            >
              Masuk / Login Akun
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
