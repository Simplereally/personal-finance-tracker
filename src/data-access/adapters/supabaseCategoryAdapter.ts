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
    async deleteCategory(userId: string, categoryId: string): Promise<PostgrestResponse<null>> {
      return await supabase
        .from('categories')
        .delete()
        .eq('user_id', userId)
        .eq('id', categoryId) as PostgrestResponse<null>;
    },
    async categoryHasTransactions(userId: string, categoryId: string): Promise<boolean> {
      const { count } = await supabase
        .from('transactions')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('category_id', categoryId);
      return count !== null && count > 0;
    },
  };
}

export type SupabaseCategoryAdapter = ReturnType<typeof createSupabaseCategoryAdapter>;