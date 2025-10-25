import { UploadCertificateRequest, UploadCertificateResponse } from "@/types/uploadCertificate";
import fetchWithAuth from "@/utils/fetchWithAuth";

export const uploadCertificateService = async (
  formData: UploadCertificateRequest,
): Promise<UploadCertificateResponse> => {
  try {
    const response = await fetchWithAuth("/api/reviewer/upload-certificate", {
      method: "POST",
      credentials: "include",
      body: formData, 
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Upload failed");
    return data;
  } catch (error: any) {
    const message = error?.response?.data?.message || error.message || "Upload failed";
    throw new Error(message);
  }
};
