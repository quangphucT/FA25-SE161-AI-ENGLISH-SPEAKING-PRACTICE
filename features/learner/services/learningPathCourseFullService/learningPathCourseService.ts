import fetchWithAuth from "@/utils/fetchWithAuth";
import { LearningPathCourseParams } from "../../hooks/learningPathCourseFullHooks/learningPathCourseFull";


export const learningPathCourseFullService = async (params: LearningPathCourseParams) => {
    try {
        const { learningPathCourseId, courseId, status } = params;
        
        const queryParams = new URLSearchParams();
        if (learningPathCourseId) {
            queryParams.append('learningPathCourseId', learningPathCourseId.toString());
        }
        if (courseId) {
            queryParams.append('courseId', courseId.toString());
        }
        if (status) {
            queryParams.append('status', status);
        }
        
        const url = `/api/learner/learning-path-course-full?${queryParams.toString()}`;
        
        const response = await fetchWithAuth(url, {
            method: "GET",
            credentials: "include",
        });
        
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Get learning path course failed");
        }
        return data;
    } catch (error: any) {
        const message = 
            error?.response?.data?.message || 
            error.message || 
            "Get learning path course failed";
        throw new Error(message);
    }
}