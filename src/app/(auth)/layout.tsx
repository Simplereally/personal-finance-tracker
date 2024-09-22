import { AppSidebar } from "@/components/AppSidebar";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header>
        <div className="mx-auto flex items-center justify-end">
          <div className="mt-2 flex items-center gap-4">
            <ThemeSwitcher />
          </div>
        </div>
      </header>
      <AppSidebar>{children}</AppSidebar>
    </div>
  );
}
