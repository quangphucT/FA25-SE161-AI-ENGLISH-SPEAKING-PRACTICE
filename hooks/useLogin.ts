// hooks/useLogin.ts
"use client";
import { useState } from "react";
import { loginService } from "@/features/shared/services/authService";
import { LoginRequest, LoginResponse } from "@/types/auth";

export const useLogin = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (
    credentials: LoginRequest
  ): Promise<LoginResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const data = await loginService(credentials);
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};
