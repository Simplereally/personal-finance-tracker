"use server";

import { createAuthRepository } from "@/data-access/AuthRepository";
import { createCategoryRepository } from "@/data-access/CategoryRepository";
import { createTransactionRepository } from "@/data-access/TransactionRepository";
import { createAuthService } from "@/services/AuthService";
import { createTransactionService } from "@/services/TransactionService";
import { type AddTransactionParams, type AddTransactionResult, type DeleteTransactionResult, type EditTransactionResult, type GetTransactionsResult, type UpdateTransactionParams } from "@/types/transaction";

const transactionRepository = createTransactionRepository();
const categoryRepository = createCategoryRepository();
const transactionService = createTransactionService(transactionRepository, categoryRepository);
const authRepository = createAuthRepository();
const authService = createAuthService(authRepository);

export async function addTransaction(
  transactionData: Omit<AddTransactionParams, "user_id">,
  categoryName?: string
): Promise<AddTransactionResult> {
  const userResult = await authService.getUser();
  if (!userResult.success || !userResult.userid) {
    return { success: false, error: "User not authenticated" };
  }
  return await transactionService.addTransaction(userResult.userid, transactionData, categoryName);
}

export async function getTransactions(): Promise<GetTransactionsResult> {
  const userResult = await authService.getUser();
  if (!userResult.success || !userResult.userid) {
    return { success: false, transactions: [], error: "User not authenticated" };
  }

  return await transactionService.getTransactions(userResult.userid);
}

export async function deleteTransaction(transactionId: string): Promise<DeleteTransactionResult> {
  const userResult = await authService.getUser();
  if (!userResult.success || !userResult.userid) {
    return { success: false, error: "User not authenticated" };
  }
  return await transactionService.deleteTransaction(userResult.userid, transactionId);
}

export async function editTransaction(
  transactionId: string,
  updatedData: UpdateTransactionParams
): Promise<EditTransactionResult> {
  const userResult = await authService.getUser();
  if (!userResult.success || !userResult.userid) {
    return { success: false, error: "User not authenticated" };
  }
  return await transactionService.editTransaction(userResult.userid, transactionId, updatedData);
}