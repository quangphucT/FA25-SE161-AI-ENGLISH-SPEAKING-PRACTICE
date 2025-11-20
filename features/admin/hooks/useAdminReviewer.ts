"use client";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import {
  adminReviewerApproveService,
  adminReviewerBanService,
  adminReviewerDetailService,
  adminReviewerLevelService,
  adminReviewerRejectService,
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

export const useAdminReviewerApprove = () => {
  return useMutation<any, Error, string>({
    mutationFn: (certificateId: string) => adminReviewerApproveService(certificateId),
    onSuccess: (data) => {
      toast.success(data.message || "Approve reviewer successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Approve reviewer failed");
    },
  });
};

export const useAdminReviewerReject = () => {
  return useMutation<any, Error, string>({
    mutationFn: (certificateId: string) => adminReviewerRejectService(certificateId),
    onSuccess: (data) => {
      toast.success(data.message || "Reject reviewer successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Reject reviewer failed");
    },
  });
};

export const useAdminReviewerLevel = () => {
  return useMutation<any, Error, { reviewerProfileId: string; level: string }>({
    mutationFn: ({ reviewerProfileId, level }) => adminReviewerLevelService(reviewerProfileId, { level }),
    onSuccess: (data) => {
      toast.success(data.message || "Update reviewer level successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Update reviewer level failed");
    },
  });
};