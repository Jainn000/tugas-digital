'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Building2, MapPin, Phone, Mail, Award, 
  CreditCard, ArrowLeft, CheckCircle2, Save 
} from 'lucide-react';
import { useToast } from '@/components/ToastContext';

export default function VendorProfilePage() {
  const toast = useToast();
  const [companyName, setCompanyName] = useState('Raya Event Supply');
  const [phone, setPhone] = useState('081399887766');
  const [email, setEmail] = useState('vendor@entrepreneur.id');
  const [address, setAddress] = useState('Kawasan Industri Pulogadung Blok III No. 8, Jakarta Timur');
  const [bankAccount, setBankAccount] = useState('BCA 8890-1234-56 (a/n PT Mahakarya Raya Event)');

  const handleSave = (e) => {
    e.preventDefault();
    toast.success('Profil bisnis dan kontak vendor berhasil disimpan.', 'Profil Disimpan');
  };

  return (
    <div className="space-y-6 max-w-4xl" data-ui="vendor-profile">
      <div className="flex items-center gap-2">
        <Link href="/vendor" className="text-[#8d8d8d] hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-poppins font-bold text-2xl text-white">
            Profile & Business
          </h1>
          <p className="font-inter text-xs text-[#8d8d8d]">
            Identitas kemitraan resmi, workshop logistik, dan data penagihan vendor.
          </p>
        </div>
      </div>

      <div className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-[12px] p-6 space-y-6">
        {/* Banner with Avatar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-b border-[#2e2e2e] pb-6">
          <div className="relative w-20 h-20 rounded-[12px] overflow-hidden border border-[#444444] bg-[#222222] shrink-0">
            <Image
              src="/figma/hero-concert.png"
              alt="Vendor Logo"
              fill
              className="object-cover"
            />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="font-poppins font-bold text-xl text-white">{companyName}</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#ff6b35] text-[#171717] uppercase">
                Vendor Resmi
              </span>
            </div>
            <p className="text-xs text-[#8d8d8d]">
              Penyedia Tata Suara, Panggung Rigging, Tata Cahaya & Visual Multicam KINETIK Partner
            </p>
            <div className="flex items-center gap-3 text-[11px] text-[#8cd6b0] pt-1">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Terverifikasi KINETIK EO
              </span>
              <span>• SLA Kesiapan: 99.4%</span>
            </div>
          </div>
        </div>

        {/* Form fields */}
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[#8d8d8d]">Nama Usaha / Perusahaan Vendor</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full bg-[#141414] border border-[#333333] rounded-[6px] px-3 py-2 text-white focus:outline-none focus:border-[#ff6b35]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[#8d8d8d]">Email Operasional</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full bg-[#141414] border border-[#333333] rounded-[6px] px-3 py-2 text-[#888888] cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[#8d8d8d]">Nomor WhatsApp Hotline PIC</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#141414] border border-[#333333] rounded-[6px] px-3 py-2 text-white focus:outline-none focus:border-[#ff6b35]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[#8d8d8d]">Rekening Penagihan Payout (Termin)</label>
              <input
                type="text"
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                className="w-full bg-[#141414] border border-[#333333] rounded-[6px] px-3 py-2 text-white focus:outline-none focus:border-[#ff6b35]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[#8d8d8d]">Alamat Gudang Workshop & Pengiriman Alat</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={2}
              className="w-full bg-[#141414] border border-[#333333] rounded-[6px] px-3 py-2 text-white focus:outline-none focus:border-[#ff6b35] resize-none"
            />
          </div>

          <div className="pt-3 border-t border-[#2e2e2e] flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 rounded-[8px] bg-[#ff6b35] text-[#171717] font-semibold text-xs flex items-center gap-1.5 hover:bg-[#e5531e] transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Profil Bisnis</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
