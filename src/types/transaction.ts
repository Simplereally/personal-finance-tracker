import { type TransactionData } from "./supabase";

export interface AddTransactionParams {
  user_id: string;
  amount: number;
  category_id: string | null;
  date: string;
  description: string | null;
}

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

export interface DeleteTransactionResult {
  success: boolean;
  error?: string;
}
