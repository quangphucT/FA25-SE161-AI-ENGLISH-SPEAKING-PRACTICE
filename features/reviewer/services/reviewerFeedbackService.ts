import { fetchWithAuth } from "@/utils/fetchWithAuth";

export interface ReviewerFeedbackHistoryResponse {
    isSucess: boolean;
    data: {
        pageNumber: number;
        pageSize: number;
        totalItems: number;
        items: ReviewerFeedbackHistory[];
    };
}
export interface ReviewerFeedbackHistory {
    feedbackId: string;
    content: string;
    rating: number;
    createdAt: Date;
    learnerName: string;
    learnerEmail: string;
    reviewId: string;
    reviewType: string;
    questionOrContent: string;
}
export const reviewerFeedbackHistoryService = async (pageNumber: number, pageSize: number): Promise<ReviewerFeedbackHistoryResponse> => {
    try {
        const params = new URLSearchParams({
            pageNumber: pageNumber.toString(),
            pageSize: pageSize.toString(),
        });
        const response = await fetchWithAuth(`/api/reviewer/feedback?${params.toString()}`, {
            method: 'GET',
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Reviewer feedback history failed");
        return data;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("An unknown error occurred");
    }
}