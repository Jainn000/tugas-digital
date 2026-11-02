import { NextResponse } from 'next/server';
import { getOrderByNumber, updateOrderStatus } from '@/lib/db';

export async function POST(req) {
  try {
    const { order_number, status = 'success' } = await req.json();

    if (!order_number) {
      return NextResponse.json({ error: 'Nomor pesanan wajib disertakan.' }, { status: 400 });
    }

    const order = await getOrderByNumber(order_number);
    if (!order) {
      return NextResponse.json({ error: 'Pesanan tidak ditemukan.' }, { status: 404 });
    }

    if (order.payment_status === 'paid') {
      return NextResponse.json({
        success: true,
        message: 'Pesanan ini sudah dibayar sebelumnya.',
        order,
      });
    }

    if (status === 'success') {
      const updated = await updateOrderStatus(order_number, 'paid', 'processing');
      return NextResponse.json({
        success: true,
        message: 'Simulasi pembayaran sukses! Status otomatis terupdate menjadi LUNAS.',
        gateway_response: {
          transaction_id: `TRX-GATEWAY-${Date.now()}`,
          status: 'SETTLEMENT',
          payment_type: order.payment_method,
          gross_amount: order.total_amount,
          settlement_time: new Date().toISOString(),
        },
        order: updated,
      });
    } else {
      const updated = await updateOrderStatus(order_number, 'failed', 'cancelled');
      return NextResponse.json({
        success: false,
        message: 'Simulasi pembayaran gagal / dibatalkan pengguna.',
        order: updated,
      });
    }
  } catch (err) {
    return NextResponse.json({ error: err.message || 'Gagal memproses simulasi pembayaran.' }, { status: 500 });
  }
}
