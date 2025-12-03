import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { rentalsDb, itemsDb } from '@/lib/db';

// Force dynamic rendering since we use cookies
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Please login first' },
        { status: 401 }
      );
    }

    const { rentalId, paymentMethod, paymentId } = await request.json();

    if (!rentalId || !paymentMethod) {
      return NextResponse.json(
        { error: 'Missing required information' },
        { status: 400 }
      );
    }

    const rental = await rentalsDb.getById(rentalId);
    if (!rental) {
      return NextResponse.json(
        { error: 'Rental not found' },
        { status: 404 }
      );
    }

    if (rental.userId !== user.userId) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 403 }
      );
    }

    await rentalsDb.update(rentalId, {
      status: 'confirmed',
      paymentId: paymentId || `pay_${Date.now()}`,
    });

    await itemsDb.update(rental.itemId, { available: false });

    const updatedRental = await rentalsDb.getById(rentalId);
    return NextResponse.json({
      message: 'Payment successful',
      rental: updatedRental,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Payment processing failed' },
      { status: 500 }
    );
  }
}

