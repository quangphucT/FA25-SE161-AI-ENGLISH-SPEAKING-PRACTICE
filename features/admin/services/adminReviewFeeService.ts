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