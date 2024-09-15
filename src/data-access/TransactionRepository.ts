import { type ITransactionRepository } from "@/interfaces/ITransactionRepository";
import { type AddTransactionParams, type AddTransactionResult, type GetTransactionsResult } from "@/types/transaction";
import { createSupabaseTransactionAdapter, type SupabaseTransactionAdapter } from "./adapters/supabaseTransactionAdapter";

export function createTransactionRepository(): ITransactionRepository {
  const adapter: SupabaseTransactionAdapter = createSupabaseTransactionAdapter();

  return {
    async addTransaction(userId: string, transaction: AddTransactionParams): Promise<AddTransactionResult> {
      const { data, error } = await adapter.addTransaction(userId, transaction);
      if (error) return { success: false, error: error.message };
      return { success: true, transactionId: data?.id };
    },

    async getTransactions(userId: string): Promise<GetTransactionsResult> {
      const { data, error } = await adapter.getTransactions(userId);
      if (error) return { success: false, transactions: [], error: error.message };
      return { success: true, transactions: data || [] };
    }
  };
}