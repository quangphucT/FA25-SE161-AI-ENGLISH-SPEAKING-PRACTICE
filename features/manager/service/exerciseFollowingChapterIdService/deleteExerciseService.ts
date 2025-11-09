import fetchWithAuth from "@/utils/fetchWithAuth";
import { DeleteExerciseResponse } from "../../hook/excerciseHooks/useDeleteExercise";

export const deleteExerciseService = async (id: string): Promise<DeleteExerciseResponse> => {
  try {
    const response = await fetchWithAuth(`/api/manager/excerciseApiRoutes/delete-exercise/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Delete exercise failed');
    return data;
  } catch (error: any) {
    const message = error?.response?.data?.message || error.message || 'Delete exercise failed';
    throw new Error(message);
  }
};