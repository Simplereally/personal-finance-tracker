"use server";

import { createAuthRepository } from "@/data-access/AuthRepository";
import { createCategoryRepository } from "@/data-access/CategoryRepository";
import { createTransactionRepository } from "@/data-access/TransactionRepository";
import { createAuthService } from "@/services/AuthService";
import { createCategoryService } from "@/services/CategoryService";
import { type DeleteCategoryResult, type GetCategoriesResult } from "@/types/category";

const categoryRepository = createCategoryRepository();
const transactionRepository = createTransactionRepository();
const categoryService = createCategoryService(categoryRepository, transactionRepository);
const authRepository = createAuthRepository();
const authService = createAuthService(authRepository);

export async function getCategories(): Promise<GetCategoriesResult> {
  const userResult = await authService.getUser();
  if (!userResult.success || !userResult.userid) {
    return { success: false, categories: [], error: "User not authenticated" };
  }

  return await categoryService.getCategories(userResult.userid);
}

export async function createCategory(name: string): Promise<GetCategoriesResult> {
  const userResult = await authService.getUser();
  if (!userResult.success || !userResult.userid) {
    return { success: false, categories: [], error: "User not authenticated" };
  }

  return await categoryService.createCategory(userResult.userid, name);
}

export async function deleteCategory(categoryId: string): Promise<DeleteCategoryResult> {
  const userResult = await authService.getUser();
  if (!userResult.success || !userResult.userid) {
    return { success: false, error: "User not authenticated" };
  }

  try {
    return await categoryService.deleteCategory(userResult.userid, categoryId);
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === "TRANSACTIONS_EXIST") {
      return { success: false, error: "TRANSACTIONS_EXIST" };
    }
    return { success: false, error: "Failed to delete category" };
  }
}

export async function deleteCategoryAndTransactions(categoryId: string): Promise<DeleteCategoryResult> {
  const userResult = await authService.getUser();
  if (!userResult.success || !userResult.userid) {
    return { success: false, error: "User not authenticated" };
  }

  return await categoryService.deleteCategoryAndTransactions(userResult.userid, categoryId);
}