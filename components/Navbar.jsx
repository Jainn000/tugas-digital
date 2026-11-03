'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, X, LogOut, ShieldAlert, FileText, User } from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
      })
      .catch(() => {});
  }, [pathname]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/login');
    router.refresh();
  };

  // Jangan tampilkan navbar publik di portal admin
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const navLinks = [
    { label: 'Beranda', href: '/' },
    { label: 'Layanan', href: '/#layanan' },
    { label: 'Portofolio', href: '/#portofolio' },
    { label: 'Paket', href: '/#paket' },
    { label: 'Acara Kami', href: '/#acara' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#171717] border-b border-[#383838] no-print">
      <div className="max-w-[1440px] mx-auto h-[84px] md:h-[96px] px-5 sm:px-8 md:px-[72px] flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-[10px] group">
          <div className="relative w-[30px] h-[34px] shrink-0">
            <Image
              src="/figma/kinetik-symbol.svg"
              alt="KINETIK Symbol"
              width={30}
              height={34}
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-poppins font-bold text-[22px] md:text-[25px] text-white tracking-[1.25px]">
              KINETIK
            </span>
            <span className="font-inter text-[#bdbdbd] text-[6.5px] tracking-[0.65px] mt-[3px]">
              EVENT PRODUCTION & ORGANIZER
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-[28px]">
          {navLinks.map((item) => {
            const isActive = pathname === item.href || (item.href === '/' && pathname === '/');
            return (
              <div key={item.label} className="flex flex-col items-center gap-[8px] pt-[10px]">
                <Link
                  href={item.href}
                  className={`font-inter text-[13px] transition-colors ${
                    isActive ? 'font-semibold text-white' : 'font-normal text-[#bdbdbd] hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
                <div
                  className={`h-[2px] w-[16px] rounded-full transition-opacity ${
                    isActive ? 'bg-[#ff6b35]' : 'bg-transparent'
                  }`}
                />
              </div>
            );
          })}

          {user && (
            <div className="flex flex-col items-center gap-[8px] pt-[10px]">
              <Link
                href="/my-orders"
                className={`font-inter text-[13px] flex items-center gap-1.5 transition-colors ${
                  pathname === '/my-orders'
                    ? 'font-semibold text-white'
                    : 'font-normal text-[#bdbdbd] hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-[#ff6b35]" />
                <span>Booking Saya</span>
              </Link>
              <div
                className={`h-[2px] w-[16px] rounded-full transition-opacity ${
                  pathname === '/my-orders' ? 'bg-[#ff6b35]' : 'bg-transparent'
                }`}
              />
            </div>
          )}
        </nav>

        {/* Right CTA / Account */}
        <div className="hidden sm:flex items-center gap-[12px]">
          {user ? (
            <div className="flex items-center gap-3">
              {user.role === 'admin' && (
                <Link
                  href="/admin"
                  className="bg-[#242424] border border-[#ff6b35] text-[#ff6b35] font-inter text-[12px] font-semibold px-3.5 py-2 rounded-[6px] hover:bg-[#ff6b35] hover:text-[#171717] transition-colors flex items-center gap-1.5"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Panel Admin</span>
                </Link>
              )}
              <div className="bg-[#242424] border border-[#383838] px-3.5 py-2 rounded-[6px] flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#ff6b35] text-[#171717] font-bold text-xs flex items-center justify-center">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="font-inter text-[12px] text-[#bdbdbd] max-w-[120px] truncate">
                  {user.name || user.email}
                </span>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="text-[#8d8d8d] hover:text-red-400 ml-1 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
              <Link
                href="/checkout"
                className="bg-[#ff6b35] text-[#171717] font-inter font-semibold text-[13px] px-[22px] h-[44px] rounded-[6px] flex items-center justify-center hover:bg-[#e5531e] transition-colors"
              >
                Pesan Sekarang
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-[12px]">
              <Link
                href="/login"
                className="border border-white/40 text-white font-inter font-semibold text-[13px] px-[22px] h-[44px] rounded-[6px] flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                Masuk
              </Link>
              <Link
                href="/checkout"
                className="bg-[#ff6b35] text-[#171717] font-inter font-semibold text-[13px] px-[22px] h-[44px] rounded-[6px] flex items-center justify-center hover:bg-[#e5531e] transition-colors"
              >
                Pesan Sekarang
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-white hover:text-[#ff6b35] transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#242424] border-t border-[#383838] px-6 py-6 flex flex-col gap-4 animate-in slide-in-from-top-2">
          {navLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="font-inter text-[15px] text-[#bdbdbd] hover:text-white py-1"
            >
              {item.label}
            </Link>
          ))}
          {user && (
            <Link
              href="/my-orders"
              onClick={() => setMobileMenuOpen(false)}
              className="font-inter text-[15px] text-[#ff6b35] py-1 flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span>Booking & Faktur Saya</span>
            </Link>
          )}
          <div className="pt-4 border-t border-[#383838] flex flex-col gap-3">
            {user ? (
              <>
                <div className="text-xs text-[#8d8d8d]">
                  Masuk sebagai: <span className="text-white font-medium">{user.name}</span>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full bg-[#171717] border border-[#383838] text-red-400 font-inter text-[13px] font-semibold py-2.5 rounded-[6px] flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Keluar Akun</span>
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="border border-white/40 text-white font-inter font-semibold text-[13px] py-2.5 rounded-[6px] text-center"
                >
                  Masuk
                </Link>
                <Link
                  href="/checkout"
                  onClick={() => setMobileMenuOpen(false)}
                  className="bg-[#ff6b35] text-[#171717] font-inter font-semibold text-[13px] py-2.5 rounded-[6px] text-center"
                >
                  Pesan Sekarang
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
