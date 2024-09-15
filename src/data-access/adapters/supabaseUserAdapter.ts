import { type CreateUserParams, type UserData } from "@/types/user";
import { createClient } from "@/utils/supabase/server";
import { type PostgrestSingleResponse } from "@supabase/supabase-js";

export function createSupabaseUserAdapter() {
  const supabase = createClient();
  return {
    async insertUser(userData: Omit<UserData, 'id'>) {
      return await supabase.from('users').insert(userData);
    },
    async getUserByEmail(email: string): Promise<PostgrestSingleResponse<UserData>> {
      return await supabase.from('users').select('*').eq('email', email).single();
    },
    async updateUser(userId: string, userData: Partial<CreateUserParams>) {
      return await supabase.from('users').update(userData).eq('id', userId);
    },
    async deleteUser(userId: string) {
      return await supabase.from('users').delete().eq('id', userId);
    },
  };
}

export type SupabaseUserAdapter = ReturnType<typeof createSupabaseUserAdapter>;