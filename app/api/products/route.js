import { NextResponse } from 'next/server';
import { getAllProducts, createProduct, getAllCategories } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('category');
    const categoriesOnly = searchParams.get('categories_only');

    if (categoriesOnly === 'true') {
      const categories = await getAllCategories();
      return NextResponse.json({ categories });
    }

    const products = await getAllProducts(categoryId ? Number(categoryId) : undefined);
    const categories = await getAllCategories();

    return NextResponse.json({ products, categories });
  } catch (err) {
    return NextResponse.json({ error: err.message || 'Gagal memuat produk.' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getCurrentUser();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Akses ditolak. Khusus Admin.' }, { status: 403 });
    }

    const body = await req.json();
    const { name, category_id, price, cost_price, stock, description, image_url } = body;

    if (!name || !price || !category_id) {
      return NextResponse.json({ error: 'Nama, kategori, dan harga jual wajib diisi.' }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4);

    const newProd = await createProduct({
      name,
      slug,
      category_id: Number(category_id),
      price: Number(price),
      cost_price: Number(cost_price) || 0,
      stock: Number(stock) || 0,
      description: description || '',
      image_url: image_url || 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80',
    });

    return NextResponse.json({ success: true, product: newProd });
  } catch (err) {
    return NextResponse.json({ error: err.message || 'Gagal menambahkan produk.' }, { status: 500 });
  }
}
