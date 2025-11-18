"use client";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import {
  adminReviewerBanService,
  adminReviewerDetailService,
  AdminReviewersResponse,
  adminReviewersService,
  ReviewerDetailResponse,
} from "../services/adminReviewerService";
import { toast } from "sonner";

export const useAdminReviewer = (
  pageNumber: number,
  pageSize: number,
  filterStatus: string,
  search: string
) => {
  return useQuery<AdminReviewersResponse, Error>({
    queryKey: ["adminReviewer", pageNumber, pageSize, filterStatus, search],
    queryFn: () =>
      adminReviewersService(pageNumber, pageSize, filterStatus, search),
    placeholderData: keepPreviousData,
  });
};

export const useAdminReviewerDetail = (reviewerProfileId: string) => {
  return useQuery<ReviewerDetailResponse, Error>({
    queryKey: ["adminReviewerDetail", reviewerProfileId],
    queryFn: () => adminReviewerDetailService(reviewerProfileId),
    enabled: !!reviewerProfileId,
  });
};

export const useAdminReviewerBan = () => {
  return useMutation<any, Error, { userId: string; reason: string }>({
    mutationFn: ({ userId, reason }) => adminReviewerBanService(userId, { reason }),
    onSuccess: (data) => {
      toast.success(data.message || "Ban reviewer successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Ban reviewer failed");
    },
  });
};

