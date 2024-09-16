export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: { id: string; name: string; user_id: string; created_at: string; updated_at: string }
        Insert: { id?: string; name: string; user_id: string; created_at?: string; updated_at?: string }
        Update: { id?: string; name?: string; user_id?: string; created_at?: string; updated_at?: string }
      }
      transactions: {
        Row: { id: string; user_id: string; category_id: string | null; amount: number; description: string | null; date: string; created_at: string; updated_at: string }
        Insert: { id?: string; user_id: string; category_id?: string | null; amount: number; description?: string | null; date: string; created_at?: string; updated_at?: string }
        Update: { id?: string; user_id?: string; category_id?: string | null; amount?: number; description?: string | null; date?: string; created_at?: string; updated_at?: string }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export interface TransactionData {
  id: string;
  user_id: string;
  amount: number;
  category_id: string | null;
  date: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface CategoryData {
  id: string;
  name: string;
}