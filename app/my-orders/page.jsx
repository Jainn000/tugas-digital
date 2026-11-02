'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatRupiah, formatSimpleDate } from '@/lib/format';
import { Ticket, ArrowRight, Printer } from 'lucide-react';

export default function MyOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/orders?my_orders=true')
      .then(res => {
        if (res.status === 401) {
          router.push('/login');
          return null;
        }
        return res.json();
      })
      .then(data => {
        if (data && data.orders) {
          setOrders(data.orders);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto my-10 px-4 space-y-8">
      <div className="border-b-2 border-black pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
            Reservasi & Tiket Saya
          </h1>
          <p className="text-sm font-bold text-neutral-600 mt-1">
            Riwayat booking paket event, tiket festival musik, dan cetak e-ticket / invoice resmi.
          </p>
        </div>
        <Link href="/" className="nb-btn nb-btn-white px-4 py-2 text-xs flex items-center gap-1.5 self-start font-bold">
          <Ticket className="w-4 h-4 stroke-[2.5]" /> Pesan Paket / Tiket Baru
        </Link>
      </div>

      {loading ? (
        <div className="nb-card bg-white p-12 text-center">
          <p className="font-bold text-lg">Memuat riwayat reservasi dari database...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="nb-card bg-white p-12 text-center space-y-4" data-ui="empty-orders">
          <Ticket className="w-16 h-16 mx-auto text-neutral-400 stroke-[1.5]" />
          <h2 className="text-xl font-bold">Belum Ada Reservasi Acara</h2>
          <p className="text-sm text-neutral-600 font-medium">
            Anda belum memiliki riwayat reservasi atau tiket festival. Mulai pesan dari katalog layanan.
          </p>
          <Link href="/" className="nb-btn nb-btn-yellow px-5 py-2.5 text-sm inline-flex items-center gap-2 font-bold">
            Buka Katalog Acara <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const isPaid = order.payment_status === 'paid';
            return (
              <div key={order.id} className="nb-card bg-white p-6 space-y-4" data-ui="order-card">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-black pb-3">
                  <div>
                    <span className="text-sm font-bold text-black">
                      {order.order_number}
                    </span>
                    <span className="text-neutral-600 text-xs font-bold ml-2">
                      • {formatSimpleDate(order.created_at)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`nb-tag text-xs font-bold ${
                        isPaid
                          ? 'bg-[#A3E635] text-black'
                          : 'bg-[#FF5C00] text-white'
                      }`}
                    >
                      {isPaid ? 'Lunas / Aktif' : 'Menunggu Bayar'}
                    </span>
                    <span className="nb-tag bg-black text-white text-xs font-bold">
                      {order.order_status.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-7 space-y-1">
                    <p className="text-xs font-bold text-neutral-600">Rincian Layanan / Tiket:</p>
                    <div className="space-y-0.5 text-xs font-medium">
                      {order.items?.map(it => (
                        <p key={it.id} className="truncate">
                          <strong>{it.quantity}x</strong> {it.product_name} ({formatRupiah(it.subtotal)})
                        </p>
                      ))}
                    </div>
                    <p className="text-xs text-neutral-600 font-bold pt-1">
                      Metode: {order.payment_method.replace('_', ' ')}
                    </p>
                  </div>

                  <div className="md:col-span-5 flex flex-col sm:items-end justify-between gap-3 pt-2 md:pt-0 border-t-2 md:border-t-0 border-black">
                    <div>
                      <span className="text-xs font-bold text-neutral-600 block sm:text-right">Total Transaksi</span>
                      <span className="text-xl font-bold text-black sm:text-right block">
                        {formatRupiah(order.total_amount)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/orders/${order.order_number}`}
                        className="nb-btn nb-btn-yellow px-3 py-1.5 text-xs flex items-center gap-1.5 font-bold"
                      >
                        <Printer className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Cetak E-Ticket / Invoice</span>
                      </Link>

                      {!isPaid && (
                        <Link
                          href={`/orders/${order.order_number}`}
                          className="nb-btn nb-btn-orange px-3 py-1.5 text-xs flex items-center gap-1.5 font-bold"
                        >
                          Bayar Sekarang
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
