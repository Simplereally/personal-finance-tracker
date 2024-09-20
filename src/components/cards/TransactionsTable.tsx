"use client";

import { Modal } from "@/components/ui/Modal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type TransactionWithFetchedAt } from "@/types/transaction";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import TransactionRow from "./TransactionRow";

interface TransactionsTableProps {
  transactions: TransactionWithFetchedAt[];
  onDeleteTransaction: (transactionId: string) => Promise<void>;
  isLoading: boolean;
}

export default function TransactionsTable({
  transactions,
  onDeleteTransaction,
  isLoading,
}: Readonly<TransactionsTableProps>) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(
    null,
  );
  const [deletingTransactions, setDeletingTransactions] = useState<Set<string>>(
    new Set(),
  );

  const handleDeleteClick = (transactionId: string) => {
    setTransactionToDelete(transactionId);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (transactionToDelete) {
      setDeletingTransactions((prev) => new Set(prev).add(transactionToDelete));
      setIsDeleteModalOpen(false);

      // Wait for the animation to complete before actually deleting
      setTimeout(() => {
        void deleteTransactionAfterDelay(transactionToDelete);
      }, 500);
    }
  };

  const deleteTransactionAfterDelay = async (id: string) => {
    try {
      await onDeleteTransaction(id);
    } catch (error) {
      console.error("Failed to delete transaction:", error);
      // Optionally, show an error toast here
    } finally {
      setDeletingTransactions((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
      setTransactionToDelete(null);
    }
  };

  return (
    <>
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex h-32 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TransactionRow
                    key={`${transaction.id}-${transaction.fetchedAt}`}
                    transaction={transaction}
                    onDeleteClick={handleDeleteClick}
                    isDeleting={deletingTransactions.has(transaction.id)}
                  />
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Transaction"
        description="Are you sure you want to delete this transaction? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
}
