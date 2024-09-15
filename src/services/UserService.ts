import { type IUserRepository } from "@/interfaces/IUserRepository";
import { type CreateUserParams, type CreateUserResult, type GetUserProfileResult, type UpdateUserResult } from "@/types/user";

export function createUserService(userRepository: IUserRepository) {
  return {
    async signUp(params: CreateUserParams): Promise<CreateUserResult> {
      return await userRepository.signUp(params);
    },

    async getUserProfile(email: string): Promise<GetUserProfileResult> {
      const result = await userRepository.getUserProfile(email);
      if (!result.success) return { success: false, error: result.error };
      return {
        success: true,
        profile: result.profile,
      };
    },

    async updateUser(userId: string, userData: Partial<CreateUserParams>): Promise<UpdateUserResult> {
      return await userRepository.updateUser(userId, userData);
    },

    async deleteUser(userId: string): Promise<UpdateUserResult> {
      return await userRepository.deleteUser(userId);
    },
  };
}

export type UserService = ReturnType<typeof createUserService>;