import axios from "axios";
import { getSession, signOut } from "next-auth/react";

const apiClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1`,
  withCredentials: true,
});

// Request interceptor
apiClient.interceptors.request.use(
  async (config) => {
    const session = await getSession();

    // Check for refresh token error
    if (session?.error === "RefreshAccessTokenError") {
      console.error("❌ Session has refresh token error, signing out");
      await signOut({ redirect: true, callbackUrl: "/" });
      return Promise.reject(new Error("Session expired"));
    }

    if (session?.accessToken) {
      config.headers["Authorization"] = `Bearer ${session.accessToken}`;
    } else {
      console.warn("⚠️ No access token found in session");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      console.log("🔄 401 error, attempting to refresh session...");

      // Force NextAuth to refresh the session
      const session = await getSession();

      if (
        !session?.accessToken ||
        session.error === "RefreshAccessTokenError"
      ) {
        throw new Error("No valid session after refresh");
      }

      // Retry the original request with the new token
      originalRequest.headers[
        "Authorization"
      ] = `Bearer ${session.accessToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      console.error("❌ Failed to refresh session, signing out");
      await signOut({ redirect: true, callbackUrl: "/" });
      return Promise.reject(refreshError);
    }
  }
);

const publicApiClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1`,
  withCredentials: true,
});

export { apiClient, publicApiClient };
