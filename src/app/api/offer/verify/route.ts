import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { findEntryByCode, markAsUsed } from '@/lib/db';

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

// GET: Verifiera kod
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json(
        { valid: false, error: 'Ingen kod angiven' },
        { status: 400 }
      );
    }

    const entry = await findEntryByCode(code);

    if (!entry) {
      return NextResponse.json({
        valid: false,
        reason: 'not_found',
        message: 'Koden hittades inte',
      });
    }

    if (entry.used) {
      return NextResponse.json({
        valid: false,
        reason: 'already_used',
        message: 'Koden har redan använts',
        usedAt: entry.used_at,
      });
    }

    if (new Date(entry.expires_at) <= new Date()) {
      return NextResponse.json({
        valid: false,
        reason: 'expired',
        message: 'Koden har gått ut',
        expiresAt: entry.expires_at,
      });
    }

    // ✅ FIX: Skicka camelCase till frontend
    return NextResponse.json({
      valid: true,
      code: entry.code,
      phoneNumber: entry.phone_number,
      createdAt: entry.created_at,
      expiresAt: entry.expires_at,
      used: entry.used,
      usedAt: entry.used_at,
    });
  } catch (error) {
    console.error('Verify error:', error);
    return NextResponse.json(
      { valid: false, error: 'Ett fel uppstod' },
      { status: 500 }
    );
  }
}

// POST: Markera kod som använd
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!verifyAuth(authHeader)) {
      return NextResponse.json({ error: 'Obehörig' }, { status: 401 });
    }

    const { code } = await request.json();
    if (!code) {
      return NextResponse.json({ error: 'Ingen kod angiven' }, { status: 400 });
    }

    const entry = await findEntryByCode(code);
    if (!entry) {
      return NextResponse.json(
        { error: 'Koden hittades inte' },
        { status: 404 }
      );
    }

    if (entry.used) {
      return NextResponse.json(
        { error: 'Koden har redan använts' },
        { status: 409 }
      );
    }

    if (new Date(entry.expires_at) <= new Date()) {
      return NextResponse.json(
        { error: 'Koden har gått ut' },
        { status: 410 }
      );
    }

    const updated = await markAsUsed(code);

    // ✅ FIX: Skicka camelCase även här
    return NextResponse.json({
      success: true,
      message: 'Koden har markerats som använd',
      usedAt: updated?.used_at,
    });
  } catch (error) {
    console.error('Mark as used error:', error);
    return NextResponse.json(
      { error: 'Ett fel uppstod' },
      { status: 500 }
    );
  }
}
