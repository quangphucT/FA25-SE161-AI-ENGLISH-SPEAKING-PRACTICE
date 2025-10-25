import { resendOTPService } from "@/features/shared/services/authService";
import { ResendOTPRequest, ResendOTPResponse } from "@/types/auth";
import { useMutation } from "@tanstack/react-query";

export const useResendOTPMutation = () => {
    return useMutation<ResendOTPResponse, Error, ResendOTPRequest>({
        mutationFn: resendOTPService
    });
}