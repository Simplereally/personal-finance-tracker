"use client";

import { TableCell } from "@/components/ui/table";
import { type TransactionData } from "@/types/supabase";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface TransactionRowProps {
  transaction: TransactionData & {
    categories: { id: string; name: string } | null;
    fetchedAt: number;
  };
}

export default function TransactionRow({
  transaction,
}: Readonly<TransactionRowProps>) {
  const locale = navigator.language || "en-AU";
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };
  const isNewTransaction =
    new Date(transaction.created_at).getTime() > transaction.fetchedAt - 500;
  const [isAnimating, setIsAnimating] = useState(isNewTransaction);
  console.log(navigator.language);
  console.log(transaction.date);
  useEffect(() => {
    if (isNewTransaction) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 800); // Match this with the animation duration
      return () => clearTimeout(timer);
    }
  }, [transaction.id, isNewTransaction, isAnimating]);

  return (
    <motion.tr
      initial={isAnimating ? { opacity: 0, y: -20 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <TableCell>
        {new Date(transaction.date).toLocaleDateString(locale, options)}
      </TableCell>
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
