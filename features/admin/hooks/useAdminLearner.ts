"use client";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import {
  adminLearnerBanService,
  AdminLearnerDetailResponse,
  adminLearnerDetailService,
  AdminLearnersResponse,
  adminLearnersService,
} from "../services/adminLearnerService";
import { toast } from "sonner";

export const useAdminLearner = (
  pageNumber: number,
  pageSize: number,
  filterStatus: string,
  search: string
) => {
  return useQuery<AdminLearnersResponse, Error>({
    queryKey: ["adminLearner", pageNumber, pageSize, filterStatus, search],
    queryFn: () =>
      adminLearnersService(pageNumber, pageSize, filterStatus, search),
    placeholderData: keepPreviousData,
  });
};
export const useAdminLearnerDetail = (learnerProfileId: string) => {
  return useQuery<AdminLearnerDetailResponse, Error>({
    queryKey: ["adminLearnerDetail", learnerProfileId],
    queryFn: () => adminLearnerDetailService(learnerProfileId),
    enabled: !!learnerProfileId, // Only fetch when learnerProfileId is provided
  });
};
export const useAdminLearnerBan = () => {
  return useMutation<any, Error, { userId: string; reason: string }>({
    mutationFn: ({ userId, reason }) => adminLearnerBanService(userId, { reason }),
    onSuccess: (data) => {
      toast.success(data.message || "Ban learner successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Ban learner failed");
    },
  });
};