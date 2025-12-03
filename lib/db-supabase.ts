import { supabaseAdmin } from './supabase';
import { User, Item, Rental } from './db';

// 检查是否使用 Supabase（通过环境变量判断）
const useSupabase = !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!supabaseAdmin;

// 用户数据操作
export const usersDbSupabase = {
  getAll: async (): Promise<User[]> => {
    if (!useSupabase || !supabaseAdmin) throw new Error('Supabase not configured');
    const { data, error } = await supabaseAdmin.from('users').select('*');
    if (error) throw error;
    return (data || []).map(convertUserFromDb);
  },

  getById: async (id: string): Promise<User | undefined> => {
    if (!useSupabase || !supabaseAdmin) throw new Error('Supabase not configured');
    const { data, error } = await supabaseAdmin.from('users').select('*').eq('id', id).single();
    if (error) {
      if (error.code === 'PGRST116') return undefined; // Not found
      throw error;
    }
    return data ? convertUserFromDb(data) : undefined;
  },

  getByEmail: async (email: string): Promise<User | undefined> => {
    if (!useSupabase || !supabaseAdmin) throw new Error('Supabase not configured');
    const { data, error } = await supabaseAdmin.from('users').select('*').eq('email', email).single();
    if (error) {
      if (error.code === 'PGRST116') return undefined; // Not found
      throw error;
    }
    return data ? convertUserFromDb(data) : undefined;
  },

  create: async (user: User): Promise<void> => {
    if (!useSupabase || !supabaseAdmin) throw new Error('Supabase not configured');
    const { error } = await supabaseAdmin.from('users').insert(convertUserToDb(user));
    if (error) throw error;
  },

  update: async (id: string, updates: Partial<User>): Promise<void> => {
    if (!useSupabase || !supabaseAdmin) throw new Error('Supabase not configured');
    const updateData: any = {};
    if (updates.email !== undefined) updateData.email = updates.email;
    if (updates.password !== undefined) updateData.password = updates.password;
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.address !== undefined) updateData.address = updates.address;
    
    const { error } = await supabaseAdmin.from('users').update(updateData).eq('id', id);
    if (error) throw error;
  },
};

// 物品数据操作
export const itemsDbSupabase = {
  getAll: async (): Promise<Item[]> => {
    if (!useSupabase || !supabaseAdmin) throw new Error('Supabase not configured');
    const { data, error } = await supabaseAdmin.from('items').select('*');
    if (error) throw error;
    return (data || []).map(convertItemFromDb);
  },

  getById: async (id: string): Promise<Item | undefined> => {
    if (!useSupabase || !supabaseAdmin) throw new Error('Supabase not configured');
    const { data, error } = await supabaseAdmin.from('items').select('*').eq('id', id).single();
    if (error) {
      if (error.code === 'PGRST116') return undefined; // Not found
      throw error;
    }
    return data ? convertItemFromDb(data) : undefined;
  },

  create: async (item: Item): Promise<void> => {
    if (!useSupabase || !supabaseAdmin) throw new Error('Supabase not configured');
    const { error } = await supabaseAdmin.from('items').insert(convertItemToDb(item));
    if (error) throw error;
  },

  update: async (id: string, updates: Partial<Item>): Promise<void> => {
    if (!useSupabase || !supabaseAdmin) throw new Error('Supabase not configured');
    const updateData: any = {};
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.category !== undefined) updateData.category = updates.category;
    if (updates.pricePerDay !== undefined) updateData.price_per_day = updates.pricePerDay;
    if (updates.image !== undefined) updateData.image = updates.image;
    if (updates.imageUrl !== undefined) updateData.image_url = updates.imageUrl;
    if (updates.available !== undefined) updateData.available = updates.available;
    if (updates.ownerName !== undefined) updateData.owner_name = updates.ownerName;
    if (updates.userId !== undefined) updateData.user_id = updates.userId;
    
    const { error } = await supabaseAdmin.from('items').update(updateData).eq('id', id);
    if (error) throw error;
  },
};

