import { type TransactionData } from "@/types/supabase";
import { type AddTransactionParams } from "@/types/transaction";
import { createClient } from "@/utils/supabase/server";
import { type PostgrestResponse, type PostgrestSingleResponse } from "@supabase/supabase-js";

export function createSupabaseTransactionAdapter() {
  const supabase = createClient();
  return {
    async addTransaction(userId: string, transaction: AddTransactionParams): Promise<PostgrestSingleResponse<TransactionData>> {
      return await supabase.from('transactions').insert({ ...transaction, user_id: userId }).select().single();
    },
    async getTransactions(userId: string): Promise<PostgrestResponse<TransactionData>> {
      return await supabase
        .from('transactions')
        .select(`
          *,
          categories:category_id (id, name)
        `)
        .eq('user_id', userId)
        .order('date', { ascending: false });
    }
  };
}

export type SupabaseTransactionAdapter = ReturnType<typeof createSupabaseTransactionAdapter>;