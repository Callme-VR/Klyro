import { AuthSession, User } from "@/types/alltypes";
import { apiClient } from "./api-client";


export interface signupPayload {
  email: string;
  name: string;
  avatarUrl?: string;
  password: string;
}

export interface signinPayload {
  email: string,
  password: string,
}



export async function signupApi(payload: signupPayload): Promise<AuthSession> {
  return apiClient<AuthSession>("/auth/signup", {
    method: "POST",
    body: JSON.stringify(payload),
    requiresAuth: false,
  });
}
/**
 * Authenticate existing credentials
 */
export async function signinApi(payload: signinPayload): Promise<AuthSession> {
  return apiClient<AuthSession>("/auth/signin", {
    method: "POST",
    body: JSON.stringify(payload),
    requiresAuth: false,
  });
}

/**
 * Fetch profile of currently authenticated user
 */
export async function getMeApi(): Promise<User> {
  return apiClient<User>("/auth/me", {
    method: "GET",
    requiresAuth: true,
  });
}