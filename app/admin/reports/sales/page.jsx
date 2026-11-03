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
          <span className="px-2.5 py-0.5 rounded-full bg-[#ff6b35]/15 border border-[#ff6b35]/30 text-[#ff6b35] text-[11px] font-semibold uppercase mb-1 inline-block">
            Analitik Omzet & Performa
          </span>
          <h2 className="font-poppins font-semibold text-xl sm:text-2xl text-white">
            Laporan Penjualan Periodik
          </h2>
          <p className="font-inter text-xs text-[#bdbdbd] mt-1">
            Filter omzet berdasarkan rentang tanggal dan cetak rekapitulasi ke format dokumen PDF.
          </p>
        </div>

        <button
          type="button"
          onClick={handlePrint}
          className="px-4 py-2 rounded-[6px] bg-[#ff6b35] text-[#171717] hover:bg-[#e5531e] text-xs font-semibold flex items-center gap-2 self-start sm:self-auto transition-colors"
        >
          <Printer className="w-4 h-4" />
          <span>Cetak Laporan (PDF)</span>
        </button>
      </div>

      {/* Date Filter Controls (Hidden when printing) */}
      <div className="bg-[#242424] border border-[#383838] rounded-[10px] p-5 space-y-4 no-print">
        <div className="flex items-center gap-2 border-b border-[#383838] pb-2 text-xs font-semibold text-white">
          <Filter className="w-4 h-4 text-[#ff6b35]" />
          <span>Filter Rentang Tanggal Transaksi:</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 items-end">
          <div className="sm:col-span-4 flex flex-col gap-1">
            <label className="text-[11px] font-medium text-[#8d8d8d]">
              Dari Tanggal (Mulai)
            </label>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="bg-[#171717] border border-[#383838] rounded-[6px] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff6b35]"
            />
          </div>

          <div className="sm:col-span-4 flex flex-col gap-1">
            <label className="text-[11px] font-medium text-[#8d8d8d]">
              Sampai Tanggal (Selesai)
            </label>
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="bg-[#171717] border border-[#383838] rounded-[6px] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff6b35]"
            />
          </div>

          <div className="sm:col-span-4 flex flex-col gap-1">
            <label className="text-[11px] font-medium text-[#8d8d8d]">
              Status Pembayaran
            </label>
            <select
              value={paymentStatus}
              onChange={e => setPaymentStatus(e.target.value)}
              className="bg-[#171717] border border-[#383838] rounded-[6px] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff6b35]"
            >
              <option value="paid">Hanya Lunas (PAID)</option>
              <option value="unpaid">Belum Lunas (UNPAID)</option>
              <option value="">Semua Status</option>
            </select>
          </div>
        </div>

        {/* Quick Range Presets */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#383838] text-xs">
          <span className="text-[#8d8d8d]">Preset Cepat:</span>
          <button
            type="button"
            onClick={() => setQuickRange('oct')}
            className="px-2.5 py-1 rounded-[4px] bg-[#171717] border border-[#383838] text-[#bdbdbd] hover:text-white hover:border-[#ff6b35] text-[11px] transition-colors"
          >
            Bulan Oktober 2026
          </button>
          <button
            type="button"
            onClick={() => setQuickRange('nov')}
            className="px-2.5 py-1 rounded-[4px] bg-[#171717] border border-[#383838] text-[#bdbdbd] hover:text-white hover:border-[#ff6b35] text-[11px] transition-colors"
          >
            Bulan November 2026
          </button>
          <button
            type="button"
            onClick={() => setQuickRange('all')}
            className="px-2.5 py-1 rounded-[4px] bg-[#171717] border border-[#383838] text-[#bdbdbd] hover:text-white hover:border-[#ff6b35] text-[11px] transition-colors"
          >
            Semua Periode
          </button>
        </div>
      </div>

      {/* Printable Report Card */}
      <div className="bg-[#242424] border border-[#383838] rounded-[10px] p-6 sm:p-8 space-y-6 text-white">
        {/* Formal Report Header */}
        <div className="border-b border-[#383838] pb-4 flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <h3 className="font-poppins font-bold text-lg text-white">
              KINETIK EVENT PRODUCTION
            </h3>
            <p className="font-inter text-xs text-[#bdbdbd] mt-0.5">
              Laporan Penjualan Tiket, Paket Acara & Rekapitulasi Omzet
            </p>
            <p className="text-[11px] text-[#8d8d8d]">
              Mata Kuliah: Digital Entrepreneurship (Kewirausahaan Digital)
            </p>
          </div>

          <div className="sm:text-right space-y-0.5 text-xs text-[#bdbdbd]">
            <p className="font-semibold text-white uppercase text-xs">Dokumen Rekapitulasi Resmi</p>
            <p>
              Periode:{' '}
              <span className="font-semibold text-white">
                {startDate ? formatSimpleDate(startDate) : 'Awal'} s/d {endDate ? formatSimpleDate(endDate) : 'Sekarang'}
              </span>
            </p>
            <p className="text-[11px] text-[#8d8d8d]">
              Tanggal: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Summary Metrics */}
        {report && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-[8px] bg-[#1c1c1c] border border-[#383838]">
              <span className="text-[10px] font-medium uppercase text-[#8d8d8d] block">Total Omzet (Revenue)</span>
              <p className="text-xl font-bold font-poppins text-[#8cd6b0] mt-1">{formatRupiah(report.totalOmzet)}</p>
            </div>

            <div className="p-4 rounded-[8px] bg-[#1c1c1c] border border-[#383838]">
              <span className="text-[10px] font-medium uppercase text-[#8d8d8d] block">Harga Pokok (HPP)</span>
              <p className="text-xl font-bold font-poppins text-white mt-1">{formatRupiah(report.totalHPP)}</p>
            </div>

            <div className="p-4 rounded-[8px] bg-[#1c1c1c] border border-[#383838]">
              <span className="text-[10px] font-medium uppercase text-[#8d8d8d] block">Estimasi Laba Kotor</span>
              <p className="text-xl font-bold font-poppins text-[#ff6b35] mt-1">{formatRupiah(report.labaKotor)}</p>
            </div>

            <div className="p-4 rounded-[8px] bg-[#1c1c1c] border border-[#383838]">
              <span className="text-[10px] font-medium uppercase text-[#8d8d8d] block">Total Transaksi</span>
              <p className="text-xl font-bold font-poppins text-white mt-1">{report.paidOrders} Pesanan</p>
            </div>
          </div>
        )}

        {/* Breakdown Table */}
        <div className="space-y-3">
          <h4 className="font-poppins font-medium text-sm text-white">Daftar Transaksi Periode Ini:</h4>

          {loading ? (
            <p className="py-8 text-center text-xs text-[#8d8d8d]">Memuat data penjualan...</p>
          ) : !report || report.orders.length === 0 ? (
            <div className="py-8 text-center rounded-[6px] border border-dashed border-[#383838] text-xs text-[#8d8d8d]">
              Tidak ada data transaksi pada rentang tanggal yang dipilih.
            </div>
          ) : (
            <div className="rounded-[6px] border border-[#383838] overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#1c1c1c] text-[#8d8d8d] border-b border-[#383838] uppercase font-semibold text-[11px]">
                  <tr>
                    <th className="p-2.5 text-center">No.</th>
                    <th className="p-2.5">No. Faktur</th>
                    <th className="p-2.5">Tanggal</th>
                    <th className="p-2.5">Pemesan / PIC</th>
                    <th className="p-2.5">Metode</th>
                    <th className="p-2.5 text-center">Status</th>
                    <th className="p-2.5 text-right">Modal (HPP)</th>
                    <th className="p-2.5 text-right">Omzet</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2e2e2e] text-[11px]">
                  {report.orders.map((ord, idx) => (
                    <tr key={ord.id} className="hover:bg-[#2a2a2a] transition-colors">
                      <td className="p-2.5 text-center text-[#8d8d8d]">{idx + 1}</td>
                      <td className="p-2.5 font-semibold text-white">{ord.order_number}</td>
                      <td className="p-2.5 text-[#bdbdbd]">{formatSimpleDate(ord.created_at)}</td>
                      <td className="p-2.5 text-white">{ord.customer_name}</td>
                      <td className="p-2.5 text-[#bdbdbd]">{ord.payment_method}</td>
                      <td className="p-2.5 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                          ord.payment_status === 'paid'
                            ? 'bg-[#8cd6b0]/15 text-[#8cd6b0] border-[#8cd6b0]/30'
                            : 'bg-[#ff6b35]/15 text-[#ff6b35] border-[#ff6b35]/30'
                        }`}>
                          {ord.payment_status.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-2.5 text-right text-[#8d8d8d]">
                        {formatRupiah(ord.total_cost)}
                      </td>
                      <td className="p-2.5 text-right font-semibold text-white">
                        {formatRupiah(ord.total_amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-[#1c1c1c] border-t border-[#383838] font-semibold text-xs">
                  <tr>
                    <td colSpan={6} className="p-3 text-right uppercase text-[#8d8d8d]">
                      Total Periode Ini:
                    </td>
                    <td className="p-3 text-right text-white">
                      {formatRupiah(report.totalHPP)}
                    </td>
                    <td className="p-3 text-right text-[#8cd6b0] text-sm">
                      {formatRupiah(report.totalOmzet)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>

        {/* Signatures for Academic / Professional Assessment */}
        <div className="pt-8 border-t border-[#383838] flex justify-between items-end text-xs text-[#8d8d8d]">
          <div>
            <p className="font-semibold text-white">Catatan Verifikator:</p>
            <p className="text-[10px] text-[#666666]">Laporan tervalidasi dari basis data transaksi KINETIK.</p>
          </div>

          <div className="text-center">
            <p className="text-[10px] text-[#666666] mb-10">
              Jakarta, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            <p className="font-semibold text-white border-t border-[#383838] pt-1 px-4">
              Dosen Penguji / Managing Director EO
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
