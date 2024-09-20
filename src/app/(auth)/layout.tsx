import { AppSidebar } from "@/components/AppSidebar";
import LogoutButton from "@/components/LogoutButton";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header>
        <div className="container mx-auto flex items-center justify-between">
          <div className="text-xl font-semibold"></div>
          <div className="flex items-center gap-4">
            <ThemeSwitcher />
            <LogoutButton />
          </div>
        </div>
      </header>
      <AppSidebar>
        <main className="flex-grow bg-background">{children}</main>
      </AppSidebar>
    </div>
  );
}
