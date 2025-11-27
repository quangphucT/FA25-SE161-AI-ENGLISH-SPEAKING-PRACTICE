import { useMutation } from "@tanstack/react-query";
import { learnerFeedbackService } from "../services/LearnerFeedbackService";
import { toast } from "sonner";

export const useLearnerFeedback = () => {
    return useMutation<any, Error, { rating: number; content: string; reviewId: string }>({
        mutationFn: (body) => learnerFeedbackService(body),
        onSuccess: (data) => {
            toast.success(data.message || "Feedback submitted successfully");
        },
        onError: (error) => {
            toast.error(error.message || "Feedback submission failed");
        },
    });
}