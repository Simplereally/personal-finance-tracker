import { type CreateUserParams, type CreateUserResult, type GetUserProfileResult, type UpdateUserResult } from "@/types/user";

export interface IUserRepository {
  signUp(params: CreateUserParams): Promise<CreateUserResult>;
  getUserProfile(email: string): Promise<GetUserProfileResult>;
  updateUser(userId: string, userData: Partial<CreateUserParams>): Promise<UpdateUserResult>;
  deleteUser(userId: string): Promise<UpdateUserResult>;
}