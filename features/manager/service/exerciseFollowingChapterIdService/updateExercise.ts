import { CreateExcerciseRequest, CreateExcerciseResponse } from "@/types/excerciseFollowingChapterId/excercise";
import { fetchWithAuth } from "@/utils/fetchWithAuth";

export const updateExerciseService = async (
  id: string,
  payload: CreateExcerciseRequest
): Promise<CreateExcerciseResponse> => {
  try {
    const response = await fetchWithAuth(`/api/manager/excerciseApiRoutes/updateExercise/${id}`, {
      method: 'PUT',
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Update exercise failed');
    return data;
  } catch (error: any) {
    const message = error?.response?.data?.message || error.message || 'Update exercise failed';
    throw new Error(message);
  }
};
