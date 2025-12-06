import { UploadResponse } from "@/types/upload/upload";
import fetchWithAuth from "@/utils/fetchWithAuth";

export const uploadImageService = async (file: File): Promise<UploadResponse> => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetchWithAuth("/api/upload/img", {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok)
      throw new Error(data.message || "Upload image failed");

    return data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error.message ||
      "Upload image failed";
    throw new Error(message);
  }
};
