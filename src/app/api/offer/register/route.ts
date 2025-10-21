import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { addEntry, findActiveEntryByPhone } from '@/lib/db';

function generateCode(): string {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
}

const VALIDITY_DAYS = 30;

function validatePhoneNumber(phone: string): { valid: boolean; error?: string } {
  // Kolla grundläggande format
  const cleaned = phone.replace(/[\s-]/g, '');
  const regex = /^0[1-9]\d{8,9}$/;
  
  if (!regex.test(cleaned)) {
    return { valid: false, error: 'Ogiltigt telefonnummerformat' };
  }

  // Kolla efter upprepade siffror (mer än 7 samma siffra i rad)
  if (/(\d)\1{7,}/.test(cleaned)) {
    return { valid: false, error: 'Telefonnumret verkar ogiltigt' };
  }

  // Kolla efter sekvenser av upprepade siffror (t.ex. 070111111111)
  const digits = cleaned.split('');
  let consecutiveCount = 1;
  let maxConsecutive = 1;
  
  for (let i = 1; i < digits.length; i++) {
    if (digits[i] === digits[i - 1]) {
      consecutiveCount++;
      maxConsecutive = Math.max(maxConsecutive, consecutiveCount);
    } else {
      consecutiveCount = 1;
    }
  }
  
  // Om mer än 6 siffror i rad är samma, avvisa
  if (maxConsecutive > 6) {
    return { valid: false, error: 'Telefonnumret verkar ogiltigt' };
  }

  // Kolla efter sekvenser (123456789 eller 987654321)
  const hasAscendingSequence = /(?:0123456789|123456789|012345678|12345678)/.test(cleaned);
  const hasDescendingSequence = /(?:9876543210|987654321|876543210|87654321)/.test(cleaned);
  
  if (hasAscendingSequence || hasDescendingSequence) {
    return { valid: false, error: 'Telefonnumret verkar ogiltigt' };
  }

  // Kolla efter mönster där alla siffror utom prefix är samma
  const afterPrefix = cleaned.substring(3); // Efter t.ex. "070"
  const uniqueDigits = new Set(afterPrefix.split('')).size;
  
  if (uniqueDigits <= 2 && afterPrefix.length >= 7) {
    return { valid: false, error: 'Telefonnumret verkar ogiltigt' };
  }

  return { valid: true };
}

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber } = await request.json();

    if (!phoneNumber || typeof phoneNumber !== 'string') {
      return NextResponse.json(
        { error: 'Ogiltigt mobilnummer' },
        { status: 400 }
      );
    }

    // Validera telefonnumret
    const validation = validatePhoneNumber(phoneNumber);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
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