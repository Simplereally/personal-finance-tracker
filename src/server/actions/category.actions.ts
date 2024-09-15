"use server";

import { createAuthRepository } from "@/data-access/AuthRepository";
import { createCategoryRepository } from "@/data-access/CategoryRepository";
import { createAuthService } from "@/services/AuthService";
import { createCategoryService } from "@/services/CategoryService";
import { type GetCategoriesResult } from "@/types/category";

const categoryRepository = createCategoryRepository();
const categoryService = createCategoryService(categoryRepository);
const authRepository = createAuthRepository();
const authService = createAuthService(authRepository);

export async function getCategories(): Promise<GetCategoriesResult> {
  const userResult = await authService.getUser();
  if (!userResult.success || !userResult.userid) {
    return { success: false, categories: [], error: "User not authenticated" };
  }

  return await categoryService.getCategories(userResult.userid);
}