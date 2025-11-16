import { useQuery } from "@tanstack/react-query";
import { getLevelsAndLearnerCourseIdsAfterEnrollingService } from "../../services/enrolling/enrolling";


export interface LearnerLevelsResponse {
  isSucess: boolean;
  data: {
    levels: LearnerLevel[];
  };
  businessCode: string;
  message: string;
}

export interface LearnerLevel {
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  courses: LearnerCourse[]; // thêm courses array
}

export interface LearnerCourse {
  learnerCourseId: string;
  learningPathCourseId: string;
  courseId: string;
  status: "NotStarted" | "InProgress" | "Completed"; // nếu status có 3 trạng thái
}


export const useGetLevelAndLearnerCourseIdAfterEnrolling = () => {
  return useQuery<LearnerLevelsResponse, Error>({
    queryKey: ["levelsAndlearnerCourseIds"], 
    queryFn: () => getLevelsAndLearnerCourseIdsAfterEnrollingService(),
  
  });
};