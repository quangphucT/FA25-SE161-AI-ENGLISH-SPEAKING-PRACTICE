"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DeleteChapterResponse, deleteChapterService } from "../../service/chaptersFollowingCourseIdService/chapterFollowingCourseid";

export const useDeleteChapter = () => {
  const queryClient = useQueryClient();
  return useMutation<DeleteChapterResponse, Error, string>({
    mutationFn: (id) => deleteChapterService(id),
    onSuccess: (data) => {
      toast.success(data.message || "Xóa chương thành công");
      queryClient.invalidateQueries({ queryKey: ["getChapterFollowingCourseId"] });
    },
    onError: (error) => {
      toast.error(error.message || "Xóa chương thất bại");
    },
  });
};
