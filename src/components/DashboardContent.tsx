"use client";

import AddTransactionCard from "@/components/cards/AddTransactionCard";
import OverviewCard from "@/components/cards/OverviewCard";
import TransactionsTable from "@/components/cards/TransactionsTable";
import { useTransactions } from "@/hooks/useTransactions";
import { useEffect } from "react";

export default function DashboardContent() {
  const {
    transactions,
    isLoading,
    fetchTransactions,
    addTransaction,
    deleteTransaction,
    editTransaction,
  } = useTransactions();

  useEffect(() => {
    void fetchTransactions();
  }, [fetchTransactions]);

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="col-span-1 md:col-span-2 lg:col-span-1">
          <AddTransactionCard
            addTransaction={addTransaction}
            onTransactionsChange={fetchTransactions} // Add this prop
          />
        </div>
        <div className="col-span-1 md:col-span-2 lg:col-span-2">
          <OverviewCard transactions={transactions} isLoading={isLoading} />
        </div>
      </div>
      <div className="mt-8">
        <TransactionsTable
          transactions={transactions}
          onDeleteTransaction={deleteTransaction}
          onEditTransaction={editTransaction}
          onTransactionsChange={fetchTransactions}
          isLoading={isLoading}
        />
      </div>
    </>
  );
}
