"use client";

import { CategorySelect } from "@/components/CategorySelect";
import { AmountInput } from "@/components/ui/AmountInput";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/DatePicker";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { TableCell } from "@/components/ui/table";
import {
  type TransactionWithFetchedAt,
  type UpdateTransactionParams,
} from "@/types/transaction";
import { format, parseISO } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { Edit, MoreHorizontal, Save, Trash, X } from "lucide-react";
import { useEffect, useState } from "react";

interface TransactionRowProps {
  transaction: TransactionWithFetchedAt;
  onEditTransaction: (
    transactionId: string,
    updatedData: UpdateTransactionParams,
  ) => Promise<void>;
  onDeleteClick: (transactionId: string) => void;
  isDeleting: boolean;
  onTransactionsChange: () => void;
}

export default function TransactionRow({
  transaction,
  onEditTransaction,
  onDeleteClick,
  isDeleting,
  onTransactionsChange,
}: Readonly<TransactionRowProps>) {
  const [isAnimating, setIsAnimating] = useState(transaction.isNew);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTransaction, setEditedTransaction] = useState(transaction);

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedTransaction(transaction);
  };

  const handleSaveEdit = async () => {
    const updatedData: UpdateTransactionParams = {
      amount: parseFloat(editedTransaction.amount.toString()),
      category_id: editedTransaction.category_id,
      date: editedTransaction.date,
      description: editedTransaction.description,
    };
    await onEditTransaction(transaction.id, updatedData);
    setIsEditing(false);
  };

  const handleInputChange = (
    field: keyof UpdateTransactionParams,
    value: string | number,
  ) => {
    setEditedTransaction((prev) => ({ ...prev, [field]: value }));
  };

  const handleCategoryChange = (
    newCategory: { value: string; label: string } | null,
  ) => {
    setEditedTransaction((prev) => ({
      ...prev,
      category_id: newCategory?.value ?? null,
      categories: newCategory
        ? { id: newCategory.value, name: newCategory.label }
        : null,
    }));
  };

  const handleDateChange = (newDate: Date) => {
    const formattedDate = format(newDate, "yyyy-MM-dd");
    handleInputChange("date", formattedDate);
  };

  const formattedDate = format(parseISO(editedTransaction.date), "dd/MM/yyyy");

  return (
    <AnimatePresence>
      {!isDeleting && (
        <motion.tr
          initial={isAnimating ? { opacity: 0, y: -20 } : false}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <TableCell>
            {isEditing ? (
              <DatePicker
                date={parseISO(editedTransaction.date)}
                onDateChange={handleDateChange}
              />
            ) : (
              formattedDate
            )}
          </TableCell>
          <TableCell>
            {isEditing ? (
              <CategorySelect
                value={
                  editedTransaction.category_id
                    ? {
                        value: editedTransaction.category_id,
                        label: editedTransaction.categories?.name ?? "",
                      }
                    : null
                }
                onChange={handleCategoryChange}
                isDisabled={false}
                onTransactionsChange={onTransactionsChange}
                showDeleteAction={false}
                allowAdditions={false} // Disable adding new categories when editing
              />
            ) : (
              (editedTransaction.categories?.name ?? "Uncategorized")
            )}
          </TableCell>
          <TableCell
            className={
              parseFloat(editedTransaction.amount.toString()) < 0
                ? "text-red-500"
                : "text-money-green"
            }
          >
            {isEditing ? (
              <AmountInput
                value={editedTransaction.amount.toString()}
                onChange={(value) => handleInputChange("amount", value)}
              />
            ) : (
              `${parseFloat(editedTransaction.amount.toString()) < 0 ? "-" : ""}$${Math.abs(parseFloat(editedTransaction.amount.toString())).toFixed(2)}`
            )}
          </TableCell>
          <TableCell>
            {isEditing ? (
              <Input
                type="text"
                value={editedTransaction.description ?? ""}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
              />
            ) : (
              editedTransaction.description
            )}
          </TableCell>
          <TableCell>
            {isEditing ? (
              <div className="flex space-x-2">
                <Button
                  onClick={handleSaveEdit}
                  size="sm"
                  className="px-2 py-1"
                >
                  <Save className="mr-1 h-4 w-4" />
                  Save
                </Button>
                <Button
                  onClick={handleCancelEdit}
                  variant="outline"
                  size="sm"
                  className="px-2 py-1"
                >
                  <X className="mr-1 h-4 w-4" />
                  Cancel
                </Button>
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleEditClick}>
                    <Edit className="mr-2 h-4 w-4" />
                    <span>Edit</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onDeleteClick(transaction.id)}
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </TableCell>
        </motion.tr>
      )}
    </AnimatePresence>
  );
}
