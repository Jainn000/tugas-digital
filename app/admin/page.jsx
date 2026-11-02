'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatRupiah, formatSimpleDate } from '@/lib/format';
import { 
  DollarSign, ShoppingCart, Package, TrendingUp, 
  ArrowUpRight, Printer, Key, Send, CheckCircle2, AlertCircle, Copy, Check 
} from 'lucide-react';

export default function AdminOverviewPage() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [webhookTesting, setWebhookTesting] = useState(false);
  const [webhookResult, setWebhookResult] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/orders').then(r => r.json()),
      fetch('/api/products').then(r => r.json()),
    ])
      .then(([ordersData, productsData]) => {
        if (ordersData.orders) setOrders(ordersData.orders);
        if (productsData.products) setProducts(productsData.products);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const paidOrders = orders.filter(o => o.payment_status === 'paid');
  const totalOmzet = paidOrders.reduce((sum, o) => sum + Number(o.total_amount), 0);
  const totalHPP = paidOrders.reduce((sum, o) => sum + Number(o.total_cost), 0);
  const labaKotor = totalOmzet - totalHPP;
  const pendingOrders = orders.filter(o => o.payment_status === 'unpaid');

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'key') {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    } else if (type === 'secret') {
      setCopiedSecret(true);
      setTimeout(() => setCopiedSecret(false), 2000);
    } else {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    }
  };

  const handleTestAkuqrisPing = async () => {
    setWebhookTesting(true);
    setWebhookResult(null);

    try {
      const res = await fetch('/api/payment/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Event': 'payment.test',
        },
        body: JSON.stringify({
          event: 'payment.test',
          message: 'Simulasi ping tombol Tes dari Dashboard AkuQRIS',
        }),
      });

      const data = await res.json();
      setWebhookResult({
        ok: res.ok,
        status: res.status,
        data,
      });
    } catch (err) {
      setWebhookResult({
        ok: false,
        status: 500,
        data: { error: err.message },
      });
    } finally {
      setWebhookTesting(false);
    }
  };

  const handleTestWebhook = async () => {
    setWebhookTesting(true);
    setWebhookResult(null);

    // Pick a pending order or the latest order
    const targetOrder = pendingOrders[0] || orders[0];
    const orderNum = targetOrder ? targetOrder.order_number : 'INV-20261102-005';

    try {
      const res = await fetch('/api/payment/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'kinetik_sec_live_99a82bc1f832',
        },
        body: JSON.stringify({
          order_id: orderNum,
          transaction_status: 'settlement',
          payment_type: 'qris',
          gross_amount: targetOrder ? targetOrder.total_amount : 15000000,
        }),
      });

      const data = await res.json();
      setWebhookResult({
        ok: res.ok,
        status: res.status,
        data,
      });

      // Refresh orders list
      const updated = await fetch('/api/orders').then(r => r.json());
      if (updated.orders) setOrders(updated.orders);
    } catch (err) {
      setWebhookResult({
        ok: false,
        status: 500,
        data: { error: err.message },
      });
    } finally {
      setWebhookTesting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center nb-card bg-white">
        <p className="font-bold text-lg">Memuat ringkasan bisnis...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" data-ui="kpi-grid">
        {/* Total Omzet */}
        <div className="nb-card bg-[#FFE600] p-5 space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-neutral-800">
            <span>Total Omzet Reservasi & Tiket</span>
            <DollarSign className="w-4 h-4" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-black">{formatRupiah(totalOmzet)}</p>
          <p className="text-xs font-bold text-neutral-800">Dari {paidOrders.length} transaksi berstatus Lunas</p>
        </div>

        {/* Laba Kotor */}
        <div className="nb-card bg-[#A3E635] p-5 space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-neutral-800">
            <span>Estimasi Laba Kotor</span>
            <TrendingUp className="w-4 h-4" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-black">{formatRupiah(labaKotor)}</p>
          <p className="text-xs font-bold text-neutral-800">Omzet dikurangi HPP ({formatRupiah(totalHPP)})</p>
        </div>

        {/* Total Pesanan */}
        <div className="nb-card bg-[#38BDF8] p-5 space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-neutral-800">
            <span>Total Reservasi & Booking</span>
            <ShoppingCart className="w-4 h-4" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-black">{orders.length} Transaksi</p>
          <p className="text-xs font-bold text-neutral-800">{pendingOrders.length} transaksi belum lunas</p>
        </div>

        {/* Total Produk */}
        <div className="nb-card bg-white p-5 space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-neutral-800">
            <span>Katalog Layanan & Tiket</span>
            <Package className="w-4 h-4" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-black">{products.length} Paket & Tiket Aktif</p>
          <p className="text-xs font-bold text-neutral-800">Total item katalog tersedia</p>
        </div>
      </div>

      {/* Payment Gateway & Webhook URL Configuration Card */}
      <div className="nb-card bg-[#FFFDF0] p-6 space-y-4 border-l-8 border-l-[#38BDF8]" data-ui="webhook-config">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-black pb-3">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 stroke-[2.5]" />
            <h3 className="text-lg font-bold">Integrasi Payment Gateway: Webhook URL & API Key</h3>
          </div>
          <span className="nb-tag bg-black text-white text-xs font-bold">Endpoint Aktif</span>
        </div>

        <p className="text-xs text-neutral-800 font-medium leading-relaxed">
          Masukkan Webhook URL ini ke dashboard payment gateway Anda (Midtrans / Xendit / Tripay). Sistem otomatis memverifikasi signature atau API Key, mengupdate status order menjadi <strong>paid</strong>, mencatat waktu pelunasan, dan menerbitkan e-ticket secara instan.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {/* Webhook URL */}
          <div className="p-3 bg-white border-2 border-black space-y-1">
            <span className="text-xs font-bold text-neutral-600 block">Webhook Callback URL:</span>
            <div className="flex items-center justify-between gap-2 bg-neutral-100 p-2 border-2 border-black">
              <span className="text-xs font-bold text-neutral-900 select-all truncate">
                http://localhost:3000/api/payment/webhook
              </span>
              <button
                onClick={() => copyToClipboard('http://localhost:3000/api/payment/webhook', 'url')}
                className="p-1 border-2 border-black bg-white hover:bg-[#FFE600] flex-shrink-0"
                title="Salin Webhook URL"
                aria-label="Salin Webhook URL"
              >
                {copiedUrl ? <Check className="w-3.5 h-3.5 text-green-700" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-[11px] text-neutral-600 font-medium">
              *Di dashboard AkuQRIS/Autoko, gunakan URL ngrok jika ingin di-ping dari server luar.
            </p>
          </div>

          {/* AkuQRIS API Key */}
          <div className="p-3 bg-white border-2 border-black space-y-1">
            <span className="text-xs font-bold text-neutral-600 block">AkuQRIS API Key (Sandbox):</span>
            <div className="flex items-center justify-between gap-2 bg-neutral-100 p-2 border-2 border-black">
              <span className="text-xs font-bold text-neutral-900 select-all truncate">
                pk_test_2c11cd6b9862c2074f9a39a1f7i5b95e
              </span>
              <button
                onClick={() => copyToClipboard('pk_test_2c11cd6b9862c2074f9a39a1f7i5b95e', 'key')}
                className="p-1 border-2 border-black bg-white hover:bg-[#FFE600] flex-shrink-0"
                title="Salin API Key"
                aria-label="Salin API Key"
              >
                {copiedKey ? <Check className="w-3.5 h-3.5 text-green-700" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-[11px] text-neutral-600 font-medium">
              Digunakan pada header <code className="bg-neutral-200 px-1 font-bold">x-api-key</code> saat membuat invoice.
            </p>
          </div>

          {/* AkuQRIS Webhook Secret */}
          <div className="p-3 bg-white border-2 border-black space-y-1">
            <span className="text-xs font-bold text-neutral-600 block">AkuQRIS Webhook Secret:</span>
            <div className="flex items-center justify-between gap-2 bg-neutral-100 p-2 border-2 border-black">
              <span className="text-xs font-bold text-neutral-900 select-all truncate">
                bd9dd1b1699672c82c5c246c742d47cc95c33389cffb0f502ac95c44c86740cc
              </span>
              <button
                onClick={() => copyToClipboard('bd9dd1b1699672c82c5c246c742d47cc95c33389cffb0f502ac95c44c86740cc', 'secret')}
                className="p-1 border-2 border-black bg-white hover:bg-[#FFE600] flex-shrink-0"
                title="Salin Secret Key"
                aria-label="Salin Secret Key"
              >
                {copiedSecret ? <Check className="w-3.5 h-3.5 text-green-700" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-[11px] text-neutral-600 font-medium">
              Digunakan untuk verifikasi <code className="bg-neutral-200 px-1 font-bold">X-Webhook-Signature</code> HMAC-SHA256.
            </p>
          </div>
        </div>

        {/* Webhook Local Simulator Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t-2 border-black">
          <div className="text-xs font-medium text-neutral-700">
            Pilihan simulasi webhook pengujian:
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleTestAkuqrisPing}
              disabled={webhookTesting}
              className="nb-btn nb-btn-yellow px-3.5 py-1.5 text-xs flex items-center gap-1.5 font-bold"
            >
              <Send className="w-3.5 h-3.5" />
              {webhookTesting ? 'Menguji...' : 'Uji AkuQRIS Ping (payment.test)'}
            </button>
            <button
              onClick={handleTestWebhook}
              disabled={webhookTesting}
              className="nb-btn nb-btn-cyan px-3.5 py-1.5 text-xs flex items-center gap-1.5 font-bold"
            >
              <Send className="w-3.5 h-3.5" />
              {webhookTesting ? 'Menguji...' : 'Uji Simulasi Lunas (POST Order)'}
            </button>
          </div>
        </div>

        {webhookResult && (
          <div
            className={`p-3 border-2 border-black text-xs font-bold flex items-start gap-2 ${
              webhookResult.ok ? 'bg-[#A3E635] text-black' : 'bg-red-100 text-red-900'
            }`}
          >
            {webhookResult.ok ? (
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <p>Respon Webhook HTTP {webhookResult.status}: {webhookResult.data.message || JSON.stringify(webhookResult.data)}</p>
              {webhookResult.data.order && (
                <p className="text-neutral-800 font-medium mt-0.5">
                  Order <strong>{webhookResult.data.order.order_number}</strong> status pembayaran kini: <strong>{webhookResult.data.order.payment_status.toUpperCase()}</strong>
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Quick Action Banner for Reports */}
      <div className="nb-card bg-[#FFFDF0] p-6 flex flex-col md:flex-row items-center justify-between gap-4 border-l-8 border-l-[#FF5C00]" data-ui="reports-banner">
        <div>
          <h3 className="text-lg font-bold">Laporan Periodik Siap Cetak ke PDF</h3>
          <p className="text-xs font-medium text-neutral-700 mt-0.5">
            Gunakan filter rentang tanggal untuk mengkaji omzet penjualan dan struktur laba rugi bulanan.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/reports/sales"
            className="nb-btn nb-btn-yellow px-3.5 py-2 text-xs flex items-center gap-1.5 font-bold"
          >
            Laporan Penjualan <ArrowUpRight className="w-4 h-4" />
          </Link>
          <Link
            href="/admin/reports/financial"
            className="nb-btn nb-btn-orange px-3.5 py-2 text-xs flex items-center gap-1.5 font-bold"
          >
            Laporan Laba Rugi <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="nb-card bg-white p-6 space-y-4" data-ui="recent-orders">
        <div className="flex justify-between items-center border-b-2 border-black pb-3">
          <h3 className="font-bold text-base">Reservasi Terbaru</h3>
          <Link href="/admin/orders" className="text-xs font-bold underline hover:text-[#FF5C00]">
            Lihat Semua Pesanan →
          </Link>
        </div>

        <div className="border-2 border-black overflow-x-auto" data-ui="table-wrapper">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FFFDF0] border-b-2 border-black font-bold">
              <tr>
                <th className="p-3 border-r-2 border-black">No. Order</th>
                <th className="p-3 border-r-2 border-black">Pemesan / PIC</th>
                <th className="p-3 border-r-2 border-black">Tanggal</th>
                <th className="p-3 border-r-2 border-black">Metode</th>
                <th className="p-3 border-r-2 border-black">Status Bayar</th>
                <th className="p-3 border-r-2 border-black text-right">Total</th>
                <th className="p-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="font-medium">
              {orders.slice(0, 5).map(o => {
                const isPaid = o.payment_status === 'paid';
                return (
                  <tr key={o.id} className="border-b-2 border-black hover:bg-neutral-50">
                    <td className="p-3 border-r-2 border-black font-bold">{o.order_number}</td>
                    <td className="p-3 border-r-2 border-black font-bold">
                      {o.customer_name}
                      <span className="block text-xs text-neutral-500 font-normal">{o.customer_phone}</span>
                    </td>
                    <td className="p-3 border-r-2 border-black">{formatSimpleDate(o.created_at)}</td>
                    <td className="p-3 border-r-2 border-black font-bold">{o.payment_method}</td>
                    <td className="p-3 border-r-2 border-black">
                      <span className={`nb-tag text-xs ${isPaid ? 'bg-[#A3E635] text-black' : 'bg-red-200 text-black'}`}>
                        {isPaid ? 'Lunas' : 'Pending'}
                      </span>
                    </td>
                    <td className="p-3 border-r-2 border-black text-right font-bold">
                      {formatRupiah(o.total_amount)}
                    </td>
                    <td className="p-3 text-center">
                      <Link
                        href={`/orders/${o.order_number}`}
                        className="nb-btn nb-btn-yellow p-1.5 text-xs inline-flex items-center gap-1 font-bold"
                        title="Buka / Cetak Struk"
                      >
                        <Printer className="w-3.5 h-3.5" /> Cetak
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
