import { type ITransactionRepository } from "@/interfaces/ITransactionRepository";
import { type AddTransactionParams, type AddTransactionResult, type DeleteTransactionResult, type GetTransactionsResult } from "@/types/transaction";
import { createSupabaseTransactionAdapter, type SupabaseTransactionAdapter } from "./adapters/supabaseTransactionAdapter";

export function createTransactionRepository(): ITransactionRepository {
  const transactionAdapter: SupabaseTransactionAdapter = createSupabaseTransactionAdapter();

  return {
    async addTransaction(transactionData: AddTransactionParams): Promise<AddTransactionResult> {
      const { data, error } = await transactionAdapter.addTransaction(transactionData);

      if (error) return { success: false, error: error.message };
      return { success: true, transactionId: data?.id };
    },
    async getTransactions(userId: string): Promise<GetTransactionsResult> {
      const { data, error } = await transactionAdapter.getTransactions(userId);
      if (error) return { success: false, transactions: [], error: error.message };
      return { success: true, transactions: data || [] };
    },
    async deleteTransaction(userId: string, transactionId: string): Promise<DeleteTransactionResult> {
      const { error } = await transactionAdapter.deleteTransaction(userId, transactionId);
      if (error) return { success: false, error: error.message };
      return { success: true };
    },
  };
}