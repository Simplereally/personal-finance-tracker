import type { TransactionInput, Goal } from "../shared/finance";
export type Actions = {
  saveTransaction: (input: TransactionInput, id?: string) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  saveGoal: (input: Omit<Goal, "id">, id?: string) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  addToGoal: (id: string, amount: number) => Promise<void>;
  saveMonthlyBudget: (amount: number) => Promise<void>;
  saveBudget: (category: string, amount: number) => Promise<void>;
  saveProfile: (input: {
    name: string;
    currency: string;
    monthlyBudget: number;
  }) => Promise<void>;
  changePassword: (
    current: string,
    next: string,
  ) => Promise<{ error?: string; success?: boolean }>;
  signOut: () => Promise<void>;
  createCategory: (name: string) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
};
