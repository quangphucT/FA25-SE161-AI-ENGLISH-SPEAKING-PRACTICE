import fetchWithAuth from "@/utils/fetchWithAuth";
import {
  CreateAIConversationPackagesRequest,
  CreateAIConversationPackagesResponse,
} from "../../hooks/aiConversationPackagesHooks/packages";

export const createAIConversationPackagesService = async (
  body: CreateAIConversationPackagesRequest
): Promise<CreateAIConversationPackagesResponse> => {
  try {
    const { amountCoin, allowedMinutes } = body;

    const response = await fetchWithAuth(
      `/api/admin/aiConversationPackagesApiRoutes/createAIConversationPackages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          amountCoin,
          allowedMinutes,
        }),
      }
    );
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "Create AI conversation package failed");
    return data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error.message ||
      "Create AI conversation package failed";
    throw new Error(message);
  }
};

export const getAllAIConversationPackagesService = async () => {
  try {
    const response = await fetchWithAuth(
      `/api/admin/aiConversationPackagesApiRoutes/getAllAIConversationPackages`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "Get AI conversation packages failed");
    return data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error.message ||
      "Get AI conversation packages failed";
    throw new Error(message);
  }
};

export const deleteAIConversationPackageService = async (id: string) => {
  try {
    const response = await fetchWithAuth(
      `/api/admin/aiConversationPackagesApiRoutes/deleteAIConversationPackage/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "Delete AI conversation package failed");
    return data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error.message ||
      "Delete AI conversation package failed";
    throw new Error(message);
  }
};
export const updateAIConversationPackageService = async (body: {
  aiConversationPackageId: string;
  amountCoin: number;
  allowedMinutes: number;
}) => {
  try {
    const { aiConversationPackageId, amountCoin, allowedMinutes } = body;
    const response = await fetchWithAuth(
      `/api/admin/aiConversationPackagesApiRoutes/updateAIConversationPackage/${aiConversationPackageId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          amountCoin,
          allowedMinutes,
        }),
      }
    );
    const data = await response.json();
    if (!response.ok)
      throw new Error(
        data.message || "Update AI conversation package failed"
      );
    return data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error.message ||
      "Update AI conversation package failed";
    throw new Error(message);
  }
};
