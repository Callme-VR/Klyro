"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "@/types/alltypes";
import { getToken, setToken, removeToken } from "@/lib/token";
import { getMeApi, signinApi, signupApi, signinPayload, signupPayload } from "@/lib/auth-api";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: signinPayload) => Promise<void>;
  signup: (payload: signupPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function initAuth() {
      const storedToken = getToken();
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        setTokenState(storedToken);
        const currentUser = await getMeApi();
        setUser(currentUser);
      } catch (error) {
        console.warn("Session token invalid or expired, clearing session:", error);
        removeToken();
        setTokenState(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    initAuth();
  }, []);

  const login = async (payload: signinPayload) => {
    const session = await signinApi(payload);
    setToken(session.token);
    setTokenState(session.token);
    setUser(session.user);
  };

  const signup = async (payload: signupPayload) => {
    const session = await signupApi(payload);
    setToken(session.token);
    setTokenState(session.token);
    setUser(session.user);
  };

  const logout = () => {
    removeToken();
    setTokenState(null);
    setUser(null);
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
