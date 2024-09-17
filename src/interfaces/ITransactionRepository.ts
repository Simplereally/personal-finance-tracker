import { type AddTransactionParams, type AddTransactionResult, type DeleteTransactionResult, type GetTransactionsResult } from "@/types/transaction";

export interface ITransactionRepository {
  addTransaction(transactionData: AddTransactionParams): Promise<AddTransactionResult>;
  getTransactions(userId: string): Promise<GetTransactionsResult>;
  deleteTransaction(userId: string, transactionId: string): Promise<DeleteTransactionResult>;
}