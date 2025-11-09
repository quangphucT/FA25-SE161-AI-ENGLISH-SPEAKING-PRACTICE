"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CreateExcerciseRequest } from "@/types/excerciseFollowingChapterId/excercise";
import { updateExerciseService } from "../../service/exerciseFollowingChapterIdService/updateExercise";

export interface CreateExcerciseResponse {
  message: string;
}
export const useUpdateExercise = () => {
  const queryClient = useQueryClient();
  return useMutation<CreateExcerciseResponse, Error, { id: string; payload: CreateExcerciseRequest }>({
    mutationFn: ({ id, payload }) => updateExerciseService(id, payload),
    onSuccess: (data) => {
      toast.success(data.message || "Cập nhật bài tập thành công");
      queryClient.invalidateQueries({ queryKey: ["getExcerciseFollowingChapterId"] });
    },
    onError: (error) => {
      toast.error(error.message || "Cập nhật bài tập thất bại");
    },
  });
};
