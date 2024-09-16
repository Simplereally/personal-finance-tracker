"use server";

import { createAuthRepository } from "@/data-access/AuthRepository";
import { createCategoryRepository } from "@/data-access/CategoryRepository";
import { createTransactionRepository } from "@/data-access/TransactionRepository";
import { createAuthService } from "@/services/AuthService";
import { createTransactionService } from "@/services/TransactionService";
import { type TransactionData } from "@/types/supabase";
import { type AddTransactionResult, type GetTransactionsResult } from "@/types/transaction";
import { revalidatePath } from "next/cache";

const transactionRepository = createTransactionRepository();
const categoryRepository = createCategoryRepository();
const transactionService = createTransactionService(transactionRepository, categoryRepository);
const authRepository = createAuthRepository();
const authService = createAuthService(authRepository);

export async function addTransaction(
  transactionData: Omit<TransactionData, "user_id" | "id" | "created_at" | "updated_at">,
  categoryName?: string
): Promise<AddTransactionResult> {
  const userResult = await authService.getUser();
  if (!userResult.success || !userResult.userid) {
    return { success: false, error: "User not authenticated" };
  }
  const result = await transactionService.addTransaction(userResult.userid, transactionData, categoryName);
  if (result.success) {
    revalidatePath('/');
  }
  return result;
}

export async function getTransactions(): Promise<GetTransactionsResult> {
  const userResult = await authService.getUser();
  if (!userResult.success || !userResult.userid) {
    return { success: false, transactions: [], error: "User not authenticated" };
  }

  const result = await transactionService.getTransactions(userResult.userid);
  revalidatePath('/'); // Changed from revalidateTag to revalidatePath
  return result;
}