// hooks/useLogin.ts
"use client";

import { forgotPasswordService } from "@/features/shared/services/authService";
import { ForgotPasswordRequest, ForgotPasswordResponse } from "@/types/auth";
import { useMutation } from "@tanstack/react-query";

import { toast } from "sonner";


export const useForgotPassword = () => {
  return useMutation<ForgotPasswordResponse, Error, ForgotPasswordRequest>({
    mutationFn: forgotPasswordService,

    onError: (error) => {
      toast.error(`Quên mật khẩu thất bại: ${error.message}`);
    }
  });
};
