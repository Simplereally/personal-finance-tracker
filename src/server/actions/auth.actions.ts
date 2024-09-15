"use server";

import { createAuthRepository } from "@/data-access/AuthRepository";
import { createAuthService } from "@/services/AuthService";
import { type AuthGetUserResult, type AuthSignInParams, type AuthSignInResult, type AuthSignOutResult, type AuthSignUpParams, type AuthSignUpResult } from "@/types/auth";

const authRepository = createAuthRepository();
const authService = createAuthService(authRepository);

export const signUp = async ({ email, password }: AuthSignUpParams): Promise<AuthSignUpResult> => {
  return await authService.signUp({ email, password });
};

export async function signIn(params: AuthSignInParams): Promise<AuthSignInResult> {
  return await authService.signIn(params);
}

export const signOut = async (): Promise<AuthSignOutResult> => {
  return await authService.signOut();
};

export const getUser = async (): Promise<AuthGetUserResult> => {
  const result = await authService.getUser();
  return result;
};