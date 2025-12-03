import { createClient } from '@supabase/supabase-js';

// 客户端配置（用于前端）
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// 服务端客户端（用于 API 路由，有完整权限）
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// 客户端（用于前端组件）
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 服务端客户端（用于 API 路由）
export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

// 数据库表类型定义
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          password: string;
          name: string;
          address: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          password: string;
          name: string;
          address?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          password?: string;
          name?: string;
          address?: string | null;
          created_at?: string;
        };
      };
      items: {
        Row: {
          id: string;
          name: string;
          description: string;
          category: string;
          price_per_day: number;
          image: string;
          image_url: string | null;
          available: boolean;
          location: string;
        };
        Insert: {
          id: string;
          name: string;
          description: string;
          category: string;
          price_per_day: number;
          image: string;
          image_url?: string | null;
          available?: boolean;
          location: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          category?: string;
          price_per_day?: number;
          image?: string;
          image_url?: string | null;
          available?: boolean;
          location?: string;
        };
      };
      rentals: {
        Row: {
          id: string;
          user_id: string;
          item_id: string;
          start_date: string;
          end_date: string;
          total_price: number;
          status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
          payment_method: 'paypal' | 'credit_card';
          payment_id: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          user_id: string;
          item_id: string;
          start_date: string;
          end_date: string;
          total_price: number;
          status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
          payment_method: 'paypal' | 'credit_card';
          payment_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          item_id?: string;
          start_date?: string;
          end_date?: string;
          total_price?: number;
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
          payment_method?: 'paypal' | 'credit_card';
          payment_id?: string | null;
          created_at?: string;
        };
      };
    };
  };
}

