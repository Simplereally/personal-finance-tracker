import { type DeleteCategoryResult, type GetCategoriesResult } from "@/types/category";

export interface ICategoryRepository {
  getCategories(userId: string): Promise<GetCategoriesResult>;
  createCategory(userId: string, name: string): Promise<GetCategoriesResult>;
  deleteCategory(userId: string, categoryId: string): Promise<DeleteCategoryResult>;
  categoryHasTransactions(userId: string, categoryId: string): Promise<boolean>;
}