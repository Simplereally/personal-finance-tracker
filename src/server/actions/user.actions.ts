"use server";

import { createUserRepository } from "@/data-access/UserRepository";
import { createUserService } from "@/services/UserService";
import { type CreateUserParams, type CreateUserResult, type GetUserProfileResult, type UpdateUserResult } from "@/types/user";

const userRepository = createUserRepository();
const userService = createUserService(userRepository);

export const signUp = async ({ email, password }: CreateUserParams): Promise<CreateUserResult> => {
  return await userService.signUp({ email, password });
};

export const getUserProfile = async (email: string): Promise<GetUserProfileResult> => {
  return await userService.getUserProfile(email);
};

export const updateUser = async (userId: string, userData: Partial<CreateUserParams>): Promise<UpdateUserResult> => {
  return await userService.updateUser(userId, userData);
};

export const deleteUser = async (userId: string): Promise<UpdateUserResult> => {
  return await userService.deleteUser(userId);
};