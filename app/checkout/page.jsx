'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { formatRupiah } from '@/lib/format';
import { 
  ChevronRight,
  Check,
  Building2,
  Landmark,
  ArrowLeftRight,
  CreditCard,
  ChevronDown,
  ChevronUp,
  Info,
  FileText,
  Clock3,
  ArrowUpRight,
  Headset,
  Lock,
  LogIn,
  UserPlus,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/components/ToastContext';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();
  const queryProductId = searchParams.get('product_id');
  const queryQty = parseInt(searchParams.get('qty') || '1', 10);

  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(queryProductId ? Number(queryProductId) : null);
  const [quantity, setQuantity] = useState(queryQty > 0 ? queryQty : 1);

  const [currentUser, setCurrentUser] = useState(null);
  const [authChecking, setAuthChecking] = useState(true);

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [eventDate, setEventDate] = useState('2026-12-20');
  
  // Payment states
  const [paymentType, setPaymentType] = useState('va'); // 'va' | 'manual' | 'card'
  const [selectedBank, setSelectedBank] = useState('BCA');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch available products
  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
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

  // Check authentication
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setCurrentUser(data.user);
          setCustomerName(data.user.name || '');
          setCustomerEmail(data.user.email || '');
          setCustomerPhone(data.user.phone || '0812 0000 0018');
          setCustomerAddress(data.user.address || 'Grand Ballroom · Hotel Cakrawala, Jakarta');
        } else {
          setCurrentUser(null);
        }
      })
      .catch(() => {
        setCurrentUser(null);
      })
      .finally(() => {
        setAuthChecking(false);
      });
  }, []);

  const handleQuickDemoLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'user@entrepreneur.id', password: 'user123' }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal login demo.');
      }
      if (data.user) {
        setCurrentUser(data.user);
        setCustomerName(data.user.name || 'Nadia Putri · PT Cakrawala Digital');
        setCustomerEmail(data.user.email || 'nadia@cakrawala.example');
        setCustomerPhone(data.user.phone || '0812 0000 0018');
        setCustomerAddress(data.user.address || 'Grand Ballroom · Hotel Cakrawala, Jakarta');
        toast.success('Berhasil masuk dengan Akun Klien Demo!', 'Autentikasi Sukses');
      }
    } catch (err) {
      const msg = err.message || 'Gagal masuk akun demo.';
      setError(msg);
      toast.error(msg, 'Gagal Autentikasi');
    } finally {
      setLoading(false);
    }
  };

  const selectedProduct = products.find((p) => p.id === Number(selectedProductId)) || products[0];

  const subtotal = selectedProduct ? Number(selectedProduct.price) * quantity : 0;
  const tax = Math.round(subtotal * 0.11);
  const total = subtotal + tax;
  const downPayment = Math.round(total * 0.5);
  const remainingPayment = total - downPayment;

  const handleSubmitBooking = async (e) => {
    if (e) e.preventDefault();
    setError('');

    // Field-level validation with bottom-right toast
    if (!currentUser) {
      toast.warning('Silakan login terlebih dahulu sebelum menerbitkan faktur & reservasi.', 'Login Diperlukan');
      setError('Harap login terlebih dahulu untuk melanjutkan pesanan.');
      return;
    }

    if (!customerName.trim()) {
      toast.error('Nama Penanggung Jawab (PIC) tidak boleh kosong.', 'Validasi Form');
      setError('Nama Penanggung Jawab wajib diisi.');
      return;
    }

    if (!customerEmail.trim() || !customerEmail.includes('@')) {
      toast.error('Format email klien tidak valid.', 'Validasi Form');
      setError('Format email tidak valid.');
      return;
    }

    const cleanPhone = customerPhone.replace(/[^0-9]/g, '');
    if (!cleanPhone || cleanPhone.length < 9) {
      toast.error('Nomor telepon/WhatsApp minimal 9 digit angka.', 'Validasi Form');
      setError('Nomor telepon/WhatsApp tidak boleh kosong dan minimal 9 digit.');
      return;
    }

    if (!customerAddress.trim()) {
      toast.error('Lokasi venue acara wajib diisi untuk koordinasi tim produksi.', 'Validasi Form');
      setError('Lokasi venue acara tidak boleh kosong.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [
            {
              product_id: selectedProduct.id,
              quantity: quantity,
            },
          ],
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
          customer_address: customerAddress,
          payment_method: `${paymentType === 'va' ? 'Virtual Account' : paymentType === 'manual' ? 'Transfer Manual' : 'Kartu Kredit'} - ${selectedBank}`,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal membuat reservasi pesanan.');
      }

      toast.success(
        `Faktur ${data.order?.order_number || 'resmi'} berhasil dibuat. Mengalihkan ke pembayaran...`,
        'Faktur Diterbitkan'
      );

      router.push(`/orders/${data.order.order_number}`);
    } catch (err) {
      const msg = err.message || 'Terjadi kesalahan saat memproses booking.';
      setError(msg);
      toast.error(msg, 'Gagal Reservasi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-ui="kinetik-checkout" className="bg-[#171717] min-h-[100dvh] text-[#bdbdbd] font-inter pb-[48px] pt-[34px] px-5 sm:px-8 md:px-[72px]">
      <div className="max-w-[1440px] mx-auto flex flex-col gap-[28px]">
        {/* Breadcrumb */}
        <div className="flex gap-[10px] items-center text-[11px] whitespace-nowrap">
          <Link href="/my-orders" className="text-[#8d8d8d] hover:text-white transition-colors">
            Booking Saya
          </Link>
          <ChevronRight className="w-3 h-3 text-[#8d8d8d]" />
          <span className="text-[#bdbdbd]">
            {selectedProduct ? `KNT-261103-0${selectedProduct.id}` : 'KNT-261103-018'}
          </span>
          <span className="text-[#8d8d8d]">/</span>
          <span className="text-white font-medium">Pembayaran</span>
        </div>

        {/* Page Introduction */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-[10px] max-w-[840px]">
            <h1 className="font-poppins font-medium text-[28px] md:text-[34px] text-white tracking-[-1.02px] leading-[1.22]">
              Selangkah lagi menuju acara Anda.
            </h1>
            <p className="text-[13px] text-[#bdbdbd] leading-[1.7]">
              Tinjau pesanan dan bayar uang muka untuk mengonfirmasi jadwal produksi.
            </p>
          </div>
          <div className="bg-[#2c2c2c] self-start md:self-auto flex items-center gap-[6px] px-[12px] py-[6px] rounded-[100px] shrink-0">
            <div className="w-[5px] h-[5px] rounded-full bg-[#bdbdbd]" />
            <span className="font-medium text-[11px] text-[#bdbdbd]">
              Booking resmi
            </span>
          </div>
        </div>

        {/* Booking Progress Tracker (3 Steps from Figma) */}
        <div className="bg-[#242424] rounded-[12px] px-6 py-5 md:px-[32px] md:py-[22px] flex flex-col sm:flex-row items-center gap-6 sm:gap-[32px] w-full border border-[#383838]">
          {/* Step 1 */}
          <div className="flex flex-1 items-center gap-[14px] w-full sm:w-auto">
            <div className="w-[34px] h-[34px] rounded-full bg-[#23372d] flex items-center justify-center shrink-0">
              <Check className="w-4 h-4 text-[#8cd6b0]" />
            </div>
            <div className="flex flex-col gap-[2px]">
              <p className="font-medium text-[13px] text-white">Detail Booking</p>
              <p className="text-[10px] text-[#8d8d8d]">Brief & penawaran disetujui</p>
            </div>
            <div className="hidden sm:block flex-1 h-px bg-[#383838] ml-2" />
          </div>

          {/* Step 2 */}
          <div className="flex flex-1 items-center gap-[14px] w-full sm:w-auto">
            <div className="w-[34px] h-[34px] rounded-full bg-[#ff6b35] flex items-center justify-center shrink-0 text-[#171717] font-semibold text-[12px]">
              2
            </div>
            <div className="flex flex-col gap-[2px]">
              <p className="font-medium text-[13px] text-white">Pembayaran DP</p>
              <p className="text-[10px] text-[#8d8d8d]">Pilih metode pembayaran</p>
            </div>
            <div className="hidden sm:block flex-1 h-px bg-[#383838] ml-2" />
          </div>

          {/* Step 3 */}
          <div className="flex flex-1 items-center gap-[14px] w-full sm:w-auto">
            <div className="w-[34px] h-[34px] rounded-full bg-[#2c2c2c] flex items-center justify-center shrink-0 text-[#8d8d8d] font-semibold text-[12px]">
              3
            </div>
            <div className="flex flex-col gap-[2px]">
              <p className="font-medium text-[13px] text-[#8d8d8d]">Konfirmasi</p>
              <p className="text-[10px] text-[#8d8d8d]">Setelah pembayaran terverifikasi</p>
            </div>
          </div>
        </div>

        {/* Auth Gate Banner if not logged in */}
        {!authChecking && !currentUser && (
          <div className="bg-[#2a241e] border border-[#ff6b35]/60 rounded-[12px] p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#ff6b35]/20 flex items-center justify-center shrink-0 text-[#ff6b35]">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-white text-[15px]">
                  Masuk Akun Diperlukan Sebelum Menerbitkan Faktur
                </p>
                <p className="text-xs text-[#bdbdbd] mt-0.5">
                  Gunakan akun klien terdaftar untuk menerbitkan invoice resmi dan kode reservasi.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <Link
                href="/login?redirect=/checkout"
                className="w-full md:w-auto bg-[#ff6b35] text-[#171717] font-semibold text-xs px-5 py-2.5 rounded-[6px] hover:bg-[#e5531e] transition-colors text-center whitespace-nowrap"
              >
                Masuk Akun
              </Link>
            </div>
          </div>
        )}

        {/* Main 2-Column Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[24px] items-start">
          {/* Left Column (7 cols / 792px): Booking & Payment Details */}
          <div className="lg:col-span-7 flex flex-col gap-[24px]">
            {/* Card 1: Detail Booking */}
            <div className="bg-[#242424] border border-[#383838] rounded-[12px] p-6 md:p-[28px] flex flex-col gap-[24px]">
              <div className="flex items-center justify-between">
                <h2 className="font-poppins font-medium text-[19px] text-white">
                  Detail booking
                </h2>
                <div className="bg-[#393224] flex items-center gap-[6px] px-[10px] py-[6px] rounded-[100px]">
                  <div className="w-[5px] h-[5px] rounded-full bg-[#e9c47d]" />
                  <span className="font-medium text-[11px] text-[#e9c47d]">
                    Menunggu DP
                  </span>
                </div>
              </div>

              {/* Booked Event Identity */}
              <div className="flex flex-col sm:flex-row gap-[20px] items-start sm:items-center">
                <div className="relative w-full sm:w-[128px] h-[104px] rounded-[8px] overflow-hidden bg-[#171717] shrink-0 border border-[#383838]">
                  <Image
                    src={selectedProduct?.image_url || '/figma/corporate-event.png'}
                    alt={selectedProduct?.name || 'Event Preview'}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col gap-[6px] flex-1">
                  <p className="font-medium text-[10px] tracking-[0.8px] text-[#ff6b35]">
                    {selectedProduct?.category_name ? selectedProduct.category_name.toUpperCase() : 'EVENT & FESTIVAL'}
                  </p>
                  <p className="font-poppins font-medium text-[20px] md:text-[23px] text-white leading-tight">
                    {selectedProduct?.name || 'Corporate Signature Gathering'}
                  </p>
                  <p className="text-[11px] text-[#8d8d8d]">
                    KNT-261103-018 · Kapasitas 200–500 peserta
                  </p>
                </div>
              </div>

              {/* Event Logistics (Editable fields) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-[24px]">
                <div className="flex flex-col gap-[7px]">
                  <label className="text-[11px] text-[#8d8d8d]">
                    Tanggal & waktu acara
                  </label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="bg-[#171717] border border-[#383838] rounded-[6px] px-3.5 py-2 text-[13px] text-white focus:outline-none focus:border-[#ff6b35]"
                  />
                </div>
                <div className="flex flex-col gap-[7px]">
                  <label className="text-[11px] text-[#8d8d8d]">
                    Lokasi / Venue Acara
                  </label>
                  <input
                    type="text"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    placeholder="Contoh: Grand Ballroom Hotel Cakrawala"
                    className="bg-[#171717] border border-[#383838] rounded-[6px] px-3.5 py-2 text-[13px] text-white focus:outline-none focus:border-[#ff6b35]"
                  />
                </div>
              </div>

              <div className="h-px bg-[#383838]" />

              {/* Client Information (PIC) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-[24px]">
                <div className="flex flex-col gap-[7px]">
                  <label className="text-[11px] text-[#8d8d8d]">
                    Penanggung jawab (PIC)
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Nama PIC / Perusahaan"
                    className="bg-[#171717] border border-[#383838] rounded-[6px] px-3.5 py-2 text-[13px] text-white focus:outline-none focus:border-[#ff6b35]"
                  />
                </div>
                <div className="flex flex-col gap-[7px]">
                  <label className="text-[11px] text-[#8d8d8d]">
                    Email & telepon
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="email@klien.id"
                      className="bg-[#171717] border border-[#383838] rounded-[6px] px-3 py-2 text-[12px] text-white focus:outline-none focus:border-[#ff6b35]"
                    />
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="0812xxxx"
                      className="bg-[#171717] border border-[#383838] rounded-[6px] px-3 py-2 text-[12px] text-white focus:outline-none focus:border-[#ff6b35]"
                    />
                  </div>
                </div>
              </div>

              {/* Ganti Produk / Paket Lain jika diinginkan */}
              {products.length > 1 && (
                <div className="pt-2">
                  <label className="text-[11px] text-[#8d8d8d] block mb-2">
                    Pilih Layanan / Paket Lain
                  </label>
                  <select
                    value={selectedProductId || ''}
                    onChange={(e) => setSelectedProductId(Number(e.target.value))}
                    className="w-full bg-[#171717] border border-[#383838] rounded-[6px] px-3.5 py-2 text-[13px] text-white focus:outline-none focus:border-[#ff6b35]"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} — {formatRupiah(p.price)}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Card 2: Metode Pembayaran */}
            <div className="bg-[#242424] border border-[#383838] rounded-[12px] p-6 md:p-[28px] flex flex-col gap-[22px]">
              <div>
                <h2 className="font-poppins font-medium text-[19px] text-white">
                  Metode pembayaran
                </h2>
                <p className="text-[12px] text-[#bdbdbd] mt-1 leading-[1.7]">
                  Pilih satu metode untuk melanjutkan pembayaran uang muka.
                </p>
              </div>

              {/* Options */}
              <div className="flex flex-col gap-[12px]">
                {/* VA Option */}
                <div
                  onClick={() => setPaymentType('va')}
                  className={`p-[18px] rounded-[8px] flex items-center gap-[16px] cursor-pointer transition-colors border ${
                    paymentType === 'va'
                      ? 'bg-[#38271f] border-[#ff6b35]'
                      : 'bg-[#242424] border-[#383838] hover:border-neutral-600'
                  }`}
                >
                  <div className="w-[18px] h-[18px] rounded-full border border-[#ff6b35] flex items-center justify-center shrink-0">
                    {paymentType === 'va' && <div className="w-[10px] h-[10px] rounded-full bg-[#ff6b35]" />}
                  </div>
                  <Landmark className="w-[22px] h-[22px] text-[#ff6b35] shrink-0" />
                  <div className="flex-1 flex flex-col gap-[2px]">
                    <p className="font-medium text-[13px] text-white">Virtual Account Bank</p>
                    <p className="text-[11px] text-[#bdbdbd]">BCA, BNI, BRI, Mandiri</p>
                  </div>
                  {paymentType === 'va' ? (
                    <ChevronUp className="w-4 h-4 text-[#bdbdbd]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#bdbdbd]" />
                  )}
                </div>

                {/* Transfer Manual Option */}
                <div
                  onClick={() => setPaymentType('manual')}
                  className={`p-[18px] rounded-[8px] flex items-center gap-[16px] cursor-pointer transition-colors border ${
                    paymentType === 'manual'
                      ? 'bg-[#38271f] border-[#ff6b35]'
                      : 'bg-[#242424] border-[#383838] hover:border-neutral-600'
                  }`}
                >
                  <div className="w-[18px] h-[18px] rounded-full border border-[#383838] flex items-center justify-center shrink-0">
                    {paymentType === 'manual' && <div className="w-[10px] h-[10px] rounded-full bg-[#ff6b35]" />}
                  </div>
                  <ArrowLeftRight className="w-[22px] h-[22px] text-[#bdbdbd] shrink-0" />
                  <div className="flex-1 flex flex-col gap-[2px]">
                    <p className="font-medium text-[13px] text-white">Transfer Bank Manual</p>
                    <p className="text-[11px] text-[#bdbdbd]">Unggah bukti transfer untuk verifikasi tim</p>
                  </div>
                  {paymentType === 'manual' ? (
                    <ChevronUp className="w-4 h-4 text-[#bdbdbd]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#bdbdbd]" />
                  )}
                </div>

                {/* Credit Card Option */}
                <div
                  onClick={() => setPaymentType('card')}
                  className={`p-[18px] rounded-[8px] flex items-center gap-[16px] cursor-pointer transition-colors border ${
                    paymentType === 'card'
                      ? 'bg-[#38271f] border-[#ff6b35]'
                      : 'bg-[#242424] border-[#383838] hover:border-neutral-600'
                  }`}
                >
                  <div className="w-[18px] h-[18px] rounded-full border border-[#383838] flex items-center justify-center shrink-0">
                    {paymentType === 'card' && <div className="w-[10px] h-[10px] rounded-full bg-[#ff6b35]" />}
                  </div>
                  <CreditCard className="w-[22px] h-[22px] text-[#bdbdbd] shrink-0" />
                  <div className="flex-1 flex flex-col gap-[2px]">
                    <p className="font-medium text-[13px] text-white">Kartu Kredit / Debit</p>
                    <p className="text-[11px] text-[#bdbdbd]">Visa & Mastercard · Settlement seketika</p>
                  </div>
                  {paymentType === 'card' ? (
                    <ChevronUp className="w-4 h-4 text-[#bdbdbd]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#bdbdbd]" />
                  )}
                </div>
              </div>

              {/* Bank Selector (BCA, BNI, BRI, Mandiri) */}
              {paymentType === 'va' && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-[12px]">
                  {['BCA', 'BNI', 'BRI', 'Mandiri'].map((bank) => {
                    const isSelected = selectedBank === bank;
                    return (
                      <button
                        key={bank}
                        type="button"
                        onClick={() => setSelectedBank(bank)}
                        className={`h-[46px] rounded-[6px] border font-semibold text-[13px] flex items-center justify-center gap-2 transition-colors ${
                          isSelected
                            ? 'bg-[#38271f] border-[#ff6b35] text-white'
                            : 'bg-[#171717] border-[#383838] text-[#bdbdbd] hover:text-white'
                        }`}
                      >
                        <span>{bank}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#ff6b35]" />}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Selected Payment Instructions Box */}
              <div className="bg-[#171717] rounded-[8px] p-[20px] flex flex-col gap-[16px] border border-[#383838]">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-[13px] text-white">
                    {selectedBank} Virtual Account
                  </p>
                  <p className="text-[11px] text-[#8cd6b0] font-normal">
                    Biaya admin Rp0
                  </p>
                </div>

                <div className="flex gap-[12px] items-center text-[12px] text-[#bdbdbd]">
                  <Info className="w-[18px] h-[18px] text-[#bdbdbd] shrink-0" />
                  <p className="leading-[1.6]">
                    Nomor VA otomatis diterbitkan setelah klik tombol di sebelah kanan.
                  </p>
                </div>

                <div className="flex flex-col gap-[10px] text-[11px] text-[#bdbdbd]">
                  <div className="flex gap-[12px] items-start">
                    <span className="text-[#ff6b35] font-semibold">1.</span>
                    <p className="leading-[1.6]">Nomor VA akan ditautkan ke nomor invoice resmi.</p>
                  </div>
                  <div className="flex gap-[12px] items-start">
                    <span className="text-[#ff6b35] font-semibold">2.</span>
                    <p className="leading-[1.6]">
                      Bayar tepat sejumlah nominal DP <span className="text-white font-semibold">{formatRupiah(downPayment)}</span> via ATM atau m-Banking {selectedBank}.
                    </p>
                  </div>
                  <div className="flex gap-[12px] items-start">
                    <span className="text-[#ff6b35] font-semibold">3.</span>
                    <p className="leading-[1.6]">Status otomatis diverifikasi setelah pembayaran masuk.</p>
                  </div>
                </div>

                <p className="text-[10px] text-[#8d8d8d] leading-[1.6] pt-1">
                  QRIS dan e-Wallet diproses otomatis oleh KINETIK Pay di halaman pembayaran berikutnya.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column (5 cols / 480px): Invoice Summary & Assistance */}
          <div className="lg:col-span-5 flex flex-col gap-[20px]">
            {/* Invoice Summary Card */}
            <div className="bg-[#242424] border border-[#383838] rounded-[12px] p-6 md:p-[28px] flex flex-col gap-[22px]">
              <div className="flex items-start justify-between">
                <h2 className="font-poppins font-medium text-[20px] text-white">
                  Ringkasan tagihan
                </h2>
                <FileText className="w-5 h-5 text-[#bdbdbd]" />
              </div>

              {/* Invoice Identification */}
              <div className="flex flex-col gap-[4px] text-[12px]">
                <p className="text-white font-medium">INV/2026/1103/018</p>
                <p className="text-[11px] text-[#8d8d8d]">
                  Diterbitkan {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} · Belum dibayar
                </p>
              </div>

              <div className="h-px bg-[#383838]" />

              {/* Invoice Line Items */}
              <div className="flex flex-col gap-[14px]">
                <div className="flex items-center justify-between text-[12px]">
                  <p className="text-[#bdbdbd]">{selectedProduct?.name || 'Paket Acara'} · {quantity}x</p>
                  <p className="text-white font-medium">{formatRupiah(subtotal)}</p>
                </div>
                <div className="flex items-center justify-between text-[12px]">
                  <p className="text-[#bdbdbd]">Audio, lighting & LED · 1 set</p>
                  <p className="text-white font-medium text-xs text-[#8cd6b0]">Termasuk Paket</p>
                </div>
                <div className="flex items-center justify-between text-[12px]">
                  <p className="text-[#bdbdbd]">Koordinasi venue & kru hari-H</p>
                  <p className="text-white font-medium text-xs text-[#8cd6b0]">Termasuk Layanan</p>
                </div>
              </div>

              <div className="h-px bg-[#383838]" />

              {/* Invoice Totals */}
              <div className="flex flex-col gap-[12px] text-[12px]">
                <div className="flex items-center justify-between text-[#bdbdbd]">
                  <p>Subtotal</p>
                  <p className="text-white font-medium">{formatRupiah(subtotal)}</p>
                </div>
                <div className="flex items-center justify-between text-[#bdbdbd]">
                  <p>PPN (11% × subtotal)</p>
                  <p className="text-white font-medium">{formatRupiah(tax)}</p>
                </div>
                <div className="flex items-center justify-between text-[#bdbdbd]">
                  <p>Biaya admin {selectedBank} VA</p>
                  <p className="text-white font-medium">Rp0</p>
                </div>
                <div className="flex items-center justify-between text-white font-semibold pt-1 border-t border-[#383838]">
                  <p className="text-[14px]">Total nilai pesanan</p>
                  <p className="text-[16px] text-white font-poppins">{formatRupiah(total)}</p>
                </div>
              </div>

              <p className="text-[10px] text-[#8d8d8d] leading-[1.6]">
                Kalkulasi resmi sesuai spesifikasi sistem. Konsumsi tambahan dan talent luar dapat dikonsultasikan terpisah.
              </p>

              {/* Payment Schedule Box (50% Down Payment from Figma) */}
              <div className="bg-[#171717] rounded-[8px] p-[18px] flex flex-col gap-[14px] border border-[#383838]">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-[12px] text-white">Uang muka 50%</p>
                  <p className="text-[10px] text-[#e9c47d] font-normal">Dibayar sekarang</p>
                </div>
                <p className="font-poppins font-medium text-[30px] md:text-[34px] text-[#ff6b35] tracking-[-1.02px]">
                  {formatRupiah(downPayment)}
                </p>
                <div className="h-px bg-[#383838]" />
                <div className="flex items-center justify-between text-[12px]">
                  <p className="text-[#bdbdbd]">Sisa pelunasan 50%</p>
                  <p className="text-white font-medium">{formatRupiah(remainingPayment)}</p>
                </div>
                <p className="text-[10px] text-[#8d8d8d] leading-[1.6]">
                  Jatuh tempo pelunasan H-7 sebelum hari pelaksanaan acara.
                </p>
              </div>

              {/* Deadline */}
              <div className="flex items-center gap-[12px]">
                <Clock3 className="w-5 h-5 text-[#ff6b35] shrink-0" />
                <div className="flex flex-col text-[11px]">
                  <p className="text-[#bdbdbd]">Batas pembayaran uang muka</p>
                  <p className="text-white font-medium text-[13px]">24 Jam dari sekarang</p>
                </div>
              </div>

              {/* Primary Action Button (Matches Figma component 46:3808) */}
              <button
                type="button"
                onClick={handleSubmitBooking}
                disabled={loading}
                className="w-full bg-[#ff6b35] text-[#171717] font-semibold text-[14px] h-[56px] rounded-[6px] flex items-center justify-center gap-[14px] hover:bg-[#e5531e] transition-colors disabled:opacity-50"
              >
                <span>{loading ? 'Memproses...' : 'Lanjut ke Pembayaran'}</span>
                <ArrowUpRight className="w-[18px] h-[18px]" />
              </button>

              <p className="text-[10px] text-[#8d8d8d] text-center leading-[1.6]">
                Dengan melanjutkan, Anda menyetujui ketentuan booking dan kebijakan pembatalan KINETIK.
              </p>
            </div>

            {/* Client Support Card */}
            <div className="border border-[#383838] rounded-[12px] p-[22px] flex items-start gap-[14px] bg-[#242424]">
              <Headset className="w-[23px] h-[23px] text-[#ff6b35] shrink-0 mt-0.5" />
              <div className="flex flex-col gap-[6px]">
                <p className="font-medium text-[13px] text-white">
                  Butuh bantuan pembayaran?
                </p>
                <p className="text-[11px] text-[#bdbdbd] leading-[1.7]">
                  Tim produksi siap membantu konsultasi teknis Senin–Jumat, 09.00–18.00 WIB.
                </p>
                <a
                  href="https://wa.me/6281200000000"
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-[12px] text-[#ff6b35] hover:underline inline-flex items-center gap-1 mt-1"
                >
                  Hubungi tim KINETIK ↗
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Footer */}
        <div className="border-t border-[#383838] pt-[20px] flex flex-col sm:flex-row items-center justify-between text-[10px] text-[#8d8d8d] gap-2">
          <p>Sistem Pemesanan Resmi KINETIK · Pembayaran Diverifikasi Otomatis Real-time.</p>
          <p>© 2026 KINETIK · Kebijakan Privasi</p>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[100dvh] bg-[#171717] flex items-center justify-center text-white">
          Memuat Workspace Pembayaran...
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
