"use client";

import { CancelBuyingCoinRequest, CancelBuyingCoinResponse } from "@/types/coin_servicePackage";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { cancelBuyingCoinServicePackagesService } from "../../services/cancelBuyingCoinServicePackages";

export const useCancelBuyingCoinServicePackages = () => {
  return useMutation<CancelBuyingCoinResponse, Error, CancelBuyingCoinRequest>({
    mutationFn:  cancelBuyingCoinServicePackagesService,
    onError: (error: any) => {
      toast.error(error.message || "Hủy gói dịch vụ thất bại");
    },
  });
};
