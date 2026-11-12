import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getOrderByNumber, updateOrderStatus } from '@/lib/db';

export async function GET() {
  return NextResponse.json({
    name: 'KINETIK Payment Gateway Webhook Endpoint',
    status: 'active',
    instructions: {
      webhook_url: 'http://localhost:3000/api/payment/webhook',
      method: 'POST',
      accepted_headers: ['x-webhook-signature', 'x-webhook-event', 'x-api-key', 'x-callback-token', 'authorization'],
      supported_gateways: ['AkuQRIS (Autoko)', 'Midtrans', 'Xendit', 'Tripay', 'Custom Gateway / Direct Webhook'],
      akuqris_config: {
        api_key_header: 'x-api-key',
        signature_header: 'x-webhook-signature',
        event_header: 'x-webhook-event',
        secret_registered: process.env.AKUQRIS_WEBHOOK_SECRET ? 'Yes' : 'Default'
      }
    }
  });
}

export async function POST(req) {
  try {
    const rawText = await req.text();
    let body = {};
    try {
      body = JSON.parse(rawText);
    } catch (e) {
      return NextResponse.json({ error: 'Format JSON payload tidak valid.' }, { status: 400 });
    }

    const akuqrisSignature = req.headers.get('x-webhook-signature');
    const akuqrisEvent = req.headers.get('x-webhook-event') || body.event;
    const rawApiKey = req.headers.get('x-api-key') || 
                      req.headers.get('x-callback-token') || 
                      req.headers.get('authorization')?.replace('Bearer ', '');

    const akuqrisSecret = process.env.AKUQRIS_WEBHOOK_SECRET || 'bd9dd1b1699672c82c5c246c742d47cc95c33389cffb0f502ac95c44c86740cc';
    const serverKey = process.env.PAYMENT_GATEWAY_API_KEY || 'kinetik_sec_live_99a82bc1f832';

    // 1. Verifikasi Signature HMAC-SHA256 untuk AkuQRIS / Autoko
    if (akuqrisSignature) {
      const expectedSignature = crypto
        .createHmac('sha256', akuqrisSecret)
        .update(rawText)
        .digest('hex');

      if (akuqrisSignature !== expectedSignature) {
        return NextResponse.json({ 
          error: 'Akses ditolak: X-Webhook-Signature AkuQRIS tidak cocok dengan secret key.' 
        }, { status: 401 });
      }
    } else if (rawApiKey) {
      // Verifikasi API Key standar (Midtrans / Xendit / Local Simulator)
      if (rawApiKey !== serverKey && rawApiKey !== process.env.AKUQRIS_API_KEY) {
        return NextResponse.json({ 
          error: 'Akses ditolak: API Key atau Secret webhook tidak valid.' 
        }, { status: 401 });
      }
    }

    // 2. Tangani event uji coba AkuQRIS (saat tombol "Tes" di dashboard diklik)
    if (akuqrisEvent === 'payment.test') {
      return NextResponse.json({
        success: true,
        message: 'Ping webhook test (payment.test) dari AkuQRIS berhasil diterima dan diverifikasi.',
        event: 'payment.test',
        timestamp: new Date().toISOString()
      }, { status: 200 });
    }

    // 3. Ekstraksi nomor pesanan
    const orderNumber = body.externalId || 
                        body.external_id || 
                        body.order_id || 
                        body.order_number || 
                        body.invoiceCode;

    if (!orderNumber) {
      return NextResponse.json({ 
        error: 'Parameter nomor order (externalId/order_id/order_number) tidak ditemukan.' 
      }, { status: 400 });
    }

    const order = await getOrderByNumber(orderNumber);
    if (!order) {
      return NextResponse.json({ 
        error: `Pesanan dengan nomor ${orderNumber} tidak terdaftar di database.` 
      }, { status: 404 });
    }

    // 4. Normalisasi status pembayaran (AkuQRIS: 'completed' / 'PAID', Midtrans: 'settlement', dsb.)
    const rawStatus = (
      body.status || 
      body.paymentStatus || 
      body.transaction_status || 
      body.status_code || 
      ''
    ).toString().toLowerCase();

    let newPaymentStatus = 'unpaid';
    let newOrderStatus = order.order_status;

    if (
      rawStatus === 'completed' || 
      rawStatus === 'paid' || 
      rawStatus === 'settlement' || 
      rawStatus === 'capture' || 
      rawStatus === 'success' ||
      rawStatus === '200'
    ) {
      newPaymentStatus = 'paid';
      newOrderStatus = 'processing';
    } else if (rawStatus === 'expired' || rawStatus === 'expire') {
      newPaymentStatus = 'expired';
      newOrderStatus = 'cancelled';
    } else if (rawStatus === 'failed' || rawStatus === 'deny' || rawStatus === 'cancel') {
      newPaymentStatus = 'failed';
      newOrderStatus = 'cancelled';
    }

    const updated = await updateOrderStatus(orderNumber, newPaymentStatus, newOrderStatus);

    return NextResponse.json({
      success: true,
      message: `Webhook berhasil diproses: Order ${orderNumber} kini berstatus ${newPaymentStatus.toUpperCase()}.`,
      order_number: orderNumber,
      payment_status: newPaymentStatus,
      order_status: newOrderStatus,
      updated_order: updated,
      received_payload: body
    }, { status: 200 });

  } catch (err) {
    return NextResponse.json({ 
      error: 'Terjadi kesalahan pemrosesan webhook internal.',
      details: err.message 
    }, { status: 500 });
  }
}
