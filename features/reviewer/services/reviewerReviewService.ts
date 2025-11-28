import fetchWithAuth from "@/utils/fetchWithAuth";
export interface ReviewerReview{
  id: string;
  content: string;
  type: string;
  submittedAt: Date;
  audioUrl: string;
  numberOfReview: number;
  learnerFullName: string;
}
export interface ReviewerReviewHistory {
  reviewId: string;
  score: number;
  comment: string;
  status: string;
  learnerAnswerId: string;
  createdAt: Date;
  questionContent: string;
  learnerFullName: string;
  reviewType: string;
  learnerAudioUrl: string;
}
export interface ReviewerReviewHistoryResponse {
  isSucess: boolean;
  data: {
    pageNumber: number;
    pageSize: number;
    totalItems: number;
    items: ReviewerReviewHistory[];
    businessCode: number;
    message: string;
  };
}
export interface ReviewerReviewPending {
  type: string;
  id: string;
  submittedAt: Date;
  content: string;
  audioUrl: string;
  numberOfReview: number;
  learnerFullName: string;
  questionText: string;
}
export interface ReviewerReviewPendingResponse {
  isSucess: boolean;
  data: {
    pageNumber: number;
    pageSize: number;
    totalItems: number;
    items: ReviewerReviewPending[];
    businessCode: number;
    message: string;
  };
}

export interface ReviewerReviewSubmitResponse {
  isSucess: boolean;
  data: {
    reviewId: string;
    learnerAnswerId: string;
    score: number;
    comment: string;
    status: string;
    remainingReviews: number;
  };
  businessCode: string;
  message: string;
}

export const reviewerReviewSubmitService = async (
    body: {
      learnerAnswerId: string | null;
      recordId: string | null;
      reviewerProfileId: string | null;
      score: number;
      comment: string;
    }
  ): Promise<ReviewerReviewSubmitResponse> => {
    try {
      const response = await fetchWithAuth(`/api/reviewer/reviewAnswer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Review answer failed");
      return data;
    } catch (error: any) {
      const message =
        error?.response?.data?.message || error.message || "Review answer failed";
      throw new Error(message);
    }
  };

  export const reviewerReviewHistoryService = async (
    pageNumber: number,
    pageSize: number
  ): Promise<ReviewerReviewHistoryResponse> => {
    try {
      const params = new URLSearchParams({
        pageNumber: pageNumber.toString(),
        pageSize: pageSize.toString(),
      });
      const response = await fetchWithAuth(`/api/reviewer/reviewAnswer/history?${params.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Review answer history failed");
      return data;
    } catch (error: any) {
      const message =
        error?.response?.data?.message || error.message || "Review answer history failed";
      throw new Error(message);
    }
  };
  export const reviewerReviewPendingService = async (
    pageNumber: number,
    pageSize: number
  ): Promise<ReviewerReviewPendingResponse> => {
    try {
      const params = new URLSearchParams({
        pageNumber: pageNumber.toString(),
        pageSize: pageSize.toString(),
      });
      const response = await fetchWithAuth(`/api/reviewer/reviewAnswer/pending?${params.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Review answer pending failed");    
      return data;
    } catch (error: any) {
      const message =
        error?.response?.data?.message || error.message || "Review answer pending failed";
      throw new Error(message);
    }
  };
  export interface ReviewerReviewStatisticsResponse {
    isSucess: boolean;
    data: {
      totalFeedback: number;
      totalReviews: number;
      averageRating: number;
      coinBalance: number;
    };
    businessCode: string;
    message: string;
  }
  export const reviewerReviewStatisticsService = async (): Promise<ReviewerReviewStatisticsResponse> => {
    try {
      const response = await fetchWithAuth(`/api/reviewer/statistics`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Reviewer review statistics failed");
      return data;
    } catch (error: any) {
      const message =
        error?.response?.data?.message || error.message || "Reviewer review statistics failed";
      throw new Error(message);
    }
  }
  export interface ReviewerReviewWalletResponse {
    isSucess: boolean;
    data: {
      totalEarnedCoin: number;
      totalEarnedMoney: number;
      currentBalanceCoin: number;
      currentBalanceMoney: number;
      transactions: Transaction;
    };
    businessCode: string;
    message: string;
  }
  export interface Transaction {
    pageNumber: number;
    pageSize: number;
    totalItems: number;
    items: TransactionItem[];
  }
  export interface TransactionItem {
    transactionId: string;
      coin: number;
    money: number;
    bankName: string;
    accountNumber: string;
    status: "Withdraw" | "Reject" | "Pending";
    orderCode: string;
    createdAt: string;
    description: string;
  }
  export const reviewerReviewWalletService = async (pageNumber: number, pageSize: number): Promise<ReviewerReviewWalletResponse> => {
    try {
      const params = new URLSearchParams({
        pageNumber: pageNumber.toString(),
        pageSize: pageSize.toString(),
      });
      const response = await fetchWithAuth(`/api/reviewer/wallet?${params.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Reviewer review wallet failed");
      return data;
    } catch (error: any) {
      const message =
        error?.response?.data?.message || error.message || "Reviewer review wallet failed";
      throw new Error(message);
    }
  }
  export const reviewerTipAfterReviewService = async (
    reviewId: string,
    amountCoin: number, 
    message: string
  ): Promise<any> => {
    try {
      // Validate required fields
      if (!reviewId || !reviewId.trim()) {
        throw new Error("Review ID is required");
      }
      if (!amountCoin || amountCoin <= 0) {
        throw new Error("Amount coin must be greater than 0");
      }
      
      const requestBody = {
        reviewId: reviewId.trim(),
        amountCoin: Number(amountCoin),
        message: message.trim() || "",
      };
      
      console.log("Calling tip after review with:", requestBody);
      
      const response = await fetchWithAuth(`/api/reviewer/tipafterreview`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
        credentials: "include",
      });
      
      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);
      
      // Read response as text first
      const responseText = await response.text();
      console.log("Response text:", responseText);
      
      let data;
      try {
        // Try to parse as JSON
        data = responseText ? JSON.parse(responseText) : {};
      } catch (jsonError) {
        // If not JSON, use text as error message
        throw new Error(responseText || "Failed to parse response from server");
      }
      
      if (!response.ok) {
        const errorMessage = data.message || data.error || `Server error: ${response.status}`;
        console.error("Tip after review failed:", errorMessage, data);
        throw new Error(errorMessage);
      }
      
      return data;
    } catch (error: any) {
      console.error("Tip after review service error:", error);
      const message =
        error?.response?.data?.message || error.message || "Failed to tip after review";
      throw new Error(message);
    }
  }