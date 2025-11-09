"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateQuestionRequest, CreateQuestionResponse } from "@/types/questionFollowingExcerciseId/question";
import { createQuestionFollowingExerciseId } from "../../service/questionsFollowingExerciseIdService/questionsFollowingExerciseId";
import { toast } from "sonner";

export const useCreateQuestionFollowingExerciseId = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateQuestionResponse, Error, CreateQuestionRequest>({
    mutationFn: createQuestionFollowingExerciseId,
    onSuccess: () => {
      toast.success("Question created successfully");
      queryClient.invalidateQueries({ queryKey: ["getQuestionsFollowingExcerciseId"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create question");
    },
  });
};
