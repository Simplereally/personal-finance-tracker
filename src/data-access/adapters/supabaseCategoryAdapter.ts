import { type CategoryData } from "@/types/supabase";
import { createClient } from "@/utils/supabase/server";
import { type PostgrestResponse } from "@supabase/supabase-js";

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
  };
}

export type SupabaseCategoryAdapter = ReturnType<typeof createSupabaseCategoryAdapter>;