"use client";

import { useState } from "react";
import { uploadAudioToCloudinary } from "@/utils/upload";

export default function ReviewRecordPage() {
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
      const file = e.target.files?.[0];
      if (!file) return;

      setLoading(true);
      setError(null);

      try {
        const uploadedUrl = await uploadAudioToCloudinary(file);
        if (uploadedUrl) {
          setUrl(uploadedUrl);
        } else {
          setError("Upload failed. Please try again.");
        }
      } catch (err) {
        setError("An error occurred during upload.");
        console.error("Upload error:", err);
      } finally {
        setLoading(false);
      }
    }

    return (
      <div>
        <input 
          type="file" 
          accept="audio/*" 
          onChange={handleUpload}
          disabled={loading}
        />
  
        {loading && <p>Uploading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        
        {url && (
          <div>
            <audio controls src={url}></audio>
            <p>Uploaded URL: {url}</p>
          </div>
        )}
      </div>
    );
  }