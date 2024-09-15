"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "@/server/actions/auth.actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const response = await signOut();
      if (response.success) {
        router.push("/login");
        router.refresh(); // Refresh to update the auth state
      } else {
        toast.error(response.error ?? "Logout failed. Please try again.");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleLogout} variant="outline" disabled={isLoading}>
      {isLoading ? "Logging out..." : "Logout"}
    </Button>
  );
}
