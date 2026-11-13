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

    const paymentMode = (process.env.QRIS_PAYMENT_MODE || process.env.PAYMENT_GATEWAY_MODE || 'production').toLowerCase();
    const isSandbox = paymentMode === 'sandbox';

    if (status === 'success') {
      const updated = await updateOrderStatus(order_number, 'paid', 'processing');
      return NextResponse.json({
        success: true,
        mode: isSandbox ? 'sandbox' : 'production',
        message: isSandbox 
          ? 'Simulasi pembayaran sukses (Sandbox)! Status otomatis terupdate menjadi LUNAS.'
          : 'Pembayaran sukses diverifikasi! Status pesanan kini LUNAS.',
        gateway_response: {
          transaction_id: isSandbox ? `TRX-SANDBOX-${Date.now()}` : `TRX-KINETIK-${Date.now()}`,
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
        mode: isSandbox ? 'sandbox' : 'production',
        message: isSandbox
          ? 'Simulasi pembayaran gagal / dibatalkan pengguna.'
          : 'Pembayaran gagal diverifikasi atau dibatalkan.',
        order: updated,
      });
    }
  } catch (err) {
    return NextResponse.json({ error: err.message || 'Gagal memproses simulasi pembayaran.' }, { status: 500 });
  }
}
