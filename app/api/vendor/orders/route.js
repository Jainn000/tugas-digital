import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getRentalOrders, updateRentalOrderStatus } from '@/lib/db';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'vendor' && user.role !== 'admin')) {
      return NextResponse.json({ error: 'Akses terbatas untuk akun vendor.' }, { status: 403 });
    }

    const orders = await getRentalOrders();

    const pendingCount = orders.filter(o => o.status === 'Pending').length;
    const confirmedCount = orders.filter(o => o.status === 'Confirmed').length;
    const processingCount = orders.filter(o => o.status === 'Processing').length;
    const completedCount = orders.filter(o => o.status === 'Completed').length;

    return NextResponse.json({
      success: true,
      orders,
      counts: {
        total: orders.length,
        pending: pendingCount,
        confirmed: confirmedCount,
        processing: processingCount,
        completed: completedCount,
      },
    });
  } catch (err) {
    return NextResponse.json({ error: 'Gagal mengambil data rental orders.' }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'vendor' && user.role !== 'admin')) {
      return NextResponse.json({ error: 'Akses terbatas untuk akun vendor.' }, { status: 403 });
    }

    const body = await req.json();
    const { order_id, status } = body;

    if (!order_id || !status) {
      return NextResponse.json({ error: 'Order ID dan status baru wajib disertakan.' }, { status: 400 });
    }

    const updated = await updateRentalOrderStatus(order_id, status);
    if (!updated) {
      return NextResponse.json({ error: 'Pesanan rental tidak ditemukan.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Status pesanan rental berhasil diubah menjadi ${status}.`,
      order: updated,
    });
  } catch (err) {
    return NextResponse.json({ error: 'Gagal memperbarui status rental order.' }, { status: 500 });
  }
}
