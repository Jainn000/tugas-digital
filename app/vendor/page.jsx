'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Box, Calendar, Clock, CheckCircle2, ArrowRight, Eye, 
  Bell, Download, Headphones, ChevronDown, Wrench, X
} from 'lucide-react';
import { useToast } from '@/components/ToastContext';
import { formatRupiah } from '@/lib/format';

export default function VendorDashboardPage() {
  const toast = useToast();
  const [stockOverview, setStockOverview] = useState({
    total: 120,
    available: 78,
    lowStock: 24,
    outOfStock: 18,
    availablePct: 65,
    lowStockPct: 20,
    outOfStockPct: 15,
  });
  const [rentalOrders, setRentalOrders] = useState([]);
  const [stockAlerts, setStockAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [quickStockModal, setQuickStockModal] = useState(false);
  const [quickItemName, setQuickItemName] = useState('');
  const [quickCategory, setQuickCategory] = useState('Lighting');
  const [quickQty, setQuickQty] = useState('');

  useEffect(() => {
    // 1. Fetch stock overview
    fetch('/api/vendor/stock')
      .then(res => res.json())
      .then(data => {
        if (data.overview) setStockOverview(data.overview);
        if (data.items) {
          const alerts = data.items.filter(i => i.status === 'low_stock' || i.status === 'out_of_stock');
          setStockAlerts(alerts.slice(0, 3));
        }
      })
      .catch(() => {});

    // 2. Fetch rental orders
    fetch('/api/vendor/orders')
      .then(res => res.json())
      .then(data => {
        if (data.orders) setRentalOrders(data.orders.slice(0, 5));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleQuickAddStock = async (e) => {
    e.preventDefault();
    if (!quickItemName.trim() || !quickQty) {
      toast.error('Lengkapi nama alat dan kuantitas stok.', 'Input Tidak Lengkap');
      return;
    }

    try {
      const res = await fetch('/api/vendor/stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: quickItemName.trim(),
          category: quickCategory,
          total_qty: Number(quickQty),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Alat ${quickItemName} berhasil ditambahkan ke inventori!`, 'Stok Ditambahkan');
        setQuickStockModal(false);
        setQuickItemName('');
        setQuickQty('');
        // Refresh overview
        fetch('/api/vendor/stock')
          .then(r => r.json())
          .then(d => { if (d.overview) setStockOverview(d.overview); });
      } else {
        toast.error(data.error || 'Gagal menambahkan stok.', 'Gagal');
      }
    } catch (err) {
      toast.error('Terjadi kesalahan jaringan.', 'Error');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#393224] text-[#e9c47d] border border-[#e9c47d]/40">
            Pending
          </span>
        );
      case 'Confirmed':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#23372d] text-[#8cd6b0] border border-[#8cd6b0]/40">
            Confirmed
          </span>
        );
      case 'Processing':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#38271f] text-[#ff6b35] border border-[#ff6b35]/40">
            Processing
          </span>
        );
      case 'Completed':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950/70 text-emerald-400 border border-emerald-800">
            Completed
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#242424] text-[#bdbdbd]">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6" data-ui="vendor-dashboard">
      {/* 1. DASHBOARD HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-poppins font-bold text-2xl sm:text-3xl text-white tracking-tight">
            Vendor Dashboard
          </h1>
          <p className="font-inter text-xs sm:text-sm text-[#8d8d8d] mt-1">
            Manage your stock and rental orders efficiently.
          </p>
        </div>

        {/* Date Filter Dropdown */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-[8px] bg-[#1a1a1a] border border-[#2e2e2e] text-xs text-[#bdbdbd] self-start sm:self-auto cursor-pointer hover:border-[#ff6b35]/50 transition-colors">
          <Calendar className="w-3.5 h-3.5 text-[#ff6b35]" />
          <span>Last 30 Days</span>
          <ChevronDown className="w-3.5 h-3.5 text-[#666666] ml-1" />
        </div>
      </div>

      {/* 2. KPI METRICS (4 CARDS MATCHING SCREENSHOT) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Stock items */}
        <div className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-[12px] p-5 flex flex-col justify-between gap-3 relative overflow-hidden group hover:border-[#383838] transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#8d8d8d] font-medium">Total Stock items</span>
            <div className="w-8 h-8 rounded-full bg-[#ff6b35]/15 flex items-center justify-center text-[#ff6b35]">
              <Box className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-poppins font-bold text-2xl sm:text-3xl text-white">
              {stockOverview.total}
            </span>
            <div className="flex items-center gap-1 text-[11px] text-[#8cd6b0] font-semibold">
              <span>↑ +2%</span>
            </div>
          </div>
          {/* Sparkline curve visualization */}
          <div className="h-8 w-full">
            <svg viewBox="0 0 100 24" className="w-full h-full stroke-[#ff6b35] fill-none stroke-[2]">
              <path d="M0,18 Q20,16 40,20 T70,8 T100,12" />
            </svg>
          </div>
        </div>

        {/* Card 2: Rental Orders */}
        <div className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-[12px] p-5 flex flex-col justify-between gap-3 relative overflow-hidden group hover:border-[#383838] transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#8d8d8d] font-medium">Rental Orders</span>
            <div className="w-8 h-8 rounded-full bg-[#ff6b35]/15 flex items-center justify-center text-[#ff6b35]">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-poppins font-bold text-2xl sm:text-3xl text-white">
              24
            </span>
            <div className="flex items-center gap-1 text-[11px] text-[#8cd6b0] font-semibold">
              <span>↑ +12%</span>
            </div>
          </div>
          <div className="h-8 w-full">
            <svg viewBox="0 0 100 24" className="w-full h-full stroke-[#ff6b35] fill-none stroke-[2]">
              <path d="M0,22 Q25,18 50,22 T80,8 T100,4" />
            </svg>
          </div>
        </div>

        {/* Card 3: Pending Orders */}
        <div className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-[12px] p-5 flex flex-col justify-between gap-3 relative overflow-hidden group hover:border-[#383838] transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#8d8d8d] font-medium">Pending Orders</span>
            <div className="w-8 h-8 rounded-full bg-[#e9c47d]/15 flex items-center justify-center text-[#e9c47d]">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-poppins font-bold text-2xl sm:text-3xl text-white">
              5
            </span>
            <div className="flex items-center gap-1 text-[11px] text-[#8cd6b0] font-semibold">
              <span>↑ +1%</span>
            </div>
          </div>
          <div className="h-8 w-full">
            <svg viewBox="0 0 100 24" className="w-full h-full stroke-[#e9c47d] fill-none stroke-[2]">
              <path d="M0,20 Q30,12 60,18 T100,10" />
            </svg>
          </div>
        </div>

        {/* Card 4: Completed Orders */}
        <div className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-[12px] p-5 flex flex-col justify-between gap-3 relative overflow-hidden group hover:border-[#383838] transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#8d8d8d] font-medium">Completed Orders</span>
            <div className="w-8 h-8 rounded-full bg-[#8cd6b0]/15 flex items-center justify-center text-[#8cd6b0]">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-poppins font-bold text-2xl sm:text-3xl text-white">
              19
            </span>
            <div className="flex items-center gap-1 text-[11px] text-[#8cd6b0] font-semibold">
              <span>↑ +8%</span>
            </div>
          </div>
          <div className="h-8 w-full">
            <svg viewBox="0 0 100 24" className="w-full h-full stroke-[#8cd6b0] fill-none stroke-[2]">
              <path d="M0,24 Q30,20 60,14 T100,4" />
            </svg>
          </div>
        </div>
      </div>

      {/* 3. MIDDLE ROW: STOCK OVERVIEW & RECENT RENTAL ORDERS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Card (5 cols): Stock Overview with SVG Donut Chart */}
        <div className="lg:col-span-5 bg-[#1a1a1a] border border-[#2e2e2e] rounded-[12px] p-6 flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-poppins font-semibold text-base text-white">
              Stock Overview
            </h2>
            <Link
              href="/vendor/stock"
              className="text-xs font-semibold text-[#ff6b35] hover:underline flex items-center gap-1"
            >
              <span>View Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
            {/* Donut Chart SVG */}
            <div className="relative w-40 h-40 shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                {/* Background circle */}
                <path
                  className="stroke-[#242424]"
                  strokeWidth="4"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                {/* Available Segment (65% orange) */}
                <path
                  className="stroke-[#ff6b35]"
                  strokeWidth="4"
                  strokeDasharray="65, 100"
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                {/* Low stock Segment (20% gray) */}
                <path
                  className="stroke-[#8d8d8d]"
                  strokeWidth="4"
                  strokeDasharray="20, 100"
                  strokeDashoffset="-65"
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                {/* Out of stock Segment (15% red) */}
                <path
                  className="stroke-[#e53935]"
                  strokeWidth="4"
                  strokeDasharray="15, 100"
                  strokeDashoffset="-85"
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>

              {/* Center Donut Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="font-poppins font-bold text-2xl text-white leading-none">
                  {stockOverview.total}
                </span>
                <span className="text-[10px] text-[#8d8d8d] font-medium mt-1">
                  Total Items
                </span>
              </div>
            </div>

            {/* Donut Legend */}
            <div className="space-y-3 text-xs w-full sm:w-auto">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff6b35] shrink-0" />
                <div className="flex flex-col">
                  <span className="text-white font-medium">Available</span>
                  <span className="text-[11px] text-[#8d8d8d]">
                    {stockOverview.available} items ({stockOverview.availablePct}%)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#8d8d8d] shrink-0" />
                <div className="flex flex-col">
                  <span className="text-white font-medium">Low Stock</span>
                  <span className="text-[11px] text-[#8d8d8d]">
                    {stockOverview.lowStock} items ({stockOverview.lowStockPct}%)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#e53935] shrink-0" />
                <div className="flex flex-col">
                  <span className="text-white font-medium">Out of Stock</span>
                  <span className="text-[11px] text-[#8d8d8d]">
                    {stockOverview.outOfStock} items ({stockOverview.outOfStockPct}%)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Card (7 cols): Recent Rental Orders Table */}
        <div className="lg:col-span-7 bg-[#1a1a1a] border border-[#2e2e2e] rounded-[12px] p-6 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-poppins font-semibold text-base text-white">
              Recent Rental Orders
            </h2>
            <Link
              href="/vendor/orders"
              className="text-xs font-semibold text-[#ff6b35] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#bdbdbd]">
              <thead>
                <tr className="border-b border-[#2e2e2e] text-[#8d8d8d] text-[11px] uppercase tracking-wider font-semibold">
                  <th className="pb-3 font-medium">Order ID</th>
                  <th className="pb-3 font-medium">Event Name</th>
                  <th className="pb-3 font-medium">Rental Date</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#242424]">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-xs text-[#8d8d8d]">
                      Memuat pesanan sewa...
                    </td>
                  </tr>
                ) : rentalOrders.map((order) => (
                  <tr key={order.order_id} className="hover:bg-[#202020] transition-colors">
                    <td className="py-3 font-medium text-white font-mono text-[11px]">
                      {order.order_id}
                    </td>
                    <td className="py-3 font-medium text-white">
                      {order.event_name}
                    </td>
                    <td className="py-3 text-[#8d8d8d]">
                      {order.rental_date}
                    </td>
                    <td className="py-3">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="py-3 text-center">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-1 rounded text-[#8d8d8d] hover:text-[#ff6b35] transition-colors"
                        title="Lihat Detail Pesanan"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 4. BOTTOM ROW: STOCK ALERTS, QUICK ACTIONS, & BANNER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (5 cols): Stock Alerts */}
        <div className="lg:col-span-5 bg-[#1a1a1a] border border-[#2e2e2e] rounded-[12px] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#ff6b35]" />
              <h2 className="font-poppins font-semibold text-base text-white">
                Stock Alerts
              </h2>
            </div>
            <Link
              href="/vendor/stock"
              className="text-xs font-semibold text-[#ff6b35] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {stockAlerts.map((item) => (
              <div
                key={item.id}
                className="bg-[#242424] border border-[#303030] rounded-[8px] p-3 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-[6px] bg-[#1a1a1a] border border-[#333333] flex items-center justify-center text-[#ff6b35] shrink-0">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-medium text-xs text-white truncate">
                      {item.name}
                    </span>
                    <span className="text-[11px] text-[#e53935] mt-0.5">
                      {item.notes || 'Stock is running low'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end shrink-0 gap-1">
                  <span className={`px-2 py-0.5 rounded-[4px] text-[10px] font-semibold ${
                    item.status === 'out_of_stock'
                      ? 'bg-red-950/60 text-red-400 border border-red-800'
                      : 'bg-[#393224] text-[#e9c47d] border border-[#e9c47d]/40'
                  }`}>
                    {item.status === 'out_of_stock' ? 'Out of Stock' : 'Low Stock'}
                  </span>
                  <span className="text-[10px] text-[#666666]">{item.updated_at || '2h ago'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (7 cols): Quick Actions + Promo Banner */}
        <div className="lg:col-span-7 space-y-6">
          {/* Quick Actions Card */}
          <div className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-[12px] p-6 space-y-4">
            <h2 className="font-poppins font-semibold text-base text-white">
              Quick Actions
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                type="button"
                onClick={() => setQuickStockModal(true)}
                className="bg-[#242424] hover:bg-[#2b2b2b] border border-[#333333] hover:border-[#ff6b35]/60 rounded-[8px] p-4 flex flex-col items-center justify-center gap-2 transition-colors text-center group"
              >
                <Box className="w-5 h-5 text-[#bdbdbd] group-hover:text-[#ff6b35] transition-colors" />
                <span className="text-xs font-medium text-white">Update Stock</span>
              </button>

              <Link
                href="/vendor/orders"
                className="bg-[#242424] hover:bg-[#2b2b2b] border border-[#333333] hover:border-[#ff6b35]/60 rounded-[8px] p-4 flex flex-col items-center justify-center gap-2 transition-colors text-center group"
              >
                <Calendar className="w-5 h-5 text-[#bdbdbd] group-hover:text-[#ff6b35] transition-colors" />
                <span className="text-xs font-medium text-white">View Orders</span>
              </Link>

              <button
                type="button"
                onClick={() => toast.success('Laporan inventori dan reservasi alat berhasil diunduh (PDF).', 'Laporan Diunduh')}
                className="bg-[#242424] hover:bg-[#2b2b2b] border border-[#333333] hover:border-[#ff6b35]/60 rounded-[8px] p-4 flex flex-col items-center justify-center gap-2 transition-colors text-center group"
              >
                <Download className="w-5 h-5 text-[#bdbdbd] group-hover:text-[#ff6b35] transition-colors" />
                <span className="text-xs font-medium text-white">Download Report</span>
              </button>

              <Link
                href="/vendor/messages"
                className="bg-[#242424] hover:bg-[#2b2b2b] border border-[#333333] hover:border-[#ff6b35]/60 rounded-[8px] p-4 flex flex-col items-center justify-center gap-2 transition-colors text-center group"
              >
                <Headphones className="w-5 h-5 text-[#bdbdbd] group-hover:text-[#ff6b35] transition-colors" />
                <span className="text-xs font-medium text-white">Contact Admin</span>
              </Link>
            </div>
          </div>

          {/* Partner Growth Banner (Matches Screenshot) */}
          <div className="relative rounded-[12px] overflow-hidden p-6 border border-[#333333] bg-[#1a1a1a] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="absolute inset-0 z-0 opacity-25">
              <Image
                src="/figma/hero-concert.png"
                alt="Concert Background"
                fill
                className="object-cover"
              />
            </div>

            <div className="relative z-10 space-y-1 text-center sm:text-left">
              <h3 className="font-poppins font-bold text-base text-white">
                Need more event equipment?
              </h3>
              <p className="text-xs text-[#bdbdbd]">
                Let&apos;s grow together with KINETIK.
              </p>
            </div>

            <div className="relative z-10 flex items-center gap-4">
              <Link
                href="/vendor/messages"
                className="px-4 py-2 rounded-full bg-[#ff6b35] text-[#171717] font-semibold text-xs hover:bg-[#e5531e] transition-colors flex items-center gap-1.5 shadow-md shadow-[#ff6b35]/20"
              >
                <span>Contact Us</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <div className="w-7 h-8 relative shrink-0">
                <Image src="/figma/kinetik-symbol.svg" alt="KINETIK" fill className="object-contain" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: ORDER DETAIL PREVIEW */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
          <div className="relative w-full max-w-lg bg-[#1e1e1e] border border-[#383838] rounded-[12px] p-6 space-y-4 text-white">
            <div className="flex justify-between items-center border-b border-[#2e2e2e] pb-3">
              <div className="flex items-center gap-2">
                <span className="font-poppins font-bold text-sm text-[#ff6b35]">
                  {selectedOrder.order_id}
                </span>
                <span className="text-xs text-[#8d8d8d]">Detail Pemesanan Rental</span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-[#8d8d8d] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[#8d8d8d] block">Nama Event & EO Pemesan:</span>
                <span className="font-semibold text-sm text-white">{selectedOrder.event_name}</span>
                <span className="text-[#ff6b35] block mt-0.5">{selectedOrder.eo_name} ({selectedOrder.eo_contact || 'Kontak EO'})</span>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-[#242424] p-3 rounded-[6px]">
                <div>
                  <span className="text-[#8d8d8d] block">Tanggal & Durasi:</span>
                  <span className="text-white font-medium">{selectedOrder.rental_date} ({selectedOrder.duration})</span>
                </div>
                <div>
                  <span className="text-[#8d8d8d] block">Total Nilai Sewa:</span>
                  <span className="text-[#8cd6b0] font-semibold text-sm">{formatRupiah(selectedOrder.total_amount)}</span>
                </div>
              </div>

              <div>
                <span className="text-[#8d8d8d] block">Rincian Peralatan:</span>
                <p className="text-white bg-[#171717] p-2.5 rounded border border-[#333333] mt-1">
                  {selectedOrder.items}
                </p>
              </div>

              <div>
                <span className="text-[#8d8d8d] block">Lokasi / Venue:</span>
                <span className="text-white">{selectedOrder.venue}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#2e2e2e] flex justify-between items-center">
              <Link
                href="/vendor/messages"
                className="text-xs text-[#ff6b35] hover:underline flex items-center gap-1"
              >
                <span>Kirim Pesan ke EO ini</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-[#242424] hover:bg-[#2e2e2e] text-white text-xs rounded-[6px]"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: QUICK ADD/UPDATE STOCK */}
      {quickStockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
          <div className="relative w-full max-w-md bg-[#1e1e1e] border border-[#383838] rounded-[12px] p-6 space-y-4 text-white">
            <div className="flex justify-between items-center border-b border-[#2e2e2e] pb-3">
              <h3 className="font-poppins font-semibold text-base text-white">
                Tambah / Perbarui Stok Peralatan
              </h3>
              <button
                onClick={() => setQuickStockModal(false)}
                className="text-[#8d8d8d] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleQuickAddStock} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-[#8d8d8d]">Nama Peralatan</label>
                <input
                  type="text"
                  value={quickItemName}
                  onChange={(e) => setQuickItemName(e.target.value)}
                  placeholder="Contoh: Smoke Hazzer Machine 1500W"
                  required
                  className="w-full bg-[#171717] border border-[#333333] rounded-[6px] px-3 py-2 text-white focus:outline-none focus:border-[#ff6b35]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[#8d8d8d]">Kategori</label>
                  <select
                    value={quickCategory}
                    onChange={(e) => setQuickCategory(e.target.value)}
                    className="w-full bg-[#171717] border border-[#333333] rounded-[6px] px-2.5 py-2 text-white focus:outline-none focus:border-[#ff6b35]"
                  >
                    <option value="Lighting">Lighting</option>
                    <option value="Audio">Audio</option>
                    <option value="Rigging">Rigging</option>
                    <option value="Visual">Visual & LED</option>
                    <option value="Power">Power & Genset</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[#8d8d8d]">Jumlah Unit Stok</label>
                  <input
                    type="number"
                    value={quickQty}
                    onChange={(e) => setQuickQty(e.target.value)}
                    placeholder="Contoh: 10"
                    required
                    className="w-full bg-[#171717] border border-[#333333] rounded-[6px] px-3 py-2 text-white focus:outline-none focus:border-[#ff6b35]"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#2e2e2e]">
                <button
                  type="button"
                  onClick={() => setQuickStockModal(false)}
                  className="px-4 py-2 bg-[#242424] text-[#bdbdbd] rounded-[6px] text-xs hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#ff6b35] text-[#171717] font-semibold rounded-[6px] text-xs hover:bg-[#e5531e]"
                >
                  Simpan Stok
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
