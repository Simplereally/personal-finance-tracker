"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableCell } from "@/components/ui/table";
import { type TransactionWithFetchedAt } from "@/types/transaction";
import { format, parseISO } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { MoreHorizontal, Trash } from "lucide-react";
import { useEffect, useState } from "react";

interface TransactionRowProps {
  transaction: TransactionWithFetchedAt;
  onDeleteClick: (transactionId: string) => void;
  isDeleting: boolean;
}

export default function TransactionRow({
  transaction,
  onDeleteClick,
  isDeleting,
}: Readonly<TransactionRowProps>) {
  const [isAnimating, setIsAnimating] = useState(transaction.isNew);

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  const formattedDate = format(parseISO(transaction.date), "dd/MM/yyyy");

  return (
    <AnimatePresence>
      {!isDeleting && (
        <motion.tr
          initial={isAnimating ? { opacity: 0, y: -20 } : false}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <TableCell>{formattedDate}</TableCell>
          <TableCell>
            {transaction.categories?.name ?? "Uncategorized"}
          </TableCell>
          <TableCell
            className={
              transaction.amount < 0 ? "text-money-red" : "text-money-green"
            }
          >
            ${Math.abs(transaction.amount).toFixed(2)}
          </TableCell>
          <TableCell>{transaction.description}</TableCell>
          <TableCell>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onDeleteClick(transaction.id)}>
                  <Trash className="mr-2 h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </motion.tr>
      )}
    </AnimatePresence>
  );
}
