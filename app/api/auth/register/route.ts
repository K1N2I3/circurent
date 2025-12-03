import { NextRequest, NextResponse } from 'next/server';
import { usersDb } from '@/lib/db';
import { hashPassword, generateToken } from '@/lib/auth';
import { initItems } from '@/lib/initItems';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, address } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const existingUser = await usersDb.getByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);
    const newUser = {
      id: Date.now().toString(),
      email,
      password: hashedPassword,
      name,
      address: address || '',
      createdAt: new Date().toISOString(),
    };

    await usersDb.create(newUser);
    initItems();

    const token = generateToken({ userId: newUser.id, email: newUser.email });

    const response = NextResponse.json(
      { message: 'Registration successful', user: { id: newUser.id, email: newUser.email, name: newUser.name } },
      { status: 201 }
    );

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}

