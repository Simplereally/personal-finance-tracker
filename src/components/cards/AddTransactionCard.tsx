"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getCategories } from "@/server/actions/category.actions";
import { addTransaction } from "@/server/actions/transaction.actions";
import { type CategoryData, type TransactionData } from "@/types/supabase";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Creatable from "react-select/creatable";
import { toast } from "sonner";

interface Category {
  value: string;
  label: string;
}

export default function AddTransactionCard() {
  const [date, setDate] = useState<Date>(new Date());
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<Category | null>(null);
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const { categories, error } = await getCategories();
      if (error) {
        console.error("Error fetching categories:", error);
        toast.error(error);
      } else {
        setCategories(
          categories.map((cat: CategoryData) => ({
            value: cat.id,
            label: cat.name,
          })),
        );
      }
    };
    void fetchCategories();
  }, []);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const transactionData: Omit<
      TransactionData,
      "user_id" | "id" | "created_at" | "updated_at"
    > = {
      amount: parseFloat(amount),
      category_id: null, // We'll set this to null for new categories
      date: date.toISOString().split("T")[0] ?? "",
      description: description || null,
    };

    let categoryName: string | undefined;

    if (category) {
      if ("__isNew__" in category) {
        // This is a new category
        categoryName = category.label;
      } else {
        // This is an existing category
        transactionData.category_id = category.value;
      }
    }

    const result = await addTransaction(transactionData, categoryName);

    if (result.success) {
      toast.success("Transaction added successfully");
      setAmount("");
      setCategory(null);
      setDescription("");
      setDate(new Date());

      // Refresh the current route
      router.refresh();
    } else {
      toast.error(result.error ?? "Failed to add transaction");
    }

    setIsLoading(false);
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
          />
          <Creatable
            isClearable
            options={categories}
            value={category}
            onChange={setCategory}
            placeholder="Select or create a category..."
          />
          <Input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
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
              />
            </PopoverContent>
          </Popover>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Adding..." : "Add Transaction"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
