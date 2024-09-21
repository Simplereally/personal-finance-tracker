import { type ICategoryRepository } from "@/interfaces/ICategoryRepository";
import { type ITransactionRepository } from "@/interfaces/ITransactionRepository";
import { type DeleteCategoryError, type DeleteCategoryResult, type GetCategoriesResult } from "@/types/category";

export function createCategoryService(categoryRepository: ICategoryRepository, transactionRepository: ITransactionRepository) {
  return {
    async getCategories(userId: string): Promise<GetCategoriesResult> {
      return await categoryRepository.getCategories(userId);
    },
    async createCategory(userId: string, name: string): Promise<GetCategoriesResult> {
      return await categoryRepository.createCategory(userId, name);
    },
    async deleteCategory(userId: string, categoryId: string): Promise<DeleteCategoryResult> {
      const hasTransactions = await categoryRepository.categoryHasTransactions(userId, categoryId);
      if (hasTransactions) {
        const error: DeleteCategoryError = new Error("Category has associated transactions") as DeleteCategoryError;
        error.code = "TRANSACTIONS_EXIST";
        throw error;
      }
      return await categoryRepository.deleteCategory(userId, categoryId);
    },
    async deleteCategoryAndTransactions(userId: string, categoryId: string): Promise<DeleteCategoryResult> {
      try {
        await transactionRepository.deleteTransactionsByCategory(userId, categoryId);
        return await categoryRepository.deleteCategory(userId, categoryId);
      } catch (error) {
        console.error("Error deleting category and transactions:", error);
        return { success: false, error: "Failed to delete category and transactions" };
      }
    },
  };
}

export type CategoryService = ReturnType<typeof createCategoryService>;