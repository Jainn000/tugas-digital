'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Calendar, ArrowLeft, MessageSquare, MapPin, 
  Clock, CheckCircle2, AlertCircle, RefreshCw, Eye, X 
} from 'lucide-react';
import { useToast } from '@/components/ToastContext';
import { formatRupiah } from '@/lib/format';

export default function VendorOrdersPage() {
  const toast = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/vendor/orders');
      const data = await res.json();
      if (data.orders) setOrders(data.orders);
    } catch (err) {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch('/api/vendor/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderId, status: newStatus }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Pesanan ${orderId} berhasil diubah ke status ${newStatus}.`, 'Status Diperbarui');
        fetchOrders();
      } else {
        toast.error(data.error || 'Gagal mengubah status.', 'Gagal');
      }
    } catch (err) {
      toast.error('Terjadi kesalahan jaringan.', 'Error');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (filter === 'All') return true;
    return o.status === filter;
  });

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
    <div className="space-y-6" data-ui="vendor-orders">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/vendor" className="text-[#8d8d8d] hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="font-poppins font-bold text-2xl text-white">
              Rental Orders
            </h1>
          </div>
          <p className="font-inter text-xs text-[#8d8d8d] mt-1 ml-6">
            Pemesanan sewa perlengkapan dari berbagai admin Event Organizer (EO).
          </p>
        </div>

        <button
          type="button"
          onClick={fetchOrders}
          className="p-2 rounded-[8px] bg-[#1a1a1a] border border-[#2e2e2e] text-[#bdbdbd] hover:text-white transition-colors self-start sm:self-auto"
          title="Segarkan Data"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#2e2e2e]">
        {['All', 'Pending', 'Confirmed', 'Processing', 'Completed'].map((tab) => {
          const count = tab === 'All' ? orders.length : orders.filter(o => o.status === tab).length;
          return (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-t-[8px] text-xs font-semibold whitespace-nowrap border-b-2 transition-all flex items-center gap-2 ${
                filter === tab
                  ? 'border-[#ff6b35] text-[#ff6b35] bg-[#ff6b35]/10'
                  : 'border-transparent text-[#8d8d8d] hover:text-white hover:bg-[#1a1a1a]'
              }`}
            >
              <span>{tab}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#242424] text-[#bdbdbd]">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Orders List Cards */}
      {loading ? (
        <div className="py-12 text-center text-xs text-[#8d8d8d]">
          <div className="w-6 h-6 border-2 border-[#2e2e2e] border-t-[#ff6b35] rounded-full animate-spin mx-auto mb-2"></div>
          Memuat pesanan sewa...
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="py-12 text-center text-xs text-[#8d8d8d] bg-[#1a1a1a] border border-[#2e2e2e] rounded-[12px]">
          Tidak ada pesanan sewa dengan status ini.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-[12px] p-5 sm:p-6 space-y-4 hover:border-[#383838] transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#262626] pb-3">
                <div className="flex items-center gap-3">
                  <span className="font-poppins font-bold text-sm text-[#ff6b35]">
                    {order.order_id}
                  </span>
                  <span className="text-xs text-[#8d8d8d]">• Admin EO: <strong className="text-white">{order.eo_name}</strong></span>
                </div>

                <div className="flex items-center gap-2.5">
                  {getStatusBadge(order.status)}
                  <span className="font-poppins font-bold text-base text-white">
                    {formatRupiah(order.total_amount)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-8 space-y-2.5">
                  <h3 className="font-poppins font-semibold text-lg text-white">
                    {order.event_name}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#bdbdbd]">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#ff6b35]" />
                      <span>Tanggal: {order.rental_date} ({order.duration})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#8cd6b0]" />
                      <span className="truncate">{order.venue}</span>
                    </div>
                  </div>

                  <div className="bg-[#141414] p-3 rounded-[6px] border border-[#282828] text-xs text-[#bdbdbd]">
                    <strong className="text-white block mb-0.5">Item Sewa:</strong>
                    {order.items}
                  </div>

                  <p className="text-[11px] text-[#8d8d8d]">
                    Kontak EO: {order.eo_contact} • {order.notes || '-'}
                  </p>
                </div>

                <div className="md:col-span-4 flex flex-col justify-between gap-3 border-t md:border-t-0 md:border-l border-[#262626] pt-3 md:pt-0 md:pl-4">
                  <div className="space-y-1.5 bg-[#242424] p-3 rounded-[6px]">
                    <label className="text-[10px] text-[#8d8d8d] uppercase font-semibold block">
                      Ubah Status Pesanan:
                    </label>
                    <select
                      value={order.status}
                      disabled={updatingId === order.order_id}
                      onChange={(e) => handleUpdateStatus(order.order_id, e.target.value)}
                      className="w-full bg-[#121212] border border-[#333333] text-white text-xs rounded px-2.5 py-1.5 focus:outline-none focus:border-[#ff6b35]"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Processing">Processing</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href="/vendor/messages"
                      className="flex-1 py-2 px-3 rounded-[6px] bg-[#ff6b35]/15 border border-[#ff6b35]/40 text-[#ff6b35] hover:bg-[#ff6b35] hover:text-[#171717] transition-colors text-xs font-semibold flex items-center justify-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat EO Ini</span>
                    </Link>
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-2 rounded-[6px] bg-[#242424] text-[#bdbdbd] hover:text-white border border-[#333333]"
                      title="Lihat Detail Lengkap"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DETAIL MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
          <div className="relative w-full max-w-lg bg-[#1e1e1e] border border-[#383838] rounded-[12px] p-6 space-y-4 text-white">
            <div className="flex justify-between items-center border-b border-[#2e2e2e] pb-3">
              <span className="font-poppins font-bold text-sm text-[#ff6b35]">
                {selectedOrder.order_id} • Detail Sewa
              </span>
              <button onClick={() => setSelectedOrder(null)} className="text-[#8d8d8d] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[#8d8d8d] block">Event:</span>
                <span className="text-base font-semibold text-white">{selectedOrder.event_name}</span>
                <span className="text-xs text-[#8cd6b0] block">{selectedOrder.eo_name} ({selectedOrder.eo_contact})</span>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-[#141414] p-3 rounded border border-[#2e2e2e]">
                <div>
                  <span className="text-[#8d8d8d] block">Tanggal:</span>
                  <span className="text-white font-medium">{selectedOrder.rental_date} ({selectedOrder.duration})</span>
                </div>
                <div>
                  <span className="text-[#8d8d8d] block">Nilai Sewa:</span>
                  <span className="text-white font-semibold text-sm">{formatRupiah(selectedOrder.total_amount)}</span>
                </div>
              </div>

              <div>
                <span className="text-[#8d8d8d] block">Item Alat:</span>
                <p className="bg-[#141414] p-2.5 rounded border border-[#2e2e2e] mt-1 text-white">
                  {selectedOrder.items}
                </p>
              </div>

              <div>
                <span className="text-[#8d8d8d] block">Venue & Catatan:</span>
                <span className="text-white block">{selectedOrder.venue}</span>
                <span className="text-[#8d8d8d] text-[11px] block mt-0.5">Catatan: {selectedOrder.notes || '-'}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#2e2e2e] flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-[#242424] hover:bg-[#2b2b2b] text-white rounded text-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
