import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { adminDashboardPurchaseService, AdminPurchaseDashboardResponse, getPurchaseDetails, getPurchases, PurchaseDetailsResponse, PurchasesResponse } from "../services/adminPurchaseService";

export const useAdminPurchase = (pageNumber: number, pageSize: number, keyword: string, type: string) => {
    return useQuery<PurchasesResponse, Error>({
        queryKey: ["adminPurchase", pageNumber, pageSize, keyword, type],
        queryFn: () => getPurchases(pageNumber, pageSize, keyword, type),
    });
};  
export const useAdminPurchaseDetails = (purchaseId: string | null) => {
    return useQuery<PurchaseDetailsResponse, Error>({
        queryKey: ["adminPurchaseDetails", purchaseId],
        queryFn: () => getPurchaseDetails(purchaseId!),
        enabled: !!purchaseId,
        placeholderData: keepPreviousData,
    });
};
export const useAdminPurchaseDashboard = () => {
    return useQuery<AdminPurchaseDashboardResponse, Error>({
        queryKey: ["adminPurchaseDashboard"],
        queryFn: () => adminDashboardPurchaseService(),
    });
};