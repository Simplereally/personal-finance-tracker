import LogoutButton from "@/components/LogoutButton";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-end p-4">
        <LogoutButton />
      </header>
      <main className="container mx-auto flex-grow py-8">{children}</main>
    </div>
  );
}
