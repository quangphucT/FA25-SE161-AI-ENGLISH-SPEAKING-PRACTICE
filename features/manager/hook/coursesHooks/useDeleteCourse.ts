"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteCourseService, DeleteCourseResponse } from "@/features/manager/service/coursesFollowingLevelsService/deleteCourse";

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();
  return useMutation<DeleteCourseResponse, Error, string>({
    mutationFn: (id) => deleteCourseService(id),
    onSuccess: (data) => {
      toast.success(data.message || "Xóa khóa học thành công");
      queryClient.invalidateQueries({ queryKey: ["getCoursesOfLevel"] });
    },
    onError: (error) => {
      toast.error(error.message || "Xóa khóa học thất bại");
    },
  });
};
