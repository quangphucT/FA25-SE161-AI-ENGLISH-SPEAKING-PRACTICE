import fetchWithAuth from "@/utils/fetchWithAuth";
import { UploadCertificateResponse } from "@/types/certificate";

export const reviewerCertificationUploadService = async (
    body: {
      file: File;
      name: string;
    }
  ): Promise<UploadCertificateResponse> => {
    try {
      const formData = new FormData();
      formData.append("file", body.file);
      formData.append("name", body.name);

      const response = await fetchWithAuth("/api/reviewer/upload-certificate", {
        method: "POST",
        // Don't set Content-Type header - let the browser set it with the correct boundary
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Upload certificate failed");
      return data;
    } catch (error: any) {
      const message =
        error?.response?.data?.message || error.message || "Upload certificate failed";
      throw new Error(message);
    }
  };
