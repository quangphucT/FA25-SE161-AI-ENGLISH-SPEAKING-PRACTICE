import fetchWithAuth from "@/utils/fetchWithAuth";
import { Reviewer } from "./adminSummaryService";


export interface AdminReviewerIncomeResponse {
    isSuccess: boolean;
    data: {
      totalReviews: number;
      totalIncome: number;
      totalReviewer: number;
      pricePerReview: number;
    };
    businessCode: number;
    message: string;
  }
  export interface AdminReviewerIncomeListResponse {
    isSuccess: boolean;
    data: {
      pageNumber: number;
      pageSize: number;
      items: ReviewerFee[];
    };
  }
  export interface ReviewerFee{
    reviewerProfileId: string;
    fullName: string;
    email: string;
    totalIncome: number;
    reviewCount: number;
  }
  export interface AdminReviewerIncomeDetailResponse {
    isSucess: boolean;
    data: {
      totalReviews: string;
      incomePerReview: number;
      totalEarnedFromSystem: number;
      totalSpentOnTips: number;
      netIncome:number
      items?: Array<{
        reviewId: string;
        score: number;
        question: string;
        comment: string;
        status: string;
        createdAt: Date;
        learner: string;
        earnedFromThisReview: number;
      }>;
    };
    businessCode?: number;
    message?: string;
  }
export const adminReviewerIncomeService = async (): Promise<AdminReviewerIncomeResponse> => {
    try {
      const response = await fetchWithAuth("/api/AdminDashboard/reviewerIncome");
      const data = await response.json();
      return data;
    } catch (error: unknown) {
      const message =
        (error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response &&
        error.response.data &&
        typeof error.response.data === "object" &&
        "message" in error.response.data
          ? (error.response.data as { message: string }).message
          : null) ||
        (error instanceof Error ? error.message : null) ||
        "An unknown error occurred";
      throw new Error(message);
    }
  };

  export const adminReviewerIncomeListService = async (
    pageNumber?: number,
    pageSize?: number,
    search?: string,
    fromDate?: string,
    toDate?: string
  ): Promise<AdminReviewerIncomeListResponse> => {
    try {
      const params = new URLSearchParams();
      if (pageNumber) params.set("pageNumber", pageNumber.toString());
      if (pageSize) params.set("pageSize", pageSize.toString());
      if (search) params.set("search", search);
      if (fromDate) params.set("fromDate", fromDate);
      if (toDate) params.set("toDate", toDate);

      const queryString = params.toString();
      const url = `/api/AdminDashboard/reviewIncomeList${queryString ? `?${queryString}` : ""}`;
      
      const response = await fetchWithAuth(url);
      const data = await response.json();
      return data;
    } catch (error: unknown) {
      const message =
        (error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response &&
        error.response.data &&
        typeof error.response.data === "object" &&
        "message" in error.response.data
          ? (error.response.data as { message: string }).message
          : null) ||
        (error instanceof Error ? error.message : null) ||
        "An unknown error occurred";
      throw new Error(message);
    }
  };

  export const adminReviewerIncomeDetailService = async (
    reviewerProfileId: string,
    fromDate?: string,
    toDate?: string
  ): Promise<AdminReviewerIncomeDetailResponse> => {
    try {
      const params = new URLSearchParams();
      if (fromDate) params.set("fromDate", fromDate);
      if (toDate) params.set("toDate", toDate);

      const queryString = params.toString();
      const url = `/api/AdminDashboard/reviewIncomeDetail/${reviewerProfileId}${queryString ? `?${queryString}` : ""}`;
      
      const response = await fetchWithAuth(url);
      const data = await response.json();
      return data;
    } catch (error: unknown) {
      const message =
        (error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response &&
        error.response.data &&
        typeof error.response.data === "object" &&
        "message" in error.response.data
          ? (error.response.data as { message: string }).message
          : null) ||
        (error instanceof Error ? error.message : null) ||
        "An unknown error occurred";
      throw new Error(message);
    }
  };
  