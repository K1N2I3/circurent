import { NextRequest, NextResponse } from 'next/server';
import { usersDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

// Get user by ID (public info only)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await usersDb.getById(params.id);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Return public user info only (no password)
    return NextResponse.json({
      id: user.id,
      name: user.name,
      avatarUrl: user.avatarUrl,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

