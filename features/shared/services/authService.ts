import {
  GoogleLoginRequest,
  GoogleLoginResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ResendOTPRequest,
  ResendOTPResponse,
  VerifyOTPRequest,
  VerifyOTPResponse,
} from "@/types/auth";

// Login Service
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

// Register Service
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
    const message =
      error?.response?.data?.message || error.message || "Register failed";
    throw new Error(message);
  }
};

// verify OTP Service

export const verifyOTPService = async (
  credentials: VerifyOTPRequest
): Promise<VerifyOTPResponse> => {
  try {
    const response = await fetch("/api/auth/verify-otp", {
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

// Resend OTP Service
export const resendOTPService = async (
  credentials: ResendOTPRequest
): Promise<ResendOTPResponse> => {
  try {
    const response = await fetch("/api/auth/resend-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Resend OTP failed");
    return data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message || error.message || "Resend OTP failed";
    throw new Error(message);
  }
};

// Login with Google Service
export const loginWithGoogleService = async (
  credentials: GoogleLoginRequest
): Promise<GoogleLoginResponse> => {
  try {
    const { idToken, role } = credentials;
    const endpoint = role === "LEARNER" ? "/api/auth/google-login-learner" : "/api/auth/google-login-reviewer";
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({idToken}),
    });
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "Login with Google failed");
    return data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error.message ||
      "Login with Google failed";
    throw new Error(message);
  }
};
