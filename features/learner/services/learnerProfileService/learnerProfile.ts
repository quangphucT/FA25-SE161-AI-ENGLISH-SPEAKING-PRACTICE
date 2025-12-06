import fetchWithAuth from "@/utils/fetchWithAuth";

/* =========================
   REQUEST
========================= */
export interface EditLearnerProfileRequest {
  fullName: string;
  phoneNumber: string;
    avatarUrl?: string; // ✅ BẮT BUỘC thêm dòng này

}

/* =========================
   RESPONSE
========================= */
export interface EditLearnerProfileResponse {
  isSucess: boolean;
  data: string; // learnerProfileId
  businessCode: string;
  message: string;
}

/* =========================
   SERVICE
========================= */
export const editLearnerProfileService =
  async (
    payload: EditLearnerProfileRequest
  ): Promise<EditLearnerProfileResponse> => {
    try {
      const response = await fetchWithAuth(
        "/api/learner/editProfileRoutes",
        {
          method: "PUT",
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok)
        throw new Error(data.message || "Cập nhật hồ sơ thất bại");

      return data;
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error.message ||
        "Cập nhật hồ sơ thất bại";

      throw new Error(message);
    }
  };
