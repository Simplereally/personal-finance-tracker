import { type TransactionData } from "@/types/supabase";

export interface AddTransactionParams {
  amount: number;
  category_id: string | null;
  date: string;
  description: string | null;
}

export interface AddTransactionResult {
  success: boolean;
  error?: string;
  transactionId?: string;
}

export interface GetTransactionsResult {
  success: boolean;
  transactions: TransactionData[];
  error?: string;
}
