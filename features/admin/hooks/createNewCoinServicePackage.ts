"use client";

import { CreateCoinServicePackageRequest, CreateCoinServicePackageResponse } from "@/types/coin_servicePackage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createCoinServicePackage } from "../services/createCoinServicePackage";
export const useCreateCoinServicePackage = () => {
   const queryClient = useQueryClient();
  return useMutation<CreateCoinServicePackageResponse, Error, CreateCoinServicePackageRequest>({
    mutationFn: createCoinServicePackage,
    onSuccess: (data) => {
      toast.success(data.message || "Tạo gói dịch vụ thành công");
      // 👇 invalidate để reload danh sách mới
      queryClient.invalidateQueries({ queryKey: ["getCoinServicePackages"] });
    },
    onError: (error) => {
      toast.error(error.message || "Tạo gói dịch vụ thất bại");
    },
  });
};
