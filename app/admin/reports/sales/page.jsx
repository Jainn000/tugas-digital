'use client';

import React, { useState, useEffect } from 'react';
import { formatRupiah, formatSimpleDate } from '@/lib/format';
import { Printer, Filter } from 'lucide-react';

export default function AdminSalesReportPage() {
  const [startDate, setStartDate] = useState('2026-10-01');
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentStatus, setPaymentStatus] = useState('paid');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (startDate) params.set('startDate', startDate);
      if (endDate) params.set('endDate', endDate);
      if (paymentStatus) params.set('paymentStatus', paymentStatus);

      const res = await fetch(`/api/reports/sales?${params.toString()}`);
      const data = await res.json();
      if (data.report) setReport(data.report);
    } catch (err) {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [startDate, endDate, paymentStatus]);

  const handlePrint = () => {
    window.print();
  };

  const setQuickRange = (range) => {
    if (range === 'oct') {
      setStartDate('2026-10-01');
      setEndDate('2026-10-31');
    } else if (range === 'nov') {
      setStartDate('2026-11-01');
      setEndDate('2026-11-30');
    } else {
      setStartDate('');
      setEndDate('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header (Hidden when printing) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <div className="inline-block nb-badge bg-[#FFE600] text-black text-xs mb-1">
            ANALITIK OMZET & PERFORMA
          </div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
            Laporan Penjualan Periodik
          </h2>
          <p className="text-xs font-bold text-neutral-600">
            Filter omzet berdasarkan rentang tanggal dan cetak ringkasan laporan ke format PDF.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="nb-btn nb-btn-yellow px-4 py-2 text-xs flex items-center gap-2 uppercase font-black self-start"
        >
          <Printer className="w-4 h-4 stroke-[2.5]" /> Cetak Laporan (PDF)
        </button>
      </div>

      {/* Date Filter Controls (Hidden when printing) */}
      <div className="nb-card bg-white p-5 space-y-4 no-print">
        <div className="flex items-center gap-2 border-b-2 border-black pb-2 text-xs font-black uppercase">
          <Filter className="w-4 h-4" /> Filter Rentang Tanggal Transaksi:
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
          <div className="sm:col-span-4 space-y-1">
            <label className="text-xs font-black uppercase text-neutral-700 block">
              Dari Tanggal (Mulai)
            </label>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="nb-input w-full text-xs font-bold"
            />
          </div>

          <div className="sm:col-span-4 space-y-1">
            <label className="text-xs font-black uppercase text-neutral-700 block">
              Sampai Tanggal (Selesai)
            </label>
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="nb-input w-full text-xs font-bold"
            />
          </div>

          <div className="sm:col-span-4 space-y-1">
            <label className="text-xs font-black uppercase text-neutral-700 block">
              Status Pembayaran
            </label>
            <select
              value={paymentStatus}
              onChange={e => setPaymentStatus(e.target.value)}
              className="nb-input w-full text-xs font-bold"
            >
              <option value="paid">Hanya Lunas (PAID)</option>
              <option value="unpaid">Belum Lunas (UNPAID)</option>
              <option value="">Semua Status</option>
            </select>
          </div>
        </div>

        {/* Quick Range Presets */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t-2 border-black text-xs font-bold">
          <span className="text-neutral-500">Preset Cepat:</span>
          <button
            onClick={() => setQuickRange('oct')}
            className="px-2.5 py-1 border border-black bg-neutral-100 hover:bg-[#FFE600] text-[11px]"
          >
            Bulan Oktober 2026
          </button>
          <button
            onClick={() => setQuickRange('nov')}
            className="px-2.5 py-1 border border-black bg-neutral-100 hover:bg-[#FFE600] text-[11px]"
          >
            Bulan November 2026
          </button>
          <button
            onClick={() => setQuickRange('all')}
            className="px-2.5 py-1 border border-black bg-neutral-100 hover:bg-[#FFE600] text-[11px]"
          >
            Semua Periode
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* PRINTABLE REPORT CONTENT (Visible on screen and print)    */}
      {/* ======================================================== */}

      <div className="print-container bg-white p-6 sm:p-8 border-2 border-black space-y-6 shadow-brutal">
        {/* Formal Report Header */}
        <div className="border-b-4 border-black pb-4 flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <div className="px-3 py-1 bg-[#FFE600] border-2 border-black font-black text-xl tracking-tight inline-block mb-1">
              KINETIK EVENT PRODUCTION
            </div>
            <p className="text-xs font-bold text-neutral-700">Laporan Penjualan Tiket, Paket Event, & Rekapitulasi Omzet</p>
            <p className="text-[11px] text-neutral-500">Mata Kuliah: Digital Entrepreneurship (Kewirausahaan Digital)</p>
          </div>

          <div className="sm:text-right space-y-0.5 text-xs font-bold text-neutral-700">
            <p className="font-black text-sm uppercase">DOKUMEN RESMI BISNIS</p>
            <p>
              Periode:{' '}
              <span className="font-black text-black">
                {startDate ? formatSimpleDate(startDate) : 'Awal'} s/d {endDate ? formatSimpleDate(endDate) : 'Sekarang'}
              </span>
            </p>
            <p>Dicetak pada: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
        </div>

        {/* Summary Metrics */}
        {report && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 border-2 border-black bg-[#FFFDF0]">
              <span className="text-[10px] font-black uppercase text-neutral-600 block">Total Omzet (Revenue)</span>
              <p className="text-xl sm:text-2xl font-black text-[#FF5C00] mt-1">{formatRupiah(report.totalOmzet)}</p>
            </div>

            <div className="p-4 border-2 border-black bg-[#FFFDF0]">
              <span className="text-[10px] font-black uppercase text-neutral-600 block">Harga Pokok (HPP)</span>
              <p className="text-xl sm:text-2xl font-black text-black mt-1">{formatRupiah(report.totalHPP)}</p>
            </div>

            <div className="p-4 border-2 border-black bg-[#A3E635]">
              <span className="text-[10px] font-black uppercase text-black block">Estimasi Laba Kotor</span>
              <p className="text-xl sm:text-2xl font-black text-black mt-1">{formatRupiah(report.labaKotor)}</p>
            </div>

            <div className="p-4 border-2 border-black bg-[#38BDF8]">
              <span className="text-[10px] font-black uppercase text-black block">Total Transaksi</span>
              <p className="text-xl sm:text-2xl font-black text-black mt-1">{report.paidOrders} Pesanan</p>
            </div>
          </div>
        )}

        {/* Breakdown Table */}
        <div className="space-y-2">
          <h4 className="font-black text-sm uppercase">Daftar Transaksi Pada Periode Ini:</h4>

          {loading ? (
            <p className="py-8 text-center font-bold text-xs">Memuat data penjualan...</p>
          ) : !report || report.orders.length === 0 ? (
            <div className="py-8 text-center border-2 border-dashed border-black text-xs font-bold text-neutral-600">
              Tidak ada data transaksi pada rentang tanggal yang dipilih.
            </div>
          ) : (
            <div className="border-2 border-black overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FFFDF0] border-b-2 border-black font-black uppercase text-[11px]">
                  <tr>
                    <th className="p-2.5 border-r-2 border-black">No.</th>
                    <th className="p-2.5 border-r-2 border-black">No. Faktur</th>
                    <th className="p-2.5 border-r-2 border-black">Tanggal</th>
                    <th className="p-2.5 border-r-2 border-black">Nama Pemesan / PIC</th>
                    <th className="p-2.5 border-r-2 border-black">Metode</th>
                    <th className="p-2.5 border-r-2 border-black text-center">Status</th>
                    <th className="p-2.5 border-r-2 border-black text-right">Modal (HPP)</th>
                    <th className="p-2.5 text-right">Omzet Bruto</th>
                  </tr>
                </thead>
                <tbody className="font-medium text-[11px]">
                  {report.orders.map((ord, idx) => (
                    <tr key={ord.id} className="hover:bg-neutral-50 border-b-2 border-black">
                      <td className="p-2.5 border-r-2 border-black text-center font-bold">{idx + 1}</td>
                      <td className="p-2.5 border-r-2 border-black font-bold">{ord.order_number}</td>
                      <td className="p-2.5 border-r-2 border-black">{formatSimpleDate(ord.created_at)}</td>
                      <td className="p-2.5 border-r-2 border-black font-bold">{ord.customer_name}</td>
                      <td className="p-2.5 border-r-2 border-black">{ord.payment_method}</td>
                      <td className="p-2.5 border-r-2 border-black text-center">
                        <span className={`px-1.5 py-0.5 border border-black font-bold text-[9px] uppercase ${ord.payment_status === 'paid' ? 'bg-[#A3E635]' : 'bg-red-200'}`}>
                          {ord.payment_status}
                        </span>
                      </td>
                      <td className="p-2.5 border-r-2 border-black text-right text-neutral-600 font-bold">
                        {formatRupiah(ord.total_cost)}
                      </td>
                      <td className="p-2.5 text-right font-black">
                        {formatRupiah(ord.total_amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-[#FFFDF0] border-t-2 border-black font-black text-xs">
                  <tr>
                    <td colSpan={6} className="p-3 border-r-2 border-black text-right uppercase">
                      Total Periode Ini:
                    </td>
                    <td className="p-3 border-r-2 border-black text-right text-neutral-800">
                      {formatRupiah(report.totalHPP)}
                    </td>
                    <td className="p-3 text-right text-[#FF5C00] text-sm">
                      {formatRupiah(report.totalOmzet)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>

        {/* Signatures for Academic / Professional Assessment */}
        <div className="pt-8 border-t-2 border-black flex justify-between items-end text-xs font-bold text-neutral-700">
          <div>
            <p className="font-black text-black">Catatan Verifikator:</p>
            <p className="text-[10px] text-neutral-500">Laporan diekspor langsung dari modul database MySQL/MariaDB.</p>
          </div>

          <div className="text-center">
            <p className="text-[10px] text-neutral-500 mb-12">Jakarta, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <p className="font-black border-t-2 border-black pt-1 px-6">Dosen Penguji / Managing Director EO</p>
          </div>
        </div>
      </div>
    </div>
  );
}
