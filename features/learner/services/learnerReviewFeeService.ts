import { fetchWithAuth } from "@/utils/fetchWithAuth";
export interface LearnerReviewFeePackagesResponse {
    isSucess: boolean;
    data: {
      totalItems: number;
      items: LearnerReviewFeePackage[];
    };
    businessCode: string;
    message: string;
  }
  export interface LearnerReviewFeePackage {
    reviewFeeId: string;
    numberOfReview: number;
    currentPricePolicy: CurrentPricePolicy;
  }
  export interface CurrentPricePolicy {
    reviewFeeDetailId: string;
    pricePerReviewFee: number;
    appliedDate: string;
    percentOfSystem: number;
    percentOfReviewer: number;
  }
export const getLearnerReviewFeePackages = async (): Promise<LearnerReviewFeePackagesResponse > => {
    try {
     
      const response = await fetchWithAuth(`/api/learner/reviewfee`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch review fee packages");
      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("An unknown error occurred");
    }
  };