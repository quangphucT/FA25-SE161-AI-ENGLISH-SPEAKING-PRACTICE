export interface LoginRequest {
  email: string;
  password: string;
}
export interface LoginResponse {
  message: string;

  accessToken: string;
  refreshToken: string;
  role: string;
  isPlacementTestDone: boolean;
  isReviewerActive: boolean;

}
export interface GoogleLoginRequest {
  idToken: string;
  role: "LEARNER" | "REVIEWER";
}
export interface GoogleLoginResponse {
  role: string;
  message: string;
  isPlacementTestDone?: boolean;
  email: string;
  isReviewerActive?: boolean;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  email: string;
}

export interface CustomError {
  response?: {
    data?: { message?: string };
    status?: number;
  };
  message?: string;
}

export interface VerifyOTPRequest {
  email: string;
  otpInput: string;
}

export interface VerifyOTPResponse {
  message: string;
}
export interface ResendOTPRequest {
  email: string;
}

export interface ResendOTPResponse {
  message: string;
}

export interface ResetPasswordRequest {
  newPassword: string;
  confirmPassword: string;
}
export interface ResetPasswordVars {
  credentials: ResetPasswordRequest;
  token: string;
};

export interface ResetPasswordResponse {
  message: string;
}


export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface UserResponse {
  userId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: "LEARNER" | "REVIEWER" | "ADMIN" | "MANAGER"; // union type cho rõ ràng
  avatarUrl: string;
  status: "Active" | "Pending" | "Banned";
  coinBalance: number;
  learnerProfile: LearnerProfile | null;
  reviewerProfile: ReviewerProfile | null;

}

export interface ReviewerProfile {
  reviewerProfileId: string;
  userId: string;
  experience: string;
  rating: number;
  status: "Pending" | "Approved" | "Rejected"; // optional chuẩn hóa luôn
  levels: string;
  walletId: string;
  balance: number;
  createdAt: string; // nếu muốn Date → thì convert sau
  updatedAt: string | null;
  isDeleted: boolean;
}
export interface LearnerProfile {
  learnerProfileId: string;
  pronunciationScore: number;
  userId: string;
  experience: string;
  rating: number;
  status: "Pending" | "Approved" | "Rejected"; // optional chuẩn hóa luôn
  level: string;
  walletId: string;
  balance: number;
  createdAt: string; // nếu muốn Date → thì convert sau
  updatedAt: string | null;
  isDeleted: boolean;
  dailyMinutes: number;
}


// Change Password
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordResponse {
  message: string;
}


