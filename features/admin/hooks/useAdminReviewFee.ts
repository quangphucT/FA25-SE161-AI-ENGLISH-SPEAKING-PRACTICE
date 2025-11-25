"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adminReviewFeeService,
  CreateReviewFeeRequest,
  CreateReviewFeeResponse,
  getReviewFeePackages,
  ReviewFeePackagesResponse,
} from "../services/adminReviewFeeService";
import { toast } from "sonner";

export const useAdminReviewFeeCreateMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<CreateReviewFeeResponse, Error, CreateReviewFeeRequest>({
    mutationFn: adminReviewFeeService,
    onSuccess: (data) => {
      toast.success(data.message || "Tạo phí đánh giá thành công");
      queryClient.invalidateQueries({ queryKey: ["adminReviewFee"] });
      queryClient.invalidateQueries({ queryKey: ["adminReviewFeePackages"] });
    },
    onError: (error) => {
      toast.error(error.message || "Tạo phí đánh giá thất bại");
    },
  });
};
export const useAdminReviewFeePackagesQuery = (pageNumber: number, pageSize: number ) => {
  return useQuery<ReviewFeePackagesResponse, Error>({
    queryKey: ["adminReviewFeePackages", pageNumber, pageSize],
    queryFn: () => getReviewFeePackages(pageNumber, pageSize),
    placeholderData: keepPreviousData,
  });
};