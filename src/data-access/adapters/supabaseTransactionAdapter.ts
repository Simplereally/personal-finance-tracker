import { type TransactionData } from "@/types/supabase";
import { type AddTransactionParams, type UpdateTransactionParams } from "@/types/transaction";
import { createClient } from "@/utils/supabase/server";
import { type PostgrestResponse, type PostgrestSingleResponse } from "@supabase/supabase-js";

export function createSupabaseTransactionAdapter() {
  const supabase = createClient();
  return {
    async addTransaction(transaction: AddTransactionParams): Promise<PostgrestSingleResponse<TransactionData>> {
      return await supabase
        .from('transactions')
        .insert(transaction)
        .select()
        .single();
    },
    async getTransactions(userId: string): Promise<PostgrestResponse<TransactionData & { categories: { id: string; name: string } | null }>> {
      return await supabase
        .from('transactions')
        .select(`
          *,
          categories (id, name)
        `)
        .eq('user_id', userId)
        .order('date', { ascending: false });
    },
    async deleteTransaction(userId: string, transactionId: string): Promise<PostgrestSingleResponse<null>> {
      return await supabase
        .from('transactions')
        .delete()
        .eq('id', transactionId)
        .eq('user_id', userId);
    },
    async editTransaction(userId: string, transactionId: string, updatedData: UpdateTransactionParams): Promise<PostgrestSingleResponse<TransactionData & { categories: { id: string; name: string } | null }>> {
      return await supabase
        .from('transactions')
        .update(updatedData)
        .eq('id', transactionId)
        .eq('user_id', userId)
        .select(`
          *,
          categories (id, name)
        `)
        .single();
    }
  };
}

export type SupabaseTransactionAdapter = ReturnType<typeof createSupabaseTransactionAdapter>;