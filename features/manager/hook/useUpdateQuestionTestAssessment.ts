"use client";

import { UpdateQuestionTestRequest, UpdateQuestionTestResponse } from "@/types/questionTest";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";
import { updateQuestionTestService } from "../service/updateQuestionTestService";
export const updateQuestionTest = () => {
   const queryClient = useQueryClient();
  return useMutation<UpdateQuestionTestResponse, Error, UpdateQuestionTestRequest>({
    mutationFn: updateQuestionTestService,
    onSuccess: (data) => {
      toast.success(data.message || "Cập nhật câu hỏi thành công");
      // 👇 invalidate để reload danh sách mới
      queryClient.invalidateQueries({ queryKey: ["getQuestionTest"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Cập nhật câu hỏi thất bại");
    },
  });
};
