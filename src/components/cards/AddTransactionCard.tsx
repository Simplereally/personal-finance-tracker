"use client";

import { CategorySelect } from "@/components/CategorySelect";
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
}

export default function AddTransactionCard({
  addTransaction,
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

    const transactionData: Omit<
      TransactionData,
      "user_id" | "id" | "created_at" | "updated_at"
    > = {
      amount: parsedAmount,
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

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers, decimal point, and minus sign
    if (/^-?\d*\.?\d*$/.test(value) || value === "") {
      setAmount(value);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Add Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            inputMode="decimal"
            placeholder="Amount e.g. 20 or -20"
            value={amount}
            onChange={handleAmountChange}
            required
            disabled={isLoading}
          />
          <CategorySelect
            value={category}
            onChange={(newValue) => setCategory(newValue)}
            isDisabled={isLoading}
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
