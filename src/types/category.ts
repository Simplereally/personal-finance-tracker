import { type CategoryData } from "@/types/supabase";

export interface GetCategoriesResult {
  success: boolean;
  categories: CategoryData[];
  error?: string;
}

export interface DeleteCategoryResult {
  success: boolean;
  error?: string;
}

export interface DeleteCategoryError extends Error {
  code: 'TRANSACTIONS_EXIST' | 'NOT_FOUND' | 'UNKNOWN';
}
