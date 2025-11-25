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
  Level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2"; // Chữ hoa L để khớp với API
  TotalCourses: number;
  CompletedCourses: number;
  Courses: LearnerCourse[]; // Chữ hoa C để khớp với API
}

export interface LearnerCourse {
  learnerCourseId: string;
  learningPathCourseId: string;
  courseId: string;
  status: "NotStarted" | "InProgress" | "Completed";
}


export const useGetLevelAndLearnerCourseIdAfterEnrolling = () => {
  return useQuery<LearnerLevelsResponse, Error>({
    queryKey: ["levelsAndlearnerCourseIds"], 
    queryFn: () => getLevelsAndLearnerCourseIdsAfterEnrollingService(),
  
  });
};