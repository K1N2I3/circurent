import { NextResponse } from 'next/server';
import { itemsDb } from '@/lib/db';
import { initItems } from '@/lib/initItems';

export async function GET() {
  try {
    await initItems();
    const items = await itemsDb.getAll();
    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch items' },
      { status: 500 }
    );
  }
}

