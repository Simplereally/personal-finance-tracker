"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type TransactionWithFetchedAt } from "@/hooks/useTransactions";
import TransactionRow from "./TransactionRow";

interface TransactionsTableProps {
  transactions: TransactionWithFetchedAt[];
}

export default function TransactionsTable({
  transactions,
}: TransactionsTableProps) {
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
                key={`${transaction.id}-${transaction.fetchedAt}`}
                transaction={transaction}
              />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
