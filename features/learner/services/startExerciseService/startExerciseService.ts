import fetchWithAuth from "@/utils/fetchWithAuth";
import { StartExerciseParams, StartExerciseResponse } from "../../hooks/startExerciseHooks/startExercise";


export const startExerciseService = async (
  params: StartExerciseParams
): Promise<StartExerciseResponse> => {
  const response = await fetchWithAuth(
    `/api/learner/start-exercise`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include',
      body: JSON.stringify({
        ...params,
        status: "InProgress"
      }),
    }
  );
 const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Update chapter failed');
    return data;
};
