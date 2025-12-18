
import { loginWithGoogleService } from "@/features/shared/services/authService";
import { GoogleLoginRequest, GoogleLoginResponse } from "@/types/auth";
import { useMutation } from "@tanstack/react-query";

export const useLoginWithGoogle = () => {
  return useMutation<GoogleLoginResponse, Error, GoogleLoginRequest>({
    mutationFn: loginWithGoogleService,
  });
};