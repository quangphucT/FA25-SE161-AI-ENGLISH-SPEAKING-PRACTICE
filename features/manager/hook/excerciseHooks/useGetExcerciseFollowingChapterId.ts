"use client";
import {  useQuery } from "@tanstack/react-query";
import { getChapterFollowingCourseIdService } from "../../service/chaptersFollowingCourseIdService/chapterFollowingCourseid";
import { GetExcerciseFollowingChapterIdResponse } from "@/types/excerciseFollowingChapterId/excercise";
import { getExcercisesFollowingChapterIdService } from "../../service/exerciseFollowingChapterIdService/excercisesFollowingChapterId";

export const useGetExcerciseFollowingChapterId = (chapterId: string, enabled: boolean = true) => {
  return useQuery<GetExcerciseFollowingChapterIdResponse, Error>({
    queryKey: ["getExcerciseFollowingChapterId", chapterId],
    queryFn: () => getExcercisesFollowingChapterIdService(chapterId),
    enabled: enabled && !!chapterId,
    retry: (failureCount, error) => {
      if (/400|404|Not Found/i.test(error.message)) return false;
      return failureCount < 2;
    },
  });
};