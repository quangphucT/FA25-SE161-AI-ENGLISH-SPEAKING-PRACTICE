"use client";

import { useState } from "react";
import { Upload, Video, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface VideoUploadFieldProps {
  value?: string;
  onUploaded: (url: string) => void;
}

export default function VideoUploadField({
  value,
  onUploaded,
}: VideoUploadFieldProps) {
  const [video, setVideo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!video) return;

    setLoading(true);
    setError(null);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", video);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ml_default"
      );

      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      if (!cloudName) throw new Error("Missing Cloudinary config");

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            setProgress(Math.round((e.loaded / e.total) * 100));
          }
        };

        xhr.onload = () => {
          const res = JSON.parse(xhr.responseText);
          if (res.secure_url) {
            onUploaded(res.secure_url);
            resolve();
          } else {
            reject(new Error("Upload failed"));
          }
        };

        xhr.onerror = () => reject(new Error("Network error"));

        xhr.open(
          "POST",
          `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`
        );
        xhr.send(formData);
      });
    } catch (err) {
  if (err instanceof Error) {
    setError(err.message);
  } else {
    setError("Upload video thất bại");
  }
}
 finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">

      {/* DROP ZONE */}
      <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed rounded-xl cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition">
        <input
          type="file"
          accept="video/*"
          className="hidden"
          onChange={(e) => setVideo(e.target.files?.[0] || null)}
        />

        <Upload className="w-10 h-10 text-gray-400 mb-2" />
        <p className="text-sm text-gray-500">
          Click hoặc kéo thả video vào đây
        </p>
      </label>

      {/* FILE INFO */}
      {video && (
        <div className="flex items-center gap-2 p-3 border rounded-lg bg-gray-50">
          <Video className="w-4 h-4 text-indigo-600" />
          <span className="text-sm truncate">{video.name}</span>
        </div>
      )}

      {/* UPLOAD BUTTON */}
      {video && !value && (
        <button
          type="button"
          onClick={handleUpload}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Đang upload...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              Upload video
            </>
          )}
        </button>
      )}

      {/* PROGRESS */}
      {loading && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Uploading</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-indigo-600 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* SUCCESS */}
      {value && (
        <div className="flex items-center gap-2 text-green-600 text-sm">
          <CheckCircle2 className="w-4 h-4" />
          Upload thành công
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}
    </div>
  );
}
