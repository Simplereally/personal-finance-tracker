"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Menu,
  Settings,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const sidebarVariants = {
  expanded: { width: "16rem" },
  collapsed: { width: "4rem" },
};

const linkItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar({
  onExpandedChange,
}: Readonly<{
  onExpandedChange: (expanded: boolean) => void;
}>) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const pathname = usePathname();

  const toggleExpanded = () => {
    const newExpandedState = !isExpanded;
    setIsExpanded(newExpandedState);
    onExpandedChange(newExpandedState);
  };

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="fixed left-4 top-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>
      <motion.div
        className="shadow-sidebar border-sidebar fixed left-0 top-0 z-40 h-full w-64 border-r bg-background md:hidden"
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={{
          open: { x: 0 },
          closed: { x: "-100%" },
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex h-full flex-col p-4">
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
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </motion.div>
      <div className="hidden md:block">
        <motion.div
          className="shadow-sidebar border-sidebar fixed left-0 top-0 z-40 h-full border-r bg-background"
          initial="expanded"
          animate={isExpanded ? "expanded" : "collapsed"}
          variants={sidebarVariants}
          transition={{ duration: 0.3 }}
        >
          <div className="flex h-full flex-col p-4">
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
                      <item.icon className="h-4 w-4" />
                      {isExpanded && <span className="ml-2">{item.label}</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </motion.div>
      </div>
    </>
  );
}
