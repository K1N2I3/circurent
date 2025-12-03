import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Analyze image and generate description using AI
export async function POST(request: NextRequest) {
  try {
    const { imageUrl } = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      );
    }

    // Check if OpenAI API key is configured
    const openaiApiKey = process.env.OPENAI_API_KEY;
    
    if (!openaiApiKey) {
      // Fallback: Return a generic description
      return NextResponse.json({
        name: 'Item',
        description: 'A rental item. Please provide more details.',
        category: 'Electronics',
      });
    }

    // Use OpenAI Vision API to analyze the image
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analyze this image and provide: 1) A short name for the item (max 50 chars), 2) A detailed description suitable for a rental marketplace (2-3 sentences), 3) The category (one of: Electronics, Sports Equipment, Outdoor Gear, Tools, Instruments, Vehicles). Respond in JSON format: {"name": "...", "description": "...", "category": "..."}'
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl
                }
              }
            ]
          }
        ],
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      // Fallback response
      return NextResponse.json({
        name: 'Item',
        description: 'A rental item. Please provide more details.',
        category: 'Electronics',
      });
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';

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

