import { useMutation } from "@tanstack/react-query";
import { startExerciseService } from "../../services/startExerciseService/startExerciseService";

export interface StartExerciseParams {
  learningPathExerciseId: string;
}

export interface StartExerciseResponse {
  isSucess: boolean;
  message: string;
}

export const useStartExercise = () => {
  return useMutation<StartExerciseResponse, Error, StartExerciseParams>({
    mutationFn: startExerciseService,
  });
};