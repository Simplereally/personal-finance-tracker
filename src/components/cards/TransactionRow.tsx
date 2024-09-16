"use client";

import { TableCell } from "@/components/ui/table";
import { type TransactionWithFetchedAt } from "@/hooks/useTransactions";
import { format, parseISO } from "date-fns";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface TransactionRowProps {
  transaction: TransactionWithFetchedAt;
}

export default function TransactionRow({
  transaction,
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
    <motion.tr
      initial={isAnimating ? { opacity: 0, y: -20 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <TableCell>{formattedDate}</TableCell>
      <TableCell>{transaction.categories?.name ?? "Uncategorized"}</TableCell>
      <TableCell
        className={transaction.amount < 0 ? "text-red-600" : "text-green-600"}
      >
        ${Math.abs(transaction.amount).toFixed(2)}
      </TableCell>
      <TableCell>{transaction.description}</TableCell>
    </motion.tr>
  );
}
