import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { LearnerReviewHistoryResponse, learnerReviewHistoryService } from "../services/learnerReviewService";

export const useLearnerReviewHistory = (pageNumber: number, pageSize: number) => {
    return useQuery<LearnerReviewHistoryResponse, Error>({
        queryKey: ["learnerReviewHistory", pageNumber, pageSize],
        queryFn: () => learnerReviewHistoryService(pageNumber, pageSize),
        placeholderData: keepPreviousData,
    });
}