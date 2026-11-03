'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { UserPlus, ShieldAlert, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/components/ToastContext';

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();
  const redirectUrl = searchParams.get('redirect');

  const [role, setRole] = useState('user'); // 'user' | 'admin'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim()) {
      const msg = 'Nama lengkap tidak boleh kosong.';
      setError(msg);
      toast.error(msg, 'Nama Kosong');
      return;
    }

    if (!email.trim()) {
      const msg = 'Alamat email wajib diisi.';
      setError(msg);
      toast.error(msg, 'Email Kosong');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      const msg = 'Format email tidak valid (contoh: nama@perusahaan.com).';
      setError(msg);
      toast.error(msg, 'Format Email Salah');
      return;
    }

    if (!password || password.length < 6) {
      const msg = 'Kata sandi minimal 6 karakter.';
      setError(msg);
      toast.error(msg, 'Kata Sandi Terlalu Pendek');
      return;
    }

    if (!phone.trim()) {
      const msg = 'Nomor telepon / WhatsApp tidak boleh kosong.';
      setError(msg);
      toast.error(msg, 'Nomor Telepon Kosong');
      return;
    }

    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.length < 9) {
      const msg = 'Nomor telepon minimal 9 digit angka.';
      setError(msg);
      toast.error(msg, 'Nomor Telepon Tidak Lengkap');
      return;
    }

    if (!address.trim()) {
      const msg = 'Alamat domisili atau instansi tidak boleh kosong.';
      setError(msg);
      toast.error(msg, 'Alamat Kosong');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
          phone: phone.trim(),
          address: address.trim(),
          role,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Pendaftaran gagal.');
      }

      const roleLabel = role === 'admin' ? 'Admin EO' : 'Klien';
      setSuccess(`Akun ${roleLabel} berhasil dibuat! Mengalihkan ke panel...`);
      toast.success(`Akun ${roleLabel} berhasil didaftarkan. Selamat datang!`, 'Pendaftaran Sukses');

      setTimeout(() => {
        if (redirectUrl) {
          router.push(redirectUrl);
        } else if (role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/');
        }
        router.refresh();
      }, 600);
    } catch (err) {
      const msg = err.message || 'Terjadi kesalahan saat mendaftar.';
      setError(msg);
      toast.error(msg, 'Pendaftaran Gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-ui="kinetik-register" className="min-h-[calc(100dvh-180px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-[#242424] border border-[#383838] rounded-[12px] p-6 sm:p-[32px] flex flex-col gap-[22px]">
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
            Daftar Akun Baru
          </h1>
          <p className="font-inter text-[12px] text-[#bdbdbd] max-w-xs leading-relaxed">
            Pilih jenis akun yang ingin didaftarkan untuk memulai akses sistem KINETIK.
          </p>
        </div>

        {/* Role Selector: Klien vs Admin EO */}
        <div className="flex flex-col gap-2">
          <span className="text-[11px] text-[#8d8d8d] font-medium">
            Pilih Peran Akun (Role):
          </span>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setRole('user')}
              className={`p-3 rounded-[6px] border text-left flex flex-col gap-1 transition-colors ${
                role === 'user'
                  ? 'bg-[#38271f] border-[#ff6b35] text-white'
                  : 'bg-[#171717] border-[#383838] text-[#bdbdbd] hover:text-white hover:border-[#ff6b35]/60'
              }`}
            >
              <div className="flex items-center gap-1.5 font-semibold text-xs">
                <User className="w-4 h-4 text-[#8cd6b0]" />
                <span>Klien / User</span>
              </div>
              <p className="text-[10px] text-[#8d8d8d] leading-tight">
                Pesan tiket festival & request proposal acara
              </p>
            </button>

            <button
              type="button"
              onClick={() => setRole('admin')}
              className={`p-3 rounded-[6px] border text-left flex flex-col gap-1 transition-colors ${
                role === 'admin'
                  ? 'bg-[#38271f] border-[#ff6b35] text-white'
                  : 'bg-[#171717] border-[#383838] text-[#bdbdbd] hover:text-white hover:border-[#ff6b35]/60'
              }`}
            >
              <div className="flex items-center gap-1.5 font-semibold text-xs">
                <ShieldAlert className="w-4 h-4 text-[#ff6b35]" />
                <span>Admin EO</span>
              </div>
              <p className="text-[10px] text-[#8d8d8d] leading-tight">
                Kelola pesanan, verifikasi tiket & laporan finansial
              </p>
            </button>
          </div>
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

        {/* Register Form */}
        <form onSubmit={handleRegister} className="flex flex-col gap-3.5">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] text-[#8d8d8d] font-medium">
              Nama Lengkap
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Rian Pratama"
              required
              className="bg-[#171717] border border-[#383838] rounded-[6px] px-3.5 py-2 text-[13px] text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#ff6b35]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] text-[#8d8d8d] font-medium">
              Alamat Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              required
              className="bg-[#171717] border border-[#383838] rounded-[6px] px-3.5 py-2 text-[13px] text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#ff6b35]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] text-[#8d8d8d] font-medium">
              Kata Sandi
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
              required
              className="bg-[#171717] border border-[#383838] rounded-[6px] px-3.5 py-2 text-[13px] text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#ff6b35]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] text-[#8d8d8d] font-medium">
              Nomor WhatsApp / Telepon
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="081234567890"
              required
              className="bg-[#171717] border border-[#383838] rounded-[6px] px-3.5 py-2 text-[13px] text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#ff6b35]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] text-[#8d8d8d] font-medium">
              Alamat Domisili / Instansi
            </label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Alamat jalan, nomor kantor, kecamatan, dan kota"
              rows={2}
              required
              className="bg-[#171717] border border-[#383838] rounded-[6px] px-3.5 py-2 text-[13px] text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#ff6b35] resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#ff6b35] text-[#171717] font-semibold text-[14px] h-[46px] rounded-[6px] flex items-center justify-center gap-2 hover:bg-[#e5531e] transition-colors disabled:opacity-50 mt-1"
          >
            {loading ? (
              <span>Memproses...</span>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Daftar Sebagai {role === 'admin' ? 'Admin EO' : 'Klien'}</span>
              </>
            )}
          </button>
        </form>

        {/* Footer Link to Login */}
        <div className="pt-2 border-t border-[#383838] text-center text-xs text-[#8d8d8d]">
          Sudah memiliki akun?{' '}
          <Link
            href={redirectUrl ? `/login?redirect=${encodeURIComponent(redirectUrl)}` : '/login'}
            className="text-[#ff6b35] font-semibold hover:underline"
          >
            Masuk di Sini
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center text-white text-sm">
          Memuat halaman pendaftaran...
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}
