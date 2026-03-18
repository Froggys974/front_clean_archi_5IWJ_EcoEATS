export interface User {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  roles?: string[];
}

export interface AuthResponse {
  token: string;
  message?: string;
}

export interface RegisterResponse {
  userId: string;
  message: string;
}
