import { fetchWithAuth } from "@/utils/fetchWithAuth";

export const learnerFeedbackService = async (body: { rating: number; content: string; reviewId: string }) => {
    try {
    const response = await fetchWithAuth("/api/learner/feedback", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        credentials: "include",
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Feedback failed");
    return data;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message || "Feedback failed");
        }
        throw new Error("Feedback failed");
    }
}
export const learnerReportReviewService = async (body: { reviewId: string ,reason: string}) => {
    try {
    const response = await fetchWithAuth("/api/learner/report", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        credentials: "include",
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Report review failed");
    return data;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message || "Report review failed");
        }
        throw new Error("Report review failed");
    }
}