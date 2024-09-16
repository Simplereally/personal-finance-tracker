"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getTransactions } from "@/server/actions/transaction.actions";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import TransactionRow from "./TransactionRow";

export default function TransactionsTable() {
  const [transactions, setTransactions] = useState([]);
  const [newTransactionIds, setNewTransactionIds] = useState(new Set());
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchTransactions = async () => {
      const result = await getTransactions();
      if (result.success) {
        setTransactions(result.transactions);
      }
    };

    fetchTransactions();

    const newId = searchParams.get("newTransactionId");
    if (newId) {
      setNewTransactionIds((prev) => new Set(prev).add(newId));
    }
  }, [searchParams]);

  return (
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TransactionRow
                key={transaction.id}
                transaction={transaction}
                isNew={newTransactionIds.has(transaction.id)}
              />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
