"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteExerciseService } from "../../service/exerciseFollowingChapterIdService/deleteExerciseService";

export interface DeleteExerciseResponse {
  message: string;
}
export const useDeleteExercise = () => {
  const queryClient = useQueryClient();
  return useMutation<DeleteExerciseResponse, Error, string>({
    mutationFn: (id) => deleteExerciseService(id),
    onSuccess: (data) => {
      toast.success(data.message || "Xóa bài tập thành công");
      queryClient.invalidateQueries({ queryKey: ["getExcerciseFollowingChapterId"] });
    },
    onError: (error) => {
      toast.error(error.message || "Xóa bài tập thất bại");
    },
  });
};
