import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getUniquePhoneNumbers } from '@/lib/db';

const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || 
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
      return NextResponse.json(
        { error: 'Obehörig' },
        { status: 401 }
      );
    }

    const uniqueNumbers = await getUniquePhoneNumbers();

    // Skapa CSV med ENDAST telefonnummer
    const csv = uniqueNumbers.join('\n');

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="telefonnummer-${new Date().toISOString().split('T')[0]}.csv"`
      }
    });

  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Ett fel uppstod' },
      { status: 500 }
    );
  }
}