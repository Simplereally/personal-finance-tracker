"use client";

import AddTransactionCard from "@/components/cards/AddTransactionCard";
import OverviewCard from "@/components/cards/OverviewCard";
import TransactionsTable from "@/components/cards/TransactionsTable";
import { TransactionFilters } from "@/components/TransactionFilters";
import { useTransactions } from "@/hooks/useTransactions";
import { useEffect, useMemo, useState } from "react";

export default function DashboardContent() {
  const {
    transactions,
    isLoading,
    fetchTransactions,
    addTransaction,
    deleteTransaction,
    editTransaction,
  } = useTransactions();

  const [filters, setFilters] = useState<{
    month: string | null;
    year: string | null;
  }>({ month: null, year: null });

  useEffect(() => {
    void fetchTransactions();
  }, [fetchTransactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      const monthMatch = filters.month
        ? transactionDate.getMonth() + 1 === parseInt(filters.month)
        : true;
      const yearMatch = filters.year
        ? transactionDate.getFullYear() === parseInt(filters.year)
        : true;
      return monthMatch && yearMatch;
    });
  }, [transactions, filters]);

  const handleFilterChange = (newFilters: {
    month: string | null;
    year: string | null;
  }) => {
    setFilters(newFilters);
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
