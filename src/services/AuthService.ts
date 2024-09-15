import { type IAuthRepository } from "@/interfaces/IAuthRepository";
import { type AuthGetUserResult, type AuthSignInParams, type AuthSignInResult, type AuthSignOutResult, type AuthSignUpParams, type AuthSignUpResult } from "@/types/auth";

export function createAuthService(authRepository: IAuthRepository) {
  return {
    async signUp({ email, password }: AuthSignUpParams): Promise<AuthSignUpResult> {
      return await authRepository.signUp({ email, password });
    },
    async signIn({ email, password }: AuthSignInParams): Promise<AuthSignInResult> {
      const result = await authRepository.signIn({ email, password });
      console.log("AuthService signIn result:", result);
      if (result.success) {
        return { ...result, redirectTo: "/" };
      }
      return result;
    },
    async signOut(): Promise<AuthSignOutResult> {
      const result = await authRepository.signOut();
      console.log("AuthService signOut result:", result);
      if (result.success) {
        return { ...result, redirectTo: "/login" };
      }
      return result;
    },
    async getUser(): Promise<AuthGetUserResult> {
      return await authRepository.getUser();
    }
  };
}

export type AuthService = ReturnType<typeof createAuthService>;