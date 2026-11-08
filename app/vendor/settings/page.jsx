'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Settings, ArrowLeft, Bell, Lock, Shield, Check, Save } from 'lucide-react';
import { useToast } from '@/components/ToastContext';

export default function VendorSettingsPage() {
  const toast = useToast();
  const [waNotif, setWaNotif] = useState(true);
  const [emailNotif, setEmailNotif] = useState(true);
  const [autoAck, setAutoAck] = useState(false);
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    toast.success('Pengaturan sistem dan preferensi notifikasi berhasil disimpan.', 'Pengaturan Disimpan');
  };

  return (
    <div className="space-y-6 max-w-4xl" data-ui="vendor-settings">
      <div className="flex items-center gap-2">
        <Link href="/vendor" className="text-[#8d8d8d] hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-poppins font-bold text-2xl text-white">
            Vendor Settings
          </h1>
          <p className="font-inter text-xs text-[#8d8d8d]">
            Konfigurasi notifikasi pemesanan rental baru, SLA respon, dan keamanan akun.
          </p>
        </div>
      </div>

      <div className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-[12px] p-6 space-y-6">
        <form onSubmit={handleSave} className="space-y-6 text-xs">
          {/* Section 1: Notifications */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#ff6b35]" />
              <span>Notifikasi Pemesanan & Chat</span>
            </h3>

            <div className="space-y-2 pt-1">
              <label className="flex items-center justify-between p-3 rounded-[8px] bg-[#141414] border border-[#2e2e2e] cursor-pointer hover:border-[#383838]">
                <div>
                  <span className="font-medium text-white block">Pemberitahuan Pesanan Rental Baru via WhatsApp</span>
                  <span className="text-[11px] text-[#8d8d8d]">Kirim alert seketika saat Admin EO menerbitkan PO sewa alat</span>
                </div>
                <input
                  type="checkbox"
                  checked={waNotif}
                  onChange={(e) => setWaNotif(e.target.checked)}
                  className="w-4 h-4 accent-[#ff6b35] cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-[8px] bg-[#141414] border border-[#2e2e2e] cursor-pointer hover:border-[#383838]">
                <div>
                  <span className="font-medium text-white block">Notifikasi Pesan Chat Masuk</span>
                  <span className="text-[11px] text-[#8d8d8d]">Terima email ringkasan jika ada pesan yang belum dibaca lebih dari 15 menit</span>
                </div>
                <input
                  type="checkbox"
                  checked={emailNotif}
                  onChange={(e) => setEmailNotif(e.target.checked)}
                  className="w-4 h-4 accent-[#ff6b35] cursor-pointer"
                />
              </label>
            </div>
          </div>

          <div className="h-px bg-[#262626]" />

          {/* Section 2: Security */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#8cd6b0]" />
              <span>Ganti Kata Sandi Vendor</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[#8d8d8d]">Kata Sandi Saat Ini</label>
                <input
                  type="password"
                  value={oldPass}
                  onChange={(e) => setOldPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#141414] border border-[#333333] rounded-[6px] px-3 py-2 text-white focus:outline-none focus:border-[#ff6b35]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#8d8d8d]">Kata Sandi Baru</label>
                <input
                  type="password"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="w-full bg-[#141414] border border-[#333333] rounded-[6px] px-3 py-2 text-white focus:outline-none focus:border-[#ff6b35]"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#2e2e2e] flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 rounded-[8px] bg-[#ff6b35] text-[#171717] font-semibold text-xs flex items-center gap-1.5 hover:bg-[#e5531e] transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Pengaturan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
