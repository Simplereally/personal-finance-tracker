import { type AddTransactionParams, type AddTransactionResult, type GetTransactionsResult } from "@/types/transaction";

export interface ITransactionRepository {
  addTransaction(userId: string, transaction: AddTransactionParams): Promise<AddTransactionResult>;
  getTransactions(userId: string): Promise<GetTransactionsResult>;
}