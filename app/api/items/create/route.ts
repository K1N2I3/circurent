import { NextRequest, NextResponse } from 'next/server';
import { itemsDb, usersDb, getDisplayName } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

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
    let { name, description, category, pricePerDay, imageUrl, available = true } = body;

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

    // If imageUrl is base64, try to upload it to Supabase Storage
    if (imageUrl && imageUrl.startsWith('data:image/') && supabaseAdmin) {
      try {
        const matches = imageUrl.match(/^data:image\/(\w+);base64,(.+)$/);
        if (matches) {
          const [, imageType, base64Data] = matches;
          const imageBuffer = Buffer.from(base64Data, 'base64');
          const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.${imageType}`;
          const filePath = `item-images/${filename}`;

          const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
            .from('item-images')
            .upload(filePath, imageBuffer, {
              contentType: `image/${imageType}`,
              upsert: false,
            });

          if (!uploadError && uploadData) {
            const { data: urlData } = supabaseAdmin.storage
              .from('item-images')
              .getPublicUrl(filePath);
            imageUrl = urlData.publicUrl;
          } else {
            console.warn('Image upload failed, using base64:', uploadError);
            // Continue with base64 if upload fails
          }
        }
      } catch (uploadError) {
        console.warn('Image upload error, using base64:', uploadError);
        // Continue with base64 if upload fails
      }
    }

    // Get user data for ownerName
    const userData = await usersDb.getById(user.userId);
    if (!userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Generate unique ID (timestamp + random string to avoid collisions)
    const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    // Create new item
    const newItem = {
      id: uniqueId,
      name: name.trim(),
      description: description.trim(),
      category: category.trim(),
      pricePerDay: Number(pricePerDay),
      image: '📦', // Default emoji
      imageUrl: imageUrl || undefined,
      available: available !== false,
      ownerName: getDisplayName(userData), // Use display name (name if exists, otherwise username)
      userId: user.userId,
    };

    await itemsDb.create(newItem);

    return NextResponse.json(
      { message: 'Item created successfully', item: newItem },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating item:', error);
    
    // Provide more detailed error message
    let errorMessage = 'Failed to create item';
    if (error?.message) {
      errorMessage = error.message;
    } else if (error?.code) {
      // Supabase specific errors
      if (error.code === '23505') {
        errorMessage = 'Item with this ID already exists';
      } else if (error.code === '23503') {
        errorMessage = 'Invalid user reference';
      } else if (error.code === '23502') {
        errorMessage = 'Missing required field';
      } else {
        errorMessage = `Database error: ${error.code}`;
      }
    }
    
    return NextResponse.json(
      { error: errorMessage, details: error?.message || error?.code || 'Unknown error' },
      { status: 500 }
    );
  }
}

