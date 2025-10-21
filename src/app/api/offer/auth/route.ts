import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || 
  crypto.createHash('sha256').update('TheOven2024!').digest('hex');

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: 'Lösenord krävs' },
        { status: 400 }
      );
    }

    const passwordHash = crypto
      .createHash('sha256')
      .update(password)
      .digest('hex');

    if (passwordHash !== ADMIN_PASSWORD_HASH) {
      return NextResponse.json(
        { error: 'Felaktigt lösenord' },
        { status: 401 }
      );
    }

    // Returnera hashen som token
    return NextResponse.json({ 
      success: true,
      token: passwordHash
    });

  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Ett fel uppstod' },
      { status: 500 }
    );
  }
}