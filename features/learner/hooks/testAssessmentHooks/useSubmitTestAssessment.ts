"use client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { submitTestAssessmentService } from "../../services/testAssessmentServices/testAssessmentService";


export interface SubmitTestAssessmentRequest {
  learnerProfileId: string;
  numberOfQuestion: number;
  tests: TestItem[];
}

export interface TestItem {
  type: string;
  assessmentDetails: AssessmentDetail[];
}

export interface AssessmentDetail {
  questionAssessmentId: string;
  score: number;
  aI_Feedback: string;
  answerAudio: string;
}
export interface SubmitTestAssessmentResponse {
  isSucess: boolean;
  data: {
    assessmentId: string;
    learnerProfileId: string;
    averageScore: number;
    assignedLevel: string;
  };
  businessCode: string;
  message: string;
}

export const useSubmitTestAssessment = () => {
  return useMutation<SubmitTestAssessmentResponse, Error, SubmitTestAssessmentRequest>({
    mutationFn: submitTestAssessmentService,
    onError: (error) => {
      toast.error(error.message || "Submit test assessment failed");
    }
  });
};
