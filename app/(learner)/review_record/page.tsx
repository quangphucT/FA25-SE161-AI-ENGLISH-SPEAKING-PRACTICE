"use client";

import { useState } from "react";
import { Upload, Video, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export default function ReviewRecordPage() {
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [video, setVideo] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
  
    const handleUpload = async () => {
      if (!video) {
        setError("Please select a video file");
        return;
      }

      setLoading(true);
      setError(null);
      setUploadProgress(0);

      try {
        const formData = new FormData();
        formData.append("file", video);
        
        // Use environment variable for upload preset, fallback to default
        const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ml_default";
        formData.append("upload_preset", uploadPreset);
    
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        if (!cloudName) {
          setError("Cloudinary cloud name is not configured");
          setLoading(false);
          return;
        }

        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          
          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
              const percent = Math.round((e.loaded / e.total) * 100);
              setUploadProgress(percent);
              console.log("Uploading:", percent + "%");
            }
          };
      
          xhr.onload = () => {
            try {
              if (xhr.status >= 200 && xhr.status < 300) {
                const response = JSON.parse(xhr.responseText);
                if (response.secure_url) {
                  setUrl(response.secure_url);
                  resolve();
                } else if (response.error) {
                  reject(new Error(response.error.message || "Upload failed"));
                } else {
                  reject(new Error("Invalid response from server"));
                }
              } else {
                try {
                  const errorResponse = JSON.parse(xhr.responseText);
                  reject(new Error(errorResponse.error?.message || `Upload failed with status ${xhr.status}`));
                } catch {
                  reject(new Error(`Upload failed with status ${xhr.status}`));
                }
              }
            } catch (parseError) {
              reject(new Error("Failed to parse server response"));
            }
          };
      
          xhr.onerror = () => {
            reject(new Error("Network error during upload"));
          };

          xhr.open(
            "POST",
            `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`
          );
      
          xhr.send(formData);
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred during upload");
      } finally {
        setLoading(false);
      }
    };

    const formatFileSize = (bytes: number) => {
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
                <Video className="w-8 h-8 text-primary" />
                Video Upload
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Upload your video file to get started
              </p>
            </div>

            {/* File Input Section */}
            <div className="space-y-4">
              <label className="block">
                <div className="relative">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setVideo(e.target.files[0]);
                        setError(null);
                        setUrl("");
                        setUploadProgress(0);
                      }
                    }}
                    disabled={loading}
                    className="hidden"
                    id="video-upload"
                  />
                  <label
                    htmlFor="video-upload"
                    className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                      loading
                        ? "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 cursor-not-allowed"
                        : "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10"
                    }`}
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className={`w-12 h-12 mb-4 ${loading ? "text-gray-400" : "text-gray-400 dark:text-gray-500"}`} />
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Video files only (MP4, MOV, AVI, etc.)
                      </p>
                    </div>
                  </label>
                </div>
              </label>

              {/* File Info */}
              {video && (
                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                  <Video className="w-5 h-5 text-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {video.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatFileSize(video.size)}
                    </p>
                  </div>
                </div>
              )}

              {/* Upload Button */}
              <button
                onClick={handleUpload}
                disabled={loading || !video}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                  loading || !video
                    ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    : "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Upload Video
                  </>
                )}
              </button>

              {/* Progress Bar */}
              {loading && uploadProgress > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div
                      className="bg-primary h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              {/* Success Message & Video Preview */}
              {url && (
                <div className="space-y-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <CheckCircle2 className="w-5 h-5" />
                    <p className="font-semibold">Upload successful!</p>
                  </div>
                  <div className="rounded-lg overflow-hidden bg-black">
                    <video
                      src={url}
                      controls
                      className="w-full h-auto max-h-[500px]"
                    />
                  </div>
                  <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Uploaded URL:</p>
                    <p className="text-sm text-gray-900 dark:text-white break-all font-mono">
                      {url}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }