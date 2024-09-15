"use server";

import { createAuthRepository } from "@/data-access/AuthRepository";
import { createTransactionRepository } from "@/data-access/TransactionRepository";
import { createAuthService } from "@/services/AuthService";
import { createTransactionService } from "@/services/TransactionService";
import { type AddTransactionParams, type AddTransactionResult, type GetTransactionsResult } from "@/types/transaction";
import { revalidatePath } from "next/cache";

const transactionRepository = createTransactionRepository();
const transactionService = createTransactionService(transactionRepository);
const authRepository = createAuthRepository();
const authService = createAuthService(authRepository);

export async function addTransaction(transaction: AddTransactionParams): Promise<AddTransactionResult> {
  const userResult = await authService.getUser();
  if (!userResult.success || !userResult.userid) {
    return { success: false, error: "User not authenticated" };
  }

  const result = await transactionService.addTransaction(userResult.userid, transaction);
  
  if (result.success) {
    revalidatePath('/'); // Revalidate the dashboard page
  }

  return result;
}

export async function getTransactions(): Promise<GetTransactionsResult> {
  const userResult = await authService.getUser();
  if (!userResult.success || !userResult.userid) {
    return { success: false, transactions: [], error: "User not authenticated" };
  }

  return await transactionService.getTransactions(userResult.userid);
}