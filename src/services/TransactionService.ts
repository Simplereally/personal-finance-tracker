import { type ICategoryRepository } from "@/interfaces/ICategoryRepository";
import { type ITransactionRepository } from "@/interfaces/ITransactionRepository";
import { type TransactionData } from "@/types/supabase";
import { type AddTransactionResult, type GetTransactionsResult } from "@/types/transaction";

export function createTransactionService(
  transactionRepository: ITransactionRepository,
  categoryRepository: ICategoryRepository
) {
  return {
    async addTransaction(
      userId: string,
      transactionData: Omit<TransactionData, "user_id" | "id" | "created_at" | "updated_at">,
      categoryName?: string
    ): Promise<AddTransactionResult> {
      let categoryId = transactionData.category_id;

      if (!categoryId && categoryName) {
        const categoryResult = await categoryRepository.createCategory(userId, categoryName);
        console.log("category result", categoryResult)
        if (categoryResult.success && categoryResult.categories.length > 0) {
          categoryId = categoryResult.categories[0].id;
          console.log("New category created with id:", categoryId);
        } else {
          return { success: false, error: "Failed to create category" };
        }
      }

      // If we still don't have a categoryId at this point, it's an error
      if (!categoryId) {
        return { success: false, error: "No valid category provided" };
      }

      console.log("Final category id:", categoryId);

      const result = await transactionRepository.addTransaction(userId, {
        ...transactionData,
        category_id: categoryId,
      });

      if (result.success) {
        return { ...result, newTransactionId: result.transactionId };
      }
      return result;
    },
    async getTransactions(userId: string): Promise<GetTransactionsResult> {
      return await transactionRepository.getTransactions(userId);
    },
    async deleteTransaction(userId: string, transactionId: string): Promise<{ success: boolean; error?: string }> {
      return await transactionRepository.deleteTransaction(userId, transactionId);
    },
  };
}

export type TransactionService = ReturnType<typeof createTransactionService>;