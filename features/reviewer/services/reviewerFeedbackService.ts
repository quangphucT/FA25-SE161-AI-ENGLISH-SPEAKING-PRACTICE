import { fetchWithAuth } from "@/utils/fetchWithAuth";

export interface ReviewerFeedbackHistoryResponse {
    isSucess: boolean;
    data: {
        pageNumber: number;
        pageSize: number;
        totalItems: number;
        items: ReviewerFeedbackHistory[];
    };
    message: string;
    businessCode: number;
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
export const reviewerFeedbackHistoryService = async (
    pageNumber: number,
    pageSize: number
): Promise<ReviewerFeedbackHistoryResponse> => {
    try {
        const params = new URLSearchParams({
            pageNumber: pageNumber.toString(),
            pageSize: pageSize.toString(),
        });
        const response = await fetchWithAuth(`/api/reviewer/feedback?${params.toString()}`, {
            method: "GET",
        });
        const data = await response.json();

        const isNoFeedbackResponse =
            response.status === 400 &&
            typeof data?.message === "string" &&
            data.message.toLowerCase().includes("chưa có feedback");

        if (isNoFeedbackResponse) {
            return {
                isSucess: true,
                data: {
                    pageNumber,
                    pageSize,
                    totalItems: 0,
                    items: [],
                },
                message: data.message ?? "Reviewer chưa có feedback nào.",
                businessCode: data.businessCode ?? 0,
            };
        }

        if (!response.ok) throw new Error(data.message || "Reviewer feedback history failed");
        return data;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("An unknown error occurred");
    }
};