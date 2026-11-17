import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  if (process.env.NODE_ENV === 'development') {
    console.warn('Supabase environment variables not set. Supabase client will not work.');
  }
}

let supabaseInstance: SupabaseClient | null = null;
let supabaseAdminInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(
        supabaseUrl || 'https://placeholder.supabase.co',
        supabaseAnonKey || 'placeholder-key',
        {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
          },
        }
      );
    } catch {
      supabaseInstance = null as unknown as SupabaseClient;
    }
  }
  return supabaseInstance;
}

export const supabase = getSupabase();

export function getSupabaseAdmin(): SupabaseClient {
  if (!supabaseAdminInstance) {
    try {
      supabaseAdminInstance = createClient(
        supabaseUrl || 'https://placeholder.supabase.co',
        supabaseServiceKey || 'placeholder-key',
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
          },
        }
      );
    } catch {
      supabaseAdminInstance = null as unknown as SupabaseClient;
    }
  }
  return supabaseAdminInstance;
}

export type Profile = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  location: string | null;
  location_detail: string | null;
  created_at: string;
  updated_at: string;
};

export type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string | null;
  image_url: string | null;
  is_available: boolean;
  stock: number;
  created_at: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  created_at: string;
};

export type Order = {
  id: string;
  user_id: string | null;
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  total: number;
  delivery_fee: number;
  delivery_address: string;
  delivery_location: string | null;
  payment_method: string;
  mpesa_receipt: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
};

export type CartItem = {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
};

export type PaymentTransaction = {
  id: string;
  order_id: string | null;
  checkout_request_id: string | null;
  merchant_request_id: string | null;
  mpesa_receipt_number: string | null;
  amount: number | null;
  phone_number: string | null;
  status: 'pending' | 'success' | 'failed' | 'cancelled';
  result_code: string | null;
  result_desc: string | null;
  created_at: string;
  updated_at: string;
};
