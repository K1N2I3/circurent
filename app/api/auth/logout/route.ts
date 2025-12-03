import { NextResponse } from 'next/server';

// Force dynamic rendering since we use cookies
export const dynamic = 'force-dynamic';

export async function POST() {
  const response = NextResponse.json({ message: 'Logout successful' });
  response.cookies.delete('token');
  return response;
}

