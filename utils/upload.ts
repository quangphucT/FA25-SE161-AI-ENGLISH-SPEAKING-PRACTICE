export const uploadImageToCloudinary = async (
  file: File
): Promise<string | null> => {
  try {
    if (!file) return null;

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload/image", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Upload failed:", error);
      return null;
    }

    const result = await response.json();

    if (result.secure_url) {
      console.log("Uploaded Image URL:", result.secure_url);
      console.log("Optimized URL:", result.optimized_url);
      // Return optimized URL if available, otherwise return secure_url
      return result.optimized_url || result.secure_url;
    } else {
      console.error("Upload failed: No secure_url in response", result);
      return null;
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    return null;
  }
};
  