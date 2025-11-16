import fetchWithAuth from "@/utils/fetchWithAuth";
import { TrackingCoursesEnrolledResponse } from "../../hooks/trackingCourses/trackingCourse";

export const trackingCourseEnrolledService = async (
  learnerCourseId: string
): Promise<TrackingCoursesEnrolledResponse> => {
  try {
    const response = await fetchWithAuth(
      `/api/learner/trackingCoursesEnrolled/${learnerCourseId}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "Tracking courses enrolled failed");
    return data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error.message ||
      "Tracking courses enrolled failed";
    throw new Error(message);
  }
};