"use client";

import { Modal } from "@/components/ui/Modal";
import { signOut } from "@/server/actions/auth.actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { DesktopSidebar } from "./DesktopSidebar";
import { MobileSidebar } from "./MobileSidebar";

interface SidebarProps {
  isExpanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
}

export function Sidebar({
  isExpanded,
  onExpandedChange,
}: Readonly<SidebarProps>) {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const router = useRouter();

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
      <MobileSidebar onLogoutClick={handleLogoutClick} />
      <DesktopSidebar
        isExpanded={isExpanded}
        onExpandedChange={onExpandedChange}
        onLogoutClick={handleLogoutClick}
      />
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
