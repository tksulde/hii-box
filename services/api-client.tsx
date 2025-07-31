import axios from "axios";
import { getSession, signOut } from "next-auth/react";

const apiClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1`,
  withCredentials: true,
});

apiClient.interceptors.request.use(
  async (config) => {
    const session = await getSession();

    if (session?.error === "RefreshAccessTokenError") {
      await signOut({ redirect: true, callbackUrl: "/" });
      throw new Error("Session expired");
    }

    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || originalRequest._retry) {
      throw error;
    }

    originalRequest._retry = true;

    try {
      const response = await fetch("/api/auth/session", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to refresh session");
      }

      const refreshedSession = await response.json();

      if (
        !refreshedSession?.accessToken ||
        refreshedSession.error === "RefreshAccessTokenError"
      ) {
        throw new Error("No valid session after refresh");
      }

      originalRequest.headers.Authorization = `Bearer ${refreshedSession.accessToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      await signOut({ redirect: true, callbackUrl: "/" });
      throw refreshError;
    }
  }
);

const publicApiClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1`,
  withCredentials: true,
});

export { apiClient, publicApiClient };
