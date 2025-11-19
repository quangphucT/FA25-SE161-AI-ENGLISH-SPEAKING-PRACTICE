import fetchWithAuth from "@/utils/fetchWithAuth";
import { UploadCertificateResponse } from "@/types/certificate";
import { Certificate } from "@/features/admin/services/adminSummaryService";
export interface ReviewerProfileResponse {
  isSucess: boolean;
  data: {
    reviewerProfileId: string;
    userId: string;
    experience: string;
    rating: number;
    status: string;
    isReviewerActive: boolean;
    yearsExperience: number;
    certificates: Certificate[];
  };
}

export const reviewerProfilePutService = async (
    userId: string,
    body: {
      experience: string;
      fullname: string;
      phoneNumber: string;
    }
  ): Promise<any> => {
    try {
      const response = await fetchWithAuth(`/api/reviewer/profile/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Update profile failed");
      return data;
    } catch (error: any) {
      const message =
        error?.response?.data?.message || error.message || "Update profile failed";
      throw new Error(message);
    }
  };
  export const reviewerProfileGetService = async (
    userId: string
  ): Promise<ReviewerProfileResponse> => {
    try {
      const response = await fetchWithAuth(
        `/api/reviewer/profile/${userId}`
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
  