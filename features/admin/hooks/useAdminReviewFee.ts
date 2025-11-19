"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  adminReviewFeeService,
  CreateReviewFeeRequest,
  CreateReviewFeeResponse,
} from "../services/adminReviewFeeService";
import { toast } from "sonner";

export const useAdminReviewFeeCreateMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<CreateReviewFeeResponse, Error, CreateReviewFeeRequest>({
    mutationFn: adminReviewFeeService,
    onSuccess: (data) => {
      toast.success(data.message || "Tạo phí đánh giá thành công");
      queryClient.invalidateQueries({ queryKey: ["adminReviewFee"] });
    },
    onError: (error) => {
      toast.error(error.message || "Tạo phí đánh giá thất bại");
    },
  });
};