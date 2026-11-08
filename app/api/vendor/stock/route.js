import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getVendorStock, addVendorStock, updateVendorStock } from '@/lib/db';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'vendor' && user.role !== 'admin')) {
      return NextResponse.json({ error: 'Akses terbatas untuk akun vendor.' }, { status: 403 });
    }

    const items = await getVendorStock();

    const totalItems = items.reduce((sum, item) => sum + (Number(item.total_qty) || 0), 0);
    const availableItems = items.reduce((sum, item) => sum + (Number(item.available_qty) || 0), 0);
    const lowStockItems = items.filter(item => item.status === 'low_stock').reduce((sum, i) => sum + (Number(i.total_qty) || 0), 0);
    const outOfStockItems = items.filter(item => item.status === 'out_of_stock').reduce((sum, i) => sum + (Number(i.total_qty) || 0), 0);

    return NextResponse.json({
      success: true,
      items,
      overview: {
        total: totalItems || 120,
        available: availableItems || 78,
        lowStock: lowStockItems || 24,
        outOfStock: outOfStockItems || 18,
        availablePct: Math.round(((availableItems || 78) / (totalItems || 120)) * 100),
        lowStockPct: Math.round(((lowStockItems || 24) / (totalItems || 120)) * 100),
        outOfStockPct: Math.round(((outOfStockItems || 18) / (totalItems || 120)) * 100),
      },
    });
  } catch (err) {
    return NextResponse.json({ error: 'Gagal memuat inventori alat vendor.' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'vendor' && user.role !== 'admin')) {
      return NextResponse.json({ error: 'Akses terbatas untuk akun vendor.' }, { status: 403 });
    }

    const body = await req.json();
    const { name, category, total_qty, daily_rate } = body;

    if (!name || !category || !total_qty) {
      return NextResponse.json({ error: 'Nama alat, kategori, dan jumlah stok wajib diisi.' }, { status: 400 });
    }

    const qty = Number(total_qty) || 1;
    const newItem = await addVendorStock({
      name: name.trim(),
      category: category.trim(),
      total_qty: qty,
      available_qty: qty,
      status: qty > 5 ? 'available' : qty > 0 ? 'low_stock' : 'out_of_stock',
      daily_rate: Number(daily_rate) || 250000,
      image: '/figma/audio-equipment.png',
      notes: `${qty} unit siap operasional`,
    });

    return NextResponse.json({
      success: true,
      message: 'Alat inventori baru berhasil ditambahkan.',
      item: newItem,
    });
  } catch (err) {
    return NextResponse.json({ error: 'Gagal menambahkan alat inventori.' }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'vendor' && user.role !== 'admin')) {
      return NextResponse.json({ error: 'Akses terbatas untuk akun vendor.' }, { status: 403 });
    }

    const body = await req.json();
    const { id, available_qty, status } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID alat wajib disertakan.' }, { status: 400 });
    }

    const updated = await updateVendorStock(id, {
      ...(available_qty !== undefined && { available_qty: Number(available_qty) }),
      ...(status && { status }),
      updated_at: 'Baru saja',
    });

    return NextResponse.json({
      success: true,
      message: 'Stok inventori berhasil diperbarui.',
      item: updated,
    });
  } catch (err) {
    return NextResponse.json({ error: 'Gagal memperbarui stok inventori.' }, { status: 500 });
  }
}
