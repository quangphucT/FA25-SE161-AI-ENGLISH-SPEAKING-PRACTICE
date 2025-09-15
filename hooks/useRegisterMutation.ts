import { registerService } from "@/features/shared/services/authService";
import { RegisterRequest, RegisterResponse } from "@/types/auth"
import { useMutation } from "@tanstack/react-query";

export const useRegisterMutation = () => {
    return useMutation<RegisterResponse, Error, RegisterRequest>({
        mutationFn: registerService
    });
}