"use client";

import { Sidebar } from "@/components/Sidebar";
import { useState } from "react";

export function AppSidebar({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="flex">
      <Sidebar isExpanded={isExpanded} onExpandedChange={setIsExpanded} />
      <main
        className={`flex-1 p-4 transition-all duration-300 md:p-6 ${
          isExpanded ? "md:ml-64" : "md:ml-12"
        }`}
      >
        {children}
      </main>
    </div>
  );
}
