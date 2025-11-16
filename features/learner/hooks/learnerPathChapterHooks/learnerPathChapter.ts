import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { createLearningPathChapterService, getLearningPathChaptersService } from "../../services/learnerPathCourseService/learnerPathCourse";

export interface EnrolledPathChapterRequest {
    learnerCourseId: string;
    learningPathCourseId: string;
}
export interface EnrolledPathChapterResponse {
    message: string;
}
export const useEnrollPathChapter = () => {
  return useMutation<EnrolledPathChapterResponse, Error, EnrolledPathChapterRequest>({
    mutationFn: createLearningPathChapterService,
    onSuccess: (data) => {
      toast.success(data.message || "Tạo learning path chapter thành công");
    },
    onError: (error) => {
      toast.error(error.message || "Tạo learning path chapter thất bại");
    },
  });
};

export interface LearningPathChapterItem {
  learningPathChapterId: string;
  chapterId: string;
  orderIndex: number;
  status: "Enrolled" | "InProgress" | "Completed";
  progress: number;
  chapterTitle: string;
  description: string;
  numberOfExercise: number;
  numberOfModule: number;
}
export interface LearningPathChapterResponse {
  isSucess: boolean;
  data: LearningPathChapterItem[];
  businessCode: string;
  message: string;
}

export const getEnrollLearningPathChapter = (learningPathCourseId: string, enabled: boolean = true) => {
     return useQuery<LearningPathChapterResponse, Error>({
        queryKey: ["getLearningPathChapters", learningPathCourseId],
        queryFn: () => getLearningPathChaptersService(learningPathCourseId),
        enabled: enabled && !!learningPathCourseId,
        retry: (failureCount, error) => {
          if (/400|404|Not Found/i.test(error.message)) return false;
          return failureCount < 2;
        },
      });
}