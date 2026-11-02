import { NextResponse } from 'next/server';
import { getSalesReport } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req) {
  try {
    const session = await getCurrentUser();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Akses ditolak. Khusus Admin.' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate') || undefined;
    const endDate = searchParams.get('endDate') || undefined;
    const paymentStatus = searchParams.get('paymentStatus') || undefined;

    const report = await getSalesReport({
      startDate,
      endDate,
      paymentStatus,
    });

    return NextResponse.json({ success: true, report });
  } catch (err) {
    return NextResponse.json({ error: err.message || 'Gagal memuat laporan penjualan.' }, { status: 500 });
  }
}
