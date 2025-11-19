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
}
export interface ReviewerReviewHistoryResponse {
  isSucess: boolean;
  data: {
    pageNumber: number;
    pageSize: number;
    totalItems: number;
    items: ReviewerReview[];
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
      learnerAnswerId: string;
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