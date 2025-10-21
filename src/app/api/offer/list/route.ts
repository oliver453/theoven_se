import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getAllEntries, getStats } from '@/lib/db';

const ADMIN_PASSWORD_HASH =
  process.env.ADMIN_PASSWORD_HASH ||
  crypto.createHash('sha256').update('TheOven2024!').digest('hex');

function verifyAuth(authHeader: string | null): boolean {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }
  const token = authHeader.substring(7);
  return token === ADMIN_PASSWORD_HASH;
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');

    if (!verifyAuth(authHeader)) {
      return NextResponse.json({ error: 'Obehörig' }, { status: 401 });
    }

    const entries = await getAllEntries();
    const stats = await getStats();

    // 🔧 KONVERTERING TILL camelCase FÖR FRONTEND
    const formattedEntries = entries.map((e) => ({
      id: e.id,
      phoneNumber: e.phone_number,
      code: e.code,
      createdAt: e.created_at,
      expiresAt: e.expires_at,
      used: e.used,
      usedAt: e.used_at,
    }));

    return NextResponse.json({
      entries: formattedEntries,
      ...stats,
    });
  } catch (error) {
    console.error('List error:', error);
    return NextResponse.json({ error: 'Ett fel uppstod' }, { status: 500 });
  }
}
