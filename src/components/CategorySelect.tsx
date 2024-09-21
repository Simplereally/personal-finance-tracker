"use client";

import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/utils";
import {
  createCategory,
  deleteCategory,
  deleteCategoryAndTransactions,
  getCategories,
} from "@/server/actions/category.actions";
import { type CategoryData } from "@/types/supabase";
import { X } from "lucide-react";
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
  required?: boolean;
  onTransactionsChange: () => void;
  showDeleteAction?: boolean;
  allowAdditions?: boolean; // Add this new prop
}

export function CategorySelect({
  value,
  onChange,
  isDisabled,
  required = false,
  onTransactionsChange,
  showDeleteAction = false,
  allowAdditions = false, // Add this with a default value of false
}: Readonly<CategorySelectProps>) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleteTransactionsModalOpen, setIsDeleteTransactionsModalOpen] =
    useState(false);

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
      if (!allowAdditions) {
        // If additions are not allowed, don't create a new category
        return;
      }
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
    [onChange, allowAdditions],
  );

  const handleCategoryChange = useCallback(
    (newCategory: Category | null, actionMeta: { action: string }) => {
      if (actionMeta.action === "create-option" && allowAdditions) {
        void handleCreateCategory(newCategory?.label ?? "");
      } else if (actionMeta.action === "clear") {
        onChange(null);
      } else {
        onChange(newCategory);
      }
    },
    [onChange, handleCreateCategory, allowAdditions],
  );

  const handleDeleteClick = (categoryId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setCategoryToDelete(categoryId);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (categoryToDelete) {
      try {
        const result = await deleteCategory(categoryToDelete);
        if (result.success) {
          setCategories((prev) =>
            prev.filter((cat) => cat.value !== categoryToDelete),
          );
          if (value?.value === categoryToDelete) {
            onChange(null);
          }
          toast.success("Category deleted successfully");
        } else if (result.error === "TRANSACTIONS_EXIST") {
          toast.error(
            "Unable to delete category - transactions exist for this category.",
            {
              action: {
                label: "Delete transactions",
                onClick: () => setIsDeleteTransactionsModalOpen(true),
              },
            },
          );
        } else {
          toast.error(result.error ?? "Failed to delete category");
        }
      } catch (error) {
        console.error("Error deleting category:", error);
        toast.error("An unexpected error occurred");
      }
      setIsDeleteModalOpen(false);
    }
  };

  const handleDeleteTransactionsConfirm = async () => {
    if (categoryToDelete) {
      try {
        const result = await deleteCategoryAndTransactions(categoryToDelete);
        if (result.success) {
          setCategories((prev) =>
            prev.filter((cat) => cat.value !== categoryToDelete),
          );
          if (value?.value === categoryToDelete) {
            onChange(null);
          }
          toast.success(
            "Category and associated transactions deleted successfully",
          );
          onTransactionsChange(); // This should now work correctly
        } else {
          toast.error(
            result.error ?? "Failed to delete category and transactions",
          );
        }
      } catch (error) {
        console.error("Error deleting category and transactions:", error);
        toast.error("An unexpected error occurred");
      }
      setIsDeleteTransactionsModalOpen(false);
      setCategoryToDelete(null);
    }
  };

  interface CustomOptionProps {
    innerProps: React.HTMLAttributes<HTMLDivElement>;
    label: string;
    data: Category;
  }

  const customOption = ({ innerProps, label, data }: CustomOptionProps) => (
    <div
      {...innerProps}
      className="flex items-center justify-between px-3 py-2 hover:bg-accent"
    >
      <span>{label}</span>
      {showDeleteAction && ( // Only render the delete button if showDeleteAction is true
        <X
          className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-foreground"
          onClick={(e) => handleDeleteClick(data.value, e)}
        />
      )}
    </div>
  );

  return (
    <>
      <Creatable
        required={required}
        isDisabled={isDisabled}
        isClearable
        options={categories}
        value={value}
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
          option: () => "cursor-default",
        }}
        components={{
          Option: customOption,
        }}
        unstyled
        isValidNewOption={(inputValue) =>
          allowAdditions && inputValue.length > 0
        }
      />
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Category"
        description="Are you sure you want to delete this category?"
        confirmText="Delete"
        cancelText="Cancel"
      />
      <Modal
        isOpen={isDeleteTransactionsModalOpen}
        onClose={() => setIsDeleteTransactionsModalOpen(false)}
        onConfirm={handleDeleteTransactionsConfirm}
        title="Delete Category and Transactions"
        description="Are you sure you want to delete this category and all associated transactions? This action cannot be undone."
        confirmText="Delete All"
        cancelText="Cancel"
      />
    </>
  );
}
