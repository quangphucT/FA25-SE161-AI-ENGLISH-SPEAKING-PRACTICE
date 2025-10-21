// hooks/useLogin.ts
"use client";
import { loginService } from "@/features/shared/services/authService";
import { LoginRequest, LoginResponse } from "@/types/auth";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";


export const useLoginMutation = () => {
  const router = useRouter();
  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: loginService,
    // onSuccess: (data) => {
    //   const { role } = data;
    //   // Chuyển hướng dựa trên vai trò
    //   switch (role) {
    //     case "ADMIN":
    //       router.push("/dashboard-admin-layout");
    //       break;

    //     case "MANAGER":
    //       router.push("/dashboard-manager-layout");
    //       break;

    //     case "REVIEWER":
    //       router.push("/dashboard-reviewer-layout");
    //       break;

    //     case "LEARNER":
    //       router.push("/dashboard-learner-layout");
    //       break;

    //     default:
    //       router.push("/sign-in");
    //       break;
    //   }
    // },
      onError: (error) => {
        toast.error(`Đăng nhập thất bại: ${error.message}`);
      }
  });
};
