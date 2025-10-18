import { verifyOTPService } from "@/features/shared/services/authService";
import { VerifyOTPRequest, VerifyOTPResponse } from "@/types/auth";
import { useMutation } from "@tanstack/react-query";

export const useVerifyOTPMutation = () => {
    return useMutation<VerifyOTPResponse, Error, VerifyOTPRequest>({
        mutationFn: verifyOTPService
    });
}