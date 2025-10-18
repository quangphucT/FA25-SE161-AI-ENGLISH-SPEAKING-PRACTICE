
import { loginWithGoogleService } from "@/features/shared/services/authService";
import { useUserStore } from "@/store/useStore";
import { GoogleLoginRequest, GoogleLoginResponse } from "@/types/auth";
import { useMutation } from "@tanstack/react-query";

export const useLoginWithGoogle = () => {
    // const { setUserEmail } = useUserStore();
  return useMutation<GoogleLoginResponse, Error, GoogleLoginRequest>({
    mutationFn: loginWithGoogleService,
    // onSuccess: (data) => {
    //   setUserEmail(data.email);
    // },
  });
};