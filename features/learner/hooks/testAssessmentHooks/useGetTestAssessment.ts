"use client";
import { AssessmentResponse } from "@/types/testAssessment/testAssessment";
import {  useQuery } from "@tanstack/react-query";
import { getTestAssessmentService } from "../../services/testAssessmentServices/testAssessmentService";


export const useGetTestAssessment = () => {
  return useQuery<AssessmentResponse, Error>({
    queryKey: ["getTestAssessment"],
    queryFn: () => getTestAssessmentService(),
  });
};