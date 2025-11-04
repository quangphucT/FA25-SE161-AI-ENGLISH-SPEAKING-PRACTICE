// hooks/useLogin.ts
"use client";
import { buyCoinService } from "@/features/shared/services/coinService";
import { BuyCoinRequest, PayOSCheckoutResponse } from "@/types/coin_servicePackage";
import { useMutation } from "@tanstack/react-query";


export const useBuyCoinMutation = () => {
  return useMutation<PayOSCheckoutResponse, Error, BuyCoinRequest>({
    mutationFn: buyCoinService,
  });
};
