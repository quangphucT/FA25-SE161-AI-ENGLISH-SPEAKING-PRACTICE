"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createExcerciseFollowingChapterId } from "../../service/exerciseFollowingChapterIdService/createExcercisesFollowingChapterId";
import { CreateExcerciseRequest, CreateExcerciseResponse } from "@/types/excerciseFollowingChapterId/excercise";


export const useCreateExerciseFollowingChapterId = () => {
  const queryClient = useQueryClient();
  return useMutation<CreateExcerciseResponse, Error, CreateExcerciseRequest>({
    mutationFn: createExcerciseFollowingChapterId,
    onSuccess: (data) => {
      toast.success(data.message || "Tạo bài tập thành công");
        queryClient.invalidateQueries({ queryKey: ["getExcerciseFollowingChapterId"] });
    },
    onError: (error) => {
      toast.error(error.message || "Tạo bài tập thất bại");
    },
  });
};
