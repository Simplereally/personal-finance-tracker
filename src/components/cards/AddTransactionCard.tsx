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
import { useTheme } from "next-themes";
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
  const [isIncome, setIsIncome] = useState(true);
  const { theme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) {
      toast.error("Invalid amount");
      setIsLoading(false);
      return;
    }

    // Apply negative sign for expenses
    const finalAmount = isIncome ? parsedAmount : -parsedAmount;

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

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and decimal point
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setAmount(value);
    }
  };

  const toggleTransactionType = () => {
    setIsIncome(!isIncome);
  };

  const getToggleButtonClass = () => {
    const baseClass =
      "absolute bottom-0 left-0 top-0 flex w-8 items-center justify-center rounded-l-md border-r";
    const incomeClass =
      theme === "dark"
        ? "bg-green-900 text-green-300"
        : "bg-[hsl(var(--toaster-success))] text-white";
    const expenseClass =
      theme === "dark"
        ? "bg-red-900 text-red-300"
        : "bg-[hsl(var(--toaster-error))] text-white";

    return `${baseClass} ${isIncome ? incomeClass : expenseClass}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Add Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Input
              type="text"
              inputMode="decimal"
              placeholder="Amount"
              value={amount}
              onChange={handleAmountChange}
              required
              disabled={isLoading}
              className="pl-14"
            />
            <button
              type="button"
              onClick={toggleTransactionType}
              className={getToggleButtonClass()}
              disabled={isLoading}
            >
              {isIncome ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v12M6 12h12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 12h12"
                  />
                </svg>
              )}
            </button>
          </div>
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
