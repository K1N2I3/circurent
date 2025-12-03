import { NextRequest, NextResponse } from 'next/server';
import { itemsDb } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// Get all items owned by the current user
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const allItems = await itemsDb.getAll();
    const userItems = allItems.filter(item => item.userId === user.userId);
    
    // Remove duplicates based on ID (in case of duplicate inserts)
    const uniqueItems = Array.from(
      new Map(userItems.map(item => [item.id, item])).values()
    );

    return NextResponse.json(uniqueItems);
  } catch (error) {
    console.error('Error fetching user items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user items' },
      { status: 500 }
    );
  }
}

