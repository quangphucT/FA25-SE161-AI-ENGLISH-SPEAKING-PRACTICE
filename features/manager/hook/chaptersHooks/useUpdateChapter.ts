"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CreateChapterRequest, CreateChapterResponse } from "@/types/chapterFollowingCourseId/chapter";
import { updateChapterService } from "../../service/chaptersFollowingCourseIdService/chapterFollowingCourseid";

export const useUpdateChapter = () => {
  const queryClient = useQueryClient();
  return useMutation<CreateChapterResponse, Error, { id: string; payload: CreateChapterRequest }>({
    mutationFn: ({ id, payload }) => updateChapterService(id, payload),
    onSuccess: (data) => {
      toast.success(data.message || "Cập nhật chương học thành công");
      queryClient.invalidateQueries({ queryKey: ["getChapterFollowingCourseId"] });
    },
    onError: (error) => {
      toast.error(error.message || "Cập nhật khóa học thất bại");
    },
  });
};
