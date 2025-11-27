import fetchWithAuth from "@/utils/fetchWithAuth";



export interface DownloadExcelResult {
  blob: Blob;
  filename: string;
}

export const downloadPurchaseExcel = async (
): Promise<DownloadExcelResult> => {
  try {
    const url = `/api/AdminDashboard/purchase/excel`;

    const response = await fetchWithAuth(url, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      // Try to parse error as JSON, but handle case where it might not be JSON
      let errorMessage = "Failed to download Excel file";
      try {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          // Clone response to read as JSON
          const responseClone = response.clone();
          const errorData = await responseClone.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } else {
          // Try to read as text
          const responseClone = response.clone();
          const text = await responseClone.text();
          if (text && text.trim().length > 0) {
            try {
              const errorData = JSON.parse(text);
              errorMessage = errorData.message || errorData.error || errorMessage;
            } catch {
              // If not JSON, use the text
              errorMessage = text || response.statusText || errorMessage;
            }
          } else {
            errorMessage = response.statusText || `HTTP ${response.status}` || errorMessage;
          }
        }
      } catch (parseError) {
        // If parsing fails, use status text
        errorMessage = response.statusText || `HTTP ${response.status}` || errorMessage;
      }
      console.error("Excel download error:", errorMessage, "Status:", response.status);
      throw new Error(errorMessage);
    }

    // Check if response is actually a blob/file
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("spreadsheet") && !contentType.includes("octet-stream")) {
      console.warn("Unexpected content type:", contentType);
    }

    const blob = await response.blob();
    
    if (blob.size === 0) {
      throw new Error("Downloaded file is empty");
    }
    
    // Extract filename from Content-Disposition header
    const contentDisposition = response.headers.get("content-disposition");
    let filename = `purchases-${new Date().toISOString().split("T")[0]}.xlsx`;
    
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1].replace(/['"]/g, "");
        // Handle UTF-8 encoded filename (RFC 5987)
        if (filename.startsWith("UTF-8''")) {
          filename = decodeURIComponent(filename.substring(7));
        }
      }
    }

    return { blob, filename };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unknown error occurred while downloading Excel file");
  }
};

// Helper function to trigger download in browser
export const triggerExcelDownload = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

