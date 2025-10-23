import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber } = await request.json();

    if (!phoneNumber || typeof phoneNumber !== 'string') {
      return NextResponse.json(
        { error: 'Ogiltigt mobilnummer' },
        { status: 400 }
      );
    }

    // Ta bort alla entries för detta telefonnummer
    const result = await sql`
      DELETE FROM offer_entries 
      WHERE phone_number = ${phoneNumber}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Inget nummer registrerat med detta telefonnummer' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Ditt nummer har tagits bort från våra utskick',
      removed: result.length
    });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return NextResponse.json(
      { error: 'Ett fel uppstod vid avregistreringen' },
      { status: 500 }
    );
  }
}