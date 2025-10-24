// hooks/useLogin.ts
"use client";
import { loginService } from "@/features/shared/services/authService";
import { LoginRequest, LoginResponse } from "@/types/auth";
import { useMutation } from "@tanstack/react-query";


export const useLoginMutation = () => {
  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: loginService,
  });
};
