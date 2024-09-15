export interface UserData {
  id: string;
  email: string;
}

export interface CreateUserParams {
  email: string;
  password: string;
}

export interface CreateUserResult {
  success: boolean;
  error?: string;
  userId?: string;
}

export interface UpdateUserResult {
  success: boolean;
  error?: string;
}

export interface GetUserProfileResult {
  success: boolean;
  profile?: UserData;
  error?: string;
}