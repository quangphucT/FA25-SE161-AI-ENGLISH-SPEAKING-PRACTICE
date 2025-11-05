
import { CreateCoinServicePackageRequest, CreateCoinServicePackageResponse } from "@/types/coin_servicePackage";
import fetchWithAuth from "@/utils/fetchWithAuth";

export const createCoinServicePackage = async (
  credentials: CreateCoinServicePackageRequest,
): Promise<CreateCoinServicePackageResponse> => {
  try {
    const response = await fetchWithAuth("/api/admin/create-coin-service-package", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Create coin service package failed");
    return data;
  } catch (error: any) {
    const message = error?.response?.data?.message || error.message || "Create coin service package failed";
    throw new Error(message);
  }
};
