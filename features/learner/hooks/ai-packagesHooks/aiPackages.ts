export interface AIConversationCharge {
  aiConversationChargeId: string;
  amountCoin: number;
  allowedMinutes: number;
}
export interface GetAIConversationChargesResponse {
  isSuccess: boolean;
  data: AIConversationCharge[];
}

import { useQuery } from "@tanstack/react-query";
import { getAIPackagesService } from "../../services/ai-packagesService/aiPackagesService";
export const useGetAIPackages = () => {
  return useQuery<GetAIConversationChargesResponse, Error>({
    queryKey: ["getAIPackages"],
    queryFn: () => getAIPackagesService(),
  });
};