import { GetServicePackagesResponse } from "@/types/servicePackage/servicePackage";
import fetchWithAuth from "@/utils/fetchWithAuth";

export const getServicePackages =
  async (pageNumber: string, pageSize: string, search: string, filter: string): Promise<GetServicePackagesResponse> => {
    try {
      // Build query string
      const params = new URLSearchParams();
      if (pageNumber && pageNumber.trim()) {
        params.set("pageNumber", pageNumber);
      }
      if (pageSize && pageSize.trim()) {
        params.set("pageSize", pageSize);
      }
      if (search && search.trim()) {
        params.set("search", search);
      }
      if (filter && filter.trim()) {
        params.set("filter", filter);
      }
      
      const queryString = params.toString();
      const url = `/api/admin/get-service-packages${queryString ? `?${queryString}` : ""}`;
      
      const response = await fetchWithAuth(url);

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch service packages");
      }
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
        "Failed to fetch service packages";
      throw new Error(message);
    }
  };
