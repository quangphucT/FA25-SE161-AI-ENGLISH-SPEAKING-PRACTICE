import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { reviewerProfileGetService, ReviewerProfileResponse, reviewerProfilePutService } from "../services/reviewerProfileService";

export const useReviewerProfilePut = () => {
    return useMutation<any, Error, { userId: string; experience: string; fullname: string; phoneNumber: string }>({
        mutationFn:({ userId, experience, fullname, phoneNumber }) => 
            reviewerProfilePutService(userId, { experience, fullname, phoneNumber }),
        onSuccess: (data) => {
        toast.success(data.message || "Upload Profile successfully");
      },
      onError: (error) => {
        toast.error(error.message || "Upload Profile failed");
      },
    });
  };
export const useReviewerProfileGet = (userId: string) => {
    return useQuery<ReviewerProfileResponse, Error>({
        queryKey: ["reviewerProfile", userId],
        queryFn: () => reviewerProfileGetService(userId),
    });
  };