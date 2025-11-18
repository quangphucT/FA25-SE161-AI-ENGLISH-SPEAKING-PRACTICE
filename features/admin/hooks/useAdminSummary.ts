"use client";
import { RegisterRequest, RegisterResponse } from "@/types/auth";
import {
  AdminSummaryResponse,
  adminSummaryService,
  adminPackagesService,
  AdminPackagesResponse,
  adminRevenueService,
  AdminRegisteredReviewerResponse,
  adminRegisteredReviewerService,
} from "../services/adminSummaryService";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { adminManagerCreateService, AdminManagerResponse, adminManagerService } from "../services/adminManagerService";
import { AdminReviewersResponse, adminReviewersService } from "../services/adminReviewerService";
export const useAdminSummary = () => {
  return useQuery<AdminSummaryResponse, Error>({
    queryKey: ["adminSummary"],
    queryFn: adminSummaryService,
  });
};
export const useAdminPackages = (year: string) => {
  return useQuery<AdminPackagesResponse, Error>({
    queryKey: ["adminPackages", year],
    queryFn: () => adminPackagesService(year),
  });
};
export const useAdminRevenue = (year: string) => {
  return useQuery<AdminPackagesResponse, Error>({
    queryKey: ["adminRevenue", year],
    queryFn: () => adminRevenueService(year),
  });
};
export const useAdminRegisteredReviewer = (
  pageNumber: number,
  pageSize: number
) => {
  return useQuery<AdminRegisteredReviewerResponse, Error>({
    queryKey: ["adminRegisteredReviewer", pageNumber, pageSize],
    queryFn: () => adminRegisteredReviewerService(pageNumber, pageSize),
  });
};
export const useAdminManagerCreateMutation = () => {
  return useMutation<RegisterResponse, Error, RegisterRequest>({
      mutationFn: adminManagerCreateService
  });
}
export const useAdminManagerList = (pageNumber: number, pageSize: number, search: string) => {  
  return useQuery<AdminManagerResponse, Error>({
    queryKey: ["adminManagerList", pageNumber, pageSize, search],
    queryFn: () => adminManagerService(pageNumber, pageSize, search),
  });
}
export const useAdminReviewerList = (pageNumber: number, pageSize: number, filterStatus: string, search: string) => {
  return useQuery<AdminReviewersResponse, Error>({
    queryKey: ["adminReviewerList", pageNumber, pageSize, filterStatus, search],
    queryFn: () => adminReviewersService(pageNumber, pageSize, filterStatus, search),
    placeholderData: keepPreviousData,
  });
}