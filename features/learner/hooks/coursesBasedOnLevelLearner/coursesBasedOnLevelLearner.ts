import { useQuery } from "@tanstack/react-query";
import { getCoursesBasedOnLevelLearnerService } from "../../services/coursesBasedOnLevelLearner/courseBasedOnLevelLearnerService";

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
    enabled: !!level
  });
};