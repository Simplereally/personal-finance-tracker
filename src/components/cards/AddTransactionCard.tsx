"use client";

import { CategorySelect } from "@/components/CategorySelect";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { type TransactionData } from "@/types/supabase";
import { type AddTransactionResult } from "@/types/transaction";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
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

    const transactionData: Omit<
      TransactionData,
      "user_id" | "id" | "created_at" | "updated_at"
    > = {
      amount: parseFloat(amount),
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
        <CardTitle>Add Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="number"
            placeholder="Amount ($)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
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
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
                disabled={isLoading}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(date, "PPP")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate: Date | undefined) => {
                  if (newDate) {
                    setDate(newDate);
                  }
                }}
                initialFocus
                disabled={isLoading}
              />
            </PopoverContent>
          </Popover>
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
