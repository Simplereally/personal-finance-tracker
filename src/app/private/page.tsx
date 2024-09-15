import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

/*
Be careful when protecting pages. The server gets the user session from the cookies, which can be spoofed by anyone.

Always use supabase.auth.getUser() to protect pages and user data.

Never trust supabase.auth.getSession() inside Server Components. It isn't guaranteed to revalidate the Auth token.

It's safe to trust getUser() because it sends a request to the Supabase Auth server every time to revalidate the Auth token.
*/

export default async function PrivatePage() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  return <p>Hello {data.user.email}</p>;
}
