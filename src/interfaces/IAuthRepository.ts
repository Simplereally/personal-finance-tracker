import { type AuthGetUserResult, type AuthSignInParams, type AuthSignInResult, type AuthSignOutResult, type AuthSignUpParams, type AuthSignUpResult } from "@/types/auth";

export interface IAuthRepository {
  signUp({ email, password }: AuthSignUpParams): Promise<AuthSignUpResult>;
  signIn({ email, password }: AuthSignInParams): Promise<AuthSignInResult>;
  signOut(): Promise<AuthSignOutResult>;
  getUser(): Promise<AuthGetUserResult>;
}