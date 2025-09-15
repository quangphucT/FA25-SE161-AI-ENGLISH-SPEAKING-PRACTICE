// hooks/useLogin.ts
"use client";
import { loginService } from "@/features/shared/services/authService";
import { LoginRequest, LoginResponse } from "@/types/auth";
import { useUserStore } from "@/store/useStore";
import { useMutation } from "@tanstack/react-query";


export const useLoginMutation = () => {
  const { setAccount } = useUserStore();
  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: loginService,
    onSuccess: (data) => {
      setAccount(data.account);
    },
  });
};
