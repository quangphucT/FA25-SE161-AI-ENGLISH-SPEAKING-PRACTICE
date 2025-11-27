import { fetchWithAuth } from "@/utils/fetchWithAuth";
export interface LearnerReviewHistory {
    reviewId: string;
    score: number;
    comment: string;
    status: string;
    recordId: string;
    createdAt: Date;
    questionContent: string;
    reviewerFullName: string;
    reviewType: "Record" | "LearnerAnswer";
}
export interface LearnerReviewHistoryResponse {
    isSucess: boolean;
    data: {
        pageNumber: number;
        pageSize: number;
        totalItems: number;
        items: LearnerReviewHistory[];          
    };
    businessCode: number;
    message: string;
}
export const learnerReviewHistoryService = async (pageNumber: number, pageSize: number): Promise<LearnerReviewHistoryResponse> => {
    try {
        const params = new URLSearchParams({
            pageNumber: pageNumber.toString(),
            pageSize: pageSize.toString(),
        });
        const response = await fetchWithAuth(`/api/learner/myReview?${params.toString()}`, {
            method: 'GET',
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Learner review history failed");
        return data;
    }
    catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("An unknown error occurred");
    }
}