"use client";

import AddTransactionCard from "@/components/cards/AddTransactionCard";
import OverviewCard from "@/components/cards/OverviewCard";
import TransactionsTable from "@/components/cards/TransactionsTable";
import { TransactionFilters } from "@/components/TransactionFilters";
import { useTransactions } from "@/hooks/useTransactions";
import { type TransactionWithFetchedAt } from "@/types/transaction";
import { useEffect, useState } from "react";

export default function DashboardContent() {
  const {
    transactions,
    isLoading,
    fetchTransactions,
    addTransaction,
    deleteTransaction,
    editTransaction,
  } = useTransactions();

  const [filteredTransactions, setFilteredTransactions] =
    useState<TransactionWithFetchedAt[]>(transactions);

  useEffect(() => {
    void fetchTransactions();
  }, [fetchTransactions]);

  useEffect(() => {
    setFilteredTransactions(transactions);
  }, [transactions]);

  const handleFilterChange = (filters: {
    month: string | null;
    year: string | null;
  }) => {
    const filtered = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      const monthMatch = filters.month
        ? transactionDate.getMonth() + 1 === parseInt(filters.month)
        : true;
      const yearMatch = filters.year
        ? transactionDate.getFullYear() === parseInt(filters.year)
        : true;
      return monthMatch && yearMatch;
    });
    setFilteredTransactions(filtered);
  };

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="col-span-1 md:col-span-2 lg:col-span-1">
          <AddTransactionCard
            addTransaction={addTransaction}
            onTransactionsChange={fetchTransactions}
          />
        </div>
        <div className="col-span-1 md:col-span-2 lg:col-span-2">
          <OverviewCard
            transactions={filteredTransactions}
            isLoading={isLoading}
          />
        </div>
      </div>
      <div className="mt-8">
        <TransactionFilters onFilterChange={handleFilterChange} />
        <TransactionsTable
          transactions={filteredTransactions}
          onDeleteTransaction={deleteTransaction}
          onEditTransaction={editTransaction}
          onTransactionsChange={fetchTransactions}
          isLoading={isLoading}
        />
      </div>
    </>
  );
}
