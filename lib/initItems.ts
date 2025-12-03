import { Item, itemsDb } from './db';

// Initialize 22+ different types of items
export const initialItems: Item[] = [
  {
    id: '1',
    name: 'Mountain Bike',
    description: 'Professional-grade mountain bike, perfect for off-road adventures. Features 27-speed transmission system and premium components.',
    category: 'Sports Equipment',
    pricePerDay: 25,
    image: '🚴',
    imageUrl: 'https://giant-bicycles.ae/wp-content/uploads/2025/08/G061095009124_1-800x800.jpg',
    available: true,
    location: 'Milan'
  },
  {
    id: '2',
    name: 'Canon EOS R5 Camera',
    description: 'Professional full-frame mirrorless camera with 45MP resolution. Capture stunning 4K video and high-resolution photos.',
    category: 'Electronics',
    pricePerDay: 80,
    image: '📷',
    imageUrl: '',
    available: true,
    location: 'Rome'
  },
  {
    id: '3',
    name: 'Epson Projector',
    description: 'High-definition 1080p projector ideal for home theaters and business presentations. Crystal-clear image quality.',
    category: 'Electronics',
    pricePerDay: 35,
    image: '📽️',
    imageUrl: '',
    available: true,
    location: 'Turin'
  },
  {
    id: '4',
    name: '4-Person Tent',
    description: 'Waterproof double-layer tent perfect for camping and outdoor adventures. Spacious and easy to set up.',
    category: 'Outdoor Gear',
    pricePerDay: 20,
    image: '⛺',
    imageUrl: '',
    available: true,
    location: 'Florence'
  },
  {
    id: '5',
    name: 'DJI Mini 3 Drone',
    description: 'Lightweight drone with 4K aerial photography capabilities. Features intelligent tracking and obstacle avoidance.',
    category: 'Electronics',
    pricePerDay: 60,
    image: '🚁',
    imageUrl: '',
    available: true,
    location: 'Venice'
  },
  {
    id: '6',
    name: 'Electric Scooter',
    description: 'Urban commuter electric scooter with 30km range. Perfect for city travel with zero emissions.',
    category: 'Vehicles',
    pricePerDay: 30,
    image: '🛴',
    imageUrl: '',
    available: true,
    location: 'Naples'
  },
  {
    id: '7',
    name: 'PlayStation 5',
    description: 'Latest generation gaming console with included controller and games. Experience next-level gaming performance.',
    category: 'Electronics',
    pricePerDay: 40,
    image: '🎮',
    imageUrl: '',
    available: true,
    location: 'Bologna'
  },
  {
    id: '8',
    name: 'Power Drill Set',
    description: 'Professional power drill tool set with multiple drill bits. Perfect for DIY projects and home improvements.',
    category: 'Tools',
    pricePerDay: 15,
    image: '🔧',
    imageUrl: '',
    available: true,
    location: 'Genoa'
  },
  {
    id: '9',
    name: 'BBQ Grill',
    description: 'Large stainless steel BBQ grill perfect for gatherings and outdoor cooking. Professional-grade quality.',
    category: 'Outdoor Gear',
    pricePerDay: 18,
    image: '🔥',
    imageUrl: '',
    available: true,
    location: 'Palermo'
  },
  {
    id: '10',
    name: 'MacBook Pro M2',
    description: '14-inch MacBook Pro with M2 chip. Ideal for work and creative projects. High-performance computing.',
    category: 'Electronics',
    pricePerDay: 50,
    image: '💻',
    imageUrl: '',
    available: true,
    location: 'Milan'
  },
  {
    id: '11',
    name: 'Yamaha Upright Piano',
    description: 'Beautiful upright piano with exceptional sound quality. Perfect for practice and performances.',
    category: 'Instruments',
    pricePerDay: 45,
    image: '🎹',
    imageUrl: '',
    available: true,
    location: 'Rome'
  },
  {
    id: '12',
    name: 'Inflatable Kayak',
    description: 'Two-person inflatable kayak, portable and perfect for water sports. Easy to transport and set up.',
    category: 'Sports Equipment',
    pricePerDay: 28,
    image: '🛶',
    imageUrl: '',
    available: true,
    location: 'Venice'
  },
  {
    id: '13',
    name: 'Meta Quest 3 VR Headset',
    description: 'Virtual reality headset for immersive gaming experiences. Cutting-edge VR technology.',
    category: 'Electronics',
    pricePerDay: 35,
    image: '🥽',
    imageUrl: '',
    available: true,
    location: 'Turin'
  },
  {
    id: '14',
    name: 'Power Tool Set',
    description: 'Complete power tool set including circular saw, angle grinder, and more. Professional-grade equipment.',
    category: 'Tools',
    pricePerDay: 22,
    image: '⚙️',
    imageUrl: '',
    available: true,
    location: 'Florence'
  },
  {
    id: '15',
    name: 'Picnic Set',
    description: 'Complete picnic set including mat, utensils, and cooler. Everything you need for outdoor dining.',
    category: 'Outdoor Gear',
    pricePerDay: 12,
    image: '🧺',
    imageUrl: '',
    available: true,
    location: 'Bologna'
  },
  {
    id: '16',
    name: 'Fender Electric Guitar',
    description: 'Classic electric guitar perfect for performances and recording. Iconic sound and quality.',
    category: 'Instruments',
    pricePerDay: 30,
    image: '🎸',
    imageUrl: '',
    available: true,
    location: 'Naples'
  },
  {
    id: '17',
    name: 'Treadmill',
    description: 'Home electric treadmill with multiple workout modes. Stay fit from the comfort of your home.',
    category: 'Sports Equipment',
    pricePerDay: 20,
    image: '🏃',
    imageUrl: '',
    available: true,
    location: 'Genoa'
  },
  {
    id: '18',
    name: '3D Printer',
    description: 'Desktop 3D printer perfect for prototyping and creative projects. High precision printing.',
    category: 'Tools',
    pricePerDay: 40,
    image: '🖨️',
    imageUrl: '',
    available: true,
    location: 'Palermo'
  },
  {
    id: '19',
    name: 'Telescope',
    description: 'Professional telescope for stargazing and astrophotography. Explore the cosmos with clarity.',
    category: 'Electronics',
    pricePerDay: 35,
    image: '🔭',
    imageUrl: '',
    available: true,
    location: 'Milan'
  },
  {
    id: '20',
    name: 'Inflatable Pool',
    description: 'Large inflatable pool perfect for family use. Easy setup and great for summer fun.',
    category: 'Outdoor Gear',
    pricePerDay: 15,
    image: '🏊',
    imageUrl: '',
    available: true,
    location: 'Rome'
  },
  {
    id: '21',
    name: 'Digital Piano',
    description: '88-key digital piano with multiple voices and metronome. Perfect for practice and performance.',
    category: 'Instruments',
    pricePerDay: 25,
    image: '🎹',
    imageUrl: '',
    available: true,
    location: 'Turin'
  },
  {
    id: '22',
    name: 'Skateboard',
    description: 'Professional skateboard perfect for street skating and trick practice. High-quality components.',
    category: 'Sports Equipment',
    pricePerDay: 10,
    image: '🛹',
    imageUrl: '',
    available: true,
    location: 'Venice'
  }
];

