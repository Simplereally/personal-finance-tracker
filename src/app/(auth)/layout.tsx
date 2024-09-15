import LogoutButton from "@/components/LogoutButton";
import { getUser } from "@/server/actions/auth.actions";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userResult = await getUser();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between p-4">
        <div>
          {userResult.success ? (
            <p>Logged in as: {userResult.userid}</p>
          ) : (
            <p>Not logged in</p>
          )}
        </div>
        <LogoutButton />
      </header>
      <main className="container mx-auto flex-grow py-8">{children}</main>
    </div>
  );
}
