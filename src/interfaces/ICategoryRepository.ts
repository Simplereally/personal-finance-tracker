import { type GetCategoriesResult } from "@/types/category";

export interface ICategoryRepository {
  getCategories(userId: string): Promise<GetCategoriesResult>;
}