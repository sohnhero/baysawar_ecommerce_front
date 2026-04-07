const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api-shop.fabiratrading.com/api";

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = {
    ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
    ...options.headers,
  } as any;

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include", // Required for sending/receiving cookies
  });

  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;
    try {
      const errorData = await response.json();
      // Handle all common error formats:
      // { error: "string" } | { error: { message: "string" } } | { message: "string" } | "string" | [ZodIssue]
      if (typeof errorData === 'string') {
        errorMessage = errorData;
      } else if (Array.isArray(errorData)) {
        // Zod issues array
        errorMessage = errorData.map((e: any) => e.message || JSON.stringify(e)).join(', ');
      } else if (typeof errorData.error === 'string') {
        errorMessage = errorData.error;
      } else if (errorData.error?.message) {
        errorMessage = errorData.error.message;
      } else if (errorData.message) {
        errorMessage = errorData.message;
      }
    } catch {
      errorMessage = response.statusText || errorMessage;
    }
    
    // In production, we avoid logging the full error to prevent information leakage
    if (process.env.NODE_ENV !== "production") {
      console.error(`API Error [${response.status}] ${endpoint}:`, errorMessage);
    }
    
    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return {} as T;
  }

  const text = await response.text();
  if (!text) {
    return {} as T;
  }

  return JSON.parse(text) as T;
}

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB limit
export const validateImageSize = (file: File) => {
  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error("L'image est trop volumineuse (max 5Mo)");
  }
  return true;
};

export const api = {
  get: <T>(endpoint: string, options?: RequestInit) =>
    apiFetch<T>(endpoint, { ...options, method: "GET" }),
  post: <T>(endpoint: string, body: any, options?: RequestInit) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  upload: <T>(endpoint: string, file: File, options?: RequestInit) => {
    // Basic validation safety
    if (file.size > MAX_IMAGE_SIZE) {
      return Promise.reject(new Error("L'image est trop volumineuse (max 5Mo)"));
    }
    const formData = new FormData();
    formData.append("file", file);
    return apiFetch<T>(endpoint, {
      ...options,
      method: "POST",
      body: formData,
    });
  },
  put: <T>(endpoint: string, body: any, options?: RequestInit) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  patch: <T>(endpoint: string, body: any, options?: RequestInit) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  delete: <T>(endpoint: string, options?: RequestInit) =>
    apiFetch<T>(endpoint, { ...options, method: "DELETE" }),
};
