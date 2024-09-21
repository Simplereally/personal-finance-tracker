import AnimatedCounter from "@/components/AnimatedCounter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type TransactionWithFetchedAt } from "@/types/transaction";
import { ArrowDownIcon, ArrowUpIcon, Loader2, ScaleIcon } from "lucide-react";
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
          <CardTitle className="text-xl font-semibold">Overview</CardTitle>
        </CardHeader>
        <CardContent className="flex h-40 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  const balanceColor = balance >= 0 ? "green" : "red";

  return (
    <Card className="col-span-full md:col-span-1">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2 rounded-lg bg-green-50 p-3 dark:bg-green-900/20">
            <div className="flex items-center space-x-2">
              <ArrowUpIcon className="h-5 w-5 text-green-600" />
              <p className="text-sm font-medium">Income</p>
            </div>
            <p className="text-lg font-semibold text-green-600">
              $
              {shouldAnimate ? (
                <AnimatedCounter decimal={2} amount={income} />
              ) : (
                income.toFixed(2)
              )}
            </p>
          </div>
          <div className="space-y-2 rounded-lg bg-red-50 p-3 dark:bg-red-900/20">
            <div className="flex items-center space-x-2">
              <ArrowDownIcon className="h-5 w-5 text-red-600" />
              <p className="text-sm font-medium">Expense</p>
            </div>
            <p className="text-lg font-semibold text-red-600">
              $
              {shouldAnimate ? (
                <AnimatedCounter decimal={2} amount={expense} />
              ) : (
                expense.toFixed(2)
              )}
            </p>
          </div>
        </div>
        <div
          className={`space-y-2 rounded-lg bg-${balanceColor}-50 p-3 dark:bg-${balanceColor}-900/20`}
        >
          <div className="flex items-center space-x-2">
            <ScaleIcon className={`h-5 w-5 text-${balanceColor}-600`} />
            <p className="text-sm font-medium">Balance</p>
          </div>
          <p className={`text-xl font-semibold text-${balanceColor}-600`}>
            {balance >= 0 ? "+" : "-"}$
            {shouldAnimate ? (
              <AnimatedCounter decimal={2} amount={Math.abs(balance)} />
            ) : (
              Math.abs(balance).toFixed(2)
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
