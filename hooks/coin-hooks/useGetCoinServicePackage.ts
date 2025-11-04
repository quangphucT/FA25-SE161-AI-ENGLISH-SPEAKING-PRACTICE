// hooks/useGetMe.ts
"use client";
import { getCoinPackageService } from "@/features/shared/services/coinService";
import { CoinServicePackageResponse } from "@/types/coin_servicePackage";
import { useQuery } from "@tanstack/react-query";

export const useGetCoinServicePackage = () => {
  return useQuery<CoinServicePackageResponse, Error>({
    queryKey: ["CoinServicePackages"],
    queryFn: getCoinPackageService,
    staleTime: 1000 * 60 * 5, 
  });
};
