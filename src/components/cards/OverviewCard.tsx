import AnimatedCounter from "@/components/AnimatedCounter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type TransactionWithFetchedAt } from "@/hooks/useTransactions";

interface OverviewCardProps {
  transactions: TransactionWithFetchedAt[];
}

export default function OverviewCard({ transactions }: OverviewCardProps) {
  const { income, expense } = transactions.reduce(
    (acc, transaction) => {
      if (transaction.amount > 0) {
        acc.income += transaction.amount;
      } else {
        acc.expense += Math.abs(transaction.amount);
      }
      return acc;
    },
    { income: 0, expense: 0 },
  );

  const balance = income - expense;

  return (
    <Card className="col-span-full md:col-span-1">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Income</p>
            <p className="flex items-center text-2xl font-bold text-green-600">
              +$
              <AnimatedCounter decimal={2} amount={income} />
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Expense</p>
            <p className="flex items-center text-2xl font-bold text-red-600">
              -$
              <AnimatedCounter decimal={2} amount={expense} />
            </p>
          </div>
        </div>
        <div className="border-t pt-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Balance</p>
            <p
              className={`flex items-center text-3xl font-bold ${balance >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              {balance >= 0 ? "+" : "-"}$
              <AnimatedCounter decimal={2} amount={Math.abs(balance)} />
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
