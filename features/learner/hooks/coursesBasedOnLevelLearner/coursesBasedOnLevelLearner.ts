import { useMutation, useQuery } from "@tanstack/react-query";
import {
  enrollingFirstCourseService,
  getCoursesBasedOnLevelLearnerService,
} from "../../services/coursesBasedOnLevelLearner/courseBasedOnLevelLearnerService";
import { toast } from "sonner";
import { useLearnerStore } from "@/store/useLearnerStore";
import { set } from "date-fns";

export interface GetCourseBasedOnLevelLearner {
  isSucess: boolean;
  data: CourseItem[];
  businessCode: string;
  message: string;
}

export interface CourseItem {
  courseId: string;
  title: string;
  numberOfChapter: number;
  orderIndex: number;
  level: string;
  price: number;
  duration: number;
  status: string;
  isFree: boolean;
  chapters: ChapterItem[];
}

export interface ChapterItem {
  chapterId: string;
  title: string;
  description: string;
  createdAt: string; // ISO date string
  numberOfExercise: number;
  exercises: ExerciseItem[];
}

export interface ExerciseItem {
  exerciseId: string;
  title: string;
  description: string;
  orderIndex: number;
  numberOfQuestion: number;
  isFree: boolean;
  questions: QuestionItem[];
}

export interface QuestionItem {
  questionId: string;
  text: string;
  type: string;
  orderIndex: number;
  phonemeJson: string;
}
export const useGetCoursesBasedOnLevelLearner = (level: string) => {
  return useQuery<GetCourseBasedOnLevelLearner, Error>({
    queryKey: ["getCoursesBasedOnLevelLearner", level],
    queryFn: () => getCoursesBasedOnLevelLearnerService(level),
    enabled: !!level,
  });
};

export interface EnrollFirstCourseResponse {
  isSuccess: boolean;
  message: string;
  businessCode: string;
  learnerCourseId: string;
}

export const useEnrollFirstCourse = () => {
  const { setLearnerCourseId } = useLearnerStore();
  return useMutation<EnrollFirstCourseResponse, Error, string>({
    mutationFn: (courseId) => enrollingFirstCourseService(courseId),
    onSuccess: (data) => {
      toast.success(data.message || "Tham gia khóa học thành công");
      setLearnerCourseId(data.learnerCourseId);
    },
    onError: (error) => {
      toast.error(error.message || "Tham gia khóa học thất bại");
    },
  });
};
