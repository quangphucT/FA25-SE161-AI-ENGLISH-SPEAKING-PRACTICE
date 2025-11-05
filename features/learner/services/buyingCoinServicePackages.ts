
import { BuyCoinRequest, PayOSCheckoutResponse } from "@/types/coin_servicePackage";
import fetchWithAuth from "@/utils/fetchWithAuth";

export const buyingCoinServicePackagesService = async (
  credentials: BuyCoinRequest,
): Promise<PayOSCheckoutResponse> => {
  try {
    const response = await fetchWithAuth("/api/learner/buyCoin-servicePackage", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Mua gói dịch vụ thất bại");
    return data;
  } catch (error: any) {
    const message = error?.response?.data?.message || error.message || "Mua gói dịch vụ thất bại";
    throw new Error(message);
  }
};
