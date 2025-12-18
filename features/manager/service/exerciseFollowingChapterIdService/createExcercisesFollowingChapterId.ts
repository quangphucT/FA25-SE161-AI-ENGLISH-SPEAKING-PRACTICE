import { CreateExcerciseRequest, CreateExcerciseResponse } from "@/types/excerciseFollowingChapterId/excercise";
import { fetchWithAuth } from "@/utils/fetchWithAuth";

export const createExcerciseFollowingChapterId = async (
  body: CreateExcerciseRequest
): Promise<CreateExcerciseResponse> => {
  try {
    const { chapterId, title, description, numberOfQuestion } = body;

    const response = await fetchWithAuth(
      `/api/manager/excerciseApiRoutes/createExerciseFollowingChapterId/${chapterId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title,
          description,
          numberOfQuestion,
        }),
      }
    );
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "Create exercise failed");
    return data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error.message ||
      "Create exercise failed";
    throw new Error(message);
  }
};
