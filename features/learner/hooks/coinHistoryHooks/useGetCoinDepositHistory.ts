import { useQuery } from "@tanstack/react-query";
import { getDepositHistoryService } from "../../services/coinHistoryService/coinHistoryService";

export const useGetDepositHistoryQuery = () => {
  return useQuery({
    queryKey: ["coin-deposit-history"],
    queryFn: getDepositHistoryService,
  });
};
