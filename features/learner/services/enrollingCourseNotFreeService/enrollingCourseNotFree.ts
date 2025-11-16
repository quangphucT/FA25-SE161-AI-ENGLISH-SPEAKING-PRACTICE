import fetchWithAuth from "@/utils/fetchWithAuth";
import { EnrollCourseNotFreeRequest, EnrollingCourseNotFreeResponse } from "../../hooks/enrollingCourseNotFreeHooks/enrollCourseNotFree";

export const enrollCourseNotFreeService = async (data: EnrollCourseNotFreeRequest) 
: Promise<EnrollingCourseNotFreeResponse> => {
    try {
        const response = await fetchWithAuth(`/api/learner/enroll-courseNotFree`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
    });
     const responseData = await response.json();
    if (!response.ok)
      throw new Error(responseData.message || "Enroll course not free failed");
    return responseData;
    } catch (error: any) {
        const message =
      error?.response?.data?.message ||
      error.message ||
      "Enroll course not free failed";
    throw new Error(message);
    }
    
};
