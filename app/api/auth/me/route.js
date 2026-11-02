import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getUserById } from '@/lib/db';

export async function GET() {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ user: null });
    }

    const fullUser = await getUserById(session.id);
    return NextResponse.json({
      user: fullUser || { id: session.id, name: session.name, email: session.email, role: session.role },
    });
  } catch (err) {
    return NextResponse.json({ user: null });
  }
}
