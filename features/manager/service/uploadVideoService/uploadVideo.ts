export const uploadVideoService = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/upload/video", {
    method: "POST",
    body: formData, // ✅ TUYỆT ĐỐI KHÔNG SET HEADERS
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Upload video failed");
  }

  return data; // ✅ { success, url }
};
