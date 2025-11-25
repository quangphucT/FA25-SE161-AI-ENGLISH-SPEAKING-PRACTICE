import { useQuery } from "@tanstack/react-query";
import { AdminTransactionsResponse, adminTransactionsService } from "../services/adminTransactionsService";

export const useAdminTransactions = (pageNumber: number, pageSize: number, search: string, status: string) => {
  return useQuery<AdminTransactionsResponse, Error>({
    queryKey: ["adminTransactions", pageNumber, pageSize, search, status],
    queryFn: () => adminTransactionsService(pageNumber, pageSize, search, status),
  });
};  