export interface AuthSignUpParams {
  email: string;
  password: string;
}

export interface AuthSignUpResult {
  success: boolean;
  userid?: string;
  error?: string;
}

export interface AuthSignInParams {
  email: string;
  password: string;
}

export interface AuthSignInResult {
  success: boolean;
  error?: string;
  redirectTo?: string;
}

export interface AuthSignOutResult {
  success: boolean;
  error?: string;
  redirectTo?: string;
}

export interface AuthGetUserResult {
  success: boolean;
  userid?: string;
  error?: string;
}