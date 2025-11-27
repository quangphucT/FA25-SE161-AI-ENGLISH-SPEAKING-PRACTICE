export const uploadFileToCloudinary = async (
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
      console.log("Uploaded URL:", result.secure_url);
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

/**
 * Upload audio file to backend API via /api/upload/audio endpoint
 * @param file - Audio file to upload
 * @returns Promise resolving to the secure URL of the uploaded audio, or null if upload fails
 */
export const uploadAudioToCloudinary = async (
  file: File
): Promise<string | null> => {
  try {
    if (!file) return null;

    // Validate that it's an audio file
    if (!file.type.startsWith("audio/")) {
      console.error("File is not an audio file:", file.type);
      return null;
    }

    const formData = new FormData();
    formData.append("file", file); // Backend API expects "file" field

    const response = await fetch("/api/upload/audio", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Upload failed" }));
      console.error("Audio upload failed:", error);
      return null;
    }

    const result = await response.json();

    // Backend API returns { success: true, url: "..." }
    if (result.success && result.url) {
      console.log("Audio uploaded successfully:", result.url);
      return result.url;
    } else {
      console.error("Audio upload failed: Invalid response format", result);
      return null;
    }
  } catch (error) {
    console.error("Error uploading audio:", error);
    return null;
  }
};
  