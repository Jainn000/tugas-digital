import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { addVendorClaim } from '@/lib/db';

export async function POST(req) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'vendor' && user.role !== 'admin')) {
      return NextResponse.json(
        { error: 'Akses terbatas untuk akun mitra vendor.' },
        { status: 403 }
      );
    }

    const { spk_number, event_name, claim_title, amount, notes } = await req.json();

    if (!claim_title || !amount || Number(amount) <= 0) {
      return NextResponse.json(
        { error: 'Judul klaim dan nominal biaya wajib diisi dengan benar.' },
        { status: 400 }
      );
    }

    const newExpense = await addVendorClaim({
      spk_number: spk_number || 'SPK-GENERAL',
      event_name: event_name || 'Operasional Lapangan',
      claim_title,
      amount: Number(amount),
      notes,
    });

    return NextResponse.json({
      success: true,
      message: 'Klaim operasional vendor berhasil dicatat dan diajukan ke finance EO.',
      expense: newExpense,
    });
  } catch (err) {
    return NextResponse.json(
      { error: 'Gagal mengajukan klaim operasional vendor.' },
      { status: 500 }
    );
  }
}
