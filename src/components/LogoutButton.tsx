"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "@/server/actions/auth.actions";
import { useState } from "react";
import { toast } from "sonner";

export default function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    const response = await signOut();
    console.log("response", response);
    if (!response.success) {
      toast.error(response.error ?? "Logout failed. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleLogout} variant="outline" disabled={isLoading}>
      {isLoading ? "Logging out..." : "Logout"}
    </Button>
  );
}
