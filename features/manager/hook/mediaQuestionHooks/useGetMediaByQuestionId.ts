"use client";
import { QuestionMediaResponse } from "@/types/media/mediaType";
import {  useQuery } from "@tanstack/react-query";
import { getMediaFollowingQuestionIdService } from "../../service/mediaFollowingQuestionIdService/mediaFolloingQuestionId";


export const useGetMediaFollowingQuestionId = (questionId: string, enabled: boolean = true) => {
  return useQuery<QuestionMediaResponse, Error>({
    queryKey: ["getMediaFollowingQuestionId", questionId],
    queryFn: () => getMediaFollowingQuestionIdService(questionId),
    enabled: enabled && !!questionId,
    retry: (failureCount, error) => {
      if (/400|404|Not Found/i.test(error.message)) return false;
      return failureCount < 2;
    },
  });
};