"use server";

import { createAuthRepository } from "@/data-access/AuthRepository";
import { createAuthService } from "@/services/AuthService";
import { type AuthGetUserResult, type AuthSignInParams, type AuthSignInResult, type AuthSignOutResult, type AuthSignUpParams, type AuthSignUpResult } from "@/types/auth";
import { redirect } from "next/navigation";

const authRepository = createAuthRepository();
const authService = createAuthService(authRepository);

export const signUp = async ({ email, password }: AuthSignUpParams): Promise<AuthSignUpResult> => {
  return await authService.signUp({ email, password });
};

export async function signIn(params: AuthSignInParams): Promise<AuthSignInResult> {
  const result = await authService.signIn(params);
  if (result.success) {
    redirect('/');
  }
  return result;
}

export const signOut = async (): Promise<AuthSignOutResult> => {
  const result = await authService.signOut();
  return result;  
};

export const getUser = async (): Promise<AuthGetUserResult> => {
  return await authService.getUser();
};