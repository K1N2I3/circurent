import fs from 'fs';
import path from 'path';
import { usersDbSupabase, itemsDbSupabase, rentalsDbSupabase } from './db-supabase';

const dataDir = path.join(process.cwd(), 'data');

// 确保数据目录存在（仅用于文件系统模式）
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const usersFile = path.join(dataDir, 'users.json');
const itemsFile = path.join(dataDir, 'items.json');
const rentalsFile = path.join(dataDir, 'rentals.json');

// 检查是否使用 Supabase
const useSupabase = !!process.env.NEXT_PUBLIC_SUPABASE_URL;

// 初始化数据文件（仅文件系统模式）
function initFile(filePath: string, defaultValue: any) {
  if (useSupabase) return; // 跳过文件系统初始化
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2));
  }
}

// 读取数据（文件系统模式）
function readData<T>(filePath: string, defaultValue: T): T {
  if (useSupabase) return defaultValue; // 如果使用 Supabase，返回默认值
  initFile(filePath, defaultValue);
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
}

// 写入数据（文件系统模式）
function writeData<T>(filePath: string, data: T): void {
  if (useSupabase) return; // 如果使用 Supabase，跳过文件写入
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export interface User {
  id: string;
  email: string;
  password: string; // 实际应用中应该存储哈希
  name: string;
  address?: string;
  createdAt: string;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  category: string;
  pricePerDay: number;
  image: string; // emoji or image URL
  imageUrl?: string; // actual image URL
  available: boolean;
  location: string;
}

export interface Rental {
  id: string;
  userId: string;
  itemId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  paymentMethod: 'paypal' | 'credit_card';
  paymentId?: string;
  createdAt: string;
}

// 用户数据操作 - 自动选择 Supabase 或文件系统
export const usersDb = {
  getAll: async (): Promise<User[]> => {
    if (useSupabase) {
      return await usersDbSupabase.getAll();
    }
    return readData(usersFile, []);
  },

  getById: async (id: string): Promise<User | undefined> => {
    if (useSupabase) {
      return await usersDbSupabase.getById(id);
    }
    const users = readData(usersFile, []);
    return users.find(u => u.id === id);
  },

  getByEmail: async (email: string): Promise<User | undefined> => {
    if (useSupabase) {
      return await usersDbSupabase.getByEmail(email);
    }
    const users = readData(usersFile, []);
    return users.find(u => u.email === email);
  },

  create: async (user: User): Promise<void> => {
    if (useSupabase) {
      await usersDbSupabase.create(user);
      return;
    }
    const users = readData(usersFile, []);
    users.push(user);
    writeData(usersFile, users);
  },

  update: async (id: string, updates: Partial<User>): Promise<void> => {
    if (useSupabase) {
      await usersDbSupabase.update(id, updates);
      return;
    }
    const users = readData(usersFile, []);
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      writeData(usersFile, users);
    }
  },
};

// 物品数据操作 - 自动选择 Supabase 或文件系统
export const itemsDb = {
  getAll: async (): Promise<Item[]> => {
    if (useSupabase) {
      return await itemsDbSupabase.getAll();
    }
    return readData(itemsFile, []);
  },

  getById: async (id: string): Promise<Item | undefined> => {
    if (useSupabase) {
      return await itemsDbSupabase.getById(id);
    }
    const items = readData(itemsFile, []);
    return items.find(i => i.id === id);
  },

  update: async (id: string, updates: Partial<Item>): Promise<void> => {
    if (useSupabase) {
      await itemsDbSupabase.update(id, updates);
      return;
    }
    const items = readData(itemsFile, []);
    const index = items.findIndex(i => i.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...updates };
      writeData(itemsFile, items);
    }
  },
};

// 租赁数据操作 - 自动选择 Supabase 或文件系统
export const rentalsDb = {
  getAll: async (): Promise<Rental[]> => {
    if (useSupabase) {
      return await rentalsDbSupabase.getAll();
    }
    return readData(rentalsFile, []);
  },

  getById: async (id: string): Promise<Rental | undefined> => {
    if (useSupabase) {
      return await rentalsDbSupabase.getById(id);
    }
    const rentals = readData(rentalsFile, []);
    return rentals.find(r => r.id === id);
  },

  getByUserId: async (userId: string): Promise<Rental[]> => {
    if (useSupabase) {
      return await rentalsDbSupabase.getByUserId(userId);
    }
    const rentals = readData(rentalsFile, []);
    return rentals.filter(r => r.userId === userId);
  },

  create: async (rental: Rental): Promise<void> => {
    if (useSupabase) {
      await rentalsDbSupabase.create(rental);
      return;
    }
    const rentals = readData(rentalsFile, []);
    rentals.push(rental);
    writeData(rentalsFile, rentals);
  },

  update: async (id: string, updates: Partial<Rental>): Promise<void> => {
    if (useSupabase) {
      await rentalsDbSupabase.update(id, updates);
      return;
    }
    const rentals = readData(rentalsFile, []);
    const index = rentals.findIndex(r => r.id === id);
    if (index !== -1) {
      rentals[index] = { ...rentals[index], ...updates };
      writeData(rentalsFile, rentals);
    }
  },
};
