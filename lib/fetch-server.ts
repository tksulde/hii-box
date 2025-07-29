/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchServer<T>(
  endpoint: string,
  options: RequestInit = {},
  timeout = 10000
): Promise<T> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const cookieStore = cookies();
  const token = (await cookieStore).get("hii_box_token")?.value;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  try {
    const res = await fetch(`${API_BASE_URL}/api/v1${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(id);

    if (res.status === 401) {
      throw new Error("Unauthorized");
    }

    if (!res.ok) {
      const errorBody = await res.text();
      throw new Error(errorBody || "Fetch error");
    }

    return await res.json();
  } catch (err: any) {
    if (err.name === "AbortError") {
      throw new Error("Request timed out");
    }
    throw err;
  }
}
