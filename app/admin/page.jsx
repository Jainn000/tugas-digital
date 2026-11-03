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

    const targetOrder = pendingOrders[0] || orders[0];
    const orderNum = targetOrder ? targetOrder.order_number : 'INV-20261102-005';

    try {
      const res = await fetch('/api/payment/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Signature': 'mock-dev-signature',
        },
        body: JSON.stringify({
          event: 'payment.settled',
          order_id: orderNum,
          gross_amount: targetOrder ? targetOrder.total_amount : 5600000,
          payment_type: 'qris',
          transaction_status: 'settlement',
          settlement_time: new Date().toISOString(),
          reference_id: 'QRIS-SIM-' + Math.floor(100000 + Math.random() * 900000),
        }),
      });

      const data = await res.json();
      setWebhookResult({
        ok: res.ok,
        status: res.status,
        data,
      });

      if (res.ok) {
        const refetch = await fetch('/api/orders');
        const d = await refetch.json();
        if (d.orders) setOrders(d.orders);
      }
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
      <div className="p-12 text-center bg-[#242424] border border-[#383838] rounded-[10px]">
        <div className="w-7 h-7 border-2 border-[#383838] border-t-[#ff6b35] rounded-full animate-spin mx-auto mb-3"></div>
        <p className="font-inter text-sm text-[#bdbdbd]">Memuat ringkasan bisnis KINETIK...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" data-ui="kpi-grid">
        {/* Total Omzet */}
        <div className="bg-[#242424] border border-[#383838] rounded-[10px] p-5 flex flex-col justify-between gap-3">
          <div className="flex justify-between items-center text-xs text-[#8d8d8d]">
            <span className="font-medium">Total Omzet Reservasi</span>
            <div className="w-7 h-7 rounded-[6px] bg-[#8cd6b0]/15 flex items-center justify-center text-[#8cd6b0]">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold font-poppins text-[#8cd6b0]">{formatRupiah(totalOmzet)}</p>
            <p className="text-[11px] text-[#8d8d8d] mt-1">{paidOrders.length} transaksi berstatus Lunas</p>
          </div>
        </div>

        {/* Laba Kotor */}
        <div className="bg-[#242424] border border-[#383838] rounded-[10px] p-5 flex flex-col justify-between gap-3">
          <div className="flex justify-between items-center text-xs text-[#8d8d8d]">
            <span className="font-medium">Estimasi Laba Kotor</span>
            <div className="w-7 h-7 rounded-[6px] bg-[#ff6b35]/15 flex items-center justify-center text-[#ff6b35]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold font-poppins text-white">{formatRupiah(labaKotor)}</p>
            <p className="text-[11px] text-[#8d8d8d] mt-1">HPP: {formatRupiah(totalHPP)}</p>
          </div>
        </div>

        {/* Total Pesanan */}
        <div className="bg-[#242424] border border-[#383838] rounded-[10px] p-5 flex flex-col justify-between gap-3">
          <div className="flex justify-between items-center text-xs text-[#8d8d8d]">
            <span className="font-medium">Total Booking</span>
            <div className="w-7 h-7 rounded-[6px] bg-[#38bdf8]/15 flex items-center justify-center text-[#38bdf8]">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold font-poppins text-white">{orders.length} Transaksi</p>
            <p className="text-[11px] text-[#8d8d8d] mt-1">{pendingOrders.length} transaksi pending bayar</p>
          </div>
        </div>

        {/* Total Produk */}
        <div className="bg-[#242424] border border-[#383838] rounded-[10px] p-5 flex flex-col justify-between gap-3">
          <div className="flex justify-between items-center text-xs text-[#8d8d8d]">
            <span className="font-medium">Katalog Layanan & Tiket</span>
            <div className="w-7 h-7 rounded-[6px] bg-white/10 flex items-center justify-center text-white">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold font-poppins text-white">{products.length} Item Aktif</p>
            <p className="text-[11px] text-[#8d8d8d] mt-1">Paket acara, festival & sewa alat</p>
          </div>
        </div>
      </div>

      {/* 2. Payment Gateway & Webhook URL Configuration Card */}
      <div className="bg-[#242424] border border-[#383838] rounded-[10px] p-6 space-y-4 border-l-4 border-l-[#ff6b35]" data-ui="webhook-config">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#383838] pb-3">
          <div className="flex items-center gap-2.5">
            <Key className="w-5 h-5 text-[#ff6b35]" />
            <h3 className="font-poppins font-medium text-base text-white">
              Integrasi Payment Gateway: Webhook URL & Kunci API
            </h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-[#8cd6b0]/15 text-[#8cd6b0] text-[11px] font-semibold border border-[#8cd6b0]/30 self-start sm:self-auto">
            Endpoint Aktif
          </span>
        </div>

        <p className="text-xs text-[#bdbdbd] font-normal leading-relaxed">
          Gunakan Webhook URL ini di dashboard payment gateway (AkuQRIS / Midtrans / Xendit). Sistem KINETIK memvalidasi signature secara instan, mengubah status transaksi menjadi lunas, dan menerbitkan e-ticket.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          {/* Webhook URL */}
          <div className="p-3 bg-[#1c1c1c] border border-[#383838] rounded-[8px] space-y-1.5">
            <span className="text-[11px] font-medium text-[#8d8d8d] block">Webhook Callback URL:</span>
            <div className="flex items-center justify-between gap-2 bg-[#171717] px-2.5 py-2 rounded-[6px] border border-[#383838]">
              <code className="text-xs text-white select-all truncate">
                /api/payment/webhook
              </code>
              <button
                type="button"
                onClick={() => copyToClipboard('https://digital-entrepreneurship-five.vercel.app/api/payment/webhook', 'url')}
                className="p-1 hover:text-[#ff6b35] text-[#8d8d8d] transition-colors shrink-0"
                title="Salin Webhook URL"
                aria-label="Salin Webhook URL"
              >
                {copiedUrl ? <Check className="w-3.5 h-3.5 text-[#8cd6b0]" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-[10px] text-[#666666]">
              *Dapat diakses langsung via HTTPS domain Vercel.
            </p>
          </div>

          {/* AkuQRIS API Key */}
          <div className="p-3 bg-[#1c1c1c] border border-[#383838] rounded-[8px] space-y-1.5">
            <span className="text-[11px] font-medium text-[#8d8d8d] block">API Key (Sandbox):</span>
            <div className="flex items-center justify-between gap-2 bg-[#171717] px-2.5 py-2 rounded-[6px] border border-[#383838]">
              <code className="text-xs text-white select-all truncate">
                pk_test_2c11cd6b98...5e
              </code>
              <button
                type="button"
                onClick={() => copyToClipboard('pk_test_2c11cd6b9862c2074f9a39a1f7i5b95e', 'key')}
                className="p-1 hover:text-[#ff6b35] text-[#8d8d8d] transition-colors shrink-0"
                title="Salin API Key"
                aria-label="Salin API Key"
              >
                {copiedKey ? <Check className="w-3.5 h-3.5 text-[#8cd6b0]" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-[10px] text-[#666666]">
              Header: <span className="text-[#bdbdbd]">x-api-key</span>
            </p>
          </div>

          {/* AkuQRIS Webhook Secret */}
          <div className="p-3 bg-[#1c1c1c] border border-[#383838] rounded-[8px] space-y-1.5">
            <span className="text-[11px] font-medium text-[#8d8d8d] block">Webhook Secret:</span>
            <div className="flex items-center justify-between gap-2 bg-[#171717] px-2.5 py-2 rounded-[6px] border border-[#383838]">
              <code className="text-xs text-white select-all truncate">
                bd9dd1b16996...0cc
              </code>
              <button
                type="button"
                onClick={() => copyToClipboard('bd9dd1b1699672c82c5c246c742d47cc95c33389cffb0f502ac95c44c86740cc', 'secret')}
                className="p-1 hover:text-[#ff6b35] text-[#8d8d8d] transition-colors shrink-0"
                title="Salin Secret Key"
                aria-label="Salin Secret Key"
              >
                {copiedSecret ? <Check className="w-3.5 h-3.5 text-[#8cd6b0]" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-[10px] text-[#666666]">
              HMAC-SHA256 signature verification.
            </p>
          </div>
        </div>

        {/* Webhook Local Simulator Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-[#383838]">
          <span className="text-xs text-[#8d8d8d]">
            Simulasi Pengujian Webhook Gateway:
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleTestAkuqrisPing}
              disabled={webhookTesting}
              className="px-3 py-1.5 rounded-[6px] bg-[#171717] border border-[#383838] text-white hover:border-[#ff6b35] text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5 text-[#ff6b35]" />
              <span>{webhookTesting ? 'Menguji...' : 'Uji Ping Gateway (payment.test)'}</span>
            </button>
            <button
              type="button"
              onClick={handleTestWebhook}
              disabled={webhookTesting}
              className="px-3.5 py-1.5 rounded-[6px] bg-[#ff6b35] text-[#171717] hover:bg-[#e5531e] text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5 text-[#171717]" />
              <span>{webhookTesting ? 'Menguji...' : 'Simulasi Pembayaran Lunas'}</span>
            </button>
          </div>
        </div>

        {webhookResult && (
          <div
            className={`p-3 rounded-[6px] border text-xs flex items-start gap-2.5 ${
              webhookResult.ok
                ? 'bg-[#23372d] border-[#8cd6b0]/40 text-[#8cd6b0]'
                : 'bg-red-950/60 border-red-800 text-red-300'
            }`}
          >
            {webhookResult.ok ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-[#8cd6b0]" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
            )}
            <div>
              <p className="font-semibold">Respon HTTP {webhookResult.status}: {webhookResult.data.message || JSON.stringify(webhookResult.data)}</p>
              {webhookResult.data.order && (
                <p className="text-[#bdbdbd] mt-0.5">
                  Order <strong>{webhookResult.data.order.order_number}</strong> status pembayaran kini: <strong className="text-[#8cd6b0]">{webhookResult.data.order.payment_status.toUpperCase()}</strong>
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 3. Quick Action Banner for Reports */}
      <div className="bg-[#242424] border border-[#383838] rounded-[10px] p-6 flex flex-col md:flex-row items-center justify-between gap-4" data-ui="reports-banner">
        <div>
          <h3 className="font-poppins font-medium text-base text-white">Laporan Periodik & Cetak PDF</h3>
          <p className="font-inter text-xs text-[#bdbdbd] mt-1">
            Gunakan filter rentang tanggal untuk mengkaji omzet penjualan dan struktur laba rugi bulanan.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/reports/sales"
            className="px-4 py-2 rounded-[6px] bg-[#171717] border border-[#383838] text-white hover:border-[#ff6b35] text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <span>Laporan Penjualan</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#ff6b35]" />
          </Link>
          <Link
            href="/admin/reports/financial"
            className="px-4 py-2 rounded-[6px] bg-[#ff6b35] text-[#171717] hover:bg-[#e5531e] text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <span>Laporan Laba Rugi</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#171717]" />
          </Link>
        </div>
      </div>

      {/* 4. Recent Orders Table */}
      <div className="bg-[#242424] border border-[#383838] rounded-[10px] p-6 space-y-4" data-ui="recent-orders">
        <div className="flex justify-between items-center border-b border-[#383838] pb-3">
          <h3 className="font-poppins font-medium text-base text-white">Reservasi Terbaru</h3>
          <Link href="/admin/orders" className="text-xs font-semibold text-[#ff6b35] hover:underline">
            Lihat Semua Pesanan →
          </Link>
        </div>

        <div className="overflow-x-auto rounded-[6px] border border-[#383838]" data-ui="table-wrapper">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1c1c1c] text-[#8d8d8d] border-b border-[#383838] uppercase font-semibold">
              <tr>
                <th className="p-3">No. Order</th>
                <th className="p-3">Pemesan / PIC</th>
                <th className="p-3">Tanggal</th>
                <th className="p-3">Metode</th>
                <th className="p-3">Status Bayar</th>
                <th className="p-3 text-right">Total</th>
                <th className="p-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2e2e2e]">
              {orders.slice(0, 5).map(o => {
                const isPaid = o.payment_status === 'paid';
                return (
                  <tr key={o.id} className="hover:bg-[#2a2a2a] transition-colors">
                    <td className="p-3 font-semibold text-white">{o.order_number}</td>
                    <td className="p-3 text-white">
                      {o.customer_name}
                      <span className="block text-[11px] text-[#8d8d8d]">{o.customer_phone}</span>
                    </td>
                    <td className="p-3 text-[#bdbdbd]">{formatSimpleDate(o.created_at)}</td>
                    <td className="p-3 font-medium text-white">{o.payment_method}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                        isPaid
                          ? 'bg-[#8cd6b0]/15 text-[#8cd6b0] border-[#8cd6b0]/30'
                          : 'bg-[#ff6b35]/15 text-[#ff6b35] border-[#ff6b35]/30'
                      }`}>
                        {isPaid ? 'Lunas' : 'Pending'}
                      </span>
                    </td>
                    <td className="p-3 text-right font-semibold text-white">
                      {formatRupiah(o.total_amount)}
                    </td>
                    <td className="p-3 text-center">
                      <Link
                        href={`/orders/${o.order_number}`}
                        className="p-1.5 rounded-[4px] bg-[#171717] border border-[#383838] text-white hover:border-[#ff6b35] hover:text-[#ff6b35] inline-flex items-center gap-1 text-[11px] font-medium transition-colors"
                        title="Buka / Cetak Struk"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Cetak</span>
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
