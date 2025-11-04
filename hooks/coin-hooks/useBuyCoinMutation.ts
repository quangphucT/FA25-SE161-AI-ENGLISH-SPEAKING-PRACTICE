// hooks/useLogin.ts
"use client";
import { buyCoinService } from "@/features/shared/services/coinService";
import { BuyCoinRequest, BuyCoinResponse } from "@/types/coin_servicePackage";
import { useMutation } from "@tanstack/react-query";


export const useBuyCoinMutation = () => {
  return useMutation<BuyCoinResponse, Error, BuyCoinRequest>({
    mutationFn: buyCoinService,
  });
};
