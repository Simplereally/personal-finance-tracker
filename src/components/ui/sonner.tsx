"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme === "dark" ? "dark" : "light"}
      className="toaster group"
      toastOptions={{
        duration: 3000, // Default duration for all toasts (3 seconds)
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground min-h-8 shadow-xl !font-semibold",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          success: "group-[.toaster]:bg-green-500 group-[.toaster]:text-white",
          error: "group-[.toaster]:bg-red-500 group-[.toaster]:text-white",
          warning: "group-[.toaster]:bg-yellow-500 group-[.toaster]:text-white",
          info: "group-[.toaster]:bg-blue-500 group-[.toaster]:text-white",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
