'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { formatRupiah } from '@/lib/format';
import { 
  CreditCard, QrCode, Building2, Smartphone, ArrowRight, 
  ShieldCheck, AlertCircle, Ticket, Calendar, MapPin, Check 
} from 'lucide-react';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryProductId = searchParams.get('product_id');
  const queryQty = parseInt(searchParams.get('qty') || '1', 10);

  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(queryProductId ? Number(queryProductId) : null);
  const [quantity, setQuantity] = useState(queryQty > 0 ? queryQty : 1);

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [eventDate, setEventDate] = useState('2026-11-20');
  const [paymentMethod, setPaymentMethod] = useState('QRIS');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch available products from DB
  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.products && data.products.length > 0) {
          setProducts(data.products);
          if (!queryProductId) {
            setSelectedProductId(data.products[0].id);
          } else {
            setSelectedProductId(Number(queryProductId));
          }
        }
      })
      .catch(() => {});
  }, [queryProductId]);

  // Prefill if logged in
  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setCustomerName(data.user.name || '');
          setCustomerEmail(data.user.email || '');
          setCustomerPhone(data.user.phone || '');
          setCustomerAddress(data.user.address || '');
        }
      })
      .catch(() => {});
  }, []);

  const selectedProduct = products.find(p => p.id === selectedProductId) || products[0];
  const itemPrice = selectedProduct ? selectedProduct.price : 0;
  const totalPrice = itemPrice * quantity;
  const shippingCost = 0; // Jasa event & e-ticket bebas ongkos kirim fisik
  const grandTotal = totalPrice + shippingCost;

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!selectedProduct) {
      setError('Silakan pilih paket acara atau tiket yang ingin direservasi.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const payload = {
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        customer_address: `${customerAddress} (Jadwal: ${eventDate})`,
        payment_method: paymentMethod,
        shipping_cost: shippingCost,
        items: [{
          product_id: selectedProduct.id,
          quantity: quantity,
        }],
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal memproses reservasi.');
      }

      router.push(`/orders/${data.order.order_number}`);
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan sistem.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto my-10 px-4">
      <div className="mb-8 border-b-2 border-black pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="nb-tag bg-[#FFE600] text-black text-xs font-bold">Direct Booking Portal</span>
          <span className="text-xs font-bold text-neutral-600">Pemesanan Langsung Tanpa Keranjang</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">
          Formulir Reservasi & Kontrak Acara
        </h1>
        <p className="text-sm font-bold text-neutral-600 mt-1">
          Konfirmasi detail paket produksi atau tiket festival. Faktur resmi dan kode pembayaran langsung diterbitkan ke akun Anda.
        </p>
      </div>

      {error && (
        <div className="p-4 mb-6 bg-red-100 border-2 border-black flex items-center gap-3 font-bold text-sm text-red-900">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8" data-ui="checkout-grid">
        {/* Left Column: Data PIC & Layanan yang Dipilih */}
        <div className="lg:col-span-7 space-y-6">
          {/* Pilihan Paket / Tiket Langsung */}
          <div className="nb-card bg-white p-6 space-y-4" data-ui="service-selection">
            <h2 className="font-bold text-lg border-b-2 border-black pb-2 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Ticket className="w-5 h-5" /> Paket Layanan / Tiket Terpilih
              </span>
              <Link href="/" className="text-xs font-bold underline hover:text-[#FF5C00]">
                Ubah Pilihan dari Katalog →
              </Link>
            </h2>

            {products.length > 0 && selectedProduct ? (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 p-4 border-2 border-black bg-[#FFFDF0]">
                  <div className="relative w-full sm:w-28 h-28 border-2 border-black bg-neutral-100 flex-shrink-0 overflow-hidden">
                    {selectedProduct.image_url ? (
                      <Image
                        src={selectedProduct.image_url}
                        alt={selectedProduct.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-xs">IMG</div>
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <span className="nb-tag bg-white text-[10px] font-bold">
                          {selectedProduct.category_name || 'Event Production'}
                        </span>
                        <h3 className="font-bold text-base leading-snug mt-1">{selectedProduct.name}</h3>
                      </div>
                      <span className="text-lg font-black text-black whitespace-nowrap">
                        {formatRupiah(selectedProduct.price)}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-700 font-medium line-clamp-2">
                      {selectedProduct.description}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t-2 border-black/20 text-xs">
                      <span className="font-bold text-neutral-600">Jumlah Pesanan / Pax:</span>
                      <div className="flex items-center border-2 border-black bg-white">
                        <button
                          type="button"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="px-2.5 py-1 font-bold hover:bg-neutral-200"
                        >
                          -
                        </button>
                        <span className="px-3 font-bold">{quantity}</span>
                        <button
                          type="button"
                          onClick={() => setQuantity(quantity + 1)}
                          className="px-2.5 py-1 font-bold hover:bg-neutral-200"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dropdown switch package */}
                <div>
                  <label className="text-xs font-bold block mb-1">Ganti Layanan / Tiket Lain:</label>
                  <select
                    value={selectedProductId || ''}
                    onChange={e => setSelectedProductId(Number(e.target.value))}
                    className="nb-input w-full text-xs font-bold"
                  >
                    {products.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} — {formatRupiah(p.price)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <div className="p-4 text-center border-2 border-black">
                <p className="text-xs font-bold">Memuat data layanan dari database...</p>
              </div>
            )}
          </div>

          {/* Data Pemesan & Jadwal */}
          <div className="nb-card bg-white p-6 space-y-4" data-ui="pic-info">
            <h2 className="font-bold text-lg border-b-2 border-black pb-2 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" /> Informasi Penanggung Jawab (PIC) & Acara
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold block mb-1">
                  Nama PIC / Instansi Pemesan *
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  required
                  placeholder="Contoh: PT Sinar Mandiri (Budi Pratama)"
                  className="nb-input w-full text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-bold block mb-1">
                  Nomor Kontak / WhatsApp PIC *
                </label>
                <input
                  type="text"
                  value={customerPhone}
                  onChange={e => setCustomerPhone(e.target.value)}
                  required
                  placeholder="081234567890"
                  className="nb-input w-full text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold block mb-1">
                  Alamat Email Penagihan Faktur *
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={e => setCustomerEmail(e.target.value)}
                  required
                  placeholder="nama@perusahaan.com"
                  className="nb-input w-full text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-bold block mb-1">
                  Estimasi Tanggal Pelaksanaan Acara *
                </label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={e => setEventDate(e.target.value)}
                  required
                  className="nb-input w-full text-sm font-bold"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold block mb-1">
                Lokasi / Alamat Venue Pelaksanaan Acara *
              </label>
              <textarea
                value={customerAddress}
                onChange={e => setCustomerAddress(e.target.value)}
                required
                rows={2}
                placeholder="Nama gedung, hotel, ballroom, atau alamat venue lengkap"
                className="nb-input w-full text-sm"
              ></textarea>
            </div>
          </div>

          {/* Metode Pembayaran */}
          <div className="nb-card bg-white p-6 space-y-4" data-ui="payment-methods">
            <h2 className="font-bold text-lg border-b-2 border-black pb-2 flex items-center gap-2">
              <CreditCard className="w-5 h-5" /> Metode Pembayaran
            </h2>
            <p className="text-xs font-medium text-neutral-600">
              Pilih metode penyelesaian pembayaran. Sistem terintegrasi dengan Payment Gateway Simulator & AkuQRIS.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* QRIS */}
              <label
                className={`p-3.5 border-2 border-black flex items-start gap-3 cursor-pointer transition-colors duration-150 ${
                  paymentMethod === 'QRIS' ? 'bg-[#FFE600]' : 'bg-white hover:bg-neutral-50'
                }`}
              >
                <input
                  type="radio"
                  name="payment_method"
                  value="QRIS"
                  checked={paymentMethod === 'QRIS'}
                  onChange={() => setPaymentMethod('QRIS')}
                  className="mt-1"
                />
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-sm">
                    <QrCode className="w-4 h-4" /> QRIS Nasional
                  </div>
                  <p className="text-xs font-medium text-neutral-700 mt-0.5">
                    Scan via BCA, Mandiri, GoPay, OVO, atau mobile banking lainnya.
                  </p>
                </div>
              </label>

              {/* BCA VA */}
              <label
                className={`p-3.5 border-2 border-black flex items-start gap-3 cursor-pointer transition-colors duration-150 ${
                  paymentMethod === 'BCA_VA' ? 'bg-[#FFE600]' : 'bg-white hover:bg-neutral-50'
                }`}
              >
                <input
                  type="radio"
                  name="payment_method"
                  value="BCA_VA"
                  checked={paymentMethod === 'BCA_VA'}
                  onChange={() => setPaymentMethod('BCA_VA')}
                  className="mt-1"
                />
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-sm">
                    <Building2 className="w-4 h-4" /> BCA Virtual Account
                  </div>
                  <p className="text-xs font-medium text-neutral-700 mt-0.5">
                    Transfer nomor VA otomatis dari BCA Mobile / KlikBCA.
                  </p>
                </div>
              </label>

              {/* Mandiri VA */}
              <label
                className={`p-3.5 border-2 border-black flex items-start gap-3 cursor-pointer transition-colors duration-150 ${
                  paymentMethod === 'MANDIRI_VA' ? 'bg-[#FFE600]' : 'bg-white hover:bg-neutral-50'
                }`}
              >
                <input
                  type="radio"
                  name="payment_method"
                  value="MANDIRI_VA"
                  checked={paymentMethod === 'MANDIRI_VA'}
                  onChange={() => setPaymentMethod('MANDIRI_VA')}
                  className="mt-1"
                />
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-sm">
                    <Building2 className="w-4 h-4" /> Mandiri Virtual Account
                  </div>
                  <p className="text-xs font-medium text-neutral-700 mt-0.5">
                    Transfer instan melalui Livin by Mandiri.
                  </p>
                </div>
              </label>

              {/* GoPay */}
              <label
                className={`p-3.5 border-2 border-black flex items-start gap-3 cursor-pointer transition-colors duration-150 ${
                  paymentMethod === 'GOPAY' ? 'bg-[#FFE600]' : 'bg-white hover:bg-neutral-50'
                }`}
              >
                <input
                  type="radio"
                  name="payment_method"
                  value="GOPAY"
                  checked={paymentMethod === 'GOPAY'}
                  onChange={() => setPaymentMethod('GOPAY')}
                  className="mt-1"
                />
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-sm">
                    <Smartphone className="w-4 h-4" /> E-Wallet GoPay
                  </div>
                  <p className="text-xs font-medium text-neutral-700 mt-0.5">
                    Pembayaran instan langsung dari aplikasi e-wallet.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Ringkasan Biaya & Tombol Terbitkan */}
        <div className="lg:col-span-5">
          <div className="nb-card bg-[#FFFDF0] p-6 space-y-4 sticky top-24" data-ui="order-summary">
            <h2 className="font-bold text-lg border-b-2 border-black pb-2 flex items-center justify-between">
              <span>Ringkasan Kontrak Reservasi</span>
              <span className="nb-tag bg-black text-white text-xs">Direct Booking</span>
            </h2>

            {selectedProduct && (
              <div className="space-y-3 border-b-2 border-black pb-4 text-xs font-bold">
                <div className="flex justify-between items-start gap-2">
                  <span className="text-neutral-700">{selectedProduct.name}</span>
                  <span className="text-right whitespace-nowrap">{formatRupiah(itemPrice)}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Kuantitas:</span>
                  <span>{quantity} unit / paket</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Tanggal Acara:</span>
                  <span className="text-black">{eventDate}</span>
                </div>
              </div>
            )}

            {/* Calculations */}
            <div className="space-y-2 pt-1 text-sm font-bold">
              <div className="flex justify-between">
                <span className="text-neutral-700">Subtotal Investasi</span>
                <span>{formatRupiah(totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-700">Biaya Administrasi & Gateway</span>
                <span className="text-emerald-700 font-bold">Gratis (Rp 0)</span>
              </div>
              <div className="flex justify-between text-base font-black pt-2 border-t-2 border-black">
                <span>Total Tagihan Booking</span>
                <span className="text-xl text-[#FF5C00]">{formatRupiah(grandTotal)}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !selectedProduct}
              className="nb-btn nb-btn-orange w-full py-3.5 text-base font-bold flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <span>Menerbitkan Faktur Reservasi...</span>
              ) : (
                <>
                  Terbitkan Faktur & Bayar <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                </>
              )}
            </button>

            <div className="space-y-1 text-center pt-2">
              <p className="text-xs font-bold text-neutral-800">
                Pemesanan langsung terdaftar ke database MySQL & menerbitkan invoice resmi.
              </p>
              <p className="text-[11px] text-neutral-600 font-medium">
                Dilengkapi e-ticket barcode 80mm dan dokumen faktur A4 untuk SPJ perusahaan.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="p-12 text-center nb-card bg-white max-w-lg mx-auto my-12">
        <p className="font-bold text-base">Memuat formulir reservasi langsung...</p>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
