import { apiClient } from "./api-client";
import type {
  AuthResponse,
  AuthTokens,
  ApiSuccessResponse,
} from "./types";

export interface RegisterPayload {
  email: string;
  password: string;
  name?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RefreshTokenPayload {
  refreshToken: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

export const authApi = {
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>("/auth/register", payload);
    return data;
  },

  async login(payload: LoginPayload): Promise<AuthTokens> {
    const { data } = await apiClient.post<AuthTokens>("/auth/login", payload);
    return data;
  },

  async refreshToken(payload: RefreshTokenPayload): Promise<AuthTokens> {
    const { data } = await apiClient.post<AuthTokens>(
      "/auth/refresh-token",
      payload,
    );
    return data;
  },

  async verifyEmail(token: string): Promise<ApiSuccessResponse> {
    const { data } = await apiClient.post<ApiSuccessResponse>(
      "/auth/verify-email",
      { token },
    );
    return data;
  },

  async forgotPassword(
    payload: ForgotPasswordPayload,
  ): Promise<ApiSuccessResponse> {
    const { data } = await apiClient.post<ApiSuccessResponse>(
      "/auth/forgot-password",
      payload,
    );
    return data;
  },

  async resetPassword(
    payload: ResetPasswordPayload,
  ): Promise<ApiSuccessResponse> {
    const { data } = await apiClient.post<ApiSuccessResponse>(
      "/auth/reset-password",
      payload,
    );
    return data;
  },

  async logout(payload: RefreshTokenPayload): Promise<ApiSuccessResponse> {
    const { data } = await apiClient.post<ApiSuccessResponse>(
      "/auth/logout",
      payload,
    );
    return data;
  },  
};
