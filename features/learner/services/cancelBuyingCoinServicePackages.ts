
import { CancelBuyingCoinRequest, CancelBuyingCoinResponse } from "@/types/coin_servicePackage";
import fetchWithAuth from "@/utils/fetchWithAuth";

export const cancelBuyingCoinServicePackagesService = async (
  credentials: CancelBuyingCoinRequest,
): Promise<CancelBuyingCoinResponse> => {
  try {
    const response = await fetchWithAuth("/api/learner/cancel-buyCoin-servicePackage", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Hủy gói dịch vụ thất bại");
    return data;
  } catch (error: any) {
    const message = error?.response?.data?.message || error.message || "Hủy gói dịch vụ thất bại";
    throw new Error(message);
  }
};
