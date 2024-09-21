import { type ICategoryRepository } from "@/interfaces/ICategoryRepository";
import { type DeleteCategoryResult, type GetCategoriesResult } from "@/types/category";
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
    async deleteCategory(userId: string, categoryId: string): Promise<DeleteCategoryResult> {
      const { error } = await adapter.deleteCategory(userId, categoryId);
      if (error) return { success: false, error: error.message };
      return { success: true };
    },
    async categoryHasTransactions(userId: string, categoryId: string): Promise<boolean> {
      return await adapter.categoryHasTransactions(userId, categoryId);
    },
  };
}