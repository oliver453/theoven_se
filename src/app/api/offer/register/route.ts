import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { addEntry, findActiveEntryByPhone } from '@/lib/db';

function generateCode(): string {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
}

const VALIDITY_DAYS = 30;

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber } = await request.json();

    if (!phoneNumber || typeof phoneNumber !== 'string') {
      return NextResponse.json(
        { error: 'Ogiltigt mobilnummer' },
        { status: 400 }
      );
    }

    // Kolla om numret redan har en giltig kod
    const existingEntry = await findActiveEntryByPhone(phoneNumber);

    if (existingEntry) {
      return NextResponse.json(
        { error: 'Detta nummer är redan registrerat' },
        { status: 409 }
      );
    }

    // Generera unik kod
    const code = generateCode();
    
    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setDate(expiresAt.getDate() + VALIDITY_DAYS);

    await addEntry({
      phone_number: phoneNumber,
      code,
      created_at: now.toISOString(),
      expires_at: expiresAt.toISOString(),
      used: false
    });

    return NextResponse.json({ 
      success: true, 
      code 
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Ett fel uppstod vid registreringen' },
      { status: 500 }
    );
  }
}