// Initialize items data
export async function initItems() {
  const existingItems = await itemsDb.getAll();
  if (existingItems.length === 0) {
    // Check if using Supabase
    const useSupabase = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
    
    if (useSupabase) {
      // Insert items into Supabase
      const { supabaseAdmin } = await import('./supabase');
      const { convertItemToDb } = await import('./db-supabase');
      
      if (!supabaseAdmin) {
        console.error('Supabase not configured');
        return;
      }
      
      try {
        const itemsToInsert = initialItems.map(convertItemToDb);
        
        // Insert all items at once
        const { error } = await supabaseAdmin.from('items').insert(itemsToInsert);
        
        if (error) {
          // If error is about duplicate key, items already exist
          if (error.code === '23505') {
            console.log('Items already exist in database');
          } else {
            console.error('Error inserting items:', error);
          }
        } else {
          console.log(`Successfully inserted ${itemsToInsert.length} items into Supabase`);
        }
      } catch (error) {
        console.error('Error in initItems:', error);
      }
    } else {
      // Write initial items to file (file system mode)
      const fs = require('fs');
      const path = require('path');
      const itemsFile = path.join(process.cwd(), 'data', 'items.json');
      // Ensure data directory exists
      const dataDir = path.dirname(itemsFile);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      fs.writeFileSync(itemsFile, JSON.stringify(initialItems, null, 2));
    }
  }
}
