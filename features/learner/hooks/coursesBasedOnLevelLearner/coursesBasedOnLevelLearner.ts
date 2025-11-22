import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  enrollingFirstCourseService,
  getCoursesBasedOnLevelLearnerService,
} from "../../services/coursesBasedOnLevelLearner/courseBasedOnLevelLearnerService";
import { toast } from "sonner";
import { useLearnerStore } from "@/store/useLearnerStore";


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
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  description: string;
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
  isSucess: boolean;
  data: {
    level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2"; 
    learningPathCourseId: string;
    learnerCourseId: string;
    courseId: string;
    status: "InProgress" | "Completed" ; 
  };
  businessCode: "INSERT_SUCESSFULLY" | string;
  message: string;
}

export const useEnrollFirstCourse = () => {
  const queryClient = useQueryClient();
  const setAllLearnerData = useLearnerStore((state) => state.setAllLearnerData);
  
  return useMutation<EnrollFirstCourseResponse, Error, string>({
    mutationFn: (courseId) => enrollingFirstCourseService(courseId),
    onSuccess: (data) => {
      
      
      setAllLearnerData({
        learnerCourseId: data.data.learnerCourseId,
        courseId: data.data.courseId,
        learningPathCourseId: data.data.learningPathCourseId,
        status: data.data.status,
      });
      
      queryClient.invalidateQueries({ queryKey: ["levelsAndlearnerCourseIds"] });
      queryClient.invalidateQueries({ queryKey: ["trackingCoursesEnrolled"] });
    },
    onError: (error) => {
      toast.error(error.message || "Tham gia khóa học thất bại");
    },
  });
};
