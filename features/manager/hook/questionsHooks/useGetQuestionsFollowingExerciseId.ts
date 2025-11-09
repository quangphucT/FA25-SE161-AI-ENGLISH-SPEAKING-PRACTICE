"use client";

import { GetQuestionsFollowingExerciseIdResponse } from "@/types/questionFollowingExcerciseId/question";
import {  useQuery } from "@tanstack/react-query";
import { getQuestionsFollowingExerciseIdService } from "../../service/questionsFollowingExerciseIdService/questionsFollowingExerciseId";


export const useGetQuestionsFollowingExerciseId = (exerciseId: string, enabled: boolean = true) => {
  return useQuery<GetQuestionsFollowingExerciseIdResponse, Error>({
    queryKey: ["getQuestionsFollowingExcerciseId", exerciseId],
    queryFn: () => getQuestionsFollowingExerciseIdService(exerciseId),
    enabled: enabled && !!exerciseId,
    retry: (failureCount, error) => {
      if (/400|404|Not Found/i.test(error.message)) return false;
      return failureCount < 2;
    },
  });
};