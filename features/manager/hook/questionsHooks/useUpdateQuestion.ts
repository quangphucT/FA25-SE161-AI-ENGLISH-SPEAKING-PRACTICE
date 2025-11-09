"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateQuestionService } from "../../service/questionsFollowingExerciseIdService/questionsFollowingExerciseId";
export interface UpdateQuestionTestRequest {
    text: string;
    type: number;
    orderIndex: number;
    phonemeJson: string;
}
export interface UpdateQuestionTestResponse {
    message: string;
}
export const useUpdateQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation<UpdateQuestionTestResponse, Error, { id: string; payload: UpdateQuestionTestRequest }>({
    mutationFn: ({ id, payload }) => updateQuestionService(id, payload),
    onSuccess: (data) => {
      toast.success(data.message || "Cập nhật câu hỏi thành công");
      queryClient.invalidateQueries({ queryKey: ["getQuestionsFollowingExcerciseId"] });
    },
    onError: (error) => {
      toast.error(error.message || "Cập nhật câu hỏi thất bại");
    },
  });
};
