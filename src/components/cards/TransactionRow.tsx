"use client";

import { TableCell } from "@/components/ui/table";
import { type TransactionData } from "@/types/supabase";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface TransactionRowProps {
  transaction: TransactionData & {
    categories: { id: string; name: string } | null;
  };
}

export default function TransactionRow({ transaction }: TransactionRowProps) {
  const [isNew, setIsNew] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsNew(false), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.tr
      initial={isNew ? { opacity: 0, y: -20 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
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
