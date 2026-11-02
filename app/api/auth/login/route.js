import { NextResponse } from 'next/server';
import { getUserByEmail } from '@/lib/db';
import { verifyPassword, createSessionToken, TOKEN_NAME } from '@/lib/auth';

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email dan password wajib diisi.' }, { status: 400 });
    }

    const user = await getUserByEmail(email);
    if (!user || !user.password) {
      return NextResponse.json({ error: 'Email atau password salah.' }, { status: 401 });
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: 'Email atau password salah.' }, { status: 401 });
    }

    const token = await createSessionToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Login berhasil.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    response.cookies.set({
      name: TOKEN_NAME,
      value: token,
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax',
    });

    return response;
  } catch (err) {
    return NextResponse.json({ error: 'Terjadi kesalahan sistem saat login.' }, { status: 500 });
  }
}
