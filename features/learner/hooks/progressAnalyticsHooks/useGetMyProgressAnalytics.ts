import { useQuery } from "@tanstack/react-query";
import {
  getMyProgressAnalyticsService,
  ProgressAnalyticsResponse,
} from "../../services/progressAnalyticsService/progressAnalyticsService";

export const useGetMyProgressAnalytics = () => {
  return useQuery<ProgressAnalyticsResponse, Error>({
    queryKey: ["myProgressAnalytics"],
    queryFn: () => getMyProgressAnalyticsService(),
  });
};
