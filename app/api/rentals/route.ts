import { NextRequest, NextResponse } from 'next/server';
import { rentalsDb, itemsDb } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const rentals = await rentalsDb.getByUserId(user.userId);
    return NextResponse.json(rentals);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch rentals' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Please login first' },
        { status: 401 }
      );
    }

    const { itemId, startDate, endDate, paymentMethod } = await request.json();

    if (!itemId || !startDate || !endDate || !paymentMethod) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const item = await itemsDb.getById(itemId);
    if (!item) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    if (!item.available) {
      return NextResponse.json(
        { error: 'Item is currently unavailable' },
        { status: 400 }
      );
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const totalPrice = days * item.pricePerDay;

    const rental = {
      id: Date.now().toString(),
      userId: user.userId,
      itemId,
      startDate,
      endDate,
      totalPrice,
      status: 'pending' as const,
      paymentMethod: paymentMethod as 'paypal' | 'credit_card',
      createdAt: new Date().toISOString(),
    };

    await rentalsDb.create(rental);

    return NextResponse.json(rental, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create rental' },
      { status: 500 }
    );
  }
}

