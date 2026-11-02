import { NextResponse } from 'next/server';
import { getProductById, updateProduct, deleteProduct } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req, { params }) {
  try {
    const product = await getProductById(Number(params.id));
    if (!product) {
      return NextResponse.json({ error: 'Produk tidak ditemukan.' }, { status: 404 });
    }
    return NextResponse.json({ product });
  } catch (err) {
    return NextResponse.json({ error: 'Gagal memuat detail produk.' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const session = await getCurrentUser();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Akses ditolak. Khusus Admin.' }, { status: 403 });
    }

    const body = await req.json();
    const updated = await updateProduct(Number(params.id), {
      category_id: body.category_id ? Number(body.category_id) : undefined,
      name: body.name,
      price: body.price !== undefined ? Number(body.price) : undefined,
      cost_price: body.cost_price !== undefined ? Number(body.cost_price) : undefined,
      stock: body.stock !== undefined ? Number(body.stock) : undefined,
      description: body.description,
      image_url: body.image_url,
    });

    if (!updated) {
      return NextResponse.json({ error: 'Produk tidak ditemukan.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: updated });
  } catch (err) {
    return NextResponse.json({ error: 'Gagal memperbarui produk.' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const session = await getCurrentUser();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Akses ditolak. Khusus Admin.' }, { status: 403 });
    }

    await deleteProduct(Number(params.id));
    return NextResponse.json({ success: true, message: 'Produk berhasil dihapus.' });
  } catch (err) {
    return NextResponse.json({ error: 'Gagal menghapus produk.' }, { status: 500 });
  }
}
