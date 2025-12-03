import { NextRequest, NextResponse } from 'next/server';
import { usersDb } from '@/lib/db';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.trim()) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Basic email format validation
    if (!email.includes('@') || !email.includes('.')) {
      return NextResponse.json(
        { available: false, message: 'Invalid email format' },
        { status: 200 }
      );
    }

    // Check if email already exists
    const existingUser = await usersDb.getByEmail(email.trim().toLowerCase());

    if (existingUser) {
      return NextResponse.json(
        { 
          available: false, 
          message: 'Email already registered' 
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { 
        available: true, 
        message: 'Email is available' 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error checking email:', error);
    return NextResponse.json(
      { 
        available: false, 
        message: 'Error checking email availability' 
      },
      { status: 500 }
    );
  }
}

