"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";
import { chooseQuestionForTestAssessmentService } from "../service/chooseQuestionForTestAssessmentService";
import { ChooseQuestionTestResponse } from "@/types/questionTest";
export const useChooseQuestionForTestAssessment = () => {
   const queryClient = useQueryClient();
  return useMutation<ChooseQuestionTestResponse, Error, { questionId: string; status: boolean }>({
    mutationFn: ({ questionId, status }) => chooseQuestionForTestAssessmentService({ questionId, status }),
    onSuccess: (data) => {
      toast.success(data.message || "Chọn câu hỏi thành công");
      // 👇 invalidate để reload danh sách mới
      queryClient.invalidateQueries({ queryKey: ["getQuestionTest"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Chọn câu hỏi thất bại");
    },
  });
};
