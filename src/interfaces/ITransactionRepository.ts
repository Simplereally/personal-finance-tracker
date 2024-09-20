import { type AddTransactionParams, type AddTransactionResult, type DeleteTransactionResult, type EditTransactionResult, type GetTransactionsResult, type UpdateTransactionParams } from "@/types/transaction";

export interface ITransactionRepository {
  addTransaction(transactionData: AddTransactionParams): Promise<AddTransactionResult>;
  getTransactions(userId: string): Promise<GetTransactionsResult>;
  deleteTransaction(userId: string, transactionId: string): Promise<DeleteTransactionResult>;
  editTransaction(userId: string, transactionId: string, updatedData: UpdateTransactionParams): Promise<EditTransactionResult>;
}