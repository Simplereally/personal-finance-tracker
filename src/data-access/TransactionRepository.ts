import { type ITransactionRepository } from "@/interfaces/ITransactionRepository";
import { type TransactionData } from "@/types/supabase";
import { type AddTransactionParams, type AddTransactionResult, type GetTransactionsResult } from "@/types/transaction";
import { createSupabaseTransactionAdapter, type SupabaseTransactionAdapter } from "./adapters/supabaseTransactionAdapter";

export function createTransactionRepository(): ITransactionRepository {
  const transactionAdapter: SupabaseTransactionAdapter = createSupabaseTransactionAdapter();

  return {
    async addTransaction(
      userId: string,
      transactionData: Omit<TransactionData, "user_id" | "id" | "created_at" | "updated_at">
    ): Promise<AddTransactionResult> {
      const transactionParams: AddTransactionParams = {
        ...transactionData,
        user_id: userId,
      };

      const { data, error } = await transactionAdapter.addTransaction(transactionParams);

      if (error) return { success: false, error: error.message };
      return { success: true, transactionId: data?.id };
    },
    async getTransactions(userId: string): Promise<GetTransactionsResult> {
      const { data, error } = await transactionAdapter.getTransactions(userId);
      if (error) return { success: false, transactions: [], error: error.message };
      return { success: true, transactions: data || [] };
    },
  };
}