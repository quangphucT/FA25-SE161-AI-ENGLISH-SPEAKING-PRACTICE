import fetchWithAuth from "@/utils/fetchWithAuth";
import { GetAIConversationChargesResponse } from "../../hooks/ai-packagesHooks/aiPackages";

export const getAIPackagesService = async (): Promise<GetAIConversationChargesResponse> => {

  try {
   
    const response = await fetchWithAuth(
      `/api/learner/aiPackagesApiRoutes/getAIPackages`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "AI packages fetching failed");
    return data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error.message ||
      "AI packages fetching failed";
    throw new Error(message);
  }
};
