
import { GetExcerciseFollowingChapterIdResponse } from "@/types/excerciseFollowingChapterId/excercise";

import fetchWithAuth from "@/utils/fetchWithAuth";

export const getExcercisesFollowingChapterIdService = async (
  chapterId: string
): Promise<GetExcerciseFollowingChapterIdResponse> => {
  try {
    const response = await fetchWithAuth(
      `/api/manager/excerciseApiRoutes/getExcercisesFollowingChapterId/${chapterId}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "Get exercises failed");
    return data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error.message ||
      "Get exercises failed";
    throw new Error(message);
  }
};


