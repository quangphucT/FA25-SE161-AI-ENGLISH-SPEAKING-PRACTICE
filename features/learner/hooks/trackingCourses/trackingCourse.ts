import { useQuery } from "@tanstack/react-query";
import { trackingCourseEnrolledService } from "../../services/trackingCoursesEnrolledService/trackingCoursesEnrolled";

export interface TrackingCoursesEnrolledResponse {
  isSucess: boolean;
  data: LearningPathCourseItem[];
  businessCode: string;
  message: string;
}

export interface LearningPathCourseItem {
  learningPathCourseId: string;  
  learnerCourseId: string | null;
  courseId: string;           
  courseTitle: string;           
  status: "Enrolled" | "Completed" | "InProgress"; 
  progress: number;    
  description: string;           
  numberOfChapter: number;       
  orderIndex: number;           
}

export const useTrackingCoursesEnrolled = (learnerCourseId: string, enabled: boolean) => {
  return useQuery<TrackingCoursesEnrolledResponse, Error>({
    queryKey: ["trackingCoursesEnrolled", learnerCourseId],
    queryFn: () => trackingCourseEnrolledService(learnerCourseId),
    enabled: enabled && !!learnerCourseId,
    retry: (failureCount, error) => {
      if (/400|404|Not Found/i.test(error.message)) return false;
      return failureCount < 2;
    },
  });
};