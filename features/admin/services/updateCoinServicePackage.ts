import { UpdateCoinServicePackageRequest, UpdateCoinServicePackageResponse } from "@/types/coin_servicePackage";
import fetchWithAuth from "@/utils/fetchWithAuth";



export const updateCoinServicePackage = async (
  payload: UpdateCoinServicePackageRequest
): Promise<UpdateCoinServicePackageResponse> => {
  try {
    const { servicePackageId, ...body } = payload;
    const response = await fetchWithAuth(
      `/api/admin/update-coin-service-package/${servicePackageId}`,
      {
        method: "PUT",
        credentials: "include",
        body: JSON.stringify(body),
      }
    );
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Update failed");
    return data;
  } catch (error: any) {
    const message = error?.response?.data?.message || error.message || "Update failed";
    throw new Error(message);
  }
};
