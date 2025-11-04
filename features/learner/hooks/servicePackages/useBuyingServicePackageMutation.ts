"use client";

import { BuyCoinRequest, PayOSCheckoutResponse } from "@/types/coin_servicePackage";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { buyingCoinServicePackagesService } from "../../services/buyingCoinServicePackages";
export const useBuyingCoinServicePackages = () => {
  return useMutation<PayOSCheckoutResponse, Error, BuyCoinRequest>({
    mutationFn: buyingCoinServicePackagesService,
    onError: (error: any) => {
      toast.error(error.message || "Mua gói dịch vụ thất bại");
    },
  });
};
