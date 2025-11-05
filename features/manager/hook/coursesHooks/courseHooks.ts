"use client";
import { GetCoursesOfLevelResponse } from "@/types/courseFollowingLevel/course";
import {  useQuery } from "@tanstack/react-query";
import { getCoursesOfLevelService } from "../../service/coursesFollowingLevelsService/courseServices";

export const useGetCoursesOfLevelMutation = (level: string ) => {
  return useQuery<GetCoursesOfLevelResponse, Error>({
    queryKey: ["getCoursesOfLevel", level],
    queryFn: () => getCoursesOfLevelService(level),
  });
};