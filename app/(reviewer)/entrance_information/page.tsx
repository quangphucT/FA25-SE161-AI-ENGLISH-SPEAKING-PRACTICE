"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useReviewerCertificationUpload } from "@/features/reviewer/hooks/useCertificationUpload";
import { useReviewerProfilePut } from "@/features/reviewer/hooks/useReviewerProfile";
import { useGetMeQuery } from "@/hooks/useGetMeQuery";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2, UploadCloud, Trash2, FileText } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

const EntranceInformation = () => {
  const [certificates, setCertificates] = useState<
    Array<{ id: string; file: File; name: string }>
  >([]);
  const [experienceYears, setExperienceYears] = useState<string>("");
  const { mutate: uploadCertificate, isPending: isUploadingCertificate } =
    useReviewerCertificationUpload();
  const { mutate: updateProfile, isPending: isUpdatingProfile } =
    useReviewerProfilePut();
  const { data: meData } = useGetMeQuery();
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const isPending = isUploadingCertificate || isUpdatingProfile;

  const generateId = () =>
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random()}`;

  const addFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const newCertificates = Array.from(fileList).map((file, index) => ({
      id: generateId(),
      file,
      name: file.name,
    }));
    setCertificates((prev) => [...prev, ...newCertificates]);
  };

  const handleNameChange = (id: string, value: string) => {
    setCertificates((prev) =>
      prev.map((certificate) =>
        certificate.id === id ? { ...certificate, name: value } : certificate
      )
    );
  };

  const handleRemoveCertificate = (id: string) => {
    setCertificates((prev) => prev.filter((certificate) => certificate.id !== id));
  };

  const handleReset = () => {
    setCertificates([]);
  };

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (certificates.length === 0) {
      toast.error("Chưa chọn file!");
      return;
    }

    if (!meData?.userId) {
      toast.error("Không tìm thấy thông tin người dùng!");
      return;
    }
    if (!experienceYears.trim()) {
      toast.error("Số năm kinh nghiệm không được để trống!");
      return;
    }
    if (Number(experienceYears.trim()) < 0) {
      toast.error("Số năm kinh nghiệm không được nhỏ hơn 0!");
      return;
    }
    if (Number(experienceYears.trim()) > 100) {
      toast.error("Số năm kinh nghiệm không được lớn hơn 100!");
      return;
    }
    if(!Number.isInteger(Number(experienceYears.trim()))) {
      toast.error("Số năm kinh nghiệm phải là số nguyên!");
      return;
    }
    try {
      // Upload certificates first
      for (const certificate of certificates) {
        const certificateName =
          certificate.name.trim() || certificate.file.name;
        await new Promise<void>((resolve, reject) => {
          uploadCertificate(
            { file: certificate.file, name: certificateName },
            {
              onSuccess: () => {
                resolve();
              },
              onError: (error) => {
                reject(error);
              },
            }
          );
        });
      }

      // Sleep to wait for certificate upload to complete
      await sleep(1000);

      // Update experience years if provided
      if (experienceYears.trim()) {
        await new Promise<void>((resolve, reject) => {
          updateProfile(
            {
              userId: meData.userId,
              experience: experienceYears.trim(),
              fullname: meData.fullName || "",
              phoneNumber: meData.phoneNumber || "",
            },
            {
              onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["getMe"] });
                queryClient.invalidateQueries({
                  queryKey: ["reviewerProfile", meData.userId],
                });
                resolve();
              },
              onError: (error) => {
                reject(error);
              },
            }
          );
        });
      }

      if (typeof window.forceRefreshToken === "function") {
        await window.forceRefreshToken();
      }
      router.push("/reviewer-waiting");
    } catch (error) {
      // Errors are handled via the mutation's onError callback (which already displays a toast)
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#18232a] px-4">
      <Card className="w-full max-w-2xl bg-[#18232a] border-none text-white rounded-2xl shadow-xl p-2">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-extrabold tracking-wide">
            Upload bằng cấp
          </CardTitle>
          <CardDescription className="text-gray-400 text-sm">
            Tải lên bằng cấp của bạn
          </CardDescription>
        </CardHeader>

        <CardContent className="mt-4">
          <form className="space-y-5" onSubmit={onSubmit}>
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-200">
                Số năm kinh nghiệm
              </label>
              <Input
                type="text"
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
                placeholder="Nhập số năm kinh nghiệm (ví dụ: 5)"
                className="bg-[#1a2730] border-[#2c3e50] text-white h-[44px] rounded-xl focus:ring-2 focus:ring-[#2ed7ff]/40"
                disabled={isPending}
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-200">
                Tải lên tệp chứng chỉ
              </label>
              <div className="bg-[#1d2a33] border border-dashed border-[#2ed7ff]/40 rounded-2xl p-5 flex flex-col items-center text-center gap-3">
                <UploadCloud className="h-10 w-10 text-[#2ed7ff]" />
                <div>
                  <p className="text-sm font-medium text-white">
                    Kéo thả hoặc nhấn để chọn tệp
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Hỗ trợ hình ảnh và PDF. Có thể chọn nhiều tệp cùng lúc.
                  </p>
                </div>
                <Input
                  type="file"
                  accept="image/*,application/pdf"
                  multiple
                  onChange={(e) => {
                    addFiles(e.target.files);
                    if (e.target) e.target.value = "";
                  }}
                  className="cursor-pointer w-full sm:w-72 bg-[#22313c] border-[#2c3e50] file:text-white h-11 rounded-xl focus:ring-2 focus:ring-[#2ed7ff]/50"
                />
              </div>

              {certificates.length > 0 && (
                <div className="bg-[#1d2a33] border border-[#243545] rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-200">
                      Danh sách chứng chỉ ({certificates.length})
                    </p>
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-xs text-gray-300 hover:text-white hover:bg-[#243545]"
                      onClick={handleReset}
                      disabled={isPending}
                    >
                      Xoá tất cả
                    </Button>
                  </div>
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {certificates.map((certificate, index) => (
                      <div
                        key={certificate.id}
                        className="bg-[#22313c] border border-[#2c3e50]/80 rounded-xl px-3 py-3 space-y-3"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-[#2ed7ff]" />
                          <div className="text-left max-w-[220px]">
                            <p className="text-sm text-white font-medium truncate whitespace-nowrap">
                              {certificate.file.name}
                            </p>
                            <p className="text-xs text-gray-400">
                              {(certificate.file.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs text-gray-300">
                            Tên hiển thị
                          </label>
                          <Input
                            value={certificate.name}
                            onChange={(e) =>
                              handleNameChange(certificate.id, e.target.value)
                            }
                            placeholder={`Nhập tên chứng chỉ #${index + 1}`}
                            className="bg-[#1a2730] border-[#2c3e50] text-white h-[44px] rounded-xl focus:ring-2 focus:ring-[#2ed7ff]/40"
                          />
                        </div>
                        <div className="flex justify-end">
                          <Button
                            type="button"
                            variant="ghost"
                            className="text-gray-400 hover:text-red-400 hover:bg-[#2a3944]"
                            size="icon"
                            onClick={() => handleRemoveCertificate(certificate.id)}
                            disabled={isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={isPending || certificates.length === 0}
              className="w-full cursor-pointer h-11 text-base bg-[#2ed7ff] text-[#18232a] hover:bg-[#1ec6e6] disabled:opacity-60 disabled:cursor-not-allowed rounded-xl font-semibold transition-all"
            >
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin h-5 w-5" />
                  Đang tải...
                </span>
              ) : (
                "Tải lên chứng chỉ"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EntranceInformation;
