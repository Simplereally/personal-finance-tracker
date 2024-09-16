import DashboardContent from "@/components/DashboardContent";

export default function Dashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-primary">Your Dashboard</h1>
      <DashboardContent />
    </div>
  );
}
