import fetchWithAuth from "@/utils/fetchWithAuth";

/* =========================
   RESPONSE
========================= */
export interface UploadAvatarResponse {
  success: boolean;
  url: string;
}

/* =========================
   SERVICE
========================= */
export const uploadAvatarService = async (
  file: File
): Promise<UploadAvatarResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetchWithAuth("/api/learner/editProfileRoutes/uploadavatar", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Upload avatar thất bại");
  }

  return data;
};
