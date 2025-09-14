// features/shared/services/authService.ts
import { LoginRequest, LoginResponse } from "@/types/auth";

export const loginService = async (
  credentials: LoginRequest
): Promise<LoginResponse> => {
  const res = await fetch("/api/auth/sign-in", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Login failed");
  }

  return res.json();
};
