import { type CategoryData } from "@/types/supabase";
import { createClient } from "@/utils/supabase/server";
import { type PostgrestResponse, type PostgrestSingleResponse } from "@supabase/supabase-js";

export function createSupabaseCategoryAdapter() {
  const supabase = createClient();
  return {
    async getCategories(userId: string): Promise<PostgrestResponse<CategoryData>> {
      return await supabase
        .from('categories')
        .select('*')
        .eq('user_id', userId)
        .order('name', { ascending: true });
    },
    async getCategoryByName(userId: string, name: string): Promise<PostgrestResponse<CategoryData>> {
      return await supabase
        .from('categories')
        .select('*')
        .eq('user_id', userId)
        .eq('name', name);
    },
    async createCategory(userId: string, name: string): Promise<PostgrestSingleResponse<CategoryData>> {
      return await supabase
        .from('categories')
        .insert({ user_id: userId, name })
        .select()
        .single();
    },
  };
}

export type SupabaseCategoryAdapter = ReturnType<typeof createSupabaseCategoryAdapter>;