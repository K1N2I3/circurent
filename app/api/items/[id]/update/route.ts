import { NextRequest, NextResponse } from 'next/server';
import { itemsDb } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// Update item (only owner can update)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const item = await itemsDb.getById(params.id);
    if (!item) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    // Check if user owns this item
    if (item.userId !== user.userId) {
      return NextResponse.json(
        { error: 'Forbidden: You can only update your own items' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const updates: any = {};

    if (body.name !== undefined) updates.name = body.name;
    if (body.description !== undefined) updates.description = body.description;
    if (body.category !== undefined) updates.category = body.category;
    if (body.pricePerDay !== undefined) updates.pricePerDay = Number(body.pricePerDay);
    if (body.imageUrl !== undefined) updates.imageUrl = body.imageUrl;
    if (body.available !== undefined) updates.available = body.available;

    await itemsDb.update(params.id, updates);

    const updatedItem = await itemsDb.getById(params.id);
    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error('Error updating item:', error);
    return NextResponse.json(
      { error: 'Failed to update item' },
      { status: 500 }
    );
  }
}

