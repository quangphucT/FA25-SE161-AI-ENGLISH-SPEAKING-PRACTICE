import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { AdminFeedbackDetailResponse, adminFeedbackDetailService, AdminFeedbackRejectResponse, adminFeedbackRejectService, AdminFeedbackResponse, adminFeedbackService } from "../services/adminFeedbackService";
export const useAdminFeedback = (pageNumber: number, pageSize: number, status: string, keyword: string) => {
    return useQuery<AdminFeedbackResponse, Error>({
        queryKey: ["adminFeedback", pageNumber, pageSize, status, keyword],
        queryFn: () => adminFeedbackService(pageNumber, pageSize, status, keyword),
        placeholderData: keepPreviousData,
    });
};
export const useAdminFeedbackDetail = (feedbackId: string) => {
    return useQuery<AdminFeedbackDetailResponse, Error>({
        queryKey: ["adminFeedbackDetail", feedbackId],
        queryFn: () => adminFeedbackDetailService(feedbackId),
        placeholderData: keepPreviousData,
        enabled: !!feedbackId && feedbackId !== "",
    });
};
export const useAdminFeedbackReject = () => {
    return useMutation<AdminFeedbackRejectResponse, Error, string>({
        mutationFn: (feedbackId: string) => adminFeedbackRejectService(feedbackId),
    });
};