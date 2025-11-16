

import { useLearnerStore } from "@/store/useLearnerStore";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { enrollCourseNotFreeService } from "../../services/enrollingCourseNotFreeService/enrollingCourseNotFree";

export interface EnrollingCourseNotFreeResponse {
  isSucess: boolean;
  data: LearnerLevelDetail;
  businessCode: string;
  message: string;
}

export interface LearnerLevelDetail {
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  learningPathCourseId: string;
  courseId: string;
  status:  "InProgress" | "Completed"; 
}


export interface EnrollCourseNotFreeRequest{
    learnerCourseId: string;
    courseId: string;
}

export const useEnrollCourseNotFree = () => {

    return useMutation<EnrollingCourseNotFreeResponse, Error, EnrollCourseNotFreeRequest>({
        mutationKey: ["enrollCourseNotFree"],
        mutationFn: (data) => enrollCourseNotFreeService(data),
       
    });
};

