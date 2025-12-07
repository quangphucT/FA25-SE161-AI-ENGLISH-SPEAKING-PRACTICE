import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { adminFeedbackApproveService, AdminFeedbackDetailResponse, adminFeedbackDetailService, AdminFeedbackRejectPayload, AdminFeedbackRejectResponse, adminFeedbackRejectService, AdminFeedbackResponse, adminFeedbackService } from "../services/adminFeedbackService";
export const useAdminFeedback = (pageNumber: number, pageSize: number, status: string, keyword: string, type: string ) => {
    return useQuery<AdminFeedbackResponse, Error>({
        queryKey: ["adminFeedback", pageNumber, pageSize, status, keyword, type],
        queryFn: () => adminFeedbackService(pageNumber, pageSize, status, keyword, type),
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
    return useMutation<AdminFeedbackRejectResponse, Error, AdminFeedbackRejectPayload>({
        mutationFn: (payload: AdminFeedbackRejectPayload) => adminFeedbackRejectService(payload),
    });
};
export const useAdminFeedbackApprove = () => {
    return useMutation<AdminFeedbackRejectResponse, Error, string>({
        mutationFn: (feedbackId: string) => adminFeedbackApproveService(feedbackId),
    });
};