export interface SendOtpRequest {
  email: string;
}

export interface RegisterRequest {
  email: string;
  otp: string;
  username: string;
  password: string;
  confirmPassword: string;
  fullName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    username: string;
    fullName: string;
  };
}