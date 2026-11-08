import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getVendorMessages, sendVendorMessage } from '@/lib/db';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'vendor' && user.role !== 'admin')) {
      return NextResponse.json({ error: 'Akses terbatas untuk akun vendor dan admin.' }, { status: 403 });
    }

    const threads = await getVendorMessages();

    return NextResponse.json({
      success: true,
      threads,
      currentUser: {
        id: user.id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    return NextResponse.json({ error: 'Gagal mengambil percakapan.' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'vendor' && user.role !== 'admin')) {
      return NextResponse.json({ error: 'Akses terbatas.' }, { status: 403 });
    }

    const body = await req.json();
    const { thread_id, message } = body;

    if (!thread_id || !message || !message.trim()) {
      return NextResponse.json({ error: 'Thread ID dan isi pesan tidak boleh kosong.' }, { status: 400 });
    }

    const senderRole = user.role === 'admin' ? 'admin' : 'vendor';
    const senderName = user.name || (user.role === 'admin' ? 'Admin EO' : 'Raya Event Supply');

    const created = await sendVendorMessage(thread_id, senderRole, senderName, message.trim());
    if (!created) {
      return NextResponse.json({ error: 'Thread percakapan tidak ditemukan.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Pesan berhasil dikirim.',
      sentMessage: created,
    });
  } catch (err) {
    return NextResponse.json({ error: 'Gagal mengirim pesan.' }, { status: 500 });
  }
}
