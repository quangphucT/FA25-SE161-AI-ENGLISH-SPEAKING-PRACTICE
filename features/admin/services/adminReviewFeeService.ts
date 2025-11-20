import fetchWithAuth from "@/utils/fetchWithAuth";

export interface CreateReviewFeeRequest {
  reviewFeeId: string;
  appliedDate: string;
  percentOfSystem: number;
  percentOfReviewer: number;
  pricePerReviewFee: number;
}

export interface CreateReviewFeeResponse {
  message: string;
}
export interface ReviewFeePackagesResponse {
  isSucess: boolean;
  data: {
    pageNumber: number;
    pageSize: number;
    totalItems: number;
    items: ReviewFeePackage[];
  };
  businessCode: string;
  message: string;
}
export interface ReviewFeePackage {
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
export const adminReviewFeeService = async (
  body: CreateReviewFeeRequest
): Promise<CreateReviewFeeResponse> => {
    try {
      const response = await fetchWithAuth("/api/AdminDashboard/reviewfee", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Create review fee failed");
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unknown error occurred");
  }
};

export const getReviewFeePackages = async (pageNumber: number, pageSize: number): Promise<ReviewFeePackagesResponse> => {
  try {
    const queryParams = new URLSearchParams({
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString(),
    });
    const response = await fetchWithAuth(`/api/AdminDashboard/reviewfee?${queryParams.toString()}`, {
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