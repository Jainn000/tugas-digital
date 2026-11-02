'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import { formatRupiah, formatIndoDate } from '@/lib/format';
import { 
  Printer, CheckCircle2, Building2, Smartphone, 
  ArrowLeft, Copy, Check, FileText, Receipt, RefreshCw, AlertCircle 
} from 'lucide-react';
import { useToast } from '@/components/ToastContext';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const orderNumber = params.orderNumber;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [invoiceMode, setInvoiceMode] = useState('A4');
  const [msg, setMsg] = useState('');

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${orderNumber}`);
      const data = await res.json();
      if (data.order) {
        setOrder(data.order);
      } else {
        toast.error('Pesanan dengan nomor tersebut tidak ditemukan di sistem.', 'Data Tidak Ditemukan');
      }
    } catch (err) {
      toast.error('Gagal mengambil data pesanan dari server.', 'Koneksi Bermasalah');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderNumber]);

  const handleSimulatePayment = async (status) => {
    setSimulating(true);
    setMsg('');
    try {
      const res = await fetch('/api/payment/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_number: orderNumber,
          status,
        }),
      });
      const data = await res.json();
      if (data.success && data.order) {
        setOrder(data.order);
        setMsg('Pembayaran berhasil diverifikasi secara instan via Payment Gateway Sandbox!');
        toast.success('Pembayaran berhasil diverifikasi secara instan! Status resmi LUNAS.', 'Pembayaran Sukses');
      } else {
        const errorMsg = data.message || 'Simulasi pembayaran dibatalkan atau ditolak sistem.';
        setMsg(errorMsg);
        toast.error(errorMsg, 'Pembayaran Belum Berhasil');
      }
    } catch (err) {
      const errorMsg = err.message || 'Gagal memproses simulasi pembayaran.';
      setMsg(errorMsg);
      toast.error(errorMsg, 'Kesalahan Gateway');
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
      <div className="max-w-4xl mx-auto my-20 p-8 text-center nb-card bg-white">
        <p className="font-bold text-lg">Memuat data transaksi dari server...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 text-center nb-card bg-white space-y-4">
        <AlertCircle className="w-12 h-12 mx-auto text-red-600" />
        <h2 className="text-xl font-bold">Pesanan Tidak Ditemukan</h2>
        <Link href="/" className="nb-btn nb-btn-yellow px-4 py-2 text-sm inline-block">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  const isPaid = order.payment_status === 'paid';

  return (
    <div className="max-w-4xl mx-auto my-8 px-4 space-y-8">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 no-print border-b-2 border-black pb-4">
        <Link
          href="/"
          className="nb-btn nb-btn-white px-3 py-1.5 text-xs flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali Belanja
        </Link>

        <div className="flex items-center gap-2">
          {/* Format selector */}
          <div className="flex border-2 border-black bg-white p-0.5 text-xs font-bold">
            <button
              onClick={() => setInvoiceMode('A4')}
              className={`px-3 py-1 flex items-center gap-1.5 ${
                invoiceMode === 'A4' ? 'bg-[#FFE600] text-black' : 'text-neutral-700'
              }`}
            >
              <FileText className="w-3.5 h-3.5" /> Invoice A4
            </button>
            <button
              onClick={() => setInvoiceMode('THERMAL')}
              className={`px-3 py-1 flex items-center gap-1.5 ${
                invoiceMode === 'THERMAL' ? 'bg-[#FFE600] text-black' : 'text-neutral-700'
              }`}
            >
              <Receipt className="w-3.5 h-3.5" /> Struk Kasir 80mm
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="nb-btn nb-btn-yellow px-4 py-1.5 text-xs flex items-center gap-2 font-bold"
          >
            <Printer className="w-4 h-4 stroke-[2.5]" /> Cetak Faktur Resmi (PDF)
          </button>
        </div>
      </div>

      {/* Payment Gateway Sandbox Section */}
      {!isPaid && (
        <div className="nb-card bg-[#FFE600] p-6 space-y-6 no-print" data-ui="payment-sandbox">
          <div className="flex items-center justify-between border-b-2 border-black pb-3">
            <div className="flex items-center gap-2">
              <span className="nb-tag bg-black text-white text-xs">Sandbox Pembayaran</span>
              <span className="font-bold text-xs text-neutral-800">Ujian & Demo Praktik</span>
            </div>
            <span className="nb-tag bg-[#FF5C00] text-white">Menunggu Pembayaran</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Visual Simulator Display */}
            <div className="bg-white border-2 border-black p-4 space-y-3 text-center">
              {order.payment_method === 'QRIS' && (
                <>
                  <p className="font-bold text-sm">Scan QRIS Nasional</p>
                  <div className="w-48 h-48 mx-auto border-2 border-black bg-white p-2 relative flex items-center justify-center">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                        order.payment_reference || order.order_number
                      )}`}
                      alt="QRIS Code"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="text-xs font-bold text-neutral-700">
                    Referensi: {order.payment_reference}
                  </p>
                  <p className="text-xs text-neutral-600 font-medium">
                    NMID: ID1020261102998 (Berlaku 15 menit)
                  </p>
                </>
              )}

              {order.payment_method.includes('VA') && (
                <div className="space-y-3 py-4">
                  <Building2 className="w-10 h-10 mx-auto text-blue-800" />
                  <p className="font-bold text-sm">Nomor Virtual Account ({order.payment_method.replace('_', ' ')})</p>
                  <div className="p-3 bg-neutral-100 border-2 border-black flex items-center justify-between gap-2">
                    <span className="text-lg font-bold tracking-wider text-black">
                      {order.payment_reference || '8801920261102001'}
                    </span>
                    <button
                      onClick={() => copyToClipboard(order.payment_reference || '8801920261102001')}
                      className="p-1.5 border-2 border-black bg-white hover:bg-[#FFE600]"
                      title="Salin nomor VA"
                      aria-label="Salin nomor VA"
                    >
                      {copied ? <Check className="w-4 h-4 text-green-700" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs font-medium text-neutral-600">
                    Atas nama: <strong>KINETIK EO - {order.customer_name}</strong>
                  </p>
                </div>
              )}

              {order.payment_method === 'GOPAY' && (
                <div className="space-y-3 py-4">
                  <Smartphone className="w-10 h-10 mx-auto text-emerald-700" />
                  <p className="font-bold text-sm">Dompet Digital GoPay</p>
                  <p className="text-xs font-bold text-neutral-700">
                    Referensi Transaksi: {order.payment_reference}
                  </p>
                  <p className="text-xs font-medium text-neutral-600">
                    Tekan tombol simulasi di samping untuk menyetujui pendebetan dana.
                  </p>
                </div>
              )}
            </div>

            {/* Simulation Controller */}
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-neutral-800 block">Total Tagihan</span>
                <p className="text-3xl font-black text-black">{formatRupiah(order.total_amount)}</p>
              </div>

              <div className="p-4 bg-white border-2 border-black space-y-2">
                <p className="font-bold text-xs flex items-center gap-1.5">
                  <RefreshCw className="w-4 h-4" /> Uji Coba Transaksi Sandbox
                </p>
                <p className="text-xs text-neutral-700 font-medium leading-relaxed">
                  Untuk pengujian alur, pilih tombol berikut untuk menyimulasikan respon gateway perbankan:
                </p>

                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <button
                    onClick={() => handleSimulatePayment('success')}
                    disabled={simulating}
                    className="nb-btn nb-btn-green py-2 px-3 text-xs flex-1 flex items-center justify-center gap-1.5 font-bold"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {simulating ? 'Memverifikasi...' : 'Bayar Sekarang (Simulasi Lunas)'}
                  </button>
                  <button
                    onClick={() => handleSimulatePayment('failed')}
                    disabled={simulating}
                    className="nb-btn bg-neutral-200 hover:bg-neutral-300 text-black py-2 px-3 text-xs flex items-center justify-center"
                  >
                    Batal
                  </button>
                </div>
              </div>

              {msg && (
                <div className="p-2.5 bg-white border-2 border-black text-xs font-bold text-emerald-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> {msg}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Success Notification Banner */}
      {isPaid && (
        <div className="p-4 bg-[#A3E635] border-2 border-black flex items-center justify-between gap-4 font-bold text-sm no-print">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
            <span>Transaksi Lunas. Pembayaran telah diverifikasi via {order.payment_method}.</span>
          </div>
          <span className="text-xs font-bold bg-black text-white px-2.5 py-1">
            Dibayar: {order.paid_at ? formatIndoDate(order.paid_at) : 'Baru saja'}
          </span>
        </div>
      )}

      {/* ======================================================== */}
      {/* PRINTABLE AREA                                           */}
      {/* ======================================================== */}

      {invoiceMode === 'A4' ? (
        /* FORMAT INVOICE RESMI A4 */
        <div className="nb-card bg-white p-8 md:p-12 space-y-8 print-container" data-ui="invoice-sheet">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b-2 border-black pb-6">
            <div className="space-y-2">
              <Logo variant="full" />
              <p className="text-xs text-neutral-600">Kemang Raya No. 45, Jakarta Selatan • Hotline: 0812-3456-7890</p>
            </div>

            <div className="sm:text-right">
              <h2 className="text-3xl font-black uppercase tracking-tight">Faktur Reservasi & Tiket</h2>
              <p className="font-bold text-sm mt-1">{order.order_number}</p>
              <div className="mt-2 inline-block">
                <span className={`nb-tag text-xs ${isPaid ? 'bg-[#A3E635] text-black' : 'bg-red-200 text-black'}`}>
                  {isPaid ? 'Status: Lunas' : 'Status: Belum Lunas'}
                </span>
              </div>
            </div>
          </div>

          {/* Meta & Customer Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
            <div className="space-y-1">
              <span className="text-xs font-bold text-neutral-600 block">Diterbitkan Kepada:</span>
              <p className="font-bold text-base">{order.customer_name}</p>
              <p className="text-neutral-700">{order.customer_email}</p>
              <p className="text-neutral-700">{order.customer_phone}</p>
              <p className="text-neutral-700 max-w-sm mt-1 text-xs">{order.customer_address}</p>
            </div>

            <div className="sm:text-right space-y-1 text-xs font-bold text-neutral-800">
              <p>
                <span className="text-neutral-600">Tanggal Transaksi:</span>{' '}
                <span className="text-black">{formatIndoDate(order.created_at)}</span>
              </p>
              {order.paid_at && (
                <p>
                  <span className="text-neutral-600">Waktu Pelunasan:</span>{' '}
                  <span className="text-black">{formatIndoDate(order.paid_at)}</span>
                </p>
              )}
              <p>
                <span className="text-neutral-600">Metode Bayar:</span>{' '}
                <span className="text-black">{order.payment_method.replace('_', ' ')}</span>
              </p>
              {order.payment_reference && (
                <p>
                  <span className="text-neutral-600">Referensi Gateway:</span>{' '}
                  <span className="text-black">{order.payment_reference}</span>
                </p>
              )}
            </div>
          </div>

          {/* Items Table */}
          <div className="border-2 border-black overflow-hidden" data-ui="items-table">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#FFFDF0] border-b-2 border-black font-bold text-xs">
                <tr>
                  <th className="p-3 border-r-2 border-black">No.</th>
                  <th className="p-3 border-r-2 border-black">Rincian Layanan / Tiket Acara</th>
                  <th className="p-3 border-r-2 border-black text-center">Kuantitas</th>
                  <th className="p-3 border-r-2 border-black text-right">Harga Satuan</th>
                  <th className="p-3 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="font-medium">
                {order.items?.map((item, idx) => (
                  <tr key={item.id} className="border-b-2 border-black hover:bg-neutral-50">
                    <td className="p-3 border-r-2 border-black text-center font-bold text-xs">{idx + 1}</td>
                    <td className="p-3 border-r-2 border-black font-bold">{item.product_name}</td>
                    <td className="p-3 border-r-2 border-black text-center font-bold">{item.quantity}</td>
                    <td className="p-3 border-r-2 border-black text-right">{formatRupiah(item.price)}</td>
                    <td className="p-3 text-right font-bold">{formatRupiah(item.subtotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
            <div className="text-xs space-y-2 text-neutral-700 font-medium">
              <p className="font-bold text-black">Catatan Reservasi:</p>
              <p>Faktur ini merupakan bukti transaksi dan kontrak pemesanan resmi yang diterbitkan oleh KINETIK Event Production & Organizer.</p>
              <p>Slot jadwal acara dan e-ticket otomatis terbit dan aktif secara permanen setelah pembayaran diverifikasi.</p>
            </div>

            <div className="space-y-2 border-2 border-black p-4 bg-[#FFFDF0]">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-neutral-600">Subtotal Layanan:</span>
                <span>{formatRupiah(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-xs font-bold">
                <span className="text-neutral-600">Biaya Administrasi:</span>
                <span className="text-emerald-700">Gratis (Rp 0)</span>
              </div>
              <div className="flex justify-between text-base font-bold pt-2 border-t-2 border-black">
                <span>Total Investasi:</span>
                <span className="text-lg text-[#FF5C00]">{formatRupiah(order.total_amount)}</span>
              </div>
            </div>
          </div>

          {/* Verification Stamp */}
          <div className="pt-6 border-t-2 border-black flex justify-between items-end text-xs">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 border-2 border-black p-1 bg-white">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(
                    `VERIFIKASI-EVENT-${order.order_number}-${order.total_amount}`
                  )}`}
                  alt="QR Validasi"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <p className="font-bold">Verifikasi Digital</p>
                <p className="text-neutral-600 text-xs">Tercatat pada database lokal KINETIK Event Production</p>
              </div>
            </div>

            <div className="text-center font-bold">
              <p className="text-xs text-neutral-600 mb-8">Disahkan Oleh,</p>
              <p className="border-t-2 border-black pt-1 px-4">Event Director & Production Lead</p>
            </div>
          </div>
        </div>
      ) : (
        /* FORMAT STRUK KASIR THERMAL 80MM */
        <div className="max-w-[340px] mx-auto bg-white border-2 border-black p-6 text-xs space-y-4 print-container" data-ui="thermal-receipt">
          {/* Header */}
          <div className="text-center space-y-1 border-b-2 border-black pb-3">
            <h3 className="font-bold text-sm">KINETIK EVENT PRODUCTION</h3>
            <p className="text-xs">Kemang Raya No. 45, Jakarta Selatan</p>
            <p className="text-xs">Hotline: 0812-3456-7890</p>
            <p className="font-bold pt-1">E-Ticket & Pass Masuk Venue</p>
          </div>

          {/* Meta */}
          <div className="space-y-1 text-xs border-b-2 border-black pb-2">
            <div className="flex justify-between">
              <span>Nomor Booking:</span>
              <span className="font-bold">{order.order_number}</span>
            </div>
            <div className="flex justify-between">
              <span>Waktu:</span>
              <span>{order.created_at.slice(0, 16)}</span>
            </div>
            <div className="flex justify-between">
              <span>Pemesan/PIC:</span>
              <span className="truncate max-w-[150px]">{order.customer_name}</span>
            </div>
          </div>

          {/* Items */}
          <div className="space-y-2 border-b-2 border-black pb-3">
            {order.items?.map(it => (
              <div key={it.id} className="space-y-0.5">
                <p className="font-bold truncate">{it.product_name}</p>
                <div className="flex justify-between text-neutral-700">
                  <span>{it.quantity} x {formatRupiah(it.price)}</span>
                  <span className="font-bold text-black">{formatRupiah(it.subtotal)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="space-y-1.5 text-xs border-b-2 border-black pb-3">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{formatRupiah(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Biaya Admin:</span>
              <span>Rp 0</span>
            </div>
            <div className="flex justify-between font-bold text-sm pt-1 border-t-2 border-black">
              <span>Total:</span>
              <span>{formatRupiah(order.total_amount)}</span>
            </div>
            <div className="flex justify-between text-neutral-700">
              <span>Metode:</span>
              <span>{order.payment_method}</span>
            </div>
            <div className="flex justify-between text-neutral-700">
              <span>Status:</span>
              <span className="font-bold">{isPaid ? 'Lunas / Aktif' : 'Belum Dibayar'}</span>
            </div>
          </div>

          {/* Footer Struk */}
          <div className="text-center space-y-1 pt-2">
            <div className="w-20 h-20 mx-auto border-2 border-black p-1 my-2">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(
                  order.order_number
                )}`}
                alt="Barcode Struk"
                className="w-full h-full object-contain"
              />
            </div>
            <p className="font-bold">Selamat Menikmati Acara</p>
            <p className="text-neutral-600 text-[10px]">Tunjukkan QR barcode ini kepada petugas gate saat registrasi ulang di venue.</p>
          </div>
        </div>
      )}
    </div>
  );
}
