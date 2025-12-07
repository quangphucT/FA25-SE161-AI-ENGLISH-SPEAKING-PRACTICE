
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { AssessmentLearnerResponse, getManagerAssessmentLearnerService } from "../service/ManagerAssessmentLearnerService";

export const useManagerAssessmentLearner = (pageNumber: number, pageSize: number) => {
    return useQuery<AssessmentLearnerResponse, Error>({
    queryKey: ["getManagerAssessmentLearner", pageNumber, pageSize],
    queryFn: () => getManagerAssessmentLearnerService(pageNumber, pageSize),
    placeholderData: keepPreviousData,
  });
};