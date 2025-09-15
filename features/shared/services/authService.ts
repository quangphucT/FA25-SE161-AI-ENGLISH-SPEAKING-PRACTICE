// features/shared/services/authService.ts
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "@/types/auth";
import axiosClient from "@/lib/axiosClient";

export const loginService = async (
  credentials: LoginRequest
): Promise<LoginResponse> => {
  try {
    const response = await axiosClient.post<LoginResponse>(
      "/api/auth/sign-in",
      credentials
    );
    return response.data;
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
    const response = await axiosClient.post<RegisterResponse>(
      "/api/auth/sign-up",
      credentials
    );
    return response.data;
  } catch (error: any) {
     const data = error?.response?.data;
  const message =
    data?.message ||
    (Array.isArray(data?.messages) ? data.messages.join(', ') : undefined) ||
    error.message ||
    "Register failed";
  throw new Error(message);
  }
};
