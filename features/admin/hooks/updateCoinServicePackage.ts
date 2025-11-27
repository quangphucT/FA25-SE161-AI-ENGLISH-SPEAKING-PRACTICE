"use client";

import { UpdateCoinServicePackageRequest, UpdateCoinServicePackageResponse } from "@/types/coin_servicePackage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateCoinServicePackage } from "../services/updateCoinServicePackage";

export const useUpdateCoinServicePackage = () => {
  const queryClient = useQueryClient();
  return useMutation<UpdateCoinServicePackageResponse, Error, UpdateCoinServicePackageRequest>({
    mutationFn: updateCoinServicePackage,
    onSuccess: (data) => {
      toast.success(data.message || "Cập nhật gói thành công");
      queryClient.invalidateQueries({ queryKey: ["getServicePackages"] });
    },
    onError: (error) => {
      toast.error(error.message || "Cập nhật gói thất bại");
    },
  });
};
