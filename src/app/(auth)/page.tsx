import AddTransactionCard from "@/components/cards/AddTransactionCard";
import OverviewCard from "@/components/cards/OverviewCard";
import TransactionsTable from "@/components/cards/TransactionsTable";

export default function Dashboard() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <AddTransactionCard />
      <OverviewCard />
      <TransactionsTable />
    </div>
  );
}
