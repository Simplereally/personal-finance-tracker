import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getTransactions } from "@/server/actions/transaction.actions";
import TransactionRow from "./TransactionRow";

export default async function TransactionsTable() {
  const result = await getTransactions();
  const transactions = result.success
    ? result.transactions.map((t) => ({ ...t, fetchedAt: Date.now() }))
    : [];

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
