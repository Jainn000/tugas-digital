'use client';

import React, { useState, useEffect } from 'react';
import { formatRupiah, formatSimpleDate } from '@/lib/format';
import { Printer, Filter, Plus, X } from 'lucide-react';

export default function AdminFinancialReportPage() {
  const [startDate, setStartDate] = useState('2026-10-01');
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [statement, setStatement] = useState(null);
  const [loading, setLoading] = useState(false);

  // Form expense modal
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [expTitle, setExpTitle] = useState('');
  const [expCategory, setExpCategory] = useState('Honor Kru & SDM');
  const [expAmount, setExpAmount] = useState(500000);
  const [expDate, setExpDate] = useState(new Date().toISOString().split('T')[0]);
  const [expNotes, setExpNotes] = useState('');
  const [savingExp, setSavingExp] = useState(false);

  const fetchStatement = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (startDate) params.set('startDate', startDate);
      if (endDate) params.set('endDate', endDate);

      const res = await fetch(`/api/reports/financial?${params.toString()}`);
      const data = await res.json();
      if (data.statement) setStatement(data.statement);
    } catch (err) {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatement();
  }, [startDate, endDate]);

  const handlePrint = () => {
    window.print();
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    setSavingExp(true);
    try {
      const res = await fetch('/api/reports/financial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          expense_title: expTitle,
          category: expCategory,
          amount: expAmount,
          expense_date: expDate,
          notes: expNotes,
        }),
      });
      if (res.ok) {
        setIsExpenseModalOpen(false);
        setExpTitle('');
        setExpAmount(500000);
        setExpNotes('');
        fetchStatement();
      }
    } catch (err) {
      alert('Gagal menambah pengeluaran.');
    } finally {
      setSavingExp(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header (Hidden when printing) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-[#8cd6b0]/15 border border-[#8cd6b0]/30 text-[#8cd6b0] text-[11px] font-semibold uppercase mb-1 inline-block">
            Akuntansi & Kelayakan Finansial
          </span>
          <h2 className="font-poppins font-semibold text-xl sm:text-2xl text-white">
            Laporan Keuangan (Laba Rugi)
          </h2>
          <p className="font-inter text-xs text-[#bdbdbd] mt-1">
            Perhitungan omzet bruto, HPP produk, beban operasional lapangan, dan laba bersih usaha.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setIsExpenseModalOpen(true)}
            className="px-3.5 py-2 rounded-[6px] bg-[#171717] border border-[#383838] text-white hover:border-[#ff6b35] text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4 text-[#ff6b35]" />
            <span>Catat Beban Operasional</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 rounded-[6px] bg-[#ff6b35] text-[#171717] hover:bg-[#e5531e] text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak PDF</span>
          </button>
        </div>
      </div>

      {/* Date Filter Bar (Hidden when printing) */}
      <div className="bg-[#242424] border border-[#383838] rounded-[10px] p-5 space-y-4 no-print">
        <div className="flex items-center gap-2 border-b border-[#383838] pb-2 text-xs font-semibold text-white">
          <Filter className="w-4 h-4 text-[#ff6b35]" />
          <span>Filter Periode Pembukuan:</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-medium text-[#8d8d8d]">
              Dari Tanggal (Awal)
            </label>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="bg-[#171717] border border-[#383838] rounded-[6px] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff6b35]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-medium text-[#8d8d8d]">
              Sampai Tanggal (Akhir)
            </label>
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="bg-[#171717] border border-[#383838] rounded-[6px] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff6b35]"
            />
          </div>
        </div>
      </div>

      {/* Printable Financial Statement */}
      <div className="bg-[#242424] border border-[#383838] rounded-[10px] p-6 sm:p-8 space-y-6 text-white" data-ui="financial-statement">
        {/* Header Document */}
        <div className="border-b border-[#383838] pb-4 flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <h3 className="font-poppins font-bold text-lg text-white">
              KINETIK EVENT PRODUCTION
            </h3>
            <h4 className="font-poppins text-sm text-[#ff6b35] font-semibold mt-0.5">
              LAPORAN LABA RUGI KOMPREHENSIF
            </h4>
            <p className="text-[11px] text-[#8d8d8d]">Statement of Profit or Loss and Other Comprehensive Income</p>
          </div>

          <div className="sm:text-right space-y-0.5 text-xs text-[#bdbdbd]">
            <p className="text-white font-semibold">KODE DOK: FIN-2026-KINETIK</p>
            <p>
              Periode:{' '}
              <span className="font-semibold text-white">
                {startDate ? formatSimpleDate(startDate) : 'Awal'} s/d {endDate ? formatSimpleDate(endDate) : 'Sekarang'}
              </span>
            </p>
            <p className="text-[10px] text-[#8d8d8d]">Standar Akuntansi Keuangan Entitas Mikro, Kecil, dan Menengah (SAK EMKM)</p>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-[#8d8d8d]">Menghitung kalkulasi pembukuan...</div>
        ) : !statement ? (
          <div className="py-12 text-center text-xs text-[#8d8d8d]">Tidak ada data keuangan pada periode ini.</div>
        ) : (
          <div className="space-y-6 text-xs">
            {/* 1. Pendapatan Penjualan */}
            <div className="space-y-2">
              <div className="bg-[#1c1c1c] p-2.5 rounded-[6px] border border-[#383838] flex justify-between items-center font-semibold text-[11px] uppercase text-[#8d8d8d]">
                <span>I. PENDAPATAN USAHA (REVENUE)</span>
                <span>NOMINAL (IDR)</span>
              </div>
              <div className="space-y-1 px-3">
                <div className="flex justify-between py-1.5 border-b border-[#2e2e2e] text-[#bdbdbd]">
                  <span>Penjualan Tiket, Paket Acara & Sewa Alat (Gross Revenue)</span>
                  <span className="font-semibold text-white">{formatRupiah(statement.pendapatan.penjualanKotor)}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#2e2e2e] text-[#8d8d8d]">
                  <span>Potongan & Diskon Penjualan</span>
                  <span>(Rp 0)</span>
                </div>
                <div className="flex justify-between py-2 font-semibold text-sm pt-2 text-white">
                  <span>TOTAL PENDAPATAN BERSIH</span>
                  <span className="text-[#8cd6b0]">{formatRupiah(statement.pendapatan.penjualanBersih)}</span>
                </div>
              </div>
            </div>

            {/* 2. HPP */}
            <div className="space-y-2">
              <div className="bg-[#1c1c1c] p-2.5 rounded-[6px] border border-[#383838] flex justify-between items-center font-semibold text-[11px] uppercase text-[#8d8d8d]">
                <span>II. HARGA POKOK PENJUALAN (HPP / COGS)</span>
                <span>NOMINAL (IDR)</span>
              </div>
              <div className="space-y-1 px-3">
                <div className="flex justify-between py-1.5 border-b border-[#2e2e2e] text-[#bdbdbd]">
                  <span>HPP Langsung (Honor Kru, Vendor Panggung, Genset & Konsumsi)</span>
                  <span className="font-semibold text-red-400">({formatRupiah(statement.hargaPokokPenjualan.totalHPP)})</span>
                </div>
                <div className="flex justify-between py-2.5 px-3 rounded-[6px] bg-[#171717] border border-[#383838] font-semibold text-sm mt-2">
                  <span className="text-white">LABA KOTOR USAHA (GROSS PROFIT)</span>
                  <span className="text-white">{formatRupiah(statement.labaKotor)}</span>
                </div>
              </div>
            </div>

            {/* 3. Beban Operasional */}
            <div className="space-y-2">
              <div className="bg-[#1c1c1c] p-2.5 rounded-[6px] border border-[#383838] flex justify-between items-center font-semibold text-[11px] uppercase text-[#8d8d8d]">
                <span>III. BEBAN OPERASIONAL & UMUM</span>
                <span>NOMINAL (IDR)</span>
              </div>
              <div className="space-y-1 px-3">
                {statement.bebanOperasional.items.map(exp => (
                  <div key={exp.id} className="flex justify-between py-1.5 border-b border-[#2e2e2e] text-[#bdbdbd]">
                    <div>
                      <span className="font-medium text-white">{exp.expense_title}</span>
                      <span className="text-[10px] text-[#8d8d8d] block mt-0.5">Kategori: {exp.category} • Tgl: {exp.expense_date}</span>
                    </div>
                    <span className="font-semibold text-red-400">({formatRupiah(exp.amount)})</span>
                  </div>
                ))}
                <div className="flex justify-between py-2 font-semibold text-[#bdbdbd] pt-2">
                  <span>TOTAL BEBAN OPERASIONAL:</span>
                  <span className="font-bold text-red-400">({formatRupiah(statement.bebanOperasional.totalBeban)})</span>
                </div>
              </div>
            </div>

            {/* 4. LABA BERSIH OPERASIONAL */}
            <div className="p-4 rounded-[8px] bg-[#38271f] border border-[#ff6b35] flex justify-between items-center">
              <div>
                <span className="font-poppins font-semibold text-sm uppercase block text-white">IV. LABA BERSIH USAHA (NET OPERATING PROFIT)</span>
                <span className="text-[11px] text-[#bdbdbd]">Laba Kotor dikurangi Total Beban Operasional</span>
              </div>
              <span className="text-2xl font-bold font-poppins text-[#8cd6b0]">
                {formatRupiah(statement.labaBersihOperasional)}
              </span>
            </div>
          </div>
        )}

        {/* Verification Footer */}
        <div className="pt-8 border-t border-[#383838] flex justify-between items-end text-xs text-[#8d8d8d]">
          <div>
            <p className="font-semibold text-white">Pernyataan Validitas:</p>
            <p className="text-[10px] text-[#666666]">
              Laporan ini dibuat otomatis dari rekap transaksi penjualan dan beban operasional KINETIK.
            </p>
          </div>

          <div className="text-center">
            <p className="text-[10px] text-[#666666] mb-10">
              Jakarta, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            <p className="font-semibold text-white border-t border-[#383838] pt-1 px-4">
              Finance & Production Controller Lead
            </p>
          </div>
        </div>
      </div>

      {/* Modal Catat Pengeluaran Baru */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
          <div className="relative w-full max-w-md bg-[#242424] border border-[#383838] rounded-[12px] p-6 space-y-4 text-white">
            <div className="flex justify-between items-center border-b border-[#383838] pb-3">
              <h3 className="font-poppins font-semibold text-base text-white">Catat Beban Operasional</h3>
              <button
                type="button"
                onClick={() => setIsExpenseModalOpen(false)}
                aria-label="Tutup modal"
                className="p-1 text-[#8d8d8d] hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="space-y-3.5">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-medium text-[#8d8d8d]">Nama Pengeluaran *</label>
                <input
                  type="text"
                  value={expTitle}
                  onChange={e => setExpTitle(e.target.value)}
                  required
                  placeholder="Contoh: Sewa Genset Silent 40 KVA / Honor Kru"
                  className="bg-[#171717] border border-[#383838] rounded-[6px] px-3.5 py-2 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#ff6b35]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-medium text-[#8d8d8d]">Kategori Beban *</label>
                <select
                  value={expCategory}
                  onChange={e => setExpCategory(e.target.value)}
                  className="bg-[#171717] border border-[#383838] rounded-[6px] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff6b35]"
                >
                  <option value="Honor Kru & SDM">Honor Kru & SDM Lapangan</option>
                  <option value="Sewa Alat & Genset">Sewa Alat & Genset Cadangan</option>
                  <option value="Produksi & Perlengkapan">Produksi Gelang & ID Panitia</option>
                  <option value="Perizinan & Administrasi">Perizinan Keramaian & Keamanan</option>
                  <option value="Pemasaran & Promosi">Pemasaran & Iklan Tiket</option>
                  <option value="Finansial & Biaya Admin">Finansial & Biaya Admin Gateway</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-medium text-[#8d8d8d]">Nominal (Rp) *</label>
                  <input
                    type="number"
                    value={expAmount}
                    onChange={e => setExpAmount(Number(e.target.value))}
                    required
                    min={1000}
                    step={1000}
                    className="bg-[#171717] border border-[#383838] rounded-[6px] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff6b35]"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-medium text-[#8d8d8d]">Tanggal *</label>
                  <input
                    type="date"
                    value={expDate}
                    onChange={e => setExpDate(e.target.value)}
                    required
                    className="bg-[#171717] border border-[#383838] rounded-[6px] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff6b35]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-medium text-[#8d8d8d]">Catatan Tambahan</label>
                <input
                  type="text"
                  value={expNotes}
                  onChange={e => setExpNotes(e.target.value)}
                  placeholder="Opsional: Keterangan nota/struk"
                  className="bg-[#171717] border border-[#383838] rounded-[6px] px-3.5 py-2 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#ff6b35]"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2.5 border-t border-[#383838]">
                <button
                  type="button"
                  onClick={() => setIsExpenseModalOpen(false)}
                  className="px-4 py-2 rounded-[6px] bg-[#171717] border border-[#383838] text-[#bdbdbd] hover:text-white text-xs font-medium transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={savingExp}
                  className="px-5 py-2 rounded-[6px] bg-[#ff6b35] text-[#171717] hover:bg-[#e5531e] text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  {savingExp ? 'Menyimpan...' : 'Simpan Beban'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
