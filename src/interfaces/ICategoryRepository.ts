import { type GetCategoriesResult } from "@/types/category";

export interface ICategoryRepository {
  getCategories(userId: string): Promise<GetCategoriesResult>;
  createCategory(userId: string, name: string): Promise<GetCategoriesResult>;
}