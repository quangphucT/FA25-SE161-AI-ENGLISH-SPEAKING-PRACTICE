import fetchWithAuth from '@/utils/fetchWithAuth';

export interface DeleteCourseResponse {
  isSucess: boolean;
  businessCode: number;
  message: string;
}

export const deleteCourseService = async (id: string): Promise<DeleteCourseResponse> => {
  try {
    const response = await fetchWithAuth(`/api/manager/courseApiRoutes/delete-course/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Delete course failed');
    return data;
  } catch (error: any) {
    const message = error?.response?.data?.message || error.message || 'Delete course failed';
    throw new Error(message);
  }
};
