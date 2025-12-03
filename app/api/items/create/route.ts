import { NextRequest, NextResponse } from 'next/server';
import { itemsDb, usersDb } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// Create a new item
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, description, category, pricePerDay, imageUrl, available = true } = body;

    // Validation
    if (!name || !description || !category || !pricePerDay) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (pricePerDay <= 0) {
      return NextResponse.json(
        { error: 'Price must be greater than 0' },
        { status: 400 }
      );
    }

    // Get user data for ownerName
    const userData = await usersDb.getById(user.userId);
    if (!userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Create new item
    const newItem = {
      id: Date.now().toString(),
      name,
      description,
      category,
      pricePerDay: Number(pricePerDay),
      image: '📦', // Default emoji
      imageUrl: imageUrl || undefined,
      available: available !== false,
      ownerName: userData.name,
      userId: user.userId,
    };

    await itemsDb.create(newItem);

    return NextResponse.json(
      { message: 'Item created successfully', item: newItem },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating item:', error);
    return NextResponse.json(
      { error: 'Failed to create item' },
      { status: 500 }
    );
  }
}

