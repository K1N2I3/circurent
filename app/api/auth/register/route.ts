import { NextRequest, NextResponse } from 'next/server';
import { usersDb } from '@/lib/db';
import { hashPassword, generateToken } from '@/lib/auth';
import { initItems } from '@/lib/initItems';

// Force dynamic rendering since we use cookies
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { email, password, username, address } = await request.json();

    if (!email || !password || !username) {
      return NextResponse.json(
        { error: 'Email, password, and username are required' },
        { status: 400 }
      );
    }

    // Validate username format
    const trimmedUsername = username.trim().toLowerCase();
    const usernameRegex = /^[a-z0-9_]{3,20}$/;
    if (!usernameRegex.test(trimmedUsername)) {
      return NextResponse.json(
        { error: 'Username must be 3-20 characters, only lowercase letters, numbers, and underscores allowed' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUserByEmail = await usersDb.getByEmail(email);
    if (existingUserByEmail) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Check if username already exists
    const existingUserByUsername = await usersDb.getByUsername(trimmedUsername);
    if (existingUserByUsername) {
      return NextResponse.json(
        { error: 'Username already taken' },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);
    const newUser = {
      id: Date.now().toString(),
      username: trimmedUsername,
      email,
      password: hashedPassword,
      name: undefined, // name is optional, can be set later in profile
      address: address || undefined, // AddressData object or undefined
      createdAt: new Date().toISOString(),
    };

    await usersDb.create(newUser);
    
    // Initialize items in background (don't fail registration if this fails)
    try {
      await initItems();
    } catch (itemsError) {
      // Log error but don't fail registration
      console.error('Error initializing items (non-critical):', itemsError);
    }

    const token = generateToken({ userId: newUser.id, email: newUser.email });

    const response = NextResponse.json(
      { message: 'Registration successful', user: { id: newUser.id, email: newUser.email, username: newUser.username } },
      { status: 201 }
    );

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error('Registration error:', error);
    
    // Provide more detailed error messages
    let errorMessage = 'Registration failed';
    if (error?.message) {
      errorMessage = error.message;
    } else if (error?.code) {
      errorMessage = `Database error: ${error.code}`;
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error?.stack : undefined
      },
      { status: 500 }
    );
  }
}

