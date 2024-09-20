import AnimatedCounter from "@/components/AnimatedCounter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type TransactionWithFetchedAt } from "@/types/transaction";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface OverviewCardProps {
  transactions: TransactionWithFetchedAt[];
  isLoading: boolean;
}

export default function OverviewCard({
  transactions,
  isLoading,
}: Readonly<OverviewCardProps>) {
  const [shouldAnimate, setShouldAnimate] = useState(false);

  const { income, expense } = transactions.reduce(
    (acc, transaction) => {
      const amount = Number(transaction.amount);
      if (amount > 0) {
        acc.income += amount;
      } else {
        acc.expense += Math.abs(amount);
      }
      return acc;
    },
    { income: 0, expense: 0 },
  );

  const balance = income - expense;

  useEffect(() => {
    if (!isLoading) {
      setShouldAnimate(true);
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <Card className="col-span-full md:col-span-1">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Overview</CardTitle>
        </CardHeader>
        <CardContent className="flex h-40 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-full md:col-span-1">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-lg font-medium text-muted-foreground">Income</p>
            <p className="text-2xl font-bold text-green-500 text-shadow-sm">
              +$
              {shouldAnimate ? (
                <AnimatedCounter decimal={2} amount={income} />
              ) : (
                income.toFixed(2)
              )}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-lg font-medium text-muted-foreground">Expense</p>
            <p className="text-2xl font-bold text-red-500 text-shadow-sm">
              -$
              {shouldAnimate ? (
                <AnimatedCounter decimal={2} amount={expense} />
              ) : (
                expense.toFixed(2)
              )}
            </p>
          </div>
        </div>
        <div className="border-t pt-4">
          <div className="space-y-2">
            <p className="text-lg font-medium text-muted-foreground">Balance</p>
            <p
              className={`text-3xl font-bold text-shadow-sm ${
                balance >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {balance >= 0 ? "+" : "-"}$
              {shouldAnimate ? (
                <AnimatedCounter decimal={2} amount={Math.abs(balance)} />
              ) : (
                Math.abs(balance).toFixed(2)
              )}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
