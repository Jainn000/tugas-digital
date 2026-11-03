'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatRupiah } from '@/lib/format';
import { Printer } from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
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

  const handleUpdateStatus = async (orderNumber, paymentStatus, orderStatus) => {
    setUpdatingId(orderNumber);
    try {
      const res = await fetch(`/api/orders/${orderNumber}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payment_status: paymentStatus,
          order_status: orderStatus,
        }),
      });
      if (res.ok) {
        fetchOrders();
      }
    } catch (err) {
      alert('Gagal memperbarui status order.');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter(o => {
    if (statusFilter === 'paid') return o.payment_status === 'paid';
    if (statusFilter === 'unpaid') return o.payment_status !== 'paid';
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-poppins font-semibold text-xl sm:text-2xl text-white">
            Manajemen Reservasi & Booking Acara
          </h2>
          <p className="font-inter text-xs text-[#bdbdbd] mt-1">
            Daftar pesanan paket event dan tiket festival dari klien, verifikasi status pelunasan, dan cetak invoice resmi.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-[6px] transition-colors ${
              statusFilter === 'all'
                ? 'bg-[#38271f] text-white border border-[#ff6b35]'
                : 'bg-[#242424] text-[#bdbdbd] border border-[#383838] hover:text-white'
            }`}
          >
            Semua ({orders.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('paid')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-[6px] transition-colors ${
              statusFilter === 'paid'
                ? 'bg-[#23372d] text-[#8cd6b0] border border-[#8cd6b0]/50'
                : 'bg-[#242424] text-[#bdbdbd] border border-[#383838] hover:text-white'
            }`}
          >
            Lunas ({orders.filter(o => o.payment_status === 'paid').length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('unpaid')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-[6px] transition-colors ${
              statusFilter === 'unpaid'
                ? 'bg-red-950/60 text-red-300 border border-red-800'
                : 'bg-[#242424] text-[#bdbdbd] border border-[#383838] hover:text-white'
            }`}
          >
            Pending ({orders.filter(o => o.payment_status !== 'paid').length})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="bg-[#242424] border border-[#383838] rounded-[10px] p-12 text-center">
          <div className="w-7 h-7 border-2 border-[#383838] border-t-[#ff6b35] rounded-full animate-spin mx-auto mb-3"></div>
          <p className="font-inter text-sm text-[#bdbdbd]">Memuat daftar pesanan...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-[#242424] border border-[#383838] rounded-[10px] p-12 text-center">
          <p className="font-inter text-sm text-[#8d8d8d]">Tidak ada transaksi ditemukan untuk filter ini.</p>
        </div>
      ) : (
        <div className="bg-[#242424] border border-[#383838] rounded-[10px] overflow-hidden" data-ui="admin-orders-table">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#1c1c1c] text-[#8d8d8d] border-b border-[#383838] uppercase font-semibold">
                <tr>
                  <th className="p-3">No. Order</th>
                  <th className="p-3">Pemesan & Kontak</th>
                  <th className="p-3">Layanan / Tiket</th>
                  <th className="p-3">Metode Bayar</th>
                  <th className="p-3 text-right">Total</th>
                  <th className="p-3">Status Bayar</th>
                  <th className="p-3">Pelaksanaan</th>
                  <th className="p-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2e2e2e]">
                {filteredOrders.map(o => {
                  const isPaid = o.payment_status === 'paid';
                  const isUpdating = updatingId === o.order_number;
                  return (
                    <tr key={o.id} className="hover:bg-[#2a2a2a] transition-colors">
                      <td className="p-3 font-semibold text-white">
                        {o.order_number}
                        <span className="block text-[10px] text-[#8d8d8d] font-normal">
                          {o.created_at.slice(0, 16)}
                        </span>
                      </td>

                      <td className="p-3 text-white">
                        <span className="font-semibold">{o.customer_name}</span>
                        <span className="block text-[11px] text-[#8d8d8d]">
                          {o.customer_email} • {o.customer_phone}
                        </span>
                      </td>

                      <td className="p-3 max-w-[200px] text-[#bdbdbd]">
                        <div className="space-y-0.5">
                          {o.items?.map(it => (
                            <p key={it.id} className="truncate text-[11px]">
                              {it.quantity}x {it.product_name}
                            </p>
                          ))}
                        </div>
                      </td>

                      <td className="p-3 text-white">
                        <span className="font-medium">{o.payment_method}</span>
                        {o.payment_reference && (
                          <span className="block text-[10px] text-[#8d8d8d] truncate max-w-[120px]">
                            {o.payment_reference}
                          </span>
                        )}
                      </td>

                      <td className="p-3 text-right font-semibold text-white">
                        {formatRupiah(o.total_amount)}
                      </td>

                      <td className="p-3">
                        <select
                          value={o.payment_status}
                          disabled={isUpdating}
                          onChange={e => handleUpdateStatus(o.order_number, e.target.value, o.order_status)}
                          className={`border rounded-[4px] px-2 py-1 text-[11px] font-semibold uppercase focus:outline-none focus:border-[#ff6b35] ${
                            isPaid
                              ? 'bg-[#23372d] border-[#8cd6b0]/40 text-[#8cd6b0]'
                              : 'bg-red-950/60 border-red-800 text-red-300'
                          }`}
                        >
                          <option value="unpaid">UNPAID (Pending)</option>
                          <option value="paid">PAID (Lunas)</option>
                          <option value="failed">FAILED (Gagal)</option>
                          <option value="expired">EXPIRED (Kedaluwarsa)</option>
                        </select>
                      </td>

                      <td className="p-3">
                        <select
                          value={o.order_status}
                          disabled={isUpdating}
                          onChange={e => handleUpdateStatus(o.order_number, o.payment_status, e.target.value)}
                          className="bg-[#171717] border border-[#383838] text-white rounded-[4px] px-2 py-1 text-[11px] font-medium uppercase focus:outline-none focus:border-[#ff6b35]"
                        >
                          <option value="pending">PENDING</option>
                          <option value="processing">PROCESSING</option>
                          <option value="completed">COMPLETED</option>
                          <option value="cancelled">CANCELLED</option>
                        </select>
                      </td>

                      <td className="p-3 text-center">
                        <Link
                          href={`/orders/${o.order_number}`}
                          className="p-1.5 rounded-[4px] bg-[#171717] border border-[#383838] text-white hover:border-[#ff6b35] hover:text-[#ff6b35] inline-flex items-center gap-1 text-[11px] font-medium transition-colors"
                          title="Buka / Cetak Faktur"
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
      )}
    </div>
  );
}
