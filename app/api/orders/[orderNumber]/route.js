import { NextResponse } from 'next/server';
import { getOrderByNumber, updateOrderStatus } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req, { params }) {
  try {
    const order = await getOrderByNumber(params.orderNumber);
    if (!order) {
      return NextResponse.json({ error: 'Pesanan tidak ditemukan.' }, { status: 404 });
    }
    return NextResponse.json({ order });
  } catch (err) {
    return NextResponse.json({ error: 'Gagal memuat detail pesanan.' }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: 'Harap login terlebih dahulu.' }, { status: 401 });
    }

    const body = await req.json();
    const { payment_status, order_status } = body;

    const existing = await getOrderByNumber(params.orderNumber);
    if (!existing) {
      return NextResponse.json({ error: 'Pesanan tidak ditemukan.' }, { status: 404 });
    }

    // Only admin can change to any status. Regular user can only cancel their own unpaid order.
    if (session.role !== 'admin') {
      if (existing.user_id !== session.id) {
        return NextResponse.json({ error: 'Akses ditolak.' }, { status: 403 });
      }
      if (order_status === 'cancelled' && existing.payment_status === 'unpaid') {
        const updated = await updateOrderStatus(params.orderNumber, 'expired', 'cancelled');
        return NextResponse.json({ success: true, order: updated });
      }
      return NextResponse.json({ error: 'Aksi tidak diizinkan.' }, { status: 403 });
    }

    const updated = await updateOrderStatus(
      params.orderNumber,
      payment_status || existing.payment_status,
      order_status || existing.order_status
    );

    return NextResponse.json({ success: true, order: updated });
  } catch (err) {
    return NextResponse.json({ error: 'Gagal memperbarui status pesanan.' }, { status: 500 });
  }
}
