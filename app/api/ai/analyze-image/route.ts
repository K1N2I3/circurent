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
        max_tokens: 500,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `You are an expert at identifying items for a rental marketplace. Analyze the image carefully and provide accurate information.

Requirements:
1. **Name**: A clear, specific name for the item (max 60 characters). Include brand, model, and key specifications if visible (e.g., "HEAD V-Shape V2 Skis 170cm with Bindings").
2. **Description**: A detailed, professional description (2-4 sentences) suitable for a rental listing. Include:
   - What the item is and its primary use
   - Key features, specifications, or characteristics visible in the image
   - Condition or notable details
   - Who would benefit from renting this item
3. **Category**: Choose the MOST ACCURATE category from this list:
   - "Electronics" - phones, laptops, cameras, audio equipment, gaming devices
   - "Sports Equipment" - skis, snowboards, bikes, tennis rackets, golf clubs, fitness equipment
   - "Outdoor Gear" - camping equipment, hiking gear, tents, sleeping bags, backpacks
   - "Tools" - power tools, hand tools, construction equipment, gardening tools
   - "Instruments" - musical instruments like guitars, keyboards, drums
   - "Vehicles" - cars, motorcycles, bicycles, scooters

IMPORTANT: 
- Look carefully at the image to identify the exact item
- Be specific with the name - include brand and model if visible
- Choose the category that BEST matches the item's primary purpose
- Respond ONLY with valid JSON, no additional text before or after

Respond in this exact JSON format:
{"name": "exact item name here", "description": "detailed description here", "category": "exact category name here"}`
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
    // Claude sometimes wraps JSON in markdown code blocks
    let jsonString = content.trim();
    
    // Remove markdown code blocks if present
    jsonString = jsonString.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '');
    jsonString = jsonString.trim();
    
    // Try to extract JSON from text if it's embedded
    const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonString = jsonMatch[0];
    }

    try {
      const parsed = JSON.parse(jsonString);
      
      // Validate and clean the parsed data
      const name = (parsed.name || '').trim();
      const description = (parsed.description || '').trim();
      const category = (parsed.category || '').trim();
      
      // Validate category is one of the allowed values
      const validCategories = ['Electronics', 'Sports Equipment', 'Outdoor Gear', 'Tools', 'Instruments', 'Vehicles'];
      const validCategory = validCategories.includes(category) ? category : 'Electronics';
      
      if (!name || !description) {
        throw new Error('Missing required fields');
      }
      
      return NextResponse.json({
        name: name,
        description: description,
        category: validCategory,
      });
    } catch (parseError) {
      console.error('Failed to parse Claude response:', parseError);
      console.error('Raw content:', content);
      // Fallback response
      return NextResponse.json({
        name: 'Item',
        description: 'A rental item. Please provide more details.',
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

