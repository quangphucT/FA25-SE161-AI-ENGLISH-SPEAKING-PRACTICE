import { useMutation, useQueryClient } from "@tanstack/react-query";
import { learnerFeedbackService, learnerReportReviewService } from "../services/LearnerFeedbackService";
import { toast } from "sonner";

export const    useLearnerFeedback = () => {
    const queryClient = useQueryClient();
    return useMutation<any, Error, { rating: number; content: string; reviewId: string }>({
        mutationFn: (body) => learnerFeedbackService(body),
        onSuccess: (data) => {
            toast.success(data.message || "Feedback submitted successfully");
            queryClient.invalidateQueries({ queryKey: ["learnerReviewHistory"] });
        },
        onError: (error) => {
            toast.error(error.message || "Feedback submission failed");
        },
    });
}
export const useLearnerReportReview = () => {
    const queryClient = useQueryClient();
    return useMutation<any, Error, { reviewId: string, reason: string }>({
        mutationFn: (body) => learnerReportReviewService(body),
        onSuccess: (data) => {
            toast.success(data.message || "Report review submitted successfully");
            queryClient.invalidateQueries({ queryKey: ["learnerReviewHistory"] });
        },
        onError: (error) => {
            toast.error(error.message || "Report review submission failed");
        },
    });
}