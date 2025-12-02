import fetchWithAuth from "@/utils/fetchWithAuth";

export interface ProgressAnalyticsResponse {
  isSucess: boolean;
  data: ProgressAnalytics;
  businessCode: string;
  message: string;
}

export interface ProgressAnalytics {
  progressAnalyticsId: string;
  dateRecorded: string;
  speakingTime: number;
  sessionsCompleted: number;
  pronunciationScoreAvg: number;
  learnerProfileId: string;
}

export const getMyProgressAnalyticsService =
  async (): Promise<ProgressAnalyticsResponse> => {
    try {
      const response = await fetchWithAuth(
        "/api/learner/progress-analytics",
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok)
        throw new Error(data.message || "Lấy ProgressAnalytics thất bại");

      return data;
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error.message ||
        "Lấy ProgressAnalytics thất bại";
      throw new Error(message);
    }
  };
