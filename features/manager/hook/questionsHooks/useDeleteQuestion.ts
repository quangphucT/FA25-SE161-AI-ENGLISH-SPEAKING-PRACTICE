"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteQuestionService } from "../../service/questionsFollowingExerciseIdService/questionsFollowingExerciseId";

export interface DeleteQuestionResponse {
  message: string;
}
export const useDeleteQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation<DeleteQuestionResponse, Error, string>({
    mutationFn: (id) => deleteQuestionService(id),
    onSuccess: (data) => {
      toast.success(data.message || "Xóa câu hỏi thành công");
      queryClient.invalidateQueries({ queryKey: ["getQuestionsFollowingExcerciseId"] });
    },
    onError: (error) => {
      toast.error(error.message || "Xóa câu hỏi thất bại");
    },
  });
};
