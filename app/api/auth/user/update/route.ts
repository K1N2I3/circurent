import { NextRequest, NextResponse } from 'next/server';
import { usersDb } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// Update user profile (avatar and/or email)
export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { email, avatarUrl } = body;

    const updates: any = {};

    // Update email if provided
    if (email !== undefined) {
      if (!email || email.trim().length === 0) {
        return NextResponse.json(
          { error: 'Email cannot be empty' },
          { status: 400 }
        );
      }
      
      // Check if email is already taken by another user
      const existingUser = await usersDb.getByEmail(email.trim());
      if (existingUser && existingUser.id !== user.userId) {
        return NextResponse.json(
          { error: 'Email is already taken' },
          { status: 400 }
        );
      }
      
      updates.email = email.trim();
    }

    // Update avatar if provided
    if (avatarUrl !== undefined) {
      // If avatarUrl is base64, upload it to Supabase Storage
      if (avatarUrl && avatarUrl.startsWith('data:image/') && supabaseAdmin) {
        try {
          const matches = avatarUrl.match(/^data:image\/(\w+);base64,(.+)$/);
          if (matches) {
            const [, imageType, base64Data] = matches;
            const imageBuffer = Buffer.from(base64Data, 'base64');
            const filename = `avatar-${user.userId}-${Date.now()}.${imageType}`;
            const filePath = `user-avatars/${filename}`;

            const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
              .from('user-avatars')
              .upload(filePath, imageBuffer, {
                contentType: `image/${imageType}`,
                upsert: true, // Overwrite if exists
              });

            if (!uploadError && uploadData) {
              const { data: urlData } = supabaseAdmin.storage
                .from('user-avatars')
                .getPublicUrl(filePath);
              updates.avatarUrl = urlData.publicUrl;
            } else {
              console.warn('Avatar upload failed, using base64:', uploadError);
              updates.avatarUrl = avatarUrl; // Fallback to base64
            }
          } else {
            updates.avatarUrl = avatarUrl; // Already a URL or empty
          }
        } catch (uploadError) {
          console.warn('Avatar upload error, using base64:', uploadError);
          updates.avatarUrl = avatarUrl; // Fallback to base64
        }
      } else {
        updates.avatarUrl = avatarUrl || null;
      }
    }

    // Update user
    await usersDb.update(user.userId, updates);

    // Fetch updated user data
    const updatedUser = await usersDb.getById(user.userId);
    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Return updated user data without password
    return NextResponse.json({
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      address: updatedUser.address,
      avatarUrl: updatedUser.avatarUrl,
      createdAt: updatedUser.createdAt,
    });
  } catch (error: any) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user', details: error?.message },
      { status: 500 }
    );
  }
}

