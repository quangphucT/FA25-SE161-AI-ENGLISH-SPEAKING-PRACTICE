import { useMutation } from "@tanstack/react-query";
import { loginApi } from "../services/authService";
import { useUserStore } from "@/store/useStore";


export function useLogin() {
  const setAccount = useUserStore((s) => s.setAccount);

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      loginApi(email, password),
    onSuccess: (account) => {
      setAccount(account);
      // sau này có thể lưu accessToken vào localStorage/sessionStorage nếu cần
    },
  });
}
