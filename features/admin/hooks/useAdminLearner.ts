"use client";
import { useQuery } from "@tanstack/react-query";
import { AdminLearnersResponse, adminLearnersService } from "../services/adminLearnerService";
export const useAdminLearner = (pageNumber: number, pageSize: number, filterStatus: string, search: string) => {
  return useQuery<AdminLearnersResponse, Error>({
    queryKey: ["adminLearner"],
    queryFn: () => adminLearnersService(pageNumber, pageSize, filterStatus, search),
  });
};
