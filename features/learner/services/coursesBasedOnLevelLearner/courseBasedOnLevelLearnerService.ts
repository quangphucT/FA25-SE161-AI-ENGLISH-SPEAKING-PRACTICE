import fetchWithAuth from "@/utils/fetchWithAuth";
import {
  EnrollFirstCourseResponse,
  GetCourseBasedOnLevelLearner,
} from "../../hooks/coursesBasedOnLevelLearner/coursesBasedOnLevelLearner";

export const getCoursesBasedOnLevelLearnerService = async (
  level: string
): Promise<GetCourseBasedOnLevelLearner> => {
  try {
    const response = await fetchWithAuth(
      `/api/learner/coursesBasedOnLevelLearnerApiRoutes/getCoursesBasedOnLevelLearner?level=${level}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "Get courses based on level failed");
    return data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error.message ||
      "Get courses based on level failed";
    throw new Error(message);
  }
};

export const enrollingFirstCourseService = async (
  courseId: string
): Promise<EnrollFirstCourseResponse> => {
  try {
    const response = await fetchWithAuth(
      `/api/learner/enrollingFirstCoursesBasedOnLevel/${courseId}`,
      {
        method: "POST",
        credentials: "include",
      }
    );
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "Enroll first course failed");
    return data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error.message ||
      "Enroll first course failed";
    throw new Error(message);
  }
};
