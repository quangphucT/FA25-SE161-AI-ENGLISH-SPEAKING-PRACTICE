import fetchWithAuth from '@/utils/fetchWithAuth';
import { CreateCourseRequest, CreateCourseResponse } from '@/types/courseFollowingLevel/course';

export const updateCourseService = async (
  id: string,
  payload: CreateCourseRequest
): Promise<CreateCourseResponse> => {
  try {
    const response = await fetchWithAuth(`/api/manager/courseApiRoutes/update-course/${id}`, {
      method: 'PUT',
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Update course failed');
    return data;
  } catch (error: any) {
    const message = error?.response?.data?.message || error.message || 'Update course failed';
    throw new Error(message);
  }
};
