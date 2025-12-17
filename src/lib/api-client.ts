import axios from "axios";
import { useAuthStore } from "@/store/auth-store";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
});

if (process.env.NODE_ENV === "development") {
  apiClient.interceptors.request.use((config) => {
    console.log("[API] Request:", config.method, config.url, config.data);
    return config;
  });

  apiClient.interceptors.request.use((config) => {
    const tokens = useAuthStore.getState().tokens;
    if (tokens?.accessToken) {
      config.headers.Authorization = `Bearer ${tokens.accessToken}`;
    }
    return config;
  })

  apiClient.interceptors.response.use(
    (response) => {
      console.log("[API] Response:", response.status, response.config.url);
      return response;
    },
    (error) => {
      if (error.response) {
        console.error(
          "[API] Error Response:",
          error.response.status,
          error.response.config?.url,
          error.response.data,
        );
      } else {
        console.error("[API] Error:", error.message);
      }
      return Promise.reject(error);
    },
  );
}
