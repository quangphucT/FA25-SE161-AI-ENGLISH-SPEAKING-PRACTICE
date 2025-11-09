"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateCourseService } from "@/features/manager/service/coursesFollowingLevelsService/updateCourse";
import { CreateCourseRequest, CreateCourseResponse } from "@/types/courseFollowingLevel/course";

export const useUpdateCourse = () => {
  const queryClient = useQueryClient();
  return useMutation<CreateCourseResponse, Error, { id: string; payload: CreateCourseRequest }>({
    mutationFn: ({ id, payload }) => updateCourseService(id, payload),
    onSuccess: (data) => {
      toast.success(data.message || "Cập nhật khóa học thành công");
      queryClient.invalidateQueries({ queryKey: ["getCoursesOfLevel"] });
    },
    onError: (error) => {
      toast.error(error.message || "Cập nhật khóa học thất bại");
    },
  });
};
