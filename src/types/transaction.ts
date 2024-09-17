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

export interface TransactionWithCategory extends TransactionData {
  categories: { id: string; name: string } | null;
}

export interface GetTransactionsResult {
  success: boolean;
  transactions: TransactionWithCategory[];
  error?: string;
}

export interface DeleteTransactionResult {
  success: boolean;
  error?: string;
}

export interface TransactionWithFetchedAt extends TransactionWithCategory {
  fetchedAt: number;
  isNew?: boolean;
}
