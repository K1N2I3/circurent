import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// Upload image to Supabase Storage
export async function POST(request: NextRequest) {
  try {
    const { imageData } = await request.json();

    if (!imageData) {
      return NextResponse.json(
        { error: 'Image data is required' },
        { status: 400 }
      );
    }

    // Check if it's a base64 data URL
    if (!imageData.startsWith('data:image/')) {
      // If it's already a URL, return it
      return NextResponse.json({ url: imageData });
    }

    // Extract image format and base64 data
    const matches = imageData.match(/^data:image\/(\w+);base64,(.+)$/);
    if (!matches) {
      return NextResponse.json(
        { error: 'Invalid image format' },
        { status: 400 }
      );
    }

    const [, imageType, base64Data] = matches;
    const imageBuffer = Buffer.from(base64Data, 'base64');

    // Generate unique filename
    const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.${imageType}`;
    const filePath = `item-images/${filename}`;

    // Upload to Supabase Storage
    if (!supabaseAdmin) {
      // Fallback: return base64 data URL if Supabase not configured
      return NextResponse.json({ url: imageData });
    }

    const { data, error } = await supabaseAdmin.storage
      .from('item-images')
      .upload(filePath, imageBuffer, {
        contentType: `image/${imageType}`,
        upsert: false,
      });

    if (error) {
      console.error('Storage upload error:', error);
      // Fallback: return base64 data URL if upload fails
      return NextResponse.json({ url: imageData });
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from('item-images')
      .getPublicUrl(filePath);

    return NextResponse.json({ url: urlData.publicUrl });
  } catch (error: any) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: 'Failed to upload image', details: error?.message },
      { status: 500 }
    );
  }
}

