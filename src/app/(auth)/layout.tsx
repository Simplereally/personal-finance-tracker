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
        <div className="container mx-auto flex items-center justify-between p-4">
          <div className="text-xl font-semibold"></div>
          <div className="flex items-center gap-4">
            <ThemeSwitcher />
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="flex-grow bg-background py-8">{children}</main>
      <footer className="border-t border-border bg-secondary py-4 text-center text-sm text-secondary-foreground">
        © 2024 Financial Tracker. All rights reserved.
      </footer>
    </div>
  );
}
