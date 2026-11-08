'use client';

import React, { useState, useEffect } from 'react';
import { formatRupiah } from '@/lib/format';
import { 
  Wrench, FileText, Calendar, MapPin, Users, DollarSign, 
  CheckCircle2, Clock, Truck, PlusCircle, AlertCircle, RefreshCw, X
} from 'lucide-react';
import { useToast } from '@/components/ToastContext';

export default function VendorDashboardPage() {
  const toast = useToast();
  const [jobs, setJobs] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);

  // Modal claim state
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [claimSpk, setClaimSpk] = useState('');
  const [claimEvent, setClaimEvent] = useState('');
  const [claimTitle, setClaimTitle] = useState('');
  const [claimAmount, setClaimAmount] = useState('');
  const [claimNotes, setClaimNotes] = useState('');
  const [claimLoading, setClaimLoading] = useState(false);

  const fetchVendorData = async () => {
    try {
      const res = await fetch('/api/vendor/jobs');
      const data = await res.json();
      if (data.success) {
        setJobs(data.jobs || []);
        setMetrics(data.metrics || null);
        if (data.jobs && data.jobs.length > 0 && !claimSpk) {
          setClaimSpk(data.jobs[0].spk_number);
          setClaimEvent(data.jobs[0].event_name);
        }
      }
    } catch (err) {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendorData();
  }, []);

  const handleUpdateStatus = async (jobId, newStatus) => {
    setUpdatingId(jobId);
    try {
      const res = await fetch('/api/vendor/jobs', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job_id: jobId, status: newStatus }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Status ${data.job?.spk_number} berhasil diperbarui menjadi ${getStatusLabel(newStatus)}.`, 'Status Diperbarui');
        fetchVendorData();
      } else {
        toast.error(data.error || 'Gagal memperbarui status.', 'Gagal');
      }
    } catch (err) {
      toast.error('Terjadi gangguan jaringan saat memperbarui status.', 'Koneksi Error');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleClaimSubmit = async (e) => {
    e.preventDefault();
    if (!claimTitle.trim() || !claimAmount || Number(claimAmount) <= 0) {
      toast.error('Harap masukkan judul klaim dan nominal yang valid.', 'Input Tidak Lengkap');
      return;
    }

    setClaimLoading(true);
    try {
      const res = await fetch('/api/vendor/claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          spk_number: claimSpk,
          event_name: claimEvent,
          claim_title: claimTitle.trim(),
          amount: Number(claimAmount),
          notes: claimNotes.trim(),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Klaim operasional berhasil diajukan ke finance EO.', 'Klaim Tercatat');
        setIsClaimModalOpen(false);
        setClaimTitle('');
        setClaimAmount('');
        setClaimNotes('');
        fetchVendorData();
      } else {
        toast.error(data.error || 'Gagal mengajukan klaim.', 'Gagal');
      }
    } catch (err) {
      toast.error('Terjadi kesalahan sistem.', 'Error');
    } finally {
      setClaimLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'menunggu_konfirmasi':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-neutral-800 text-neutral-300 border border-neutral-700">
            Menunggu Konfirmasi
          </span>
        );
      case 'persiapan_alat':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-950/60 text-blue-300 border border-blue-800">
            Persiapan Alat di Gudang
          </span>
        );
      case 'loading_venue':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#393224] text-[#e9c47d] border border-[#e9c47d]/60">
            Loading & Rigging di Venue
          </span>
        );
      case 'ready_soundcheck':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#23372d] text-[#8cd6b0] border border-[#8cd6b0]/50">
            Ready & Soundcheck Selesai
          </span>
        );
      case 'selesai':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-neutral-900 text-neutral-400 border border-neutral-800">
            Pekerjaan Selesai & Bongkar
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-neutral-800 text-white">
            {status}
          </span>
        );
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'menunggu_konfirmasi': return 'Menunggu Konfirmasi';
      case 'persiapan_alat': return 'Persiapan Alat';
      case 'loading_venue': return 'Loading Venue';
      case 'ready_soundcheck': return 'Ready Soundcheck';
      case 'selesai': return 'Selesai';
      default: return status;
    }
  };

  const filteredJobs = jobs.filter(j => {
    if (filterStatus === 'all') return true;
    return j.job_status === filterStatus;
  });

  return (
    <div className="space-y-8" data-ui="vendor-dashboard">
      {/* 1. WELCOME & ACTION BAR */}
      <div className="bg-[#242424] border border-[#383838] rounded-[12px] p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h1 className="font-poppins font-semibold text-2xl text-white">
              Konsol Penugasan Mitra Produksi
            </h1>
          </div>
          <p className="font-inter text-xs text-[#bdbdbd] max-w-2xl leading-relaxed">
            Kelola status Surat Perintah Kerja (SPK), kesiapan rigging, pemantauan audio lighting di venue, serta pengajuan termin pembayaran ke pihak KINETIK EO.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setIsClaimModalOpen(true)}
            className="px-4 py-2.5 rounded-[6px] bg-[#e9c47d] text-[#171717] hover:bg-[#d8b066] font-semibold text-xs flex items-center gap-2 transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Ajukan Klaim Biaya Lapangan</span>
          </button>
          <button
            type="button"
            onClick={fetchVendorData}
            className="p-2.5 rounded-[6px] bg-[#171717] border border-[#383838] text-[#bdbdbd] hover:text-white transition-colors"
            title="Segarkan Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. OPERATIONAL KPI METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#242424] border border-[#383838] rounded-[10px] p-5 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs text-[#8d8d8d]">
            <span>SPK Penugasan Aktif</span>
            <FileText className="w-4 h-4 text-[#e9c47d]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-poppins font-semibold text-2xl text-white">
              {metrics ? metrics.activeJobs : 0} Event
            </span>
            <span className="text-[11px] text-[#8d8d8d]">
              / {metrics ? metrics.totalJobs : 0} Total
            </span>
          </div>
          <span className="text-[11px] text-[#8cd6b0]">
            {metrics ? metrics.completedJobs : 0} Event selesai terlaksana
          </span>
        </div>

        <div className="bg-[#242424] border border-[#383838] rounded-[10px] p-5 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs text-[#8d8d8d]">
            <span>Total Nilai Kontrak PO</span>
            <DollarSign className="w-4 h-4 text-[#ff6b35]" />
          </div>
          <span className="font-poppins font-semibold text-2xl text-white">
            {metrics ? formatRupiah(metrics.totalPO) : 'Rp0'}
          </span>
          <span className="text-[11px] text-[#8d8d8d]">
            Nilai akumulasi paket produksi mitra
          </span>
        </div>

        <div className="bg-[#242424] border border-[#383838] rounded-[10px] p-5 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs text-[#8d8d8d]">
            <span>Termin Terbayar EO</span>
            <CheckCircle2 className="w-4 h-4 text-[#8cd6b0]" />
          </div>
          <span className="font-poppins font-semibold text-2xl text-[#8cd6b0]">
            {metrics ? formatRupiah(metrics.totalPaid) : 'Rp0'}
          </span>
          <span className="text-[11px] text-[#8cd6b0]">
            DP 50% & pelunasan acara selesai
          </span>
        </div>

        <div className="bg-[#242424] border border-[#383838] rounded-[10px] p-5 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs text-[#8d8d8d]">
            <span>Piutang / Menunggu Pelunasan</span>
            <Clock className="w-4 h-4 text-[#e9c47d]" />
          </div>
          <span className="font-poppins font-semibold text-2xl text-[#e9c47d]">
            {metrics ? formatRupiah(metrics.remainingPO) : 'Rp0'}
          </span>
          <span className="text-[11px] text-[#8d8d8d]">
            Pelunasan termin H+1 pasca acara
          </span>
        </div>
      </div>

      {/* 3. WORK ORDERS LIST SECTION */}
      <div className="bg-[#242424] border border-[#383838] rounded-[12px] p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#383838] pb-4">
          <div>
            <h2 className="font-poppins font-semibold text-lg text-white">
              Daftar Surat Perintah Kerja (SPK) Vendor
            </h2>
            <p className="text-xs text-[#bdbdbd] mt-0.5">
              Klik pembaruan status pengerjaan saat alat bergerak dari gudang hingga standby di venue.
            </p>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'Semua' },
              { id: 'loading_venue', label: 'Loading Venue' },
              { id: 'persiapan_alat', label: 'Persiapan Alat' },
              { id: 'ready_soundcheck', label: 'Ready Soundcheck' },
              { id: 'selesai', label: 'Selesai' },
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterStatus(tab.id)}
                className={`px-3 py-1.5 rounded-[6px] text-xs font-semibold whitespace-nowrap transition-colors ${
                  filterStatus === tab.id
                    ? 'bg-[#e9c47d] text-[#171717]'
                    : 'bg-[#171717] border border-[#383838] text-[#bdbdbd] hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-[#bdbdbd]">
            <div className="w-6 h-6 border-2 border-[#383838] border-t-[#e9c47d] rounded-full animate-spin mx-auto mb-2"></div>
            Memuat penugasan SPK dari server...
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#8d8d8d]">
            Tidak ada penugasan kerja dengan filter status ini.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5">
            {filteredJobs.map(job => (
              <div
                key={job.id}
                className="bg-[#171717] border border-[#383838] rounded-[10px] p-5 sm:p-6 space-y-4 hover:border-[#e9c47d]/50 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2e2e2e] pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="font-poppins font-bold text-sm tracking-wide text-white">
                      {job.spk_number}
                    </span>
                    <span className="text-xs text-[#8d8d8d]">• Klien: {job.client_name}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {getStatusBadge(job.job_status)}
                    <span className="text-[11px] px-2 py-0.5 rounded bg-[#242424] text-[#8cd6b0] font-medium border border-[#383838]">
                      {job.payment_status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  {/* Left Column: Event details */}
                  <div className="md:col-span-8 space-y-3">
                    <h3 className="font-poppins font-semibold text-lg text-white">
                      {job.event_name}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-[#bdbdbd]">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#ff6b35] shrink-0" />
                        <span className="truncate">{job.venue}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#e9c47d] shrink-0" />
                        <span>Loading: {job.load_in_date}</span>
                      </div>
                    </div>

                    <div className="bg-[#242424] border border-[#383838] rounded-[6px] p-3 text-xs space-y-1">
                      <div className="font-medium text-white flex items-center gap-1.5">
                        <Wrench className="w-3.5 h-3.5 text-[#e9c47d]" />
                        <span>Lingkup Perlengkapan & Rigging:</span>
                      </div>
                      <p className="text-[#bdbdbd]">{job.scope_work}</p>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-[#8d8d8d]">
                      <Users className="w-3.5 h-3.5 text-[#8cd6b0]" />
                      <span>Alokasi Kru: <strong className="text-white">{job.crew_assigned}</strong></span>
                    </div>

                    {job.notes && (
                      <div className="text-[11px] text-[#8d8d8d] bg-[#1c1c1c] p-2.5 rounded border border-[#2e2e2e]">
                        <strong>Catatan Lapangan:</strong> {job.notes}
                      </div>
                    )}
                  </div>

                  {/* Right Column: Financial & Interactive Status Controller */}
                  <div className="md:col-span-4 flex flex-col justify-between gap-4 border-t md:border-t-0 md:border-l border-[#2e2e2e] pt-4 md:pt-0 md:pl-5">
                    <div className="space-y-1">
                      <span className="text-[11px] text-[#8d8d8d] block">Nilai PO Pekerjaan:</span>
                      <span className="font-poppins font-semibold text-xl text-white block">
                        {formatRupiah(job.po_amount)}
                      </span>
                      <span className="text-[11px] text-[#8cd6b0] block">
                        Terbayar: {formatRupiah(job.paid_amount)}
                      </span>
                    </div>

                    {/* Quick Status Update Controller */}
                    <div className="space-y-1.5 bg-[#242424] p-3 rounded-[6px] border border-[#383838]">
                      <label className="text-[10px] text-[#8d8d8d] font-semibold uppercase tracking-wider block">
                        Perbarui Status Pengerjaan:
                      </label>
                      <select
                        value={job.job_status}
                        disabled={updatingId === job.id}
                        onChange={(e) => handleUpdateStatus(job.id, e.target.value)}
                        className="w-full bg-[#171717] border border-[#383838] text-white text-xs rounded px-2.5 py-1.5 focus:outline-none focus:border-[#e9c47d] disabled:opacity-50"
                      >
                        <option value="menunggu_konfirmasi">Menunggu Konfirmasi</option>
                        <option value="persiapan_alat">Persiapan Alat di Gudang</option>
                        <option value="loading_venue">Loading & Rigging di Venue</option>
                        <option value="ready_soundcheck">Ready & Soundcheck Selesai</option>
                        <option value="selesai">Pekerjaan Selesai & Bongkaran</option>
                      </select>
                      {updatingId === job.id && (
                        <span className="text-[10px] text-[#e9c47d] block animate-pulse">
                          Memperbarui status...
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. LOGISTICS & INVENTORY READINESS */}
      <div className="bg-[#242424] border border-[#383838] rounded-[12px] p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#383838] pb-3">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#e9c47d]" />
            <h2 className="font-poppins font-semibold text-base text-white">
              Kesiapan Armada Logistik & Unit Alat Vendor
            </h2>
          </div>
          <span className="text-xs text-[#8cd6b0] font-medium">Semua Unit Tersertifikasi Laik Operasi</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#171717] border border-[#383838] rounded-[8px] p-4 space-y-2">
            <span className="text-[10px] text-[#ff6b35] font-semibold uppercase tracking-wider">Sound System</span>
            <h4 className="font-poppins font-medium text-sm text-white">L-Acoustics K2 Line Array 20kW</h4>
            <div className="flex items-center justify-between text-xs pt-1 border-t border-[#2e2e2e]">
              <span className="text-[#8d8d8d]">Alokasi:</span>
              <span className="text-[#8cd6b0] font-medium">Tribrata Stage (Active)</span>
            </div>
          </div>

          <div className="bg-[#171717] border border-[#383838] rounded-[8px] p-4 space-y-2">
            <span className="text-[10px] text-[#ff6b35] font-semibold uppercase tracking-wider">Rigging Structure</span>
            <h4 className="font-poppins font-medium text-sm text-white">Aluminium Roof Truss 14x10m</h4>
            <div className="flex items-center justify-between text-xs pt-1 border-t border-[#2e2e2e]">
              <span className="text-[#8d8d8d]">Alokasi:</span>
              <span className="text-[#8cd6b0] font-medium">Tribrata Stage (Rigged)</span>
            </div>
          </div>

          <div className="bg-[#171717] border border-[#383838] rounded-[8px] p-4 space-y-2">
            <span className="text-[10px] text-[#ff6b35] font-semibold uppercase tracking-wider">Visual & LED</span>
            <h4 className="font-poppins font-medium text-sm text-white">Videotron P3.9 Indoor 6x3.5m</h4>
            <div className="flex items-center justify-between text-xs pt-1 border-t border-[#2e2e2e]">
              <span className="text-[#8d8d8d]">Alokasi:</span>
              <span className="text-[#e9c47d] font-medium">Hotel Mulia (Standby)</span>
            </div>
          </div>

          <div className="bg-[#171717] border border-[#383838] rounded-[8px] p-4 space-y-2">
            <span className="text-[10px] text-[#ff6b35] font-semibold uppercase tracking-wider">Power Generator</span>
            <h4 className="font-poppins font-medium text-sm text-white">Genset Silent Perkins 80 kVA</h4>
            <div className="flex items-center justify-between text-xs pt-1 border-t border-[#2e2e2e]">
              <span className="text-[#8d8d8d]">Alokasi:</span>
              <span className="text-[#8cd6b0] font-medium">Standby Gudang Siap Kirim</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. MODAL AJUKAN KLAIM BIAYA LAPANGAN */}
      {isClaimModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
          <div className="relative w-full max-w-md bg-[#242424] border border-[#383838] rounded-[12px] p-6 space-y-4 text-white">
            <div className="flex justify-between items-center border-b border-[#383838] pb-3">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-[#e9c47d]" />
                <h3 className="font-poppins font-semibold text-base text-white">
                  Ajukan Klaim Operasional Lapangan
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsClaimModalOpen(false)}
                className="text-[#8d8d8d] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleClaimSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs text-[#8d8d8d]">Pilih SPK Event Terkait</label>
                <select
                  value={claimSpk}
                  onChange={(e) => {
                    setClaimSpk(e.target.value);
                    const selected = jobs.find(j => j.spk_number === e.target.value);
                    if (selected) setClaimEvent(selected.event_name);
                  }}
                  className="w-full bg-[#171717] border border-[#383838] rounded-[6px] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#e9c47d]"
                >
                  {jobs.map(j => (
                    <option key={j.id} value={j.spk_number}>
                      {j.spk_number} — {j.event_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-[#8d8d8d]">Deskripsi Klaim / Pengeluaran</label>
                <input
                  type="text"
                  value={claimTitle}
                  onChange={(e) => setClaimTitle(e.target.value)}
                  placeholder="Contoh: Tambahan Kabel Snake 30m & Extra Hour Crew"
                  required
                  className="w-full bg-[#171717] border border-[#383838] rounded-[6px] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#e9c47d]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-[#8d8d8d]">Nominal Biaya (IDR)</label>
                <input
                  type="number"
                  value={claimAmount}
                  onChange={(e) => setClaimAmount(e.target.value)}
                  placeholder="Contoh: 450000"
                  required
                  className="w-full bg-[#171717] border border-[#383838] rounded-[6px] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#e9c47d]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-[#8d8d8d]">Keterangan Tambahan / Alasan</label>
                <textarea
                  value={claimNotes}
                  onChange={(e) => setClaimNotes(e.target.value)}
                  placeholder="Alasan penambahan pengeluaran di lokasi acara..."
                  rows={2}
                  className="w-full bg-[#171717] border border-[#383838] rounded-[6px] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#e9c47d] resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#383838]">
                <button
                  type="button"
                  onClick={() => setIsClaimModalOpen(false)}
                  className="px-4 py-2 bg-[#171717] border border-[#383838] rounded-[6px] text-xs text-[#bdbdbd] hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={claimLoading}
                  className="px-4 py-2 bg-[#e9c47d] text-[#171717] font-semibold rounded-[6px] text-xs hover:bg-[#d8b066] disabled:opacity-50"
                >
                  {claimLoading ? 'Mengajukan...' : 'Kirim Klaim ke EO'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
