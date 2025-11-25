import { getReviewFeePackages, ReviewFeePackagesResponse } from "@/features/admin/services/adminReviewFeeService";
import { getLearnerReviewFeePackages, LearnerReviewFeePackagesResponse } from "../services/learnerReviewFeeService";
import { useQuery } from "@tanstack/react-query";

export const useLearnerReviewFeePackagesQuery = () => {
    return useQuery<LearnerReviewFeePackagesResponse, Error>({
      queryKey: ["learnerReviewFeePackages"],
      queryFn: () => getLearnerReviewFeePackages(),
    });
  };