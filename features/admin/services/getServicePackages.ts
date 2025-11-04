import { GetQuestionTestResponse } from "@/types/questionTest";
import { GetServicePackagesResponse } from "@/types/servicePackage/servicePackage";
import fetchWithAuth from "@/utils/fetchWithAuth";

export const getServicePackages =
  async (): Promise<GetServicePackagesResponse> => {
    try {
      const response = await fetchWithAuth(`/api/admin/get-service-packages`, {
        method: "GET",
        credentials: "include",
      });

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
