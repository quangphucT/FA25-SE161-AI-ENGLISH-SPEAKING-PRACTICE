import fetchWithAuth from "@/utils/fetchWithAuth";

export interface CoinDepositHistory {
  orderCode: string;
  amountMoney: number;
  amountCoin: number;
  status: string;
  description: string;
  createdAt: string;
}

export const getDepositHistoryService = async (): Promise<CoinDepositHistory[]> => {
  try {
    const response = await fetchWithAuth(
      `/api/learner/coinHistoryApiRoutes`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    const data = await response.json();

    if (!response.ok)
      throw new Error(data.message || "Deposit history fetching failed");

    return data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error.message ||
      "Deposit history fetching failed";
    throw new Error(message);
  }
};
