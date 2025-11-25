"use client";

import { DeleteCoinServicePackageResponse } from "@/types/coin_servicePackage";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";
import { deleteCoinServicePackage } from "../services/deleteCoinServicePackageService";
export const deleteCoinServicePackageMutation = () => {
   const queryClient = useQueryClient();
  return useMutation<DeleteCoinServicePackageResponse, Error, string>({
    mutationFn: async (id) => await deleteCoinServicePackage(id),
    onSuccess: (data) => {
      toast.success(data.message || "Xóa gói dịch vụ thành công");
      // 👇 invalidate để reload danh sách mới
      queryClient.invalidateQueries({ queryKey: ["getServicePackages"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Xóa gói dịch vụ thất bại");
    },
  });
};
