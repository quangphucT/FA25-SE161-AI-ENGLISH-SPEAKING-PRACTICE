
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "@/types/auth";

export const loginService = async (
  credentials: LoginRequest
): Promise<LoginResponse> => {
  try {
    const response = await fetch("/api/auth/sign-in", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Login failed");
    return data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message || error.message || "Login failed";
    throw new Error(message);
  }
};

export const registerService = async (
  credentials: RegisterRequest
): Promise<RegisterResponse> => {
  try {
    const response = await fetch("/api/auth/sign-up", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Register failed");
    return data;
  } catch (error: any) {
    const data = error?.response?.data;
    const message = data?.message ||
      (Array.isArray(data?.messages) ? data.messages.join(", ") : undefined) ||
      error.message ||
      "Register failed";
    throw new Error(message);
  }
};
