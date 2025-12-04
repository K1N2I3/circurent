import { NextRequest, NextResponse } from 'next/server';
import { usersDb } from '@/lib/db';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json();

    if (!username || !username.trim()) {
      return NextResponse.json(
        { available: false, message: 'Username is required' },
        { status: 200 }
      );
    }

    const trimmedUsername = username.trim().toLowerCase();

    // Username validation rules
    const usernameRegex = /^[a-z0-9_]{3,20}$/;
    if (!usernameRegex.test(trimmedUsername)) {
      return NextResponse.json(
        { 
          available: false, 
          message: 'Username must be 3-20 characters, only lowercase letters, numbers, and underscores allowed' 
        },
        { status: 200 }
      );
    }

    // Check if username already exists
    const existingUser = await usersDb.getByUsername(trimmedUsername);

    if (existingUser) {
      return NextResponse.json(
        { 
          available: false, 
          message: 'Username already taken' 
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { 
        available: true, 
        message: 'Username is available' 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error checking username:', error);
    return NextResponse.json(
      { 
        available: false, 
        message: 'Error checking username availability' 
      },
      { status: 500 }
    );
  }
}

