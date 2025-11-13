import fetchWithAuth from "@/utils/fetchWithAuth";
import { ChartCoinForConversationPayload, ChartCoinForConversationResponse } from "../../hooks/chartCoinForConversation/useChartCoinForConversation";

export const useChartCoinForConversationService = async (
   payload: ChartCoinForConversationPayload
): Promise<ChartCoinForConversationResponse> => {
  try {
    const response = await fetchWithAuth(
      `/api/learner/chartCoinForConversationWithAI`,
      {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(payload),
      }
    );
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "Chart coin for conversation");
    return data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error.message ||
      "Chart coin for conversation";
    throw new Error(message);
  }
};
