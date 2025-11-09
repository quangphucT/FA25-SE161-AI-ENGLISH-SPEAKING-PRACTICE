"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createChapterServiceFollowingCourseId } from "@/features/manager/service/chaptersFollowingCourseIdService/chapterFollowingCourseid";
import { CreateChapterRequest, CreateChapterResponse } from "@/types/chapterFollowingCourseId/chapter";


export const useCreateChapterFollowingCourseId = () => {
  const queryClient = useQueryClient();
  return useMutation<CreateChapterResponse, Error, CreateChapterRequest>({
    mutationFn: createChapterServiceFollowingCourseId,
    onSuccess: (data) => {
      toast.success(data.message || "Tạo chương học thành công");
        queryClient.invalidateQueries({ queryKey: ["getChapterFollowingCourseId"] });
    },
    onError: (error) => {
      toast.error(error.message || "Tạo chương học thất bại");
    },
  });
};
