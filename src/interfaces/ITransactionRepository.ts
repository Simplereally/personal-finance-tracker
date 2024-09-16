import { type TransactionData } from "@/types/supabase";
import { type AddTransactionResult, type GetTransactionsResult } from "@/types/transaction";

export interface ITransactionRepository {
  addTransaction(
    userId: string,
    transactionData: Omit<TransactionData, "user_id" | "id" | "created_at" | "updated_at">
  ): Promise<AddTransactionResult>;
  getTransactions(userId: string): Promise<GetTransactionsResult>;
}