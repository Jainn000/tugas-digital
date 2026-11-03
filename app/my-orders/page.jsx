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
  }, [router]);

  return (
    <div className="max-w-5xl mx-auto my-10 px-4 space-y-8">
      <div className="border-b border-[#383838] pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-poppins font-semibold text-2xl sm:text-3xl text-white">
            Reservasi & Tiket Saya
          </h1>
          <p className="font-inter text-xs text-[#bdbdbd] mt-1">
            Riwayat pemesanan paket acara, tiket festival musik, dan cetak invoice resmi KINETIK.
          </p>
        </div>
        <Link
          href="/"
          className="px-4 py-2 rounded-[6px] bg-[#171717] border border-[#383838] text-white hover:border-[#ff6b35] text-xs font-semibold flex items-center gap-1.5 self-start transition-colors"
        >
          <Ticket className="w-4 h-4 text-[#ff6b35]" />
          <span>Pesan Layanan / Tiket Baru</span>
        </Link>
      </div>

      {loading ? (
        <div className="bg-[#242424] border border-[#383838] rounded-[10px] p-12 text-center">
          <div className="w-7 h-7 border-2 border-[#383838] border-t-[#ff6b35] rounded-full animate-spin mx-auto mb-3"></div>
          <p className="font-inter text-sm text-[#bdbdbd]">Memuat riwayat reservasi...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-[#242424] border border-[#383838] rounded-[10px] p-12 text-center space-y-4" data-ui="empty-orders">
          <Ticket className="w-12 h-12 mx-auto text-[#666666]" />
          <h2 className="font-poppins font-medium text-lg text-white">Belum Ada Reservasi Acara</h2>
          <p className="font-inter text-xs text-[#8d8d8d] max-w-sm mx-auto">
            Anda belum memiliki riwayat pemesanan paket event atau tiket festival.
          </p>
          <Link
            href="/"
            className="px-5 py-2.5 rounded-[6px] bg-[#ff6b35] text-[#171717] hover:bg-[#e5531e] text-xs font-semibold inline-flex items-center gap-2 transition-colors"
          >
            <span>Buka Katalog Acara</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const isPaid = order.payment_status === 'paid';
            return (
              <div key={order.id} className="bg-[#242424] border border-[#383838] rounded-[10px] p-6 space-y-4" data-ui="order-card">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#383838] pb-3">
                  <div>
                    <span className="font-poppins font-semibold text-sm text-white">
                      {order.order_number}
                    </span>
                    <span className="text-[#8d8d8d] text-xs ml-2 font-inter">
                      • {formatSimpleDate(order.created_at)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                        isPaid
                          ? 'bg-[#8cd6b0]/15 text-[#8cd6b0] border-[#8cd6b0]/30'
                          : 'bg-[#ff6b35]/15 text-[#ff6b35] border-[#ff6b35]/30'
                      }`}
                    >
                      {isPaid ? 'Lunas / Aktif' : 'Menunggu Bayar'}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#171717] border border-[#383838] text-[11px] text-[#bdbdbd] font-semibold">
                      {order.order_status.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-7 space-y-1">
                    <p className="text-[11px] font-medium text-[#8d8d8d]">Rincian Layanan / Tiket:</p>
                    <div className="space-y-0.5 text-xs text-[#bdbdbd]">
                      {order.items?.map(it => (
                        <p key={it.id} className="truncate">
                          <strong className="text-white">{it.quantity}x</strong> {it.product_name} ({formatRupiah(it.subtotal)})
                        </p>
                      ))}
                    </div>
                    <p className="text-[11px] text-[#8d8d8d] pt-1">
                      Metode: <span className="text-white font-medium">{order.payment_method.replace('_', ' ')}</span>
                    </p>
                  </div>

                  <div className="md:col-span-5 flex flex-col sm:items-end justify-between gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-[#383838]">
                    <div>
                      <span className="text-[11px] text-[#8d8d8d] block sm:text-right">Total Transaksi</span>
                      <span className="text-xl font-bold font-poppins text-white sm:text-right block">
                        {formatRupiah(order.total_amount)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/orders/${order.order_number}`}
                        className="px-3.5 py-1.5 rounded-[6px] bg-[#171717] border border-[#383838] text-white hover:border-[#ff6b35] hover:text-[#ff6b35] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Faktur / Tiket</span>
                      </Link>

                      {!isPaid && (
                        <Link
                          href={`/orders/${order.order_number}`}
                          className="px-3.5 py-1.5 rounded-[6px] bg-[#ff6b35] text-[#171717] hover:bg-[#e5531e] text-xs font-semibold flex items-center gap-1.5 transition-colors"
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
