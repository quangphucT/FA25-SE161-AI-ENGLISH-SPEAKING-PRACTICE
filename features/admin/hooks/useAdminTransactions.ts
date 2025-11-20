import { useQuery } from "@tanstack/react-query";
import { AdminTransactionsResponse, adminTransactionsService } from "../services/adminTransactionsService";

export const useAdminTransactions = () => {
  return useQuery<AdminTransactionsResponse, Error>({
    queryKey: ["adminTransactions"],
    queryFn: adminTransactionsService,
  });
};  