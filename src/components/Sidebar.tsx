"use client";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/Modal";
import { signOut } from "@/server/actions/auth.actions";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  LogOut,
  Menu,
  Settings,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

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
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const toggleExpanded = () => {
    const newExpandedState = !isExpanded;
    setIsExpanded(newExpandedState);
    onExpandedChange(newExpandedState);
  };

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const handleLogoutConfirm = async () => {
    setIsLogoutModalOpen(false);
    try {
      await signOut();
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Failed to log out. Please try again.");
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="fixed left-6 top-6 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>
      <motion.div
        className="fixed left-0 top-0 z-40 h-full border-r border-[var(--sidebar-border)] bg-background shadow-[var(--sidebar-shadow)] md:hidden"
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={{
          open: { x: 0 },
          closed: { x: "-100%" },
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex h-full flex-col p-2">
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
          className="shadow-sidebar border-sidebar fixed left-0 top-0 z-40 flex h-full flex-col border-r bg-background"
          initial="expanded"
          animate={isExpanded ? "expanded" : "collapsed"}
          variants={sidebarVariants}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-1 flex-col p-3">
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
                      <item.icon
                        className={isExpanded ? "h-4 w-4" : "h-6 w-6"}
                      />
                      {isExpanded && <span className="ml-2">{item.label}</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <div className="p-4">
            <Button
              variant="ghost"
              className={`w-full justify-start ${isExpanded ? "px-2" : "px-0"}`}
              onClick={handleLogoutClick}
            >
              <LogOut className={isExpanded ? "h-4 w-4" : "h-6 w-6"} />
              {isExpanded && <span className="ml-2">Logout</span>}
            </Button>
          </div>
        </motion.div>
      </div>
      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
        title="Confirm Logout"
        description="Are you sure you want to log out?"
        confirmText="Logout"
        cancelText="Cancel"
      />
    </>
  );
}
