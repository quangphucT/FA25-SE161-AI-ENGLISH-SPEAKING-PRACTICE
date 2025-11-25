import fetchWithAuth from "@/utils/fetchWithAuth";
import { ReviewerReviewPendingResponse, ReviewerReviewSubmitResponse } from "./reviewerReviewService";
export interface ReviewerCoinHistoryWithdrawResponse {
  data: Array<{
    orderCode: string;
    amountMoney: number;
    amountCoin: number;
    status: string;
    bankName: string;
    accountNumber: string;
    description: string;
    createdAt: string;
  }>;
}
export interface ReviewerCoinWithdrawResponse {
    orderCode: string;
    amountMoney: number;
    amountCoin: number;
    status: string;
}
export const reviewerCoinWithdrawService = async (
    body: {
        coin: number;
        bankName: string;
        accountNumber: string;
    }
  ): Promise<ReviewerCoinWithdrawResponse> => {
    try {
      const response = await fetchWithAuth(`/api/reviewer/coin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Review answer failed");
      return data;
    } catch (error: any) {
      const message =
        error?.response?.data?.message || error.message || "Review answer failed";
      throw new Error(message);
    }
  };

  export const reviewerCoinHistoryWithdrawService = async (
  ): Promise<ReviewerCoinHistoryWithdrawResponse> => {
    try {
      const response = await fetchWithAuth(`/api/reviewer/coin`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Withdraw coin history failed");
      // API trả về array trực tiếp, cần wrap vào object có property data
      return Array.isArray(data) ? { data } : data;
    } catch (error: any) {
      const message =
        error?.response?.data?.message || error.message || "Withdraw coin history failed";
      throw new Error(message);
    }
  };