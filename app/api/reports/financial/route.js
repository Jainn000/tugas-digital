import { NextResponse } from 'next/server';
import { getFinancialStatement, addExpense } from '@/lib/db';
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

    const statement = await getFinancialStatement(startDate, endDate);
    return NextResponse.json({ success: true, statement });
  } catch (err) {
    return NextResponse.json({ error: err.message || 'Gagal memuat laporan keuangan.' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getCurrentUser();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Akses ditolak. Khusus Admin.' }, { status: 403 });
    }

    const body = await req.json();
    const { expense_title, category, amount, expense_date, notes } = body;

    if (!expense_title || !category || !amount || !expense_date) {
      return NextResponse.json({ error: 'Judul pengeluaran, kategori, nominal, dan tanggal wajib diisi.' }, { status: 400 });
    }

    const created = await addExpense({
      expense_title,
      category,
      amount: Number(amount),
      expense_date,
      notes: notes || '',
    });

    return NextResponse.json({ success: true, expense: created });
  } catch (err) {
    return NextResponse.json({ error: err.message || 'Gagal menambah data pengeluaran.' }, { status: 500 });
  }
}
