import fetchWithAuth from "@/utils/fetchWithAuth";

export interface AdminLearnersResponse {
  isSucess: boolean;
  data: {
    pageNumber: number;
    pageSize: number;
    totalItems: number;
    items: Learner[];
  };
  businessCode: number;
  message: string;
}
export interface Learner {
  learnerProfileId: string;
  fullName: string;
  email: string;
  phone: string;
  level: string;
  pronunciationScore: number;
  status: string;
  createdAt: string;
  lastActiveAt: string | null;
  currentPackage: string;
}

export const adminLearnersService = async (
  pageNumber: number,
  pageSize: number,
  filterStatus: string,
  search: string
): Promise<AdminLearnersResponse> => {
  try {
    const response = await fetchWithAuth(
      `/api/AdminLearner/list?pageNumber=${pageNumber}&pageSize=${pageSize}&filterStatus=${filterStatus}&search=${search}`
    );
    const data = await response.json();
    return data;
  } catch (error: unknown) {
    const message =
      (error &&
      typeof error === "object" &&
      "response" in error &&
      error.response &&
      typeof error.response === "object" &&
      "data" in error.response &&
      error.response.data &&
      typeof error.response.data === "object" &&
      "message" in error.response.data
        ? (error.response.data as { message: string }).message
        : null) ||
      (error instanceof Error ? error.message : null) ||
      "An unknown error occurred";
    throw new Error(message);
  }
};
