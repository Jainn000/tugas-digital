'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ShieldAlert, User, LogIn, AlertCircle, CheckCircle2 } from 'lucide-react';
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
      const msg = 'Kolom kata sandi / password tidak boleh kosong.';
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
        } else {
          router.push('/');
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

  const fillCredentials = (role) => {
    if (role === 'admin') {
      setEmail('admin@entrepreneur.id');
      setPassword('admin123');
    } else {
      setEmail('user@entrepreneur.id');
      setPassword('user123');
    }
    setError('');
  };

  return (
    <div className="max-w-md mx-auto my-12 px-4">
      <div className="nb-card bg-white p-6 sm:p-8 space-y-6" data-ui="login-box">
        <div className="border-b-2 border-black pb-4 text-center">
          <h1 className="text-3xl font-black uppercase tracking-tight">Masuk ke Sistem</h1>
          <p className="text-xs font-bold text-neutral-600 mt-1">
            Gunakan akun Admin untuk mengelola event & finansial atau Akun Klien untuk memesan tiket.
          </p>
        </div>

        {/* Quick Demo Preset Buttons */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-neutral-700 block text-center">
            Pilihan Akun Uji Coba:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillCredentials('admin')}
              className="nb-btn nb-btn-yellow py-2 px-2 text-xs flex items-center justify-center gap-1.5 font-bold"
            >
              <ShieldAlert className="w-4 h-4 stroke-[2.5]" />
              <span>Admin EO</span>
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('user')}
              className="nb-btn nb-btn-cyan py-2 px-2 text-xs flex items-center justify-center gap-1.5 font-bold"
            >
              <User className="w-4 h-4 stroke-[2.5]" />
              <span>Klien / Tamu</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-100 border-2 border-black flex items-center gap-2 text-xs font-bold text-red-900">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 bg-[#A3E635] border-2 border-black flex items-center gap-2 text-xs font-bold text-black">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-bold block mb-1">
              Email Pengguna
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@entrepreneur.id"
              required
              className="nb-input w-full text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-bold block mb-1">
              Kata Sandi
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="nb-input w-full text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="nb-btn nb-btn-orange w-full py-3 text-sm flex items-center justify-center gap-2 font-bold"
          >
            {loading ? (
              <span>Memverifikasi...</span>
            ) : (
              <>
                <LogIn className="w-4 h-4 stroke-[2.5]" />
                Masuk Sekarang
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t-2 border-black text-center text-xs font-bold text-neutral-600">
          Belum punya akun?{' '}
          <Link 
            href={redirectUrl ? `/register?redirect=${encodeURIComponent(redirectUrl)}` : '/register'} 
            className="text-black underline font-bold hover:text-[#FF5C00]"
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
    <Suspense fallback={
      <div className="p-12 text-center nb-card bg-white max-w-md mx-auto my-12">
        <p className="font-bold text-sm">Memuat formulir login...</p>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