// 租赁数据操作
export const rentalsDbSupabase = {
  getAll: async (): Promise<Rental[]> => {
    if (!useSupabase || !supabaseAdmin) throw new Error('Supabase not configured');
    const { data, error } = await supabaseAdmin.from('rentals').select('*');
    if (error) throw error;
    return (data || []).map(convertRentalFromDb);
  },

  getById: async (id: string): Promise<Rental | undefined> => {
    if (!useSupabase || !supabaseAdmin) throw new Error('Supabase not configured');
    const { data, error } = await supabaseAdmin.from('rentals').select('*').eq('id', id).single();
    if (error) {
      if (error.code === 'PGRST116') return undefined; // Not found
      throw error;
    }
    return data ? convertRentalFromDb(data) : undefined;
  },

  getByUserId: async (userId: string): Promise<Rental[]> => {
    if (!useSupabase || !supabaseAdmin) throw new Error('Supabase not configured');
    const { data, error } = await supabaseAdmin.from('rentals').select('*').eq('user_id', userId);
    if (error) throw error;
    return (data || []).map(convertRentalFromDb);
  },

  create: async (rental: Rental): Promise<void> => {
    if (!useSupabase || !supabaseAdmin) throw new Error('Supabase not configured');
    const { error } = await supabaseAdmin.from('rentals').insert(convertRentalToDb(rental));
    if (error) throw error;
  },

  update: async (id: string, updates: Partial<Rental>): Promise<void> => {
    if (!useSupabase || !supabaseAdmin) throw new Error('Supabase not configured');
    const updateData: any = {};
    if (updates.userId !== undefined) updateData.user_id = updates.userId;
    if (updates.itemId !== undefined) updateData.item_id = updates.itemId;
    if (updates.startDate !== undefined) updateData.start_date = updates.startDate;
    if (updates.endDate !== undefined) updateData.end_date = updates.endDate;
    if (updates.totalPrice !== undefined) updateData.total_price = updates.totalPrice;
    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.paymentMethod !== undefined) updateData.payment_method = updates.paymentMethod;
    if (updates.paymentId !== undefined) updateData.payment_id = updates.paymentId;
    
    const { error } = await supabaseAdmin.from('rentals').update(updateData).eq('id', id);
    if (error) throw error;
  },
};

// 转换函数：数据库格式 <-> 应用格式
function convertUserFromDb(dbUser: any): User {
  // Handle address: can be string (old format) or JSON object (new format)
  let address: User['address'] = undefined;
  if (dbUser.address) {
    try {
      // Try to parse as JSON if it's a string
      const parsed = typeof dbUser.address === 'string' 
        ? JSON.parse(dbUser.address) 
        : dbUser.address;
      
      // Check if it's the new format (object with street, city, etc.)
      if (parsed && typeof parsed === 'object' && 'street' in parsed) {
        address = parsed;
      } else {
        // Old format: convert string to AddressData if possible, otherwise undefined
        address = undefined;
      }
    } catch {
      // If parsing fails, treat as old format and set to undefined
      address = undefined;
    }
  }

  return {
    id: dbUser.id,
    email: dbUser.email,
    password: dbUser.password,
    name: dbUser.name,
    address,
    createdAt: dbUser.created_at,
  };
}

function convertUserToDb(user: User): any {
  return {
    id: user.id,
    email: user.email,
    password: user.password,
    name: user.name,
    // Store address as JSON string in database
    address: user.address ? JSON.stringify(user.address) : null,
    created_at: user.createdAt,
  };
}

function convertItemFromDb(dbItem: any): Item {
  return {
    id: dbItem.id,
    name: dbItem.name,
    description: dbItem.description,
    category: dbItem.category,
    pricePerDay: Number(dbItem.price_per_day),
    image: dbItem.image,
    imageUrl: dbItem.image_url || undefined,
    available: dbItem.available,
    ownerName: dbItem.owner_name || dbItem.location || 'CircuRent', // Support both old and new field names
    userId: dbItem.user_id || undefined,
  };
}

function convertItemToDb(item: Item): any {
  return {
    id: item.id,
    name: item.name,
    description: item.description,
    category: item.category,
    price_per_day: item.pricePerDay,
    image: item.image,
    image_url: item.imageUrl || null,
    available: item.available,
    owner_name: item.ownerName, // Use owner_name in database
    user_id: item.userId || null,
    // Backward compatibility: also set location if column exists
    // Use ownerName as location value for compatibility
    location: item.ownerName || 'CircuRent',
  };
}

function convertRentalFromDb(dbRental: any): Rental {
  return {
    id: dbRental.id,
    userId: dbRental.user_id,
    itemId: dbRental.item_id,
    startDate: dbRental.start_date,
    endDate: dbRental.end_date,
    totalPrice: Number(dbRental.total_price),
    status: dbRental.status,
    paymentMethod: dbRental.payment_method,
    paymentId: dbRental.payment_id || undefined,
    createdAt: dbRental.created_at,
  };
}

function convertRentalToDb(rental: Rental): any {
  return {
    id: rental.id,
    user_id: rental.userId,
    item_id: rental.itemId,
    start_date: rental.startDate,
    end_date: rental.endDate,
    total_price: rental.totalPrice,
    status: rental.status,
    payment_method: rental.paymentMethod,
    payment_id: rental.paymentId || null,
    created_at: rental.createdAt,
  };
}

// 导出转换函数供迁移脚本使用
export { convertItemToDb };

