import fetchWithAuth from "@/utils/fetchWithAuth";

export interface AdminFeedbackResponse {
    isSucess: boolean;
    data: {
        totalFeedback: number;
        totalApproved: number;
        totalRejected: number;
        averageRating: number;
        totalReports: number;
        pageNumber: number;
        pageSize: number;
        totalItems: number;
        totalPages?: number;
        items: Feedback[];
    };
    businessCode: string;
    message: string;
}
export interface Feedback {
    feedbackId: string;
    senderName: string;
    senderEmail: string;
    type: string;
    rating: number;
    content: string;
    status: string;
    createdAt: string;
    reviewId: string;
    reviewerName: string;
    reviewScore?: number;
    reviewerScore?: number; // Keep for backward compatibility
    reviewerComment?: string;
    reviewComment?: string; // Keep for backward compatibility
    reviewerType?: string;
    reviewType?: string; // Keep for backward compatibility
    learnerRecordAudioUrl?: string;
}
export interface AdminFeedbackDetailResponse {
    isSucess: boolean;
    data: {
        feedbackId: string;
        senderName: string;
        type: string;
        rating: number;
        content: string;
        status: string;
        createdAt: string;
        reviewId: string;
    };
    businessCode: string;
    message: string;
}
export interface AdminFeedbackRejectResponse {
    isSucess: boolean;
    businessCode: string;
    message: string;
}
export interface AdminFeedbackRejectPayload {
    feedbackId: string;
    reason?: string;
}
export const adminFeedbackService = async (pageNumber: number, pageSize: number, status: string, keyword: string, type: string ): Promise<AdminFeedbackResponse> => {
    try {
        const params = new URLSearchParams();
        params.set("pageNumber", pageNumber.toString());
        params.set("pageSize", pageSize.toString());
        if (status) params.set("status", status);
        if (keyword) params.set("keyword", keyword);
        if (type) params.set("type", type);
        const response = await fetchWithAuth(`/api/AdminDashboard/feedback?${params.toString()}`);
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
export const adminFeedbackDetailService = async (feedbackId: string): Promise<AdminFeedbackDetailResponse> => {
    try {
        const response = await fetchWithAuth(`/api/AdminDashboard/feedback/${feedbackId}`,);
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
export const adminFeedbackRejectService = async ({ feedbackId, reason = "" }: AdminFeedbackRejectPayload): Promise<AdminFeedbackRejectResponse> => {
    try {
        const response = await fetchWithAuth(`/api/AdminDashboard/feedback/reject/${feedbackId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(reason),
        });
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
export const adminFeedbackApproveService = async (feedbackId: string): Promise<AdminFeedbackRejectResponse> => {
    try {
        const response = await fetchWithAuth(`/api/AdminDashboard/feedback/approve/${feedbackId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
        });
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