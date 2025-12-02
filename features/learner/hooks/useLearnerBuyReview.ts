import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LearnerBuyReviewBuyRecordService, LearnerBuyReviewBuyResponse, LearnerBuyReviewBuyService, LearnerBuyReviewMenu, LearnerBuyReviewMenuService } from "../services/LearnerBuyReviewService";
import { toast } from "sonner";

export const useLearnerBuyReview = () => {
    const queryClient = useQueryClient();
    return useMutation<any, Error, { learnerAnswerId: string, reviewFeeId: string } >({
        mutationFn: ({ learnerAnswerId, reviewFeeId }) => LearnerBuyReviewBuyService(learnerAnswerId, reviewFeeId),
        onSuccess: (data) => {
            toast.success("Mua đánh giá thành công");
            queryClient.invalidateQueries({ queryKey: ["learnerBuyReview"] });
            queryClient.invalidateQueries({ queryKey: ["learnerBuyReviewMenu"] });
        },
        onError: (error) => {
            toast.error(error.message || "Mua đánh giá thất bại");
        },
    });
}

export const useLearnerBuyReviewMenu = () => {
    return useQuery<LearnerBuyReviewMenu[] | { data: LearnerBuyReviewMenu[] }, Error>({
        queryKey: ["learnerBuyReviewMenu"],
        queryFn: () => LearnerBuyReviewMenuService(),
    });
}

export const useLearnerBuyReviewBuyRecord = () => {
    const queryClient = useQueryClient();
    return useMutation<any, Error, { recordId: string, reviewFeeId: string }>({
        mutationFn: ({ recordId, reviewFeeId }) => LearnerBuyReviewBuyRecordService(recordId, reviewFeeId),
        onSuccess: (data) => {
            toast.success( "Mua đánh giá record thành công");
            queryClient.invalidateQueries({ queryKey: ["learnerBuyReviewBuyRecord"] });
            queryClient.invalidateQueries({ queryKey: ["learnerBuyReviewMenu"] });
        },
        onError: (error) => {
            toast.error(error.message || "Mua đánh giá record thất bại");
        },
    });
}