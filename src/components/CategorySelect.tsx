"use client";

import { cn } from "@/lib/utils";
import {
  createCategory,
  getCategories,
} from "@/server/actions/category.actions";
import { type CategoryData } from "@/types/supabase";
import { useCallback, useEffect, useState } from "react";
import Creatable from "react-select/creatable";
import { toast } from "sonner";

export interface Category {
  value: string;
  label: string;
}

interface CategorySelectProps {
  value: Category | null;
  onChange: (category: Category | null) => void;
  isDisabled: boolean;
}

export function CategorySelect({
  value,
  onChange,
  isDisabled,
}: Readonly<CategorySelectProps>) {
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

  const handleCreateCategory = useCallback(
    async (inputValue: string) => {
      const result = await createCategory(inputValue);
      if (result.success && result.categories.length > 0) {
        const newCategory = {
          value: result.categories[0]?.id ?? "",
          label: result.categories[0]?.name ?? "",
        };
        setCategories((prev) => [...prev, newCategory]);
        onChange(newCategory);
      } else {
        toast.error(result.error ?? "Failed to create category");
      }
    },
    [onChange],
  );

  const handleCategoryChange = useCallback(
    (newCategory: Category | null, actionMeta: { action: string }) => {
      if (actionMeta.action === "create-option") {
        void handleCreateCategory(newCategory?.label ?? "");
      } else {
        onChange(newCategory);
      }
    },
    [onChange, handleCreateCategory],
  );

  return (
    <Creatable
      isDisabled={isDisabled}
      isClearable
      options={categories}
      value={value}
      required
      onChange={handleCategoryChange}
      placeholder="Select or create a category..."
      classNames={{
        control: (state) =>
          cn(
            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium",
            "placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
            "disabled:cursor-not-allowed disabled:opacity-50",
            state.isFocused && "ring-1 ring-ring",
          ),
        menu: () =>
          "mt-2 rounded-md border bg-popover text-popover-foreground shadow-md",
        option: (state) =>
          cn(
            "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
            state.isFocused && "bg-accent text-accent-foreground",
            state.isSelected && "bg-primary text-primary-foreground",
          ),
      }}
      unstyled
    />
  );
}
