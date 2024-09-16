"use client";

import AddTransactionCard from "@/components/cards/AddTransactionCard";
import OverviewCard from "@/components/cards/OverviewCard";
import TransactionsTable from "@/components/cards/TransactionsTable";
import { useTransactions } from "@/hooks/useTransactions";
import { useEffect } from "react";

export default function Dashboard() {
  const { transactions, fetchTransactions, addTransaction } = useTransactions();

  useEffect(() => {
    void fetchTransactions();
  }, [fetchTransactions]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <AddTransactionCard addTransaction={addTransaction} />
      <OverviewCard />
      <TransactionsTable transactions={transactions} />
    </div>
  );
}
