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

export const signIn = async ({ email, password }: AuthSignInParams): Promise<AuthSignInResult> => {
  const result = await authService.signIn({ email, password });
  console.log("action result", result);
  if (result.success && result.redirectTo) {
    console.log("Attempting to redirect to:", result.redirectTo);
    redirect(result.redirectTo);
  }
  console.log("returning result", result);
  return result;
};

export const signOut = async (): Promise<AuthSignOutResult> => {
  const result = await authService.signOut();
  console.log("action result", result);
  if (result.success && result.redirectTo) {
    console.log("Attempting to redirect to:", result.redirectTo);
    redirect(result.redirectTo);
  }
  return result;
};

export const getUser = async (): Promise<AuthGetUserResult> => {
  return await authService.getUser();
};