"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
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
import { changePasswordService } from "@/features/shared/services/authService";
import { Eye, EyeOff, Lock } from "lucide-react";
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
  const [openChangePassword, setOpenChangePassword] = useState(false);
const [currentPassword, setCurrentPassword] = useState("");
const [newPassword, setNewPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [isChanging, setIsChanging] = useState(false);
  const [formData, setFormData] = useState({
    fullname: meData?.fullName || "",
    experience: meData?.reviewerProfile?.experience || "",
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
  const derivedLevel =
    (profileData as { level?: string } | undefined)?.level ??
    (meData?.reviewerProfile as { level?: string } | undefined)?.level ??
    meData?.reviewerProfile?.levels ??
    "___";

  const mentorData = {
    id: profileData?.reviewerProfileId || "",
    name: meData?.fullName || "Name not provided",
    avatar: meData?.avatarUrl || "/api/placeholder/150/150",
    rating: profileData?.rating || 0,
    totalReviews: 0, // TODO: Get from API if available
    totalFeedbacks: 0, // TODO: Get from API if available
    yearsExperience:
      profileData?.experience ??
      profileData?.yearsExperience ??
      meData?.reviewerProfile?.experience ??
      0,
    level: derivedLevel, // TODO: Get from API if available
    certifications: profileData?.certificates || [],
  };

  const handleChangePassword = async () => {
    // 1. Validate
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }
  
    if (newPassword !== confirmPassword) {
      alert("Mật khẩu xác nhận không khớp");
      return;
    }
  
    try {
      setIsChanging(true);
  
      // 2. Call API
     await changePasswordService({
    currentPassword,
    newPassword,
    confirmPassword,
  });
  
  
      // 3. Thành công
      alert("Đổi mật khẩu thành công");
  
      // reset state
      setOpenChangePassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      alert(error.message || "Đổi mật khẩu thất bại");
    } finally {
      setIsChanging(false);
    }
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
                        {mentorData.yearsExperience} years of experience
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
                          ({mentorData.totalFeedbacks} reviews)
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
                    Qualifications & Expertise
                  </h3>
                  <div className="space-y-5">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-5 rounded-2xl border border-blue-100">
                      <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        Basic Information
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-600">
                            Total certificates:
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
                              Experience
                            </h4>
                            <span className="text-gray-700 font-medium">
                              {mentorData.yearsExperience} years of experience
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
                              Reviews
                            </h4>
                            <span className="text-gray-700 font-medium">
                              {mentorData.rating.toFixed(1)}/5
                              {mentorData.totalFeedbacks > 0 && (
                                <> ({mentorData.totalFeedbacks} reviews)</>
                              )}
                            </span>
                          </div>
                        </div>
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
                  Edit profile
                </Button>

                  <Button
                      variant="outline"
                      className="flex items-center gap-2"
                      onClick={() => setOpenChangePassword(true)}
                    >
                      <Lock className="w-4 h-4" />
                      Đổi mật khẩu
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
                Certificates
              </h3>
              <Button
                onClick={() => setIsAddingCert(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3 rounded-2xl font-semibold"
              >
                Add certificate
              </Button>
            </div>

            {mentorData.certifications &&
            mentorData.certifications.length > 0 ? (
              <div className="relative group">
                <Carousel
                  opts={{
                    align: "start",
                    loop: false,
                  }}
                  className="w-full"
                >
                  <CarouselContent className="-ml-2 md:-ml-4">
                    {mentorData.certifications.map((cert) => (
                      <CarouselItem key={cert.certificateId} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                        <div className="bg-gradient-to-br from-white to-blue-50/50 p-0 rounded-2xl border-2 border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 h-full overflow-hidden">
                          {/* Image Section */}
                          <div className="w-full h-48 md:h-56 lg:h-64 overflow-hidden bg-gray-100">
                            <Image
                              src={cert.url || "/api/placeholder/64/64"}
                              alt={cert.name}
                              width={400}
                              height={300}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          {/* Content Section */}
                          <div className="p-4 md:p-5 space-y-3">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-bold text-gray-900 text-base md:text-lg line-clamp-2 flex-1">
                                {cert.name}
                              </h4>
                            </div>
                            <div className="flex items-center gap-2">
                              {cert.status === "Approved" && (
                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-xs font-semibold border border-green-200">
                                  <CheckCircle className="w-4 h-4" />
                                  Approved
                                </div>
                              )}
                              {cert.status === "Pending" && (
                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold border border-yellow-200">
                                  <Clock className="w-4 h-4" />
                                  Pending approval
                                </div>
                              )}
                              {cert.status === "Rejected" && (
                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 text-red-800 rounded-full text-xs font-semibold border border-red-200">
                                  <AlertCircle className="w-4 h-4" />
                                  Rejected
                                </div>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">
                              Professional certification
                            </p>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  {/* {mentorData.certifications.length > 1 && (
                    <>
                      <CarouselPrevious className="left-0 md:-left-12 bg-white/90 hover:bg-white shadow-lg border-2 border-gray-200 opacity-0 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 z-[100] pointer-events-none md:group-hover:pointer-events-auto hidden md:flex" />
                      <CarouselNext className="right-0 md:-right-12 bg-white/90 hover:bg-white shadow-lg border-2 border-gray-200 opacity-0 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 z-[100] pointer-events-none md:group-hover:pointer-events-auto hidden md:flex" />
                    </>
                  )} */}
                </Carousel>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-2xl border border-gray-200">
                <div className="text-gray-600">No certificates yet.</div>
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
                  Basic information
                </h3>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label
                      htmlFor="fullname"
                      className="text-sm font-medium text-gray-700"
                    >
                      Full name
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
                      Experience
                    </Label>
                    <Input
                      id="experience"
                      value={formData.experience}
                      onChange={(e) =>
                        handleInputChange("experience", e.target.value)
                      }
                      placeholder="Enter your years of experience..."
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="phoneNumber"
                      className="text-sm font-medium text-gray-700"
                    >
                      Phone number
                    </Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) =>
                        handleInputChange("phoneNumber", e.target.value)
                      }
                      className="mt-1"
                      placeholder="Enter your phone number..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={isPending}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isPending ? "Saving..." : "Save changes"}
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
                  Add new certificate
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
                    Certificate name *
                  </Label>
                  <Input
                    id="certName"
                    value={certFormData.name}
                    onChange={(e) =>
                      handleCertInputChange("name", e.target.value)
                    }
                    placeholder="Enter certificate name..."
                    className="w-full"
                  />
                </div>

                {/* Image Upload Section */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">
                    Certificate image *
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
                            Drag and drop images here or
                          </p>
                          <Button
                            onClick={handleImageClick}
                            variant="outline"
                            className="border-blue-500 text-blue-600 hover:bg-blue-50"
                          >
                            Choose images
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
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveCert}
                  disabled={!certFormData.name || imageFiles.length === 0 || isCertUploadPending}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isCertUploadPending ? "Uploading..." : "Save certificate"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Change Password Dialog */}
{openChangePassword && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Lock className="w-5 h-5" />
          Đổi mật khẩu
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setOpenChangePassword(false)}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Body */}
      <div className="p-6 space-y-4">
        <div>
          <Label>Mật khẩu hiện tại</Label>
          <Input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>

        <div>
          <Label>Mật khẩu mới</Label>
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <div>
          <Label>Xác nhận mật khẩu mới</Label>
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
        <Button
          variant="outline"
          onClick={() => setOpenChangePassword(false)}
        >
          Hủy
        </Button>
        <Button
          onClick={handleChangePassword}
          disabled={isChanging}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
        >
          {isChanging ? "Đang xử lý..." : "Đổi mật khẩu"}
        </Button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default  ReviewerProfile;