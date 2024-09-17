import { type ICategoryRepository } from "@/interfaces/ICategoryRepository";
import { type ITransactionRepository } from "@/interfaces/ITransactionRepository";
import { type AddTransactionParams, type AddTransactionResult, type DeleteTransactionResult, type GetTransactionsResult } from "@/types/transaction";

export function createTransactionService(
  transactionRepository: ITransactionRepository,
  categoryRepository: ICategoryRepository
) {
  return {
    async addTransaction(
      userId: string,
      transactionData: Omit<AddTransactionParams, "user_id">,
      categoryName?: string
    ): Promise<AddTransactionResult> {
      let categoryId = transactionData.category_id;

      if (!categoryId && categoryName) {
        const categoryResult = await categoryRepository.createCategory(userId, categoryName);
        if (categoryResult.success && categoryResult.categories.length > 0) {
          const newCategory = categoryResult.categories[0];
          if (newCategory?.id) {
            categoryId = newCategory.id;
          } else {
            return { success: false, error: "Failed to create category: Invalid category data" };
          }
        } else {
          return { success: false, error: "Failed to create category" };
        }
      }

      if (!categoryId) {
        return { success: false, error: "No valid category provided" };
      }

      const result = await transactionRepository.addTransaction({
        ...transactionData,
        user_id: userId,
        category_id: categoryId,
      });

      return result;
    },
    async getTransactions(userId: string): Promise<GetTransactionsResult> {
      return await transactionRepository.getTransactions(userId);
    },
    async deleteTransaction(userId: string, transactionId: string): Promise<DeleteTransactionResult> {
      return await transactionRepository.deleteTransaction(userId, transactionId);
    },
  };
}

export type TransactionService = ReturnType<typeof createTransactionService>;