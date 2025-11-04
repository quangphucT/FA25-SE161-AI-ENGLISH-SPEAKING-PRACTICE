import { GetQuestionTestResponse } from "@/types/questionTest";
import fetchWithAuth from "@/utils/fetchWithAuth";

export const getQuestionTestService = async (
  pageNumber: number,
  pageSize: number,
  type?: string,
  keyword?: string
): Promise<GetQuestionTestResponse> => {
  try {
    const query = new URLSearchParams({
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString(),
      type: type || "",
      keyword: keyword || "",
    }).toString();

    const response = await fetchWithAuth(
      `/api/manager/get-questions-test?${query}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "Create question test failed");
    return data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error.message ||
      "Create question test failed";
    throw new Error(message);
  }
};
