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
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  level: string;
  pronunciationScore: number;
  status: string;
  joinDate: string;
  lastActiveAt: string | null;
  currentCourseTitle: string | null;
  currentCourseStatus: string | null;
  currentCourseProgress: number | null;
}

export interface LearnerDetail {
  learnerProfileId: string;
  userId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  level: string;
  pronunciationScore: number;
  dailyMinutes: number;
  status: string;
  joinDate: string;
  lastActiveAt: string;
  courses: Course[];
  assessmentCount: number;
  avgScore: number;
}

export interface Course {
  status: string;
  progress: number;
  title: string;
  price: number;
  duration: number;
  startTime: string;
  endTime: string;
}
export interface AdminLearnerDetailResponse {
  isSucess: boolean;
  data: LearnerDetail;
  businessCode: number;
  message: string;
}

export const adminLearnersService = async (
  pageNumber: number,
  pageSize: number,
  filterStatus: string,
  search: string
): Promise<AdminLearnersResponse> => {
  try {
    const params = new URLSearchParams({
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString(),
      filterStatus,
    });

    if (search.trim()) {
      params.append("search", search.trim());
    }

    const response = await fetchWithAuth(
      `/api/AdminDashboard/learners?${params.toString()}`
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
export const adminLearnerDetailService = async (
  learnerProfileId: string
): Promise<AdminLearnerDetailResponse> => {
  try {
    const response = await fetchWithAuth(`/api/AdminDashboard/learners/${learnerProfileId}`);
    const data = await response.json();
    return data;
  }
  catch (error: unknown) {
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
export const adminLearnerBanService = async (
  userId: string,
  body: {
    reason: string;
  }
): Promise<any> => {
  try {
    const response = await fetchWithAuth(`/api/AdminDashboard/learners/ban/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Ban learner failed");
    return data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message || error.message || "Ban learner failed";
    throw new Error(message);
  }
};