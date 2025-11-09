"use client";

import { GetChapterFollowingCourseIdResponse } from "@/types/chapterFollowingCourseId/chapter";
import {  useQuery } from "@tanstack/react-query";
import { getChapterFollowingCourseIdService } from "../../service/chaptersFollowingCourseIdService/chapterFollowingCourseid";


export const useGetChapterFollowingCourseId = (courseId: string, enabled: boolean = true) => {
  return useQuery<GetChapterFollowingCourseIdResponse, Error>({
    queryKey: ["getChapterFollowingCourseId", courseId],
    queryFn: () => getChapterFollowingCourseIdService(courseId),
    enabled: enabled && !!courseId,
    retry: (failureCount, error) => {
      if (/400|404|Not Found/i.test(error.message)) return false;
      return failureCount < 2;
    },
  });
};