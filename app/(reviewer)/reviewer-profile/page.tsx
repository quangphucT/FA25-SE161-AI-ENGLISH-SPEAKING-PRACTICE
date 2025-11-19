"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Star,
  Award,
  TrendingUp,
  Edit,
  CheckCircle,
  X,
  Save,
  Clock,
  AlertCircle,
  Upload,
} from "lucide-react";
import Image from "next/image";
import { useGetMeQuery } from "@/hooks/useGetMeQuery";
import { useReviewerProfileGet, useReviewerProfilePut } from "@/features/reviewer/hooks/useReviewerProfile";
import { useReviewerCertificationUpload } from "@/features/reviewer/hooks/useCertificationUpload";
import { useQueryClient } from "@tanstack/react-query";
const FileDropZone = ({
  onDrop,
  children,
  className,
}: {
  onDrop: (files: FileList) => void;
  children: React.ReactNode;
  accept?: string;
  multiple?: boolean;
  className?: string;
}) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onDrop(files);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={className}
    >
      {children}
    </div>
  );
};

const ReviewerProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingCert, setIsAddingCert] = useState(false);
  const [certFormData, setCertFormData] = useState({
    name: "",
    imageUrl: "",
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
  const imageInputRef = useRef<HTMLInputElement>(null);
  
  const {data: meData} = useGetMeQuery();
  const {data: reviewerProfileData} = useReviewerProfileGet(meData?.userId || "");
  const { mutate: reviewerProfilePut, isPending } = useReviewerProfilePut();
  const { mutate: reviewerCertificationUpload, isPending: isCertUploadPending } = useReviewerCertificationUpload();
  const queryClient = useQueryClient();
  const profileData = reviewerProfileData?.data;
  
  const [formData, setFormData] = useState({
    fullname: meData?.fullName || "",
    experience: profileData?.experience || "",
    phoneNumber: meData?.phoneNumber || "",
  });

  // Update formData when API data loads
  useEffect(() => {
    if (profileData && meData) {
      setFormData({
        fullname: meData.fullName || "",
        experience: profileData.experience || "",
        phoneNumber: meData.phoneNumber || "",
      });
    }
  }, [profileData, meData]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    if (!meData?.userId) return;
    
    reviewerProfilePut(
      {
        userId: meData.userId,
        fullname: formData.fullname,
        experience: formData.experience,
        phoneNumber: formData.phoneNumber,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
          // Refetch profile data to show updated information
          queryClient.invalidateQueries({ queryKey: ["reviewerProfile", meData.userId] });
          // Also refetch user data to update fullName and phoneNumber
          queryClient.invalidateQueries({ queryKey: ["getMe"] });
        },
      }
    );
  };

  const handleCancel = () => {
    // Reset form data to original values from API
    if (profileData && meData) {
      setFormData({
        fullname: meData.fullName || "",
        experience: profileData.experience || "",
        phoneNumber: meData.phoneNumber || "",
      });
    }
    setIsEditing(false);
  };

  // Certification handlers
  const handleCertInputChange = (field: string, value: string) => {
    setCertFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      setImageFiles(newFiles);

      // Create preview URLs
      const newUrls = newFiles.map((file) => URL.createObjectURL(file));
      setUploadedImageUrls(newUrls);

      // Set the first image as the main image
      if (newUrls.length > 0) {
        setCertFormData((prev) => ({
          ...prev,
          imageUrl: newUrls[0],
        }));
      }
    }
  };

  const handleImageDrop = useCallback((files: FileList) => {
    const dataTransfer = new DataTransfer();
    Array.from(files).forEach((file) => dataTransfer.items.add(file));
    const event = {
      target: { files: dataTransfer.files },
    } as React.ChangeEvent<HTMLInputElement>;
    handleImageChange(event);
  }, []);

  const handleImageClick = () => {
    imageInputRef.current?.click();
  };

  const handleRemoveImage = (fileToRemove: File) => {
    const newFiles = imageFiles.filter((file) => file !== fileToRemove);
    setImageFiles(newFiles);

    // Update URLs
    const newUrls = newFiles.map((file) => URL.createObjectURL(file));
    setUploadedImageUrls(newUrls);

    // Update main image
    if (newUrls.length > 0) {
      setCertFormData((prev) => ({
        ...prev,
        imageUrl: newUrls[0],
      }));
    } else {
      setCertFormData((prev) => ({
        ...prev,
        imageUrl: "",
      }));
    }
  };

  const handleSaveCert = () => {
    if (!certFormData.name || imageFiles.length === 0) {
      return;
    }

    reviewerCertificationUpload(
      {
        file: imageFiles[0],
        name: certFormData.name,
      },
      {
        onSuccess: () => {
          setIsAddingCert(false);
          // Reset form
          setCertFormData({ name: "", imageUrl: "" });
          setImageFiles([]);
          setUploadedImageUrls([]);
          // Refetch profile data to show new certificate
          if (meData?.userId) {
            queryClient.invalidateQueries({ queryKey: ["reviewerProfile", meData.userId] });
          }
        },
      }
    );
  };

  const handleCancelCert = () => {
    setIsAddingCert(false);
    setCertFormData({ name: "", imageUrl: "" });
    setImageFiles([]);
    setUploadedImageUrls([]);
  };

  // Use real data from API
  const mentorData = {
    id: profileData?.reviewerProfileId || "",
    name: meData?.fullName || "Chưa có tên",
    avatar: meData?.avatarUrl || "/api/placeholder/150/150",
    rating: profileData?.rating || 0,
    totalReviews: 0, // TODO: Get from API if available
    totalFeedbacks: 0, // TODO: Get from API if available
    yearsExperience: meData?.reviewerProfile?.experience || 0,
    level: meData?.reviewerProfile?.levels || "___", // TODO: Get from API if available
    certifications: profileData?.certificates || [],
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header Profile Section */}
      <div className="relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-linear-to-br from-blue-50 via-white to-purple-50 rounded-3xl"></div>

        <Card className="relative bg-white/80 backdrop-blur-sm border-0 shadow-2xl shadow-blue-100/50 rounded-3xl overflow-hidden">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Avatar & Basic Info */}
              <div className="flex flex-col items-center lg:items-start space-y-6">
                <div className="relative group">
                  <div className="absolute -inset-2 bg-linear-to-br from-blue-500 to-purple-600 rounded-full opacity-20 group-hover:opacity-30 transition-opacity blur"></div>
                  <Image
                    src="/images/imageLanding.avif"
                    alt={mentorData.name}
                    className="relative w-40 h-40 rounded-full object-cover border-4 border-white shadow-2xl"
                    width={160}
                    height={160}
                  />
                  <div className="absolute -bottom-2 -right-2 bg-linear-to-br from-green-400 to-emerald-500 w-12 h-12 rounded-full flex items-center justify-center shadow-lg">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                </div>

                <div className="text-center lg:text-left space-y-4">
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
                      {mentorData.name}
                    </h1>
                    <div className="mt-3 space-y-1">
                      {mentorData.level && (
                        <p className="text-lg text-gray-700 font-medium">
                          Level: {mentorData.level}
                        </p>
                      )}
                      <p className="text-base text-gray-600">
                        {mentorData.yearsExperience} năm kinh nghiệm
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 justify-center lg:justify-start">
                    <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-50 to-orange-50 px-4 py-2 rounded-full border border-yellow-200">
                      <Star className="w-5 h-5 text-yellow-500 fill-current" />
                          <span className="font-bold text-lg text-gray-900">
                        {mentorData.rating.toFixed(1)}
                      </span>
                      {mentorData.totalFeedbacks > 0 && (
                        <span className="text-gray-600 text-sm font-medium">
                          ({mentorData.totalFeedbacks} đánh giá)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Qualification & Experience */}
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="p-2 bg-linear-to-br from-blue-500 to-purple-600 rounded-xl">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    Trình độ & Chuyên môn
                  </h3>
                  <div className="space-y-5">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-5 rounded-2xl border border-blue-100">
                      <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        Thông tin cơ bản
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-600">
                            Tổng số chứng chỉ:
                          </span>
                          <span className="text-sm font-semibold text-gray-900">
                            {mentorData.certifications?.length || 0}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-600">
                            Level:
                          </span>
                          <span className="text-sm font-semibold text-gray-900">
                            {mentorData.level}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-linear-to-br from-white to-blue-50 p-5 rounded-2xl border border-blue-100 shadow-lg">
                      <div className="space-y-4">
                        {/* Experience */}
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-linear-to-br from-blue-500 to-indigo-600 rounded-lg">
                            <Award className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 text-sm">
                              Kinh nghiệm
                            </h4>
                            <span className="text-gray-700 font-medium">
                              {mentorData.yearsExperience} năm kinh nghiệm
                            </span>
                          </div>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-linear-to-br from-purple-500 to-pink-600 rounded-lg">
                            <Star className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 text-sm">
                              Nhận xét
                            </h4>
                            <span className="text-gray-700 font-medium">
                              {mentorData.rating.toFixed(1)}/5
                              {mentorData.totalFeedbacks > 0 && (
                                <> ({mentorData.totalFeedbacks} nhận xét)</>
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Statistics */}
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="p-2 bg-linear-to-br from-emerald-500 to-teal-600 rounded-xl">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    Thống kê
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-2xl border border-blue-100">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 font-medium">
                          Tổng nhận xét:
                        </span>
                        <span className="font-bold text-2xl text-blue-600">
                          {mentorData.totalFeedbacks}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 font-medium">
                          Tổng đánh giá:
                        </span>
                        <span className="font-bold text-2xl text-blue-600">
                          {mentorData.totalReviews}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex flex-col gap-3">
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3 rounded-2xl font-semibold"
                >
                  <Edit className="w-5 h-5 mr-2" />
                  Chỉnh sửa hồ sơ
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Certifications Section */}
      <div className="max-w-7xl mx-auto mt-6">
        <Card className="border-0 shadow-2xl shadow-blue-100/50 rounded-3xl overflow-hidden">
          <CardContent className="p-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-linear-to-br from-indigo-500 to-purple-600 rounded-xl">
                  <Award className="w-5 h-5 text-white" />
                </div>
                Chứng chỉ
              </h3>
              <Button
                onClick={() => setIsAddingCert(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3 rounded-2xl font-semibold"
              >
                Thêm chứng chỉ
              </Button>
            </div>

            {mentorData.certifications &&
            mentorData.certifications.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mentorData.certifications.map((cert) => (
                  <div
                    key={cert.certificateId}
                    className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl overflow-hidden shadow-md">
                        <Image
                          src={cert.url || "/api/placeholder/64/64"}
                          alt={cert.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-900 text-lg truncate max-w-[200px]">
                            {cert.name}
                          </h4>
                          <div className="flex items-center gap-2">
                            {cert.status === "Accepted" && (
                              <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                <CheckCircle className="w-3 h-3" />
                                Đã duyệt
                              </div>
                            )}
                            {cert.status === "Pending" && (
                              <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                                <Clock className="w-3 h-3" />
                                Chờ duyệt
                              </div>
                            )}
                            {cert.status === "Rejected" && (
                              <div className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                                <AlertCircle className="w-3 h-3" />
                                Bị từ chối
                              </div>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Chứng chỉ chuyên môn
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-2xl border border-gray-200">
                <div className="text-gray-600">Chưa có chứng chỉ.</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                Edit Profile
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                className="p-2"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Thông tin cơ bản
                </h3>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label
                      htmlFor="fullname"
                      className="text-sm font-medium text-gray-700"
                    >
                      Họ và tên
                    </Label>
                    <Input
                      id="fullname"
                      value={formData.fullname}
                      onChange={(e) =>
                        handleInputChange("fullname", e.target.value)
                      }
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="experience"
                      className="text-sm font-medium text-gray-700"
                    >
                      Kinh nghiệm
                    </Label>
                    <Input
                      id="experience"
                      value={formData.experience}
                      onChange={(e) =>
                        handleInputChange("experience", e.target.value)
                      }
                      placeholder="Nhập số năm kinh nghiệm của bạn..."
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="phoneNumber"
                      className="text-sm font-medium text-gray-700"
                    >
                      Số điện thoại
                    </Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) =>
                        handleInputChange("phoneNumber", e.target.value)
                      }
                      className="mt-1"
                      placeholder="Nhập số điện thoại..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
              <Button variant="outline" onClick={handleCancel}>
                Hủy
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={isPending}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isPending ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Certification Modal */}
      {isAddingCert && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="p-2 bg-linear-to-br from-indigo-500 to-purple-600 rounded-xl">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  Thêm chứng chỉ mới
                </h2>
                <Button
                  onClick={handleCancelCert}
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-6">
                {/* Certification Name */}
                <div>
                  <Label
                    htmlFor="certName"
                    className="text-sm font-medium text-gray-700 mb-2 block"
                  >
                    Tên chứng chỉ *
                  </Label>
                  <Input
                    id="certName"
                    value={certFormData.name}
                    onChange={(e) =>
                      handleCertInputChange("name", e.target.value)
                    }
                    placeholder="Nhập tên chứng chỉ..."
                    className="w-full"
                  />
                </div>

                {/* Image Upload Section */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">
                    Hình ảnh chứng chỉ *
                  </Label>

                  <FileDropZone
                    onDrop={handleImageDrop}
                    accept="image/*"
                    multiple
                  >
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-blue-400 transition-colors">
                      {uploadedImageUrls.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {uploadedImageUrls.map((url, index) => (
                            <div key={index} className="relative group">
                              <div className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                                <Image
                                  src={url}
                                  alt={`Preview ${index + 1}`}
                                  width={200}
                                  height={200}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <Button
                                onClick={() =>
                                  handleRemoveImage(imageFiles[index])
                                }
                                size="sm"
                                variant="destructive"
                                className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center">
                          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600 mb-2">
                            Kéo thả hình ảnh vào đây hoặc
                          </p>
                          <Button
                            onClick={handleImageClick}
                            variant="outline"
                            className="border-blue-500 text-blue-600 hover:bg-blue-50"
                          >
                            Chọn hình ảnh
                          </Button>
                        </div>
                      )}
                    </div>
                  </FileDropZone>

                  <input
                    type="file"
                    ref={imageInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    multiple
                    className="hidden"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
                <Button
                  onClick={handleCancelCert}
                  variant="outline"
                  className="px-6 py-2"
                >
                  Hủy
                </Button>
                <Button
                  onClick={handleSaveCert}
                  disabled={!certFormData.name || imageFiles.length === 0 || isCertUploadPending}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isCertUploadPending ? "Đang tải lên..." : "Lưu chứng chỉ"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default  ReviewerProfile;