
import {getOrderCodeStatusResponse } from "@/types/coin_servicePackage";
import fetchWithAuth from "@/utils/fetchWithAuth";

export const getOrderCodeStatusService = async (
    orderCode: string,
): Promise<getOrderCodeStatusResponse> => {
  try {
    const response = await fetchWithAuth(`/api/learner/getOrderCodeStatus/${orderCode}`, {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Lấy trạng thái gói dịch vụ thất bại");
    return data;
  } catch (error: any) {
    const message = error?.response?.data?.message || error.message || "Lấy trạng thái gói dịch vụ thất bại";
    throw new Error(message);
  }
};
