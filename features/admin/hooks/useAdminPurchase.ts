import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { adminDashboardPurchaseService, AdminPurchaseDashboardResponse, AiBuyersResponse, EnrolledCourseResponse, getAiBuyers, getEnrolledCourseBuyers, getPurchaseDetails, getPurchases, getReviewFeeBuyers, PurchaseDetailsResponse, PurchasesResponse, ReviewFeeBuyersResponse } from "../services/adminPurchaseService";

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

export const useAiBuyers = (pageNumber: number, pageSize: number, buyerPageNumber: number, buyerPageSize: number) => {
    return useQuery<AiBuyersResponse, Error>({
        queryKey: ["aiBuyers", pageNumber, pageSize, buyerPageNumber, buyerPageSize],
        queryFn: () => getAiBuyers(pageNumber, pageSize, buyerPageNumber, buyerPageSize),
    });
};
export const useReviewFeeBuyers = (pageNumber: number, pageSize: number) => {
    return useQuery<ReviewFeeBuyersResponse, Error>({
        queryKey: ["reviewFeeBuyers", pageNumber, pageSize],
        queryFn: () => getReviewFeeBuyers(pageNumber, pageSize),
    });
};
export const useEnrolledCourseBuyers = (pageNumber: number, pageSize: number) => {
    return useQuery<EnrolledCourseResponse, Error>({
        queryKey: ["enrolledCourseBuyers", pageNumber, pageSize],
        queryFn: () => getEnrolledCourseBuyers(pageNumber, pageSize),
    });
};