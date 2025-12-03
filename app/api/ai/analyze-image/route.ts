import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Analyze image and generate description using Claude API
export async function POST(request: NextRequest) {
  try {
    const { imageUrl } = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      );
    }

    // Check if Anthropic API key is configured
    const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
    
    if (!anthropicApiKey) {
      // Fallback: Return a generic description
      return NextResponse.json({
        name: 'Item',
        description: 'A rental item. Please provide more details.',
        category: 'Electronics',
      });
    }

    // Determine image format and prepare content
    let imageContent: any;
    
    // Check if imageUrl is a base64 data URL
    if (imageUrl.startsWith('data:image/')) {
      // Extract base64 data and media type
      const matches = imageUrl.match(/^data:image\/(\w+);base64,(.+)$/);
      if (matches) {
        const mediaType = matches[1];
        const base64Data = matches[2];
        imageContent = {
          type: 'image',
          source: {
            type: 'base64',
            media_type: `image/${mediaType}`,
            data: base64Data,
          },
        };
      } else {
        // Fallback for invalid base64 format
        return NextResponse.json({
          name: 'Item',
          description: 'A rental item. Please provide more details.',
          category: 'Electronics',
        });
      }
    } else {
      // Assume it's a URL (must be publicly accessible)
      imageContent = {
        type: 'image',
        source: {
          type: 'url',
          url: imageUrl,
        },
      };
    }

    // Use Claude API to analyze the image
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': anthropicApiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 300,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analyze this image and provide: 1) A short name for the item (max 50 chars), 2) A detailed description suitable for a rental marketplace (2-3 sentences), 3) The category (one of: Electronics, Sports Equipment, Outdoor Gear, Tools, Instruments, Vehicles). Respond in JSON format: {"name": "...", "description": "...", "category": "..."}'
              },
              imageContent
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Claude API error:', error);
      // Fallback response
      return NextResponse.json({
        name: 'Item',
        description: 'A rental item. Please provide more details.',
        category: 'Electronics',
      });
    }

    const data = await response.json();
    const content = data.content?.[0]?.text || '';

    // Try to parse JSON from the response
    try {
      const parsed = JSON.parse(content);
      return NextResponse.json({
        name: parsed.name || 'Item',
        description: parsed.description || 'A rental item.',
        category: parsed.category || 'Electronics',
      });
    } catch {
      // If parsing fails, extract information from text
      return NextResponse.json({
        name: 'Item',
        description: content || 'A rental item. Please provide more details.',
        category: 'Electronics',
      });
    }
  } catch (error) {
    console.error('Error analyzing image:', error);
    return NextResponse.json(
      {
        name: 'Item',
        description: 'A rental item. Please provide more details.',
        category: 'Electronics',
      },
      { status: 200 } // Return fallback instead of error
    );
  }
}

