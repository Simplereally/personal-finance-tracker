import { type AuthSignInParams, type AuthSignUpParams } from "@/types/auth";
import { createClient } from "@/utils/supabase/server";

export function createSupabaseAuthAdapter() {
  const supabase = createClient();
  return {
    async signUp({ email, password }: AuthSignUpParams) {
      return await supabase.auth.signUp({ email, password });
    },
    async getUser()  {
      return await supabase.auth.getUser();
    },
    async signIn({ email, password }: AuthSignInParams) {
      return await supabase.auth.signInWithPassword({ email, password });
    },
    async signOut() {
      return await supabase.auth.signOut();
    },    
  };
}

export type SupabaseAuthAdapter = ReturnType<typeof createSupabaseAuthAdapter>;