import { NextResponse } from 'next/server';
import { getAllOrders, createOrder, getProductById } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: 'Silakan login terlebih dahulu.' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const filterUser = searchParams.get('my_orders') === 'true';

    // If user is not admin, they can ONLY see their own orders
    const targetUserId = session.role === 'admin' && !filterUser ? undefined : session.id;
    const orders = await getAllOrders(targetUserId);

    return NextResponse.json({ orders });
  } catch (err) {
    return NextResponse.json({ error: err.message || 'Gagal memuat daftar pesanan.' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ 
        error: 'Silakan masuk / login akun terlebih dahulu sebelum melakukan pemesanan.' 
      }, { status: 401 });
    }

    const body = await req.json();
    const {
      customer_name,
      customer_email,
      customer_phone,
      customer_address,
      payment_method,
      items,
      shipping_cost = 0,
    } = body;

    if (!customer_name || !customer_email || !customer_phone || !customer_address || !payment_method || !items || items.length === 0) {
      return NextResponse.json({ error: 'Data formulir pesanan dan item belanja tidak lengkap.' }, { status: 400 });
    }

    // Verify items and calculate subtotal & total cost
    let subtotal = 0;
    let totalCost = 0;
    const verifiedItems = [];

    for (const item of items) {
      const prod = await getProductById(item.product_id);
      if (!prod) {
        return NextResponse.json({ error: `Produk ID ${item.product_id} tidak ditemukan.` }, { status: 400 });
      }
      if (prod.stock < item.quantity) {
        return NextResponse.json({ error: `Stok produk ${prod.name} tidak mencukupi (sisa: ${prod.stock}).` }, { status: 400 });
      }

      const itemPrice = Number(prod.price);
      const itemCost = Number(prod.cost_price);
      const qty = Number(item.quantity);

      subtotal += itemPrice * qty;
      totalCost += itemCost * qty;

      verifiedItems.push({
        product_id: prod.id,
        product_name: prod.name,
        price: itemPrice,
        cost_price: itemCost,
        quantity: qty,
      });
    }

    const shipping = Number(shipping_cost) || 0;
    const totalAmount = subtotal + shipping;

    // Generate unique order number (INV-YYYYMMDD-XXXX)
    const dateCode = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randCode = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `INV-${dateCode}-${randCode}`;

    // Generate payment reference based on method
    let paymentRef = '';
    if (payment_method === 'QRIS') {
      paymentRef = `NMD-QRIS-${dateCode}-${randCode}`;
    } else if (payment_method.includes('VA')) {
      paymentRef = `88019${dateCode.slice(-4)}${randCode}`;
    } else {
      paymentRef = `EWL-${dateCode}-${randCode}`;
    }

    const created = await createOrder(
      {
        order_number: orderNumber,
        user_id: session ? session.id : null,
        customer_name,
        customer_email,
        customer_phone,
        customer_address,
        subtotal,
        tax_amount: 0,
        shipping_cost: shipping,
        total_amount: totalAmount,
        total_cost: totalCost,
        payment_method,
        payment_status: 'unpaid',
        order_status: 'pending',
        payment_reference: paymentRef,
        paid_at: null,
      },
      verifiedItems
    );

    return NextResponse.json({
      success: true,
      message: 'Pesanan berhasil dibuat.',
      order: created,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message || 'Gagal membuat pesanan.' }, { status: 500 });
  }
}
