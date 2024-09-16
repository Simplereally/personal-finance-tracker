import { type ICategoryRepository } from "@/interfaces/ICategoryRepository";
import { type GetCategoriesResult } from "@/types/category";
import { createSupabaseCategoryAdapter, type SupabaseCategoryAdapter } from "./adapters/supabaseCategoryAdapter";

export function createCategoryRepository(): ICategoryRepository {
  const adapter: SupabaseCategoryAdapter = createSupabaseCategoryAdapter();

  return {
    async getCategories(userId: string): Promise<GetCategoriesResult> {
      const { data, error } = await adapter.getCategories(userId);
      if (error) return { success: false, categories: [], error: error.message };
      return { success: true, categories: data || [] };
    },
    async createCategory(userId: string, name: string): Promise<GetCategoriesResult> {
      const { data, error } = await adapter.createCategory(userId, name);
      if (error) return { success: false, categories: [], error: error.message };
      return { success: true, categories: data ? [data] : [] };
    },
  };
}