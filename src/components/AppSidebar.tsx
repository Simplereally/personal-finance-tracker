"use client";

import { Sidebar } from "@/components/Sidebar";
import { motion } from "framer-motion";
import { useState } from "react";

export function AppSidebar({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  return (
    <div className="flex">
      <Sidebar onExpandedChange={setIsSidebarExpanded} />
      <motion.main
        className="flex-1 p-4 transition-all duration-300 md:p-6"
        initial={false}
        animate={{
          marginLeft: isSidebarExpanded ? "16rem" : "4rem",
        }}
        transition={{ duration: 0.1 }}
      >
        {children}
      </motion.main>
    </div>
  );
}
