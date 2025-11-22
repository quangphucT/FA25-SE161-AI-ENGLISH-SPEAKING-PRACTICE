import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { LearnerTransactionResponse, learnerTransactionService } from "../services/learnerTransactionService";

export const useLearnerTransaction = () => {
  return useQuery<LearnerTransactionResponse, Error>({
    queryKey: ["learnerTransaction"],
    queryFn: () => learnerTransactionService(),
    placeholderData: keepPreviousData,
  });
};