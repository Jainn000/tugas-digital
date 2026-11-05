'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatRupiah, formatIndoDate } from '@/lib/format';
import { 
  Printer, CheckCircle2, Clock, ArrowLeft, 
  Smartphone, Building2, Copy, Check, FileText, Receipt, RefreshCw, AlertCircle 
} from 'lucide-react';
import { useToast } from '@/components/ToastContext';

export default function OrderDetailPage({ params }) {
  const { orderNumber } = params;
  const toast = useToast();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [invoiceMode, setInvoiceMode] = useState('A4'); // 'A4' | 'THERMAL'
  const [simulating, setSimulating] = useState(false);
  const [msg, setMsg] = useState('');

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${orderNumber}`);
      const data = await res.json();
      if (data.order) {
        setOrder(data.order);
      }
    } catch (err) {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderNumber]);

  const handleSimulatePayment = async (status = 'success') => {
    setSimulating(true);
    setMsg('');
    try {
      const res = await fetch('/api/payment/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_number: orderNumber,
          action: status,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg('Pembayaran berhasil diverifikasi.');
        toast.success(`Pembayaran ${orderNumber} berhasil diverifikasi! E-ticket resmi telah aktif.`, 'Pembayaran Sukses');
        fetchOrder();
      } else {
        const errorMsg = data.error || 'Simulasi gagal';
        setMsg(errorMsg);
        toast.error(errorMsg, 'Gagal Memproses');
      }
    } catch (err) {
      setMsg('Gagal terhubung ke gateway.');
      toast.error('Gagal terhubung ke gateway pembayaran.', 'Koneksi Error');
    } finally {
      setSimulating(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Nomor Virtual Account disalin ke clipboard.', 'Berhasil Disalin');
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto my-20 p-8 text-center bg-[#242424] border border-[#383838] rounded-[10px] text-white">
        <div className="w-7 h-7 border-2 border-[#383838] border-t-[#ff6b35] rounded-full animate-spin mx-auto mb-3"></div>
        <p className="font-inter text-sm text-[#bdbdbd]">Memuat data transaksi dari server...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 text-center bg-[#242424] border border-[#383838] rounded-[10px] text-white space-y-4">
        <AlertCircle className="w-12 h-12 mx-auto text-red-400" />
        <h2 className="font-poppins font-semibold text-lg">Pesanan Tidak Ditemukan</h2>
        <Link
          href="/"
          className="px-4 py-2 rounded-[6px] bg-[#ff6b35] text-[#171717] hover:bg-[#e5531e] text-xs font-semibold inline-block transition-colors"
        >
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  const isPaid = order.payment_status === 'paid';

  return (
    <div className="max-w-4xl mx-auto my-8 px-4 space-y-8 text-white">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print border-b border-[#383838] pb-4">
        <Link
          href="/"
          className="w-fit px-3 py-1.5 rounded-[6px] bg-[#171717] border border-[#383838] text-[#bdbdbd] hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Format selector */}
          <div className="flex rounded-[6px] border border-[#383838] bg-[#171717] p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setInvoiceMode('A4')}
              className={`px-3 py-1 rounded-[4px] flex items-center gap-1.5 font-medium transition-colors ${
                invoiceMode === 'A4' ? 'bg-[#ff6b35] text-[#171717]' : 'text-[#8d8d8d] hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Invoice A4</span>
            </button>
            <button
              type="button"
              onClick={() => setInvoiceMode('THERMAL')}
              className={`px-3 py-1 rounded-[4px] flex items-center gap-1.5 font-medium transition-colors ${
                invoiceMode === 'THERMAL' ? 'bg-[#ff6b35] text-[#171717]' : 'text-[#8d8d8d] hover:text-white'
              }`}
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>Struk 80mm</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-1.5 rounded-[6px] bg-[#ff6b35] text-[#171717] hover:bg-[#e5531e] text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Faktur (PDF)</span>
          </button>
        </div>
      </div>

      {/* Payment Gateway Sandbox Section */}
      {!isPaid && (
        <div className="bg-[#242424] border border-[#383838] rounded-[10px] p-6 space-y-6 no-print border-l-4 border-l-[#ff6b35]" data-ui="payment-sandbox">
          <div className="flex items-center justify-between border-b border-[#383838] pb-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-[4px] bg-[#171717] border border-[#383838] text-[#bdbdbd] text-xs font-semibold">
                Sandbox Gateway
              </span>
              <span className="text-xs text-[#8d8d8d]">Simulasi Pembayaran Interaktif</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-[#ff6b35]/15 text-[#ff6b35] border border-[#ff6b35]/30 text-xs font-semibold">
              Menunggu Pembayaran
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Visual Simulator Display */}
            <div className="bg-[#171717] border border-[#383838] rounded-[8px] p-4 space-y-3 text-center">
              {order.payment_method === 'QRIS' && (
                <>
                  <p className="font-poppins font-medium text-xs text-white">Scan QRIS Nasional</p>
                  <div className="w-44 h-44 mx-auto rounded-[6px] border border-[#383838] bg-white p-2 relative flex items-center justify-center">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                        order.payment_reference || order.order_number
                      )}`}
                      alt="QRIS Code"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="text-[11px] text-[#bdbdbd]">
                    Referensi: <span className="text-white font-medium">{order.payment_reference}</span>
                  </p>
                  <p className="text-[10px] text-[#8d8d8d]">
                    NMID: ID1020261102998 (Berlaku 15 menit)
                  </p>
                </>
              )}

              {order.payment_method.includes('VA') && (
                <div className="space-y-3 py-4">
                  <Building2 className="w-10 h-10 mx-auto text-[#ff6b35]" />
                  <p className="font-poppins font-medium text-xs text-white">Nomor Virtual Account ({order.payment_method.replace('_', ' ')})</p>
                  <div className="p-3 bg-[#1c1c1c] border border-[#383838] rounded-[6px] flex items-center justify-between gap-2">
                    <span className="text-base font-semibold tracking-wider text-white">
                      {order.payment_reference || '8801920261102001'}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(order.payment_reference || '8801920261102001')}
                      className="p-1.5 rounded-[4px] bg-[#171717] border border-[#383838] text-[#8d8d8d] hover:text-white"
                      title="Salin nomor VA"
                      aria-label="Salin nomor VA"
                    >
                      {copied ? <Check className="w-4 h-4 text-[#8cd6b0]" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-[#8d8d8d]">
                    Atas nama: <strong className="text-white">KINETIK EO - {order.customer_name}</strong>
                  </p>
                </div>
              )}

              {order.payment_method === 'GOPAY' && (
                <div className="space-y-3 py-4">
                  <Smartphone className="w-10 h-10 mx-auto text-[#8cd6b0]" />
                  <p className="font-poppins font-medium text-xs text-white">Dompet Digital GoPay</p>
                  <p className="text-xs text-[#bdbdbd]">
                    Referensi Transaksi: {order.payment_reference}
                  </p>
                  <p className="text-[11px] text-[#8d8d8d]">
                    Tekan tombol simulasi di samping untuk menyetujui pendebetan dana.
                  </p>
                </div>
              )}
            </div>

            {/* Simulation Controller */}
            <div className="space-y-4">
              <div>
                <span className="text-[11px] text-[#8d8d8d] block">Total Tagihan</span>
                <p className="text-2xl sm:text-3xl font-bold font-poppins text-white">{formatRupiah(order.total_amount)}</p>
              </div>

              <div className="p-4 bg-[#171717] border border-[#383838] rounded-[8px] space-y-2.5">
                <p className="font-semibold text-xs text-white flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 text-[#ff6b35]" />
                  <span>Uji Coba Transaksi Sandbox</span>
                </p>
                <p className="text-xs text-[#bdbdbd] leading-relaxed">
                  Pilih tombol di bawah untuk menyimulasikan respon gateway perbankan:
                </p>

                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleSimulatePayment('success')}
                    disabled={simulating}
                    className="py-2 px-3 rounded-[6px] bg-[#ff6b35] text-[#171717] hover:bg-[#e5531e] text-xs font-semibold flex-1 flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{simulating ? 'Memverifikasi...' : 'Bayar Sekarang (Simulasi Lunas)'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSimulatePayment('failed')}
                    disabled={simulating}
                    className="py-2 px-3 rounded-[6px] bg-[#242424] border border-[#383838] hover:border-red-800 text-[#8d8d8d] hover:text-red-400 text-xs font-medium flex items-center justify-center transition-colors disabled:opacity-50"
                  >
                    Batal
                  </button>
                </div>
              </div>

              {msg && (
                <div className="p-2.5 bg-[#23372d] border border-[#8cd6b0]/40 rounded-[6px] text-xs font-semibold text-[#8cd6b0] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{msg}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Success Notification Banner */}
      {isPaid && (
        <div className="p-4 bg-[#23372d] border border-[#8cd6b0]/40 rounded-[8px] flex items-center justify-between gap-4 text-xs font-semibold text-[#8cd6b0] no-print">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-[#8cd6b0] shrink-0" />
            <span>Transaksi Lunas. Pembayaran telah diverifikasi via {order.payment_method}.</span>
          </div>
          <span className="text-[11px] text-[#bdbdbd]">
            Dibayar: {order.paid_at ? formatIndoDate(order.paid_at) : 'Baru saja'}
          </span>
        </div>
      )}

      {/* PRINTABLE AREA */}
      {invoiceMode === 'A4' ? (
        /* FORMAT INVOICE RESMI A4 */
        <div className="bg-[#242424] border border-[#383838] rounded-[10px] p-6 sm:p-10 space-y-8" data-ui="invoice-sheet">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-[#383838] pb-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="relative w-[28px] h-[32px] shrink-0">
                  <Image
                    src="/figma/kinetik-symbol.svg"
                    alt="KINETIK"
                    width={28}
                    height={32}
                    className="object-contain"
                  />
                </div>
                <span className="font-poppins font-bold text-lg text-white">KINETIK</span>
              </div>
              <p className="text-xs text-[#8d8d8d]">Kemang Raya No. 45, Jakarta Selatan • Hotline: 0812-3456-7890</p>
            </div>

            <div className="sm:text-right">
              <h2 className="font-poppins font-semibold text-xl text-white">Faktur Reservasi & Tiket</h2>
              <p className="text-xs text-[#bdbdbd] mt-0.5">{order.order_number}</p>
              <div className="mt-2 inline-block">
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                  isPaid
                    ? 'bg-[#8cd6b0]/15 text-[#8cd6b0] border-[#8cd6b0]/30'
                    : 'bg-[#ff6b35]/15 text-[#ff6b35] border-[#ff6b35]/30'
                }`}>
                  {isPaid ? 'Status: Lunas' : 'Status: Menunggu Pembayaran'}
                </span>
              </div>
            </div>
          </div>

          {/* Meta & Customer Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div className="space-y-1">
              <span className="text-[11px] font-medium text-[#8d8d8d] block">Diterbitkan Kepada:</span>
              <p className="font-semibold text-white text-sm">{order.customer_name}</p>
              <p className="text-[#bdbdbd]">{order.customer_email}</p>
              <p className="text-[#bdbdbd]">{order.customer_phone}</p>
              <p className="text-[#8d8d8d] max-w-sm mt-1">{order.customer_address}</p>
            </div>

            <div className="sm:text-right space-y-1 text-[#bdbdbd]">
              <p>
                <span className="text-[#8d8d8d]">Tanggal Transaksi:</span>{' '}
                <span className="text-white font-medium">{formatIndoDate(order.created_at)}</span>
              </p>
              {order.paid_at && (
                <p>
                  <span className="text-[#8d8d8d]">Waktu Pelunasan:</span>{' '}
                  <span className="text-white font-medium">{formatIndoDate(order.paid_at)}</span>
                </p>
              )}
              <p>
                <span className="text-[#8d8d8d]">Metode Bayar:</span>{' '}
                <span className="text-white font-medium">{order.payment_method.replace('_', ' ')}</span>
              </p>
              {order.payment_reference && (
                <p>
                  <span className="text-[#8d8d8d]">Referensi:</span>{' '}
                  <span className="text-white font-medium">{order.payment_reference}</span>
                </p>
              )}
            </div>
          </div>

          {/* Items Table */}
          <div className="rounded-[6px] border border-[#383838] overflow-hidden" data-ui="items-table">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#1c1c1c] text-[#8d8d8d] border-b border-[#383838] uppercase font-semibold text-[11px]">
                <tr>
                  <th className="p-3 text-center">No.</th>
                  <th className="p-3">Rincian Layanan / Tiket</th>
                  <th className="p-3 text-center">Kuantitas</th>
                  <th className="p-3 text-right">Harga Satuan</th>
                  <th className="p-3 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2e2e2e]">
                {order.items?.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-[#2a2a2a] transition-colors">
                    <td className="p-3 text-center text-[#8d8d8d]">{idx + 1}</td>
                    <td className="p-3 font-semibold text-white">{item.product_name}</td>
                    <td className="p-3 text-center font-medium text-white">{item.quantity}</td>
                    <td className="p-3 text-right text-[#bdbdbd]">{formatRupiah(item.price)}</td>
                    <td className="p-3 text-right font-semibold text-white">{formatRupiah(item.subtotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-2">
            <div className="text-xs space-y-1.5 text-[#8d8d8d]">
              <p className="font-semibold text-white">Catatan Reservasi:</p>
              <p>Faktur ini adalah bukti transaksi sah yang diterbitkan oleh KINETIK Event Production & Organizer.</p>
              <p>Slot jadwal acara dan e-ticket aktif permanen setelah pembayaran tervalidasi.</p>
            </div>

            <div className="space-y-2 rounded-[8px] border border-[#383838] p-4 bg-[#1c1c1c]">
              <div className="flex justify-between text-xs">
                <span className="text-[#8d8d8d]">Subtotal:</span>
                <span className="text-white font-medium">{formatRupiah(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#8d8d8d]">Biaya Admin:</span>
                <span className="text-[#8cd6b0] font-medium">Gratis (Rp 0)</span>
              </div>
              <div className="flex justify-between text-sm font-semibold pt-2 border-t border-[#383838]">
                <span className="text-white">Total Investasi:</span>
                <span className="text-[#ff6b35] font-bold font-poppins">{formatRupiah(order.total_amount)}</span>
              </div>
            </div>
          </div>

          {/* Verification Stamp */}
          <div className="pt-6 border-t border-[#383838] flex justify-between items-end text-xs text-[#8d8d8d]">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-[4px] border border-[#383838] p-1 bg-white">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(
                    `VERIFIKASI-EVENT-${order.order_number}-${order.total_amount}`
                  )}`}
                  alt="QR Validasi"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <p className="font-semibold text-white">Verifikasi Digital</p>
                <p className="text-[10px] text-[#666666]">Tercatat pada basis data KINETIK Event Production</p>
              </div>
            </div>

            <div className="text-center">
              <p className="text-[10px] text-[#666666] mb-8">Disahkan Oleh,</p>
              <p className="border-t border-[#383838] pt-1 px-4 font-semibold text-white">
                Event Director & Production Lead
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* FORMAT STRUK KASIR THERMAL 80MM */
        <div className="max-w-[340px] mx-auto bg-[#242424] border border-[#383838] rounded-[8px] p-6 text-xs space-y-4" data-ui="thermal-receipt">
          {/* Header */}
          <div className="text-center space-y-1 border-b border-[#383838] pb-3">
            <h3 className="font-poppins font-bold text-sm text-white">KINETIK EVENT PRODUCTION</h3>
            <p className="text-[11px] text-[#8d8d8d]">Kemang Raya No. 45, Jakarta Selatan</p>
            <p className="text-[11px] text-[#8d8d8d]">Hotline: 0812-3456-7890</p>
            <p className="font-semibold text-white pt-1">Pass Masuk Venue & E-Ticket</p>
          </div>

          {/* Meta */}
          <div className="space-y-1 text-xs border-b border-[#383838] pb-2 text-[#bdbdbd]">
            <div className="flex justify-between">
              <span>Nomor Booking:</span>
              <span className="font-semibold text-white">{order.order_number}</span>
            </div>
            <div className="flex justify-between">
              <span>Waktu:</span>
              <span>{order.created_at.slice(0, 16)}</span>
            </div>
            <div className="flex justify-between">
              <span>Pemesan:</span>
              <span className="truncate max-w-[150px] text-white">{order.customer_name}</span>
            </div>
          </div>

          {/* Items */}
          <div className="space-y-2 border-b border-[#383838] pb-3">
            {order.items?.map(it => (
              <div key={it.id} className="space-y-0.5">
                <p className="font-medium text-white truncate">{it.product_name}</p>
                <div className="flex justify-between text-[#8d8d8d]">
                  <span>{it.quantity} x {formatRupiah(it.price)}</span>
                  <span className="font-semibold text-white">{formatRupiah(it.subtotal)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="space-y-1.5 text-xs border-b border-[#383838] pb-3 text-[#bdbdbd]">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{formatRupiah(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Biaya Admin:</span>
              <span className="text-[#8cd6b0]">Rp 0</span>
            </div>
            <div className="flex justify-between font-semibold text-sm pt-1 border-t border-[#383838] text-white">
              <span>Total:</span>
              <span className="text-[#ff6b35]">{formatRupiah(order.total_amount)}</span>
            </div>
            <div className="flex justify-between text-[#8d8d8d]">
              <span>Metode:</span>
              <span>{order.payment_method}</span>
            </div>
            <div className="flex justify-between text-[#8d8d8d]">
              <span>Status:</span>
              <span className={isPaid ? 'text-[#8cd6b0] font-semibold' : 'text-[#ff6b35] font-semibold'}>
                {isPaid ? 'Lunas / Aktif' : 'Menunggu Bayar'}
              </span>
            </div>
          </div>

          {/* Footer Struk */}
          <div className="text-center space-y-1 pt-2">
            <div className="w-20 h-20 mx-auto rounded-[4px] border border-[#383838] p-1 bg-white my-2">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(
                  order.order_number
                )}`}
                alt="Barcode Struk"
                className="w-full h-full object-contain"
              />
            </div>
            <p className="font-semibold text-white">Selamat Menikmati Acara</p>
            <p className="text-[#8d8d8d] text-[10px]">Tunjukkan QR barcode ini kepada petugas saat registrasi gate.</p>
          </div>
        </div>
      )}
    </div>
  );
}
