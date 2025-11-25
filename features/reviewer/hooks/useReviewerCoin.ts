"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ReviewerCoinHistoryWithdrawResponse, reviewerCoinHistoryWithdrawService, ReviewerCoinWithdrawResponse, reviewerCoinWithdrawService } from "../services/reviewerCoinService";
import { toast } from "sonner";

export const useReviewerCoinWithdraw = () => {
    const queryClient = useQueryClient();
    return useMutation<ReviewerCoinWithdrawResponse, Error, { coin: number; bankName: string; accountNumber: string }>({
        mutationFn: reviewerCoinWithdrawService,
        onSuccess: () => {
            toast.success("Rút coin thành công");
            // Invalidate và refetch wallet data
            queryClient.invalidateQueries({ queryKey: ["reviewReviewWallet"] });
        },
        onError: (error) => {
            toast.error(error.message || "Rút coin thất bại");
        },
    });
}

export const useReviewerCoinHistoryWithdraw = () => {
    return useQuery<ReviewerCoinHistoryWithdrawResponse, Error>({
        queryKey: ["reviewerCoinHistoryWithdraw"],
        queryFn: reviewerCoinHistoryWithdrawService,
    });
}