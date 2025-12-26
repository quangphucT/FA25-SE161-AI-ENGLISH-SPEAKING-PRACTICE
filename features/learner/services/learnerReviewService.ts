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
    // API trả về field reviewAudioUrl
    reviewAudioUrl: string | null;
    reviewType: "Record" | "LearnerAnswer" ;
    feedbackStatus: "NotSent" | "Approved" | "Rejected" | "Pending";
    feedbackRating: number;
    feedbackContent: string;
    tipAmount: number;
    tipMessage: string;
    learnerAudioUrl: string;
}
export interface LearnerReviewHistoryResponse {
    isSucess: boolean;
    data: {
        pageNumber: number;
        pageSize: number;
        totalItems: number;
        completed: number;
        pending: number;
        rejected: number;
        items: LearnerReviewHistory[];          
    };
    businessCode: number;
    message: string;
}
export const learnerReviewHistoryService = async (pageNumber: number, pageSize: number, status: string, keyword: string): Promise<LearnerReviewHistoryResponse> => {
    try {
        const params = new URLSearchParams({
            pageNumber: pageNumber.toString(),
            pageSize: pageSize.toString(),
            status: status,
            keyword: keyword,
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