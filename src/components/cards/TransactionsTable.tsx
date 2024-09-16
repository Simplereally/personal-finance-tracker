"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type TransactionWithFetchedAt } from "@/hooks/useTransactions";
import { useState } from "react";
import TransactionRow from "./TransactionRow";

interface TransactionsTableProps {
  transactions: TransactionWithFetchedAt[];
  onDeleteTransaction: (transactionId: string) => Promise<void>;
}

export default function TransactionsTable({
  transactions,
  onDeleteTransaction,
}: TransactionsTableProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(
    null,
  );

  const handleDeleteClick = (transactionId: string) => {
    setTransactionToDelete(transactionId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (transactionToDelete) {
      await onDeleteTransaction(transactionToDelete);
      setIsDeleteDialogOpen(false);
      setTransactionToDelete(null);
    }
  };

  return (
    <>
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
        </CardHeader>
        <CardContent>
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
                />
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              transaction.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              variant="destructive"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
