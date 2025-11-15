import { useQuery } from "@tanstack/react-query";
import { 
  AdminReviewerIncomeResponse, 
  adminReviewerIncomeService, 
  adminReviewerIncomeListService, 
  AdminReviewerIncomeListResponse,
  adminReviewerIncomeDetailService,
  AdminReviewerIncomeDetailResponse
} from "../services/adminReviewerIncomeService";
export const useAdminReviewerIncome = () => {
  return useQuery<AdminReviewerIncomeResponse, Error>({
    queryKey: ["adminReviewerIncome"],
    queryFn: adminReviewerIncomeService,
  });
}; 

export const useAdminReviewerIncomeList = (
  pageNumber?: number,
  pageSize?: number,
  search?: string,
  fromDate?: string,
  toDate?: string
) => {
  return useQuery<AdminReviewerIncomeListResponse, Error>({
    queryKey: ["adminReviewerIncomeList", pageNumber, pageSize, search, fromDate, toDate],
    queryFn: () => adminReviewerIncomeListService(pageNumber, pageSize, search, fromDate, toDate),
  });
};

export const useAdminReviewerIncomeDetail = (
  reviewerProfileId: string,
  fromDate?: string,
  toDate?: string
) => {
  return useQuery<AdminReviewerIncomeDetailResponse, Error>({
    queryKey: ["adminReviewerIncomeDetail", reviewerProfileId, fromDate, toDate],
    queryFn: () => adminReviewerIncomeDetailService(reviewerProfileId, fromDate, toDate),
    enabled: !!reviewerProfileId, // Only fetch when reviewerProfileId is provided
  });
};