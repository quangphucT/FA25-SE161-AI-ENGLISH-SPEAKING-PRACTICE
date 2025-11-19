import fetchWithAuth from "@/utils/fetchWithAuth";
import { Certificate } from "./adminSummaryService";

export interface AdminReviewersResponse {
  isSucess: boolean;
  data: {
    pageNumber: number;
    pageSize: number;
    totalItems: number;
    items: Reviewer[];
  };
  businessCode: number;
  message: string;
}
export interface Reviewer {
  reviewerProfileId: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  level: string;
  experience: number;
  rating: number;
  status: string;
  lastActiveAt: Date;
  createdAt: Date;
  
}
export interface ReviewerDetail {
    reviewerProfileId: string;
    fullName: string;
    email: string;
    phone: string;
    experience: string;
    rating: number;
    status: string;
    lastActiveAt: Date;
    createdAt: Date;
    certificates: Certificate[];
    feedbacks: Feedback[];
  }

export interface ReviewerDetailResponse {
  isSucess: boolean;
  data: ReviewerDetail;
  businessCode: number;
  message: string;
}
export interface Feedback {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    content: string;
    rating: number;
    createdAt: Date;
  }
export const adminReviewersService = async (
  pageNumber: number,
  pageSize: number,
  filterStatus: string,
  search: string
): Promise<AdminReviewersResponse> => {
  try {
    const params = new URLSearchParams({
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString(),
      filterStatus: filterStatus || "",
      search: search || "",
    });
    const response = await fetchWithAuth(
      `/api/AdminDashboard/reviewer?${params.toString()}`
    );
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
export const adminReviewerDetailService = async (
    reviewerProfileId: string,
  ): Promise<ReviewerDetailResponse> => {
    try {
      const url = `/api/AdminDashboard/reviewer/${reviewerProfileId}`;
      
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
  
export const adminReviewerBanService = async (
    userId: string,
    body: {
      reason: string;
    }
  ): Promise<any> => {
    try {
      const response = await fetchWithAuth(`/api/AdminDashboard/reviewer/ban/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Ban reviewer failed");
      return data;
    } catch (error: any) {
      const message =
        error?.response?.data?.message || error.message || "Ban reviewer failed";
      throw new Error(message);
    }
  };