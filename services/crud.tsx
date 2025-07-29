import { apiClient, publicApiClient } from "@/services/api-client";
import axios, { AxiosResponse } from "axios";

// Helper function to prepare FormData
const prepareFormData = (data: Record<string, any>): FormData => {
  const formData = new FormData();
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      formData.append(key, data[key]);
    }
  }
  return formData;
};

// Centralized error handler
const handleError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    return (
      error.response || {
        status: 500,
        statusText: "An unexpected error occurred",
        data: { detail: "Server error" },
      }
    );
  }
  return {
    status: 500,
    statusText: "An unexpected error occurred",
    data: { detail: "Server error" },
  };
};

export const get_request = async (url: string) => {
  try {
    return await apiClient.get(url);
  } catch (error) {
    throw handleError(error);
  }
};

export const post_request = async (
  url: string,
  data: any,
  headers: Record<string, string> = {}
) => {
  try {
    const newHeaders = { ...headers };
    if (data instanceof FormData) {
      delete newHeaders["Content-Type"];
    }

    return await apiClient.post(url, data, {
      headers: newHeaders,
    });
  } catch (error) {
    return handleError(error);
  }
};

export const patch_request = async (
  url: string,
  id: string | number,
  data: any,
  contentType: string,
  token?: string
) => {
  const headers: Record<string, string> = { "Content-Type": contentType };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const requestData =
    contentType === "multipart/form-data" ? prepareFormData(data) : data;

  try {
    const endpoint = id ? `${url}/${id}` : url;

    return await apiClient.patch(endpoint, requestData, { headers });
  } catch (error) {
    return handleError(error);
  }
};

export const delete_request = async (url: string, id: string | number) => {
  try {
    return await apiClient.delete(`${url}/${id}`);
  } catch (error) {
    return handleError(error);
  }
};

export const delete_file = async (data: any) => {
  try {
    return await apiClient.delete("/file/delete", {
      data,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return handleError(error);
  }
};

export const public_get_request = async (url: string) => {
  try {
    return await publicApiClient.get(url);
  } catch (error) {
    return handleError(error);
  }
};

export const public_post_request = async (
  url: string,
  data: any,
  headers: Record<string, string> = {}
) => {
  try {
    const newHeaders = { ...headers };
    if (data instanceof FormData) {
      delete newHeaders["Content-Type"];
    }

    return await publicApiClient.post(url, data, { headers: newHeaders });
  } catch (error) {
    return handleError(error);
  }
};

export const public_patch_request = async (
  url: string,
  data: any,
  headers: Record<string, string>
) => {
  try {
    const newHeaders = { ...headers };
    if (data instanceof FormData) {
      delete newHeaders["Content-Type"];
    }
    return await publicApiClient.patch(url, data, { headers: newHeaders });
  } catch (error) {
    return handleError(error);
  }
};

// Type guard for AxiosResponse
export const isAxiosResponse = (
  response: any
): response is AxiosResponse<any> => {
  return response && (response as AxiosResponse).data !== undefined;
};
