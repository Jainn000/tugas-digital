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
          <h2 className="text-2xl font-black uppercase">Manajemen Reservasi & Booking Acara</h2>
          <p className="text-xs font-bold text-neutral-600">
            Daftar booking paket event dan tiket festival dari klien, verifikasi status bayar, serta cetak dokumen invoice resmi.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 self-start">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 text-xs font-black uppercase border-2 border-black ${
              statusFilter === 'all' ? 'bg-black text-white' : 'bg-white'
            }`}
          >
            Semua ({orders.length})
          </button>
          <button
            onClick={() => setStatusFilter('paid')}
            className={`px-3 py-1.5 text-xs font-black uppercase border-2 border-black ${
              statusFilter === 'paid' ? 'bg-[#A3E635] text-black' : 'bg-white'
            }`}
          >
            Lunas ({orders.filter(o => o.payment_status === 'paid').length})
          </button>
          <button
            onClick={() => setStatusFilter('unpaid')}
            className={`px-3 py-1.5 text-xs font-black uppercase border-2 border-black ${
              statusFilter === 'unpaid' ? 'bg-[#FF5C00] text-white' : 'bg-white'
            }`}
          >
            Belum Lunas ({orders.filter(o => o.payment_status !== 'paid').length})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="nb-card bg-white p-12 text-center">
          <p className="font-black text-lg">Memuat daftar pesanan...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="nb-card bg-white p-12 text-center">
          <p className="font-black text-base">Tidak ada transaksi ditemukan.</p>
        </div>
      ) : (
        <div className="nb-card bg-white overflow-hidden" data-ui="admin-orders-table">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FFFDF0] border-b-2 border-black uppercase font-black">
                <tr>
                  <th className="p-3 border-r-2 border-black">No. Order</th>
                  <th className="p-3 border-r-2 border-black">Pemesan & Kontak PIC</th>
                  <th className="p-3 border-r-2 border-black">Layanan / Tiket</th>
                  <th className="p-3 border-r-2 border-black">Metode Bayar</th>
                  <th className="p-3 border-r-2 border-black text-right">Total Investasi</th>
                  <th className="p-3 border-r-2 border-black">Status Pembayaran</th>
                  <th className="p-3 border-r-2 border-black">Status Pelaksanaan</th>
                  <th className="p-3 text-center">Aksi / Cetak</th>
                </tr>
              </thead>
              <tbody className="font-medium">
                {filteredOrders.map(o => {
                  const isPaid = o.payment_status === 'paid';
                  const isUpdating = updatingId === o.order_number;
                  return (
                    <tr key={o.id} className="hover:bg-neutral-50 border-b-2 border-black">
                      <td className="p-3 border-r-2 border-black font-bold">
                        {o.order_number}
                        <span className="block text-[10px] text-neutral-500 font-sans">
                          {o.created_at.slice(0, 16)}
                        </span>
                      </td>

                      <td className="p-3 border-r-2 border-black font-bold">
                        {o.customer_name}
                        <span className="block text-[10px] text-neutral-500 font-normal">
                          {o.customer_email} • {o.customer_phone}
                        </span>
                      </td>

                      <td className="p-3 border-r-2 border-black max-w-[180px]">
                        <div className="space-y-0.5">
                          {o.items?.map(it => (
                            <p key={it.id} className="truncate text-[11px]">
                              {it.quantity}x {it.product_name}
                            </p>
                          ))}
                        </div>
                      </td>

                      <td className="p-3 border-r-2 border-black font-bold">
                        {o.payment_method}
                        {o.payment_reference && (
                          <span className="block text-[9px] text-neutral-500 truncate max-w-[100px]">
                            {o.payment_reference}
                          </span>
                        )}
                      </td>

                      <td className="p-3 border-r-2 border-black text-right font-black">
                        {formatRupiah(o.total_amount)}
                      </td>

                      <td className="p-3 border-r-2 border-black">
                        <select
                          value={o.payment_status}
                          disabled={isUpdating}
                          onChange={e => handleUpdateStatus(o.order_number, e.target.value, o.order_status)}
                          className={`border-2 border-black p-1 text-[11px] font-black uppercase ${
                            isPaid ? 'bg-[#A3E635]' : 'bg-red-200'
                          }`}
                        >
                          <option value="unpaid">UNPAID (Belum Bayar)</option>
                          <option value="paid">PAID (Lunas)</option>
                          <option value="failed">FAILED (Gagal)</option>
                          <option value="expired">EXPIRED (Kedaluwarsa)</option>
                        </select>
                      </td>

                      <td className="p-3 border-r-2 border-black">
                        <select
                          value={o.order_status}
                          disabled={isUpdating}
                          onChange={e => handleUpdateStatus(o.order_number, o.payment_status, e.target.value)}
                          className="border-2 border-black p-1 text-[11px] font-bold uppercase bg-white"
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
                          className="nb-btn nb-btn-yellow p-1.5 text-xs inline-flex items-center gap-1 font-bold"
                          title="Buka Faktur & Struk"
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
      )}
    </div>
  );
}
