import { type AuthSignInParams, type AuthSignUpParams } from "@/types/auth";
import { createClient } from "@/utils/supabase/server";

export function createSupabaseAuthAdapter() {
  return {
    async signUp({ email, password }: AuthSignUpParams) {
      const supabase = createClient();
      const result = await supabase.auth.signUp({ email, password });
      return result;
    },
    async getUser() {
      const supabase = createClient();
      const result = await supabase.auth.getUser();
      return result;
    },
    async signIn({ email, password }: AuthSignInParams) {
      const supabase = createClient();
      const result = await supabase.auth.signInWithPassword({ email, password });
      return result;
    },
    async signOut() {
      const supabase = createClient();
      const result = await supabase.auth.signOut();
      return result;
    },    
  };
}

export type SupabaseAuthAdapter = ReturnType<typeof createSupabaseAuthAdapter>;