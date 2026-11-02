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
          <div className="inline-block nb-badge bg-[#A3E635] text-black text-xs mb-1">
            AKUNTANSI & KELAYAKAN FINANSIAL
          </div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
            Laporan Keuangan (Laba Rugi)
          </h2>
          <p className="text-xs font-bold text-neutral-600">
            Perhitungan omzet bruto, HPP produk, beban operasional, dan laba bersih usaha.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start">
          <button
            onClick={() => setIsExpenseModalOpen(true)}
            className="nb-btn nb-btn-white px-3.5 py-2 text-xs flex items-center gap-1.5 font-bold"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" /> Catat Beban Operasional
          </button>
          <button
            onClick={handlePrint}
            className="nb-btn nb-btn-yellow px-4 py-2 text-xs flex items-center gap-2 uppercase font-black"
          >
            <Printer className="w-4 h-4 stroke-[2.5]" /> Cetak PDF
          </button>
        </div>
      </div>

      {/* Date Filter Bar (Hidden when printing) */}
      <div className="nb-card bg-white p-5 space-y-4 no-print">
        <div className="flex items-center gap-2 border-b-2 border-black pb-2 text-xs font-black uppercase">
          <Filter className="w-4 h-4" /> Filter Periode Pembukuan:
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-black uppercase text-neutral-700 block">
              Dari Tanggal (Awal)
            </label>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="nb-input w-full text-xs font-bold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-black uppercase text-neutral-700 block">
              Sampai Tanggal (Akhir)
            </label>
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="nb-input w-full text-xs font-bold"
            />
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* PRINTABLE FINANCIAL STATEMENT (A4 FORMAL FORMAT)         */}
      {/* ======================================================== */}

      <div className="print-container bg-white p-6 sm:p-10 border-2 border-black space-y-8 shadow-brutal" data-ui="financial-statement">
        {/* Header Document */}
        <div className="border-b-4 border-black pb-6 flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <div className="px-3 py-1 bg-[#A3E635] border-2 border-black font-black text-xl tracking-tight inline-block mb-1">
              KINETIK EVENT PRODUCTION
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tight">LAPORAN LABA RUGI KOMPREHENSIF</h3>
            <p className="text-xs font-bold text-neutral-700">Statement of Profit or Loss and Other Comprehensive Income</p>
          </div>

          <div className="sm:text-right space-y-0.5 text-xs font-bold text-neutral-700">
            <p className="text-black font-black">KODE DOK: FIN-2026-KINETIK</p>
            <p>
              Periode:{' '}
              <span className="font-black text-black">
                {startDate ? formatSimpleDate(startDate) : 'Awal'} s/d {endDate ? formatSimpleDate(endDate) : 'Sekarang'}
              </span>
            </p>
            <p>Standar Akuntansi Keuangan Entitas Mikro, Kecil, dan Menengah (SAK EMKM)</p>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center font-bold text-sm">Menghitung kalkulasi pembukuan...</div>
        ) : !statement ? (
          <div className="py-12 text-center text-xs font-bold">Tidak ada data keuangan pada periode ini.</div>
        ) : (
          <div className="space-y-6 text-sm">
            {/* 1. Pendapatan Penjualan */}
            <div className="space-y-2">
              <div className="bg-[#FFFDF0] p-2.5 border-2 border-black flex justify-between items-center font-black text-xs uppercase">
                <span>I. PENDAPATAN USAHA (REVENUE)</span>
                <span>NOMINAL (IDR)</span>
              </div>
              <div className="space-y-1.5 px-3 font-medium text-xs">
                <div className="flex justify-between py-1 border-b-2 border-neutral-200">
                  <span>Penjualan Tiket, Paket Acara, & Sewa Alat (Gross Revenue)</span>
                  <span className="font-bold">{formatRupiah(statement.pendapatan.penjualanKotor)}</span>
                </div>
                <div className="flex justify-between py-1 border-b-2 border-neutral-200 text-neutral-600">
                  <span>Potongan & Diskon Penjualan</span>
                  <span>(Rp 0)</span>
                </div>
                <div className="flex justify-between py-1 font-black text-black text-sm pt-1">
                  <span>TOTAL PENDAPATAN BERSIH</span>
                  <span className="text-emerald-800">{formatRupiah(statement.pendapatan.penjualanBersih)}</span>
                </div>
              </div>
            </div>

            {/* 2. HPP */}
            <div className="space-y-2">
              <div className="bg-[#FFFDF0] p-2.5 border-2 border-black flex justify-between items-center font-black text-xs uppercase">
                <span>II. HARGA POKOK PENJUALAN (HPP / COGS)</span>
                <span>NOMINAL (IDR)</span>
              </div>
              <div className="space-y-1.5 px-3 font-medium text-xs">
                <div className="flex justify-between py-1 border-b-2 border-neutral-200">
                  <span>HPP Langsung (Honor Kru, Sewa Venue, Catering, & Genset Acara)</span>
                  <span className="font-bold text-red-700">({formatRupiah(statement.hargaPokokPenjualan.totalHPP)})</span>
                </div>
                <div className="flex justify-between py-2 font-black text-black text-sm bg-neutral-100 px-2 border border-black mt-2">
                  <span>LABA KOTOR USAHA (GROSS PROFIT)</span>
                  <span className="text-black">{formatRupiah(statement.labaKotor)}</span>
                </div>
              </div>
            </div>

            {/* 3. Beban Operasional */}
            <div className="space-y-2">
              <div className="bg-[#FFFDF0] p-2.5 border-2 border-black flex justify-between items-center font-black text-xs uppercase">
                <span>III. BEBAN OPERASIONAL & UMUM</span>
                <span>NOMINAL (IDR)</span>
              </div>
              <div className="space-y-1 px-3 font-medium text-xs">
                {statement.bebanOperasional.items.map(exp => (
                  <div key={exp.id} className="flex justify-between py-1.5 border-b-2 border-neutral-200">
                    <div>
                      <span className="font-bold">{exp.expense_title}</span>
                      <span className="text-[10px] text-neutral-500 block">Kategori: {exp.category} • Tgl: {exp.expense_date}</span>
                    </div>
                    <span className="font-bold text-red-700">({formatRupiah(exp.amount)})</span>
                  </div>
                ))}
                <div className="flex justify-between py-1.5 font-bold text-neutral-800 pt-2">
                  <span>TOTAL BEBAN OPERASIONAL:</span>
                  <span className="font-black text-red-700">({formatRupiah(statement.bebanOperasional.totalBeban)})</span>
                </div>
              </div>
            </div>

            {/* 4. LABA BERSIH OPERASIONAL */}
            <div className="p-4 border-4 border-black bg-[#FFE600] flex justify-between items-center font-black text-base sm:text-lg shadow-brutal">
              <div>
                <span className="uppercase block">IV. LABA BERSIH USAHA (NET OPERATING PROFIT)</span>
                <span className="text-xs font-bold text-neutral-800">Laba Kotor dikurangi Total Beban Operasional</span>
              </div>
              <span className="text-2xl text-black">
                {formatRupiah(statement.labaBersihOperasional)}
              </span>
            </div>
          </div>
        )}

        {/* Verification Footer */}
        <div className="pt-8 border-t-2 border-black flex justify-between items-end text-xs font-bold text-neutral-700">
          <div>
            <p className="font-black text-black">Pernyataan Validitas:</p>
            <p className="text-[10px] text-neutral-500">
              Laporan ini dibuat secara otomatis dari catatan transaksi penjualan dan beban operasional pada sistem.
            </p>
          </div>

          <div className="text-center">
            <p className="text-[10px] text-neutral-500 mb-12">Jakarta, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <p className="font-black border-t-2 border-black pt-1 px-8">Finance & Production Controller Lead</p>
          </div>
        </div>
      </div>

      {/* Modal Catat Pengeluaran Baru */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="relative w-full max-w-md bg-white border-4 border-black p-6 space-y-4 shadow-brutal-xl">
            <div className="flex justify-between items-center border-b-2 border-black pb-2">
              <h3 className="font-black text-base uppercase">Catat Beban Operasional</h3>
              <button onClick={() => setIsExpenseModalOpen(false)} aria-label="Tutup modal" className="p-1 hover:bg-neutral-100 border-2 border-black">
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-black uppercase block">Nama Pengeluaran *</label>
                <input
                  type="text"
                  value={expTitle}
                  onChange={e => setExpTitle(e.target.value)}
                  required
                  placeholder="Contoh: Sewa Genset Silent 40 KVA / Honor Kru"
                  className="nb-input w-full text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black uppercase block">Kategori Beban *</label>
                <select
                  value={expCategory}
                  onChange={e => setExpCategory(e.target.value)}
                  className="nb-input w-full text-xs font-bold"
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
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase block">Nominal (Rp) *</label>
                  <input
                    type="number"
                    value={expAmount}
                    onChange={e => setExpAmount(Number(e.target.value))}
                    required
                    min={1000}
                    step={1000}
                    className="nb-input w-full text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black uppercase block">Tanggal *</label>
                  <input
                    type="date"
                    value={expDate}
                    onChange={e => setExpDate(e.target.value)}
                    required
                    className="nb-input w-full text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black uppercase block">Catatan Tambahan</label>
                <input
                  type="text"
                  value={expNotes}
                  onChange={e => setExpNotes(e.target.value)}
                  placeholder="Opsional: Keterangan nota/struk"
                  className="nb-input w-full text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t-2 border-black">
                <button
                  type="button"
                  onClick={() => setIsExpenseModalOpen(false)}
                  className="nb-btn nb-btn-white px-3 py-1.5 text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={savingExp}
                  className="nb-btn nb-btn-yellow px-4 py-1.5 text-xs font-black uppercase"
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
