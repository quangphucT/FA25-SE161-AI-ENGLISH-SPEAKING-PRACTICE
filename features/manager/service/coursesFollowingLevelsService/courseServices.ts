
import { GetCoursesOfLevelResponse } from "@/types/courseFollowingLevel/course";
import fetchWithAuth from "@/utils/fetchWithAuth";

export const getCoursesOfLevelService = async (
  level: string
): Promise<GetCoursesOfLevelResponse> => {
  try {
   

    const response = await fetchWithAuth(
      `/api/manager/courseApiRoutes/getCoursesOfLevel/${level}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "Course fetching failed");
    return data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error.message ||
      "Course fetching failed";
    throw new Error(message);
  }
};
