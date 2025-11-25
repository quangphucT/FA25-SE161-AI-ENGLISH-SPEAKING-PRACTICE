import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ReviewerFeedbackHistoryResponse, reviewerFeedbackHistoryService } from "../services/reviewerFeedbackService";

export const useReviewFeedback = (pageNumber: number, pageSize: number) => {
    return useQuery<ReviewerFeedbackHistoryResponse, Error>({
        queryKey: ["reviewerFeedback", pageNumber, pageSize],
        queryFn: () => reviewerFeedbackHistoryService(pageNumber, pageSize),
        placeholderData: keepPreviousData,
    });
}