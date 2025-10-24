"use client";

import { resetPasswordService } from "@/features/shared/services/authService";
import { ResetPasswordRequest, ResetPasswordResponse, ResetPasswordVars } from "@/types/auth";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";



export const useResetPassword = () => {
  return useMutation<ResetPasswordResponse, Error, ResetPasswordVars>({
    mutationFn: async ({ credentials, token }) =>
      resetPasswordService(credentials, token),
    onError: (error) => {
      toast.error(`Đặt lại mật khẩu thất bại: ${error.message}`);
    },
  });
};
