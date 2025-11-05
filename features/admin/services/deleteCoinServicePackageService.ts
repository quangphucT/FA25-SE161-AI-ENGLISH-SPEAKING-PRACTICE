
import { DeleteCoinServicePackageResponse } from "@/types/coin_servicePackage";
import fetchWithAuth from "@/utils/fetchWithAuth";

export const deleteCoinServicePackage = async (
  id: string,
): Promise<DeleteCoinServicePackageResponse> => {
  try {
    const response = await fetchWithAuth(`/api/admin/delete-coin-service-package/${id}`, {
      method: "DELETE",
      credentials: "include",
    });         
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Delete  coin service package failed");
    return data;
  } catch (error: any) {
    const message = error?.response?.data?.message || error.message || "Delete coin service package failed";
    throw new Error(message);
  }
};
