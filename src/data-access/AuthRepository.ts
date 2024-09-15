import { type IAuthRepository } from "@/interfaces/IAuthRepository";
import { type AuthGetUserResult, type AuthSignInParams, type AuthSignInResult, type AuthSignOutResult, type AuthSignUpParams, type AuthSignUpResult } from "@/types/auth";
import { createSupabaseAuthAdapter, type SupabaseAuthAdapter } from "./adapters/supabaseAuthAdapter";

export function createAuthRepository(): IAuthRepository {
  const adapter: SupabaseAuthAdapter = createSupabaseAuthAdapter();

  return {
    async signUp({ email, password }: AuthSignUpParams): Promise<AuthSignUpResult> {
      const { data, error } = await adapter.signUp({ email, password });
      if (error) return { success: false, error: error.message };
      if (!data.session) return { success: false, error: "No session found after sign up" }; 
      return { success: true };
    },
    async signIn({ email, password }: AuthSignInParams): Promise<AuthSignInResult> {
      const { data, error } = await adapter.signIn({ email, password });
      if (error) return { success: false, error: error.message };
      if (!data.session) return { success: false, error: "No session found after sign in" }; 
      return { success: true };
    },
    async signOut(): Promise<AuthSignOutResult> {
      const { error } = await adapter.signOut();
      if (error) return { success: false, error: error.message };
      return { success: true };
    },
    async getUser(): Promise<AuthGetUserResult> {
      const { data, error } = await adapter.getUser();
      if (error) return { success: false, error: error.message };
      return { success: true, userid: data.user.id };
    }
  };
}