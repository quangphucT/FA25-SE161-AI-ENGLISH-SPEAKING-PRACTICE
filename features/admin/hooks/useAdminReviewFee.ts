"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adminReviewFeeService,
  CreateReviewFeeRequest,
  CreateReviewFeeResponse,
  getReviewFeePackages,
  ReviewFeePackagesResponse,
    getReviewFeeDetail,   
      CreateReviewFeePackageRequest,
  CreateReviewFeePackageResponse,
  adminReviewFeePackageService,
    adminReviewFeePolicyService,
    adminReviewFeePolicyUpcomingService,
    CreateReviewFeePolicyUpcomingRequest,
    CreateReviewFeePolicyUpcomingResponse,


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


export const useAdminReviewFeeDetailQuery = (reviewFeeId: string | null) => {
  return useQuery({
    queryKey: ["adminReviewFeeDetail", reviewFeeId],
    queryFn: () => getReviewFeeDetail(reviewFeeId!),
    enabled: !!reviewFeeId,
  });
};


export const useAdminReviewFeePackageCreateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateReviewFeePackageResponse, Error, CreateReviewFeePackageRequest>({
    mutationFn: adminReviewFeePackageService,

    onSuccess: (data) => {
      toast.success(data.message || "Tạo gói Review Fee thành công");

      queryClient.invalidateQueries({ queryKey: ["adminReviewFeePackages"] });
    },

    onError: (error) => {
      toast.error(error.message || "Tạo gói Review Fee thất bại");
    },
  });
};
export const useAdminReviewFeePolicyCreateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminReviewFeePolicyService,
    onSuccess: (data) => {
      toast.success(data.message || "Tạo chính sách mới thành công");
      queryClient.invalidateQueries({ queryKey: ["adminReviewFeePackages"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Tạo chính sách thất bại");
    },
  });
};
export const useAdminReviewFeePolicyUpcomingCreateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateReviewFeePolicyUpcomingResponse, Error, CreateReviewFeePolicyUpcomingRequest>({
    mutationFn: adminReviewFeePolicyUpcomingService,
    onSuccess: (data) => {
      toast.success(data.message || "Tạo chính sách sắp áp dụng thành công");
      queryClient.invalidateQueries({ queryKey: ["adminReviewFeePackages"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Tạo chính sách sắp áp dụng thất bại");
    },
  });
};  