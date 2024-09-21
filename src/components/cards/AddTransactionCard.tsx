"use client";

import { CategorySelect } from "@/components/CategorySelect";
import { AmountInput } from "@/components/ui/AmountInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/DatePicker";
import { Input } from "@/components/ui/input";
import { type TransactionData } from "@/types/supabase";
import { type AddTransactionResult } from "@/types/transaction";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface AddTransactionCardProps {
  addTransaction: (
    transactionData: Omit<
      TransactionData,
      "user_id" | "id" | "created_at" | "updated_at"
    >,
    categoryName?: string,
  ) => Promise<AddTransactionResult>;
  onTransactionsChange: () => void; // Add this prop
}

export default function AddTransactionCard({
  addTransaction,
  onTransactionsChange,
}: Readonly<AddTransactionCardProps>) {
  const [date, setDate] = useState<Date>(new Date());
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) {
      toast.error("Invalid amount");
      setIsLoading(false);
      return;
    }

    // Use parsedAmount directly, as it now includes the correct sign
    const finalAmount = parsedAmount;

    const transactionData: Omit<
      TransactionData,
      "user_id" | "id" | "created_at" | "updated_at"
    > = {
      amount: finalAmount,
      category_id: category?.value ?? null,
      date: format(date, "yyyy-MM-dd"),
      description: description || null,
    };

    try {
      const result = await addTransaction(transactionData, category?.label);

      if (result.success) {
        toast.success("Transaction added successfully");
        setAmount("");
        setDescription("");
      } else {
        toast.error(result.error ?? "Failed to add transaction");
      }
    } catch (error) {
      console.error("Error adding transaction:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Add Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <AmountInput
            value={amount}
            onChange={setAmount}
            disabled={isLoading}
            required
          />
          <CategorySelect
            value={category}
            onChange={(newValue) => setCategory(newValue)}
            isDisabled={isLoading}
            required
            onTransactionsChange={onTransactionsChange}
            showDeleteAction
            allowAdditions // Add this prop to enable adding new categories
          />
          <Input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isLoading}
          />
          <DatePicker date={date} onDateChange={setDate} />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              "Add Transaction"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
