import { useMutation, useQuery } from "@tanstack/react-query";
import { AdminWithdrawalPutResponse, AdminWithdrawalResponse, adminWithdrawalApproveService, adminWithdrawalRejectService, adminWithdrawalService } from "../services/adminWithdrawalService";

export const useAdminWithdrawal = (pageNumber: number, pageSize: number) => {
    return useQuery<AdminWithdrawalResponse, Error>({
        queryKey: ["adminWithdrawal", pageNumber, pageSize],
        queryFn: () => adminWithdrawalService(pageNumber, pageSize),
    });
};
export const useAdminWithdrawalApprove = (transactionId: string) => {
    return useMutation<AdminWithdrawalPutResponse, Error>({
        mutationFn: () => adminWithdrawalApproveService(transactionId),
    });
};
export const useAdminWithdrawalReject = (transactionId: string) => {
    return useMutation<AdminWithdrawalPutResponse, Error>({
        mutationFn: () => adminWithdrawalRejectService(transactionId),
    }); 
};