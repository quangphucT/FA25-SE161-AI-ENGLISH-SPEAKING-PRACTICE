import { BuyCoinRequest, BuyCoinResponse, CoinServicePackageResponse } from "@/types/coin_servicePackage";
import fetchWithAuth from "@/utils/fetchWithAuth";

export const getCoinPackageService = async (): Promise<CoinServicePackageResponse> => {
  try {
    const response = await fetchWithAuth("/api/coin/getCoinServicePackages", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Get me failed");
    return data as CoinServicePackageResponse;
  } catch (error: any) {
    const message =
      error?.response?.data?.message || error.message || "Get me failed";
    throw new Error(message);
  }
};

export const buyCoinService = async (credentials: BuyCoinRequest): Promise<BuyCoinResponse> => {
  try {
    const response = await fetchWithAuth("/api/coin/buyCoin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Buy coin failed");
    return data as BuyCoinResponse;
  }
  catch (error: any) {
    const message =
      error?.response?.data?.message || error.message || "Buy coin failed";
    throw new Error(message);
  }
};