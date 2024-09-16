import { addTransaction as addTransactionAction, getTransactions } from "@/server/actions/transaction.actions";
import { type TransactionData } from "@/types/supabase";
import { type AddTransactionResult, type GetTransactionsResult } from "@/types/transaction";
import { useCallback, useState } from 'react';

export type TransactionWithFetchedAt = TransactionData & { fetchedAt: number; categories: { id: string; name: string } | null };

// Helper function to sort transactions by date
const sortTransactionsByDate = (transactions: TransactionWithFetchedAt[]) => {
  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export function useTransactions() {
  const [transactions, setTransactions] = useState<TransactionWithFetchedAt[]>([]);

  const fetchTransactions = useCallback(async (): Promise<void> => {
    const result: GetTransactionsResult = await getTransactions();
    if (result.success) {
      const sortedTransactions = sortTransactionsByDate(
        result.transactions.map(t => ({ ...t, fetchedAt: Date.now(), categories: null }))
      );
      setTransactions(sortedTransactions);
    }
  }, []);

  const addTransaction = useCallback(async (
    transactionData: Omit<TransactionData, "user_id" | "id" | "created_at" | "updated_at">,
    categoryName?: string
  ): Promise<AddTransactionResult> => {
    const result = await addTransactionAction(transactionData, categoryName);
    if (result.success && result.transactionId) {
      const newTransaction: TransactionWithFetchedAt = {
        ...transactionData,
        id: result.transactionId,
        user_id: '', // This should be filled with the actual user_id
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        fetchedAt: Date.now(),
        categories: categoryName ? { id: transactionData.category_id ?? '', name: categoryName } : null
      };
      setTransactions(prevTransactions => {
        const updatedTransactions = [...prevTransactions, newTransaction];
        return sortTransactionsByDate(updatedTransactions);
      });
    }
    return result;
  }, []);

  return { transactions, fetchTransactions, addTransaction };
}