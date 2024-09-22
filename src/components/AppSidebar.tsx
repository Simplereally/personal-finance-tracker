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
      <div className="flex-1">
        {/* Mobile view */}
        <main className="p-4 md:hidden">{children}</main>

        {/* Desktop view with animation */}
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
    </div>
  );
}
