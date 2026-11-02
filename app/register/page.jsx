'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
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
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone, address }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Pendaftaran gagal.');
      }

      setSuccess('Akun berhasil dibuat. Mengalihkan ke halaman utama...');
      setTimeout(() => {
        router.push('/');
        router.refresh();
      }, 700);
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 px-4">
      <div className="nb-card bg-white p-6 sm:p-8 space-y-6" data-ui="register-box">
        <div className="border-b-2 border-black pb-4 text-center">
          <h1 className="text-3xl font-black uppercase tracking-tight">Daftar Akun Baru</h1>
          <p className="text-xs font-bold text-neutral-600 mt-1">
            Daftarkan identitas untuk mulai memesan paket acara atau tiket festival.
          </p>
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

        <form onSubmit={handleRegister} className="space-y-3.5">
          <div>
            <label className="text-xs font-bold block mb-1">
              Nama Lengkap
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Contoh: Rian Pratama"
              required
              className="nb-input w-full text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-bold block mb-1">
              Alamat Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="nama@email.com"
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
              placeholder="Minimal 6 karakter"
              required
              className="nb-input w-full text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-bold block mb-1">
              Nomor WhatsApp atau Telepon
            </label>
            <input
              type="text"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="081234567890"
              required
              className="nb-input w-full text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-bold block mb-1">
              Alamat Domisili / Instansi
            </label>
            <textarea
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="Alamat jalan, nomor kantor, kecamatan, dan kota"
              rows={2}
              required
              className="nb-input w-full text-sm"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="nb-btn nb-btn-yellow w-full py-3 text-sm flex items-center justify-center gap-2 font-bold mt-2"
          >
            {loading ? (
              <span>Memproses...</span>
            ) : (
              <>
                <UserPlus className="w-4 h-4 stroke-[2.5]" />
                Selesaikan Pendaftaran
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t-2 border-black text-center text-xs font-bold text-neutral-600">
          Sudah memiliki akun?{' '}
          <Link href="/login" className="text-black underline font-bold hover:text-[#FF5C00]">
            Masuk di Sini
          </Link>
        </div>
      </div>
    </div>
  );
}
