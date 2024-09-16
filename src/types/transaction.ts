import { type TransactionData } from "./supabase";

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
