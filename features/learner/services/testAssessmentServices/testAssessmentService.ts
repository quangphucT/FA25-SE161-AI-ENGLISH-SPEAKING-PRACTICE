
import { BuyCoinRequest, PayOSCheckoutResponse } from "@/types/coin_servicePackage";
import { AssessmentResponse } from "@/types/testAssessment/testAssessment";
import fetchWithAuth from "@/utils/fetchWithAuth";

export const getTestAssessmentService = async (): Promise<AssessmentResponse> => {
  try {
    const response = await fetchWithAuth("/api/learner/getTestAssessment", {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Lấy thông tin đánh giá thất bại");
    return data;
  } catch (error: any) {
    const message = error?.response?.data?.message || error.message || "Lấy thông tin đánh giá thất bại";
    throw new Error(message);
  }
};
