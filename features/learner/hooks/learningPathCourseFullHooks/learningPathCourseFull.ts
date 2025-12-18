import { useQuery } from "@tanstack/react-query"
import { learningPathCourseFullService } from "../../services/learningPathCourseFullService/learningPathCourseService";
interface QuestionMedia {
  questionMediaId: string;
  accent: string;
  audioUrl: string | null;
  videoUrl: string | null;
  imageUrl: string | null;
  source: string | null;
}
interface Question {
  learningPathQuestionId: string;
  questionId: string;
  status: string;
  score: number;
  numberOfRetake: number;
  text: string;
  type: string;
  orderIndex: number;
  audioRecordingUrl: string;
  explainTheWrongForVoiceAI: string;
  media: QuestionMedia[];
}

interface Exercise {
  learningPathExerciseId: string;
  exerciseId: string;
  orderIndex: number;
  status: string;
  exerciseTitle: string;
  exerciseDescription: string;
  progress: number;
  scoreAchieved: number;
  numberOfQuestion: number;
  questions: Question[];   
}


interface Chapter {
  learningPathChapterId: string;
  chapterId: string;
  orderIndex: number;
  status: string;
  progress: number;
  numberOfModule: number;
  chapterTitle: string;
  chapterDescription: string;
  exercises: Exercise[];
}

interface Course {
  courseId: string;
  title: string;
  description: string;
  level: string;
  price: number;
  averageScore: number;
}

interface LearningPathCourseData {
  learningPathCourseId: string;
  learnerCourseId: string;
  courseId: string;
  status: string;
  progress: number;
  numberOfChapter: number;
  orderIndex: number;
  course: Course;
  chapters: Chapter[];
}

interface ApiResponse {
  isSucess: boolean;
  data: LearningPathCourseData;
  businessCode: string;
  message: string;
}

export interface LearningPathCourseParams {
  learningPathCourseId?: string;
  courseId?: string;
}

export const useLearningPathCourseFull = (params: LearningPathCourseParams, enabled: boolean = true) => {
     const isParamsValid = Boolean(
    params.learningPathCourseId && params.courseId
  );
    return useQuery<ApiResponse, Error>({
        queryKey: ["learningPathCourseFull", params],
        queryFn: () => learningPathCourseFullService(params),
       enabled: enabled && isParamsValid,  // chỉ gọi khi tất cả tham số hợp lệ
    });
}