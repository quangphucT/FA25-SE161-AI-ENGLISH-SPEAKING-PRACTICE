import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { reviewerReviewHistoryService, reviewerReviewPendingService, reviewerReviewSubmitService, ReviewerReviewSubmitResponse } from "../services/reviewerReviewService";
import { ReviewerReviewHistoryResponse, ReviewerReviewPendingResponse } from "../services/reviewerReviewService";
import { useQuery } from "@tanstack/react-query";
export const useReviewReviewSubmit = () => {
    const queryClient = useQueryClient();
    return useMutation<ReviewerReviewSubmitResponse, Error, { learnerAnswerId: string; recordId: string | null; reviewerProfileId: string | null; score: number; comment: string }>({
        mutationFn: ({ learnerAnswerId, recordId, reviewerProfileId, score, comment }) => reviewerReviewSubmitService({ learnerAnswerId, recordId, reviewerProfileId, score, comment }),
        onSuccess: (data) => {
            const message = data.message || "Review answer submitted successfully";
            const remainingReviews = data.data?.remainingReviews;
            
            // Show success message with remaining reviews info if available
            if (remainingReviews !== undefined) {
                toast.success(`${message} (Còn ${remainingReviews} câu trả lời cần review)`);
            } else {
                toast.success(message);
            }
            
            // Invalidate pending reviews to refresh the list
            queryClient.invalidateQueries({ queryKey: ["reviewReviewPending"] });
        },
        onError: (error) => {
            toast.error(error.message || "Review answer submission failed");
        },
    });
}
export const useReviewReviewHistory = (pageNumber: number, pageSize: number ) => {
    return useQuery<ReviewerReviewHistoryResponse, Error>({
        queryKey: ["reviewReviewHistory", pageNumber, pageSize],
        queryFn: () => reviewerReviewHistoryService(pageNumber, pageSize),
    });
}
export const useReviewReviewPending = (pageNumber: number, pageSize: number) => {
    return useQuery<ReviewerReviewPendingResponse, Error>({
        queryKey: ["reviewReviewPending", pageNumber, pageSize],
        queryFn: () => reviewerReviewPendingService(pageNumber, pageSize),
    });
}