"use client";

import { CreateQuestionTestRequest, CreateQuestionTestResponse } from "@/types/questionTest";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createQuestionTestService } from "../service/createQuestionTestService";
import { toast } from "sonner";
export const useCreateQuestionTest = () => {
   const queryClient = useQueryClient();
  return useMutation<CreateQuestionTestResponse, Error, CreateQuestionTestRequest>({
    mutationFn: createQuestionTestService,
    onSuccess: (data) => {
      toast.success(data.message || "Tạo câu hỏi thành công");
      // 👇 invalidate để reload danh sách mới
      queryClient.invalidateQueries({ queryKey: ["getQuestionTest"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Tạo câu hỏi thất bại");
    },
  });
};
