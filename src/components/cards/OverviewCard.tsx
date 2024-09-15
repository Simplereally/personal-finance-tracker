import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function OverviewCard() {
  // This is a placeholder. In a real application, you'd fetch this data from your backend.
  const data = {
    income: 5000,
    expense: 3000,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-green-600">Income: ${data.income}</p>
          <p className="text-red-600">Expense: ${data.expense}</p>
        </div>
      </CardContent>
    </Card>
  );
}
