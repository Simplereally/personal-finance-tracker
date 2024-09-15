import { type IUserRepository } from "@/interfaces/IUserRepository";
import { type CreateUserParams, type CreateUserResult, type GetUserProfileResult, type UpdateUserResult } from "@/types/user";
import { createSupabaseAuthAdapter, type SupabaseAuthAdapter } from "./adapters/supabaseAuthAdapter";
import { createSupabaseUserAdapter, type SupabaseUserAdapter } from "./adapters/supabaseUserAdapter";

export function createUserRepository(): IUserRepository {
  const authAdapter: SupabaseAuthAdapter = createSupabaseAuthAdapter();
  const userAdapter: SupabaseUserAdapter = createSupabaseUserAdapter();

  return {
    async signUp({ email, password }: CreateUserParams): Promise<CreateUserResult> {
      const { data, error } = await authAdapter.signUp({ email, password });
      if (error) return { success: false, error: error.message };
      if (!data.user) return { success: false, error: "User creation failed." };

      const { error: insertError } = await userAdapter.insertUser({ email });
      if (insertError) return { success: false, error: insertError.message };

      return { success: true, userId: data.user.id };
    },

    async getUserProfile(email: string): Promise<GetUserProfileResult> {
      const { data, error } = await userAdapter.getUserByEmail(email);
      if (error) return { success: false, error: error.message };
      if (!data) return { success: false, error: "User not found." };

      return { success: true, profile: data };
    },

    async updateUser(userId: string, userData: Partial<CreateUserParams>): Promise<UpdateUserResult> {
      const { error } = await userAdapter.updateUser(userId, userData);
      if (error) return { success: false, error: error.message };

      return { success: true };
    },

    async deleteUser(userId: string): Promise<UpdateUserResult> {
      const { error } = await userAdapter.deleteUser(userId);
      if (error) return { success: false, error: error.message };

      return { success: true };
    }
  };
}