import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/store/auth-store";
import type { AuthTokens } from "@/lib/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});


apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const accessToken = useAuthStore.getState().tokens?.accessToken;
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

let refreshInFlight: Promise<AuthTokens> | null = null;

async function refreshTokens(): Promise<AuthTokens> {
  const refreshToken = useAuthStore.getState().tokens?.refreshToken;
  if (!refreshToken) throw new Error("No refresh token");


  const { data } = await axios.post<AuthTokens>(
    `${API_BASE_URL}/auth/refresh-token`,
    { refreshToken },
    { headers: { "Content-Type": "application/json" } },
  );


  useAuthStore.getState().setTokens(data);
  return data;
}

apiClient.interceptors.response.use(
  (res) => res,
  async (err: AxiosError) => {
    const status = err.response?.status;
    const originalRequest = err.config as any;

    if (status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        if (!refreshInFlight) {
          refreshInFlight = refreshTokens().finally(() => {
            refreshInFlight = null;
          });
        }

        await refreshInFlight;

        const newAccess = useAuthStore.getState().tokens?.accessToken;
        if (newAccess) {
          originalRequest.headers = originalRequest.headers ?? {};
          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        }

        return apiClient(originalRequest);
      } catch (refreshErr) {
        useAuthStore.getState().clearAuth();
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(err);
  },
);
