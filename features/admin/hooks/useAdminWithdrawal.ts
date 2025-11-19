import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { AdminWithdrawalPutResponse, AdminWithdrawalResponse, AdminWithdrawalSummaryResponse, adminWithdrawalApproveService, adminWithdrawalRejectService, adminWithdrawalService, adminWithdrawalSummaryService } from "../services/adminWithdrawalService";

export const useAdminWithdrawal = (pageNumber: number, pageSize: number, status: string, keyword: string) => {
    return useQuery<AdminWithdrawalResponse, Error>({
        queryKey: ["adminWithdrawal", pageNumber, pageSize, status, keyword],
        queryFn: () => adminWithdrawalService(pageNumber, pageSize, status, keyword),
        placeholderData: keepPreviousData,
    });
};
export const useAdminWithdrawalApprove = () => {
    return useMutation<AdminWithdrawalPutResponse, Error, string>({
        mutationFn: (transactionId: string) => adminWithdrawalApproveService(transactionId),
    });
};
export const useAdminWithdrawalReject = () => {
    return useMutation<AdminWithdrawalPutResponse, Error, string>({
        mutationFn: (transactionId: string) => adminWithdrawalRejectService(transactionId),
    }); 
};
export const useAdminWithdrawalSummary = () => {
    return useQuery<AdminWithdrawalSummaryResponse, Error>({
        queryKey: ["adminWithdrawalSummary"],
        queryFn: adminWithdrawalSummaryService,
    });
};