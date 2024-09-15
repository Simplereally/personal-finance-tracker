import { type CategoryData } from "@/types/supabase";

export interface GetCategoriesResult {
  success: boolean;
  categories: CategoryData[];
  error?: string;
}
