import { type ICategoryRepository } from "@/interfaces/ICategoryRepository";
import { type GetCategoriesResult } from "@/types/category";

export function createCategoryService(categoryRepository: ICategoryRepository) {
  return {
    async getCategories(userId: string): Promise<GetCategoriesResult> {
      return await categoryRepository.getCategories(userId);
    },
  };
}

export type CategoryService = ReturnType<typeof createCategoryService>;