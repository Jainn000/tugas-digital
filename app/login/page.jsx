'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { LogIn, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/components/ToastContext';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();
  const redirectUrl = searchParams.get('redirect');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim()) {
      const msg = 'Kolom alamat email tidak boleh kosong.';
      setError(msg);
      toast.error(msg, 'Email Kosong');
      return;
    }

    if (!password) {
      const msg = 'Kolom kata sandi tidak boleh kosong.';
      setError(msg);
      toast.error(msg, 'Password Kosong');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Email atau kata sandi tidak cocok.');
      }

      setSuccess(`Selamat datang kembali, ${data.user.name}!`);
      toast.success(`Selamat datang, ${data.user.name}! Akses berhasil diverifikasi.`, 'Login Berhasil');
      setTimeout(() => {
        if (redirectUrl) {
          router.push(redirectUrl);
        } else if (data.user.role === 'admin') {
          router.push('/admin');
        } else if (data.user.role === 'vendor') {
          router.push('/vendor');
        } else {
          router.push('/my-orders');
        }
        router.refresh();
      }, 500);
    } catch (err) {
      const msg = err.message || 'Email atau kata sandi salah.';
      setError(msg);
      toast.error(msg, 'Autentikasi Gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-ui="kinetik-login" className="min-h-[calc(100dvh-180px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-[#242424] border border-[#383838] rounded-[12px] p-6 sm:p-[32px] flex flex-col gap-[24px]">
        {/* Header with KINETIK Logo */}
        <div className="flex flex-col items-center text-center gap-2">
          <div className="relative w-[32px] h-[36px] mb-1">
            <Image
              src="/figma/kinetik-symbol.svg"
              alt="KINETIK Symbol"
              width={32}
              height={36}
              className="object-contain"
            />
          </div>
          <h1 className="font-poppins font-medium text-[24px] text-white">
            Masuk ke KINETIK
          </h1>
          <p className="font-inter text-[12px] text-[#bdbdbd] max-w-xs leading-relaxed">
            Akses sistem manajemen acara, portal mitra produksi, dan tiket resmi.
          </p>
        </div>

        {/* Status Alerts */}
        {error && (
          <div className="p-3 bg-red-950/60 border border-red-800 rounded-[6px] flex items-center gap-2.5 text-xs text-red-300">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 bg-[#23372d] border border-[#8cd6b0]/40 rounded-[6px] flex items-center gap-2.5 text-xs text-[#8cd6b0]">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] text-[#8d8d8d] font-medium">
              Alamat Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="contoh: admin@entrepreneur.id"
              required
              className="bg-[#171717] border border-[#383838] rounded-[6px] px-3.5 py-2.5 text-[13px] text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#ff6b35]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] text-[#8d8d8d] font-medium">
              Kata Sandi
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              required
              className="bg-[#171717] border border-[#383838] rounded-[6px] px-3.5 py-2.5 text-[13px] text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#ff6b35]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#ff6b35] text-[#171717] font-semibold text-[14px] h-[48px] rounded-[6px] flex items-center justify-center gap-2 hover:bg-[#e5531e] transition-colors disabled:opacity-50 mt-1"
          >
            {loading ? (
              <span>Memverifikasi...</span>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Masuk Sekarang</span>
              </>
            )}
          </button>
        </form>

        {/* Footer Link to Register */}
        <div className="pt-2 border-t border-[#383838] text-center text-xs text-[#8d8d8d]">
          Belum punya akun?{' '}
          <Link
            href={redirectUrl ? `/register?redirect=${encodeURIComponent(redirectUrl)}` : '/register'}
            className="text-[#ff6b35] font-semibold hover:underline"
          >
            Daftar Akun Baru
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center text-white text-sm">
          Memuat halaman masuk...
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
