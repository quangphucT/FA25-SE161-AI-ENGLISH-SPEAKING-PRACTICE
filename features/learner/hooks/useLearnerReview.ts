import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { LearnerReviewHistoryResponse, learnerReviewHistoryService } from "../services/learnerReviewService";

export const useLearnerReviewHistory = (pageNumber: number, pageSize: number, status: string, keyword: string) => {
    return useQuery<LearnerReviewHistoryResponse, Error>({
        queryKey: ["learnerReviewHistory", pageNumber, pageSize, status, keyword],
        queryFn: () => learnerReviewHistoryService(pageNumber, pageSize, status, keyword),
        placeholderData: keepPreviousData,
    });
}