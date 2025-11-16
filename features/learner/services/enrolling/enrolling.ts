import fetchWithAuth from "@/utils/fetchWithAuth";
import { LearnerLevelsResponse } from "../../hooks/enrollingCourseHooks/enrollingCourses";


export const getLevelsAndLearnerCourseIdsAfterEnrollingService = async (): Promise<LearnerLevelsResponse> => {
  try {
    const response = await fetchWithAuth("/api/learner/getMyLevels", {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Lấy thông tin cấp độ thất bại");
    return data;
  } catch (error: any) {
    const message = error?.response?.data?.message || error.message || "Lấy thông tin cấp độ thất bại";
    throw new Error(message);
  }
};