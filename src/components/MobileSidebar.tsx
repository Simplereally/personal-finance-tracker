"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Home, LogOut, Menu, Settings, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const linkItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/settings", label: "Settings", icon: Settings },
];

interface MobileSidebarProps {
  onLogoutClick: () => void;
}

export function MobileSidebar({ onLogoutClick }: Readonly<MobileSidebarProps>) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="fixed right-2 top-2 z-50 h-10 w-10 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>
      <motion.div
        className="fixed inset-0 z-40 flex flex-col bg-background shadow-[var(--sidebar-shadow)] md:hidden"
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={{
          open: { x: 0 },
          closed: { x: "100%" },
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex h-full flex-col">
          <nav className="flex-grow overflow-y-auto p-4 pt-14">
            <ul className="space-y-2">
              {linkItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center rounded-lg p-3 text-base font-medium ${
                      pathname === item.href
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="border-t p-4">
            <Button
              variant="secondary"
              className={`w-full`}
              onClick={onLogoutClick}
            >
              <LogOut className={"h-4 w-4"} />
              <span className="ml-2">Logout</span>
            </Button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
