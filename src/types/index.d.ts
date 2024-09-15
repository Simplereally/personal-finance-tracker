declare interface SignInProps {
  email: string;
  password: string;
}

interface SignInResponse {
  success: boolean;
  error?: string;
}

declare type CreateUserParams = {
  email: string;
  password: string;
};

interface UserSession {
  email: string;
}
