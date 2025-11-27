
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { AssessmentLearnerResponse, getManagerAssessmentLearnerService } from "../service/ManagerAssessmentLearnerService";

export const useManagerAssessmentLearner = (pageNumber: number, pageSize: number, type?: string, keyword?: string) => {
    return useQuery<AssessmentLearnerResponse, Error>({
    queryKey: ["getManagerAssessmentLearner", pageNumber, pageSize, type, keyword],
    queryFn: () => getManagerAssessmentLearnerService(pageNumber, pageSize, type, keyword),
    placeholderData: keepPreviousData,
  });
};