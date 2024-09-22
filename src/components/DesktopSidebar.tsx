"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  LogOut,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebarVariants = {
  expanded: { width: "16rem" },
  collapsed: { width: "3rem" },
};

const linkItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/settings", label: "Settings", icon: Settings },
];

interface DesktopSidebarProps {
  isExpanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
  onLogoutClick: () => void;
}

export function DesktopSidebar({
  isExpanded,
  onExpandedChange,
  onLogoutClick,
}: Readonly<DesktopSidebarProps>) {
  const pathname = usePathname();

  const toggleExpanded = () => {
    onExpandedChange(!isExpanded);
  };

  return (
    <div className="hidden md:block">
      <motion.div
        className="shadow-sidebar border-sidebar fixed left-0 top-0 z-40 flex h-full flex-col border-r bg-background"
        initial="expanded"
        animate={isExpanded ? "expanded" : "collapsed"}
        variants={sidebarVariants}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-1 flex-col p-1">
          <div className="mb-8 flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleExpanded}
              className="ml-auto"
            >
              {isExpanded ? (
                <ChevronLeft className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </div>
          <nav className="flex-1">
            <ul className="space-y-2">
              {linkItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center rounded-lg p-2 text-sm font-medium ${
                      pathname === item.href
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    <item.icon className={isExpanded ? "h-4 w-4" : "h-6 w-6"} />
                    {isExpanded && <span className="ml-2">{item.label}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="p-3">
          <Button
            variant="ghost"
            className={`w-full justify-start ${isExpanded ? "px-2" : "px-0"}`}
            onClick={onLogoutClick}
          >
            <LogOut className={isExpanded ? "h-4 w-4" : "h-6 w-6"} />
            {isExpanded && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
