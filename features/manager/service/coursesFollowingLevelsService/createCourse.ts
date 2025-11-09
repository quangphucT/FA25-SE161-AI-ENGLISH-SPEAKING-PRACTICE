import fetchWithAuth from '@/utils/fetchWithAuth';
import { CreateCourseRequest, CreateCourseResponse } from '@/types/courseFollowingLevel/course';



export const createCourseService = async (credentials: CreateCourseRequest): Promise<CreateCourseResponse> => {
  try {
    const response = await fetchWithAuth('/api/manager/courseApiRoutes/createCourseOfLevel', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Create course failed');
    return data;
  } catch (error: any) {
    const message = error?.response?.data?.message || error.message || 'Create course failed';
    throw new Error(message);
  }
};
