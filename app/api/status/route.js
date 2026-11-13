import { NextResponse } from 'next/server';
import { getDatabaseStatus } from '@/lib/db';

export async function GET() {
  const status = await getDatabaseStatus();
  const paymentMode = (process.env.QRIS_PAYMENT_MODE || process.env.PAYMENT_GATEWAY_MODE || 'production').toLowerCase();
  return NextResponse.json({
    ...status,
    payment_mode: paymentMode === 'sandbox' ? 'sandbox' : 'production',
  });
}
