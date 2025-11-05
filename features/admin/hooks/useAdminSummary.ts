"use client";
import {
  AdminSummaryResponse,
  adminSummaryService,
  adminPackagesService,
  AdminPackagesResponse,
  adminRevenueService,
  AdminRegisteredReviewerResponse,
  adminRegisteredReviewerService,
} from "../services/adminSummaryService";
import { useQuery } from "@tanstack/react-query";
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
