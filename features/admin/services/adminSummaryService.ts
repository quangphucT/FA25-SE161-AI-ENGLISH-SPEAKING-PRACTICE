"use client";

import fetchWithAuth from "@/utils/fetchWithAuth";

export interface AdminSummaryResponse {
  isSuccess: boolean;
  data: {
    totalLearners: number;
    totalActiveLearners: number;
    totalServicePackages: number;
    totalRevenue: number;
  };
  businessCode: number;
  message: string;
}
export interface AdminPackagesResponse {
  isSucess: boolean;
  data: PackageSoldStatistics[];
  businessCode: number;
  message: string;
}
export interface PackageSoldStatistics {
  month: number;
  count: number;
  revenue: number;
}
export interface AdminRevenueResponse {
  isSucess: boolean;
  data: PackageSoldStatistics[];
  businessCode: number;
  message: string;
}
export interface AdminRegisteredReviewerResponse {
  isSucess: boolean;
  data: {
    pageNumber: number;
    pageSize: number;
    items: Reviewer[];
  };
  businessCode: number;
  message: string;
}
export interface Reviewer {
  reviewerProfileId: string;
  fullName: string;
  email: string;
  phone: string;
  experience: string;
  status: string;
  hasCertificate: boolean;
  certificates: Certificate[];
    reviewCount: number;   
  totalIncome: number;   
}
export interface Certificate {
  certificateId: string;
  name: string;
  url: string;
  status: string;
}


export const adminSummaryService = async (): Promise<AdminSummaryResponse> => {
  try {
    const response = await fetchWithAuth("/api/AdminDashboard/summary");
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
export const adminPackagesService = async (
  year: string
): Promise<AdminPackagesResponse> => {
  try {
    const response = await fetchWithAuth(
      `/api/AdminDashboard/packages?year=${year}`
    );
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    // 🔥 Trả toàn bộ object, KHÔNG phải chỉ mảng data
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

export const adminRevenueService = async (
  year: string
): Promise<AdminRevenueResponse> => {
  try {
    const response = await fetchWithAuth(
      `/api/AdminDashboard/revenue?year=${year}`
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
export const adminRegisteredReviewerService = async (
  pageNumber: number,
  pageSize: number
): Promise<AdminRegisteredReviewerResponse> => {
  try {
    const response = await fetchWithAuth(
      `/api/AdminDashboard/registeredreviewer?pageNumber=${pageNumber}&pageSize=${pageSize}`
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
