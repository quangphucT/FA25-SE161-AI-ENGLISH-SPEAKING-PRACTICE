import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useChartCoinForConversationService } from "../../services/chartCoinForConversationService/chartCoinForConversation";

export interface ChartCoinForConversationResponse {
    isSuccess: boolean;
    data: null; 
    businessCode: string;
    message: string;
}
export interface ChartCoinForConversationPayload {
    payCoin: number;
}
export const useChartCoinForConversation = () => {
  return useMutation<ChartCoinForConversationResponse, Error, ChartCoinForConversationPayload>({
    mutationFn: useChartCoinForConversationService,
     
    onError: (error) => {
      toast.error(error.message || "Chart xu thất bại");
    },
  });
};
