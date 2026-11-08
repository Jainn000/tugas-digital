import { NextResponse } from 'next/server';
import { getUserByEmail, createUser } from '@/lib/db';
import { hashPassword, createSessionToken, TOKEN_NAME } from '@/lib/auth';

export async function POST(req) {
  try {
    const { name, email, password, phone, address, role } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Nama, email, dan password wajib diisi.' }, { status: 400 });
    }

    const existing = await getUserByEmail(email);
    if (existing) {
      return NextResponse.json({ error: 'Email sudah terdaftar. Silakan login.' }, { status: 400 });
    }

    const assignedRole = role === 'admin' ? 'admin' : role === 'vendor' ? 'vendor' : 'user';

    const hashedPassword = await hashPassword(password);
    const newUser = await createUser({
      name,
      email,
      password: hashedPassword,
      role: assignedRole,
      phone: phone || '',
      address: address || '',
    });

    const token = await createSessionToken({
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Pendaftaran akun berhasil.',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
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
    return NextResponse.json({ error: err.message || 'Gagal mendaftar akun.' }, { status: 500 });
  }
}
