"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createCourseService } from "@/features/manager/service/coursesFollowingLevelsService/createCourse";
import { CreateCourseRequest, CreateCourseResponse } from "@/types/courseFollowingLevel/course";

export const useCreateCourse = () => {
  const queryClient = useQueryClient();
  return useMutation<CreateCourseResponse, Error, CreateCourseRequest>({
    mutationFn: createCourseService,
    onSuccess: (data) => {
      toast.success(data.message || "Tạo khóa học thành công");
        queryClient.invalidateQueries({ queryKey: ["getCourses"] });
    },
    onError: (error) => {
      toast.error(error.message || "Tạo khóa học thất bại");
    },
  });
};
