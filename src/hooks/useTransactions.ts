import { addTransaction as addTransactionAction, deleteTransaction as deleteTransactionAction, editTransaction as editTransactionAction, getTransactions } from "@/server/actions/transaction.actions";
import { type AddTransactionParams, type AddTransactionResult, type DeleteTransactionResult, type GetTransactionsResult, type TransactionWithFetchedAt, type UpdateTransactionParams } from "@/types/transaction";
import { format, startOfDay } from 'date-fns';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

// Helper function to standardize date
const standardizeDate = (dateString: string): string => {
  const date = new Date(dateString);
  return format(startOfDay(date), "yyyy-MM-dd");
};

// Helper function to sort transactions by date and then by created_at
const sortTransactions = (transactions: TransactionWithFetchedAt[]) => {
  return transactions.sort((a, b) => {
    const dateComparison = new Date(b.date).getTime() - new Date(a.date).getTime();
    if (dateComparison === 0) {
      // If dates are the same, sort by created_at
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    return dateComparison;
  });
};

export function useTransactions() {
  const [transactions, setTransactions] = useState<TransactionWithFetchedAt[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTransactions = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    const result: GetTransactionsResult = await getTransactions();
    if (result.success) {
      const standardizedTransactions = result.transactions.map(t => ({
        ...t,
        date: standardizeDate(t.date),
        fetchedAt: Date.now(),
        isNew: false
      }));
      setTransactions(sortTransactions(standardizedTransactions));
    } else {
      // Handle error case
      console.error("Failed to fetch transactions:", result.error);
      // Optionally set transactions to an empty array or keep the previous state
      // setTransactions([]);
    }
    setIsLoading(false);
  }, []);

  const addTransaction = useCallback(async (
    transactionData: Omit<AddTransactionParams, "user_id">,
    categoryName?: string
  ): Promise<AddTransactionResult> => {
    const standardizedTransactionData = {
      ...transactionData,
      date: standardizeDate(transactionData.date),
      amount: Number(transactionData.amount), // Ensure amount is rounded to 2 decimal places
    };
    const result = await addTransactionAction(standardizedTransactionData, categoryName);
    if (result.success && result.transactionId) {
      const newTransaction: TransactionWithFetchedAt = {
        ...standardizedTransactionData,
        id: result.transactionId,
        user_id: '', // This should be filled with the actual user_id
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        fetchedAt: Date.now(),
        categories: categoryName 
          ? { id: standardizedTransactionData.category_id ?? result.transactionId, name: categoryName } 
          : null,
        isNew: true
      };
      setTransactions(prevTransactions => {
        const updatedTransactions = [...prevTransactions, newTransaction];
        return sortTransactions(updatedTransactions);
      });
      return { ...result, transactionId: newTransaction.id };
    }
    return result;
  }, []);

  const deleteTransaction = useCallback(async (transactionId: string): Promise<void> => {
    const result: DeleteTransactionResult = await deleteTransactionAction(transactionId);
    if (result.success) {
      setTransactions(prevTransactions => 
        prevTransactions.filter(t => t.id !== transactionId)
      );
      toast.success("Transaction deleted successfully");
    } else {
      toast.error(result.error ?? "Failed to delete transaction");
    }
  }, []);

  const editTransaction = useCallback(async (
    transactionId: string,
    updatedData: UpdateTransactionParams
  ): Promise<void> => {
    const result = await editTransactionAction(transactionId, updatedData);
    if (result.success && result.transaction) {
      setTransactions(prevTransactions =>
        prevTransactions.map(t =>
          t.id === transactionId ? { ...t, ...result.transaction, updated_at: new Date().toISOString() } : t
        )
      );
      toast.success("Transaction updated successfully");
    } else {
      console.error(result.error);
      toast.error(result.error ?? "Failed to update transaction");
    }
  }, []);

  return { transactions, isLoading, fetchTransactions, addTransaction, deleteTransaction, editTransaction };
}