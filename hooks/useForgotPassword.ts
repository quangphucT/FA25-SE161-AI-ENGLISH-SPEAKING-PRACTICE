"use client";
import { forgotPasswordService } from "@/features/shared/services/authService";
import { ForgotPasswordRequest, ForgotPasswordResponse } from "@/types/auth";
import { useMutation } from "@tanstack/react-query";
export const useForgotPassword = () => {
  return useMutation<ForgotPasswordResponse, Error, ForgotPasswordRequest>({
    mutationFn: forgotPasswordService,
  });
};
