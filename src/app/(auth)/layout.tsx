import LogoutButton from "@/components/LogoutButton";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="border-b border-border bg-secondary">
        <div className="container mx-auto flex items-center justify-between p-4">
          <div className="text-xl font-semibold">
            <h1 className="inline-block rounded-lg bg-primary px-4 py-2 text-4xl font-bold text-white">
              Financial Tracker
            </h1>
          </div>
          <LogoutButton />
        </div>
      </header>
      <main className="flex-grow bg-background py-8">{children}</main>
      <footer className="border-t border-border bg-secondary py-4 text-center text-sm text-secondary-foreground">
        © 2024 Financial Tracker. All rights reserved.
      </footer>
    </div>
  );
}
