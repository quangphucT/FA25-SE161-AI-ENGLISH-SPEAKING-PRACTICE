"use client";

import {  GetQuestionTestResponse } from "@/types/questionTest";
import {  useQuery } from "@tanstack/react-query";
import { getQuestionTestService } from "../service/getQuestionTestService";

export const useGetQuestionTestQuery = (pageNumber: number, pageSize: number, type?: string, keyword?: string ) => {
  return useQuery<GetQuestionTestResponse, Error>({
    queryKey: ["getQuestionTest", pageNumber, pageSize, type, keyword],
    queryFn: () => getQuestionTestService(pageNumber, pageSize, type, keyword),
  });
};