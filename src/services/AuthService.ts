import { type IAuthRepository } from "@/interfaces/IAuthRepository";
import { type AuthGetUserResult, type AuthSignInParams, type AuthSignInResult, type AuthSignOutResult, type AuthSignUpParams, type AuthSignUpResult } from "@/types/auth";

export function createAuthService(authRepository: IAuthRepository) {
  return {
    async signUp({ email, password }: AuthSignUpParams): Promise<AuthSignUpResult> {
      return await authRepository.signUp({ email, password });
    },
    async signIn({ email, password }: AuthSignInParams): Promise<AuthSignInResult> {
      return await authRepository.signIn({ email, password });      
    },
    async signOut(): Promise<AuthSignOutResult> {
      return await authRepository.signOut();
    },
    async getUser(): Promise<AuthGetUserResult> {
      return await authRepository.getUser();
    }
  };
}

export type AuthService = ReturnType<typeof createAuthService>;