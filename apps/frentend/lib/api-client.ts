import { ApiErrorResponse, ApiResponse } from "@/types/alltypes";
import { getToken, removeToken } from "./token";


const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5500/api/v1";

/**
 * Custom Error Class for API Failures
 */
export class ApiError extends Error {
  code: string;
  details?: Record<string, string[]>;
  status: number;

  constructor(message: string, code: string = "INTERNAL_SERVER_ERROR", status: number = 500, details?: Record<string, string[]>) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

/**
 * Centralized API Client Wrapper
 */
export async function apiClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { requiresAuth = true, headers = {}, ...customConfig } = options;

  const reqHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(headers as Record<string, string>),
  };

  // Inject Authorization Bearer token if required
  if (requiresAuth) {
    const token = getToken();
    if (token) {
      reqHeaders["Authorization"] = `Bearer ${token}`;
    }
  }

  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const response = await fetch(`${BASE_URL}${cleanEndpoint}`, {
    ...customConfig,
    headers: reqHeaders,
  });

  const responseData = await response.json().catch(() => null);

  // Handle Unauthorized 401 or Invalid/Deleted User Session 404
  if (response.status === 401 || (response.status === 404 && endpoint.includes("/auth/me"))) {
    removeToken();
    if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login") && !window.location.pathname.startsWith("/signup")) {
      window.location.href = "/login";
    }
  }

  // Handle Non-2xx HTTP responses
  if (!response.ok || (responseData && responseData.success === false)) {
    const errorBody = responseData as ApiErrorResponse | null;
    const errorMessage = errorBody?.error?.message || responseData?.message || "An unexpected network error occurred";
    const errorCode = errorBody?.error?.code || "HTTP_ERROR";
    const errorDetails = errorBody?.error?.details;

    const formattedDetails = errorDetails
      ? Object.entries(errorDetails)
        .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(", ") : msgs}`)
        .join("; ")
      : "";
    const fullMessage = formattedDetails
      ? `${errorMessage} (${formattedDetails})`
      : errorMessage;

    throw new ApiError(fullMessage, errorCode, response.status, errorDetails);
  }

  // Return typed data payload
  const successBody = responseData as ApiResponse<T>;
  return successBody.data;
}
