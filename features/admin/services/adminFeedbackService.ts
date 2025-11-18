import fetchWithAuth from "@/utils/fetchWithAuth";

export interface AdminFeedbackResponse {
    isSucess: boolean;
    data: {
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
export const adminFeedbackService = async (pageNumber: number, pageSize: number, status: string, keyword: string): Promise<AdminFeedbackResponse> => {
    try {
        const response = await fetchWithAuth(`/api/AdminDashboard/feedback?pageNumber=${pageNumber}&pageSize=${pageSize}&status=${status}&keyword=${keyword}`);
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
        const response = await fetchWithAuth(`/api/AdminDashboard/feedback/${feedbackId}`);
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
export const adminFeedbackRejectService = async (feedbackId: string): Promise<AdminFeedbackRejectResponse> => {
    try {
        const response = await fetchWithAuth(`/api/AdminDashboard/feedback/${feedbackId}/reject`);
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