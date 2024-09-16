import AddTransactionCard from "@/components/cards/AddTransactionCard";
import OverviewCard from "@/components/cards/OverviewCard";
import TransactionsTable from "@/components/cards/TransactionsTable";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default function Dashboard() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <AddTransactionCard />
      <OverviewCard />
      <Suspense fallback={<Skeleton className="h-[200px] w-full" />}>
        <TransactionsTable />
      </Suspense>
    </div>
  );
}
