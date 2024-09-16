import { type TransactionData } from "@/types/supabase";

export type AddTransactionParams = Omit<TransactionData, "id" | "created_at" | "updated_at">;

export interface AddTransactionResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

export interface GetTransactionsResult {
  success: boolean;
  transactions: TransactionData[];
  error?: string;
}
