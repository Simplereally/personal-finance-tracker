import { type ITransactionRepository } from "@/interfaces/ITransactionRepository";
import { type AddTransactionParams, type AddTransactionResult, type GetTransactionsResult } from "@/types/transaction";

export function createTransactionService(transactionRepository: ITransactionRepository) {
  return {
    async addTransaction(userId: string, transaction: AddTransactionParams): Promise<AddTransactionResult> {
      return await transactionRepository.addTransaction(userId, transaction);
    },

    async getTransactions(userId: string): Promise<GetTransactionsResult> {
      return await transactionRepository.getTransactions(userId);
    }
  };
}

export type TransactionService = ReturnType<typeof createTransactionService>;