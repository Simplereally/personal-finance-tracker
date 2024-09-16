"use client";

import { getCategories } from "@/server/actions/category.actions";
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
}

export function CategorySelect({ value, onChange }: CategorySelectProps) {
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

  const handleCategoryChange = useCallback(
    (newCategory: Category | null) => {
      onChange(newCategory);
    },
    [onChange],
  );

  return (
    <Creatable
      isClearable
      options={categories}
      value={value}
      onChange={handleCategoryChange}
      placeholder="Select or create a category..."
    />
  );
}
