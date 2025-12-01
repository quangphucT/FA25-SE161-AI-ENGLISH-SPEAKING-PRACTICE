import { useQuery } from "@tanstack/react-query";
import { AdminDashboardResponse, adminDashboardTransactionService, AdminTransactionsResponse, adminTransactionsService } from "../services/adminTransactionsService";

export const useAdminTransactions = (pageNumber: number, pageSize: number, search: string, status: string, type: string) => {
  return useQuery<AdminTransactionsResponse, Error>({
    queryKey: ["adminTransactions", pageNumber, pageSize, search, status, type],
    queryFn: () => adminTransactionsService(pageNumber, pageSize, search, status, type),
  });
};  
export const useAdminDashboardTransaction = () => {
  return useQuery<AdminDashboardResponse, Error>({
    queryKey: ["adminDashboardTransaction"],
    queryFn: () => adminDashboardTransactionService(),
  });
};