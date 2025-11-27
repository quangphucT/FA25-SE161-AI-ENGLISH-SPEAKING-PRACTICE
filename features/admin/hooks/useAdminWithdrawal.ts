"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AdminWithdrawalPutResponse, AdminWithdrawalResponse, AdminWithdrawalSummaryResponse, adminWithdrawalApproveService, adminWithdrawalRejectService, adminWithdrawalService, adminWithdrawalSummaryService } from "../services/adminWithdrawalService";
import { toast } from "sonner";

export const useAdminWithdrawal = (pageNumber: number, pageSize: number, status: string, keyword: string) => {
    return useQuery<AdminWithdrawalResponse, Error>({
        queryKey: ["adminWithdrawal", pageNumber, pageSize, status, keyword],
        queryFn: () => adminWithdrawalService(pageNumber, pageSize, status, keyword),
        placeholderData: keepPreviousData,
    });
};
export const useAdminWithdrawalApprove = () => {
    const queryClient = useQueryClient();
    return useMutation<AdminWithdrawalPutResponse, Error, string>({
        mutationFn: (transactionId: string) => adminWithdrawalApproveService(transactionId),
        onSuccess: (data) => {
            toast.success(data.message || "Duyệt yêu cầu rút tiền thành công");
            // Invalidate queries để refetch data
            queryClient.invalidateQueries({ queryKey: ["adminWithdrawal"] });
            queryClient.invalidateQueries({ queryKey: ["adminWithdrawalSummary"] });
            // Invalidate adminTransactions để refetch purchases-management page
            queryClient.invalidateQueries({ queryKey: ["adminTransactions"] });
        },
        onError: (error) => {
            toast.error(error.message || "Duyệt yêu cầu rút tiền thất bại");
        },
    });
};
export const useAdminWithdrawalReject = () => {
    const queryClient = useQueryClient();
    return useMutation<AdminWithdrawalPutResponse, Error, { transactionId: string; reason: string }>({
        mutationFn: ({ transactionId, reason }) => adminWithdrawalRejectService(transactionId, reason),
        onSuccess: (data) => {
            toast.success(data.message || "Từ chối yêu cầu rút tiền thành công");
            // Invalidate queries để refetch data
            queryClient.invalidateQueries({ queryKey: ["adminWithdrawal"] });
            queryClient.invalidateQueries({ queryKey: ["adminWithdrawalSummary"] });
            // Invalidate adminTransactions để refetch purchases-management page
            queryClient.invalidateQueries({ queryKey: ["adminTransactions"] });
        },
        onError: (error) => {
            toast.error(error.message || "Từ chối yêu cầu rút tiền thất bại");
        },
    }); 
};
export const useAdminWithdrawalSummary = () => {
    return useQuery<AdminWithdrawalSummaryResponse, Error>({
        queryKey: ["adminWithdrawalSummary"],
        queryFn: adminWithdrawalSummaryService,
    });
};