"use client";
import { use, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Home,
  BookOpen,
  Wallet,
  BarChart3,
  User,
  Target,
  Award,
  ChevronRight,
  PlayCircle,
  BookMarked,
  Coins,
  CheckCircle2,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { useGetMeQuery } from "@/hooks/useGetMeQuery";
import { useGetCoinServicePackage } from "@/hooks/coin-hooks/useGetCoinServicePackage";
import PaymentInforSection from "@/components/PaymentInforSection";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

import { useBuyingCoinServicePackages } from "@/features/learner/hooks/servicePackages/useBuyingServicePackageMutation";
import { toast } from "sonner";
import Image from "next/image";

export default function LearnerDashboard() {
  const [activeMenu, setActiveMenu] = useState("overview");
  const [loadingPackageId, setLoadingPackageId] = useState<string | null>(null);
  const [showCoinModal, setShowCoinModal] = useState(false);
  const [qrCodeImage, setQrCodeImage] = useState<string | null>(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const { data: userData } = useGetMeQuery();
  const { data: coinPackages } = useGetCoinServicePackage();
  const { mutate: buyCoin, isPending } = useBuyingCoinServicePackages();

  const sidebarMenu = [
    { id: "overview", label: "Tổng quan", icon: Home },
    { id: "courses", label: "Lộ trình học", icon: BookOpen },
    { id: "wallet", label: "Ví & Coin", icon: Wallet },
    { id: "progress", label: "Tiến độ", icon: BarChart3 },
    { id: "profile", label: "Hồ sơ", icon: User },
  ];

  const stats = [
    {
      label: "Khoá học đang học",
      value: "2",
      unit: "/ 6 khoá",
      icon: BookOpen,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      label: "Bài luyện phát âm",
      value: "35",
      unit: "exercises",
      icon: Target,
      color: "text-green-500",
      bg: "bg-green-50",
    },
    {
      label: "Điểm phát âm",
      value: "88",
      unit: "/ 100",
      icon: Award,
      color: "text-orange-500",
      bg: "bg-orange-50",
    },
  ];

  // 6 Courses trong level B1 - Tập trung vào Speaking & Pronunciation
  const coursesInB1 = [
    {
      id: 1,
      title: "Basic Pronunciation & Speaking",
      description: "Phát âm cơ bản và luyện nói từng âm tiết",
      progress: 100,
      chapters: 8,
      completedChapters: 8,
      totalExercises: 24,
      completedExercises: 24,
      status: "completed",
      isFree: true,
      price: 0,
    },
    {
      id: 2,
      title: "Everyday Conversation Practice",
      description: "Luyện nói các tình huống giao tiếp hàng ngày",
      progress: 60,
      chapters: 10,
      completedChapters: 6,
      totalExercises: 30,
      completedExercises: 18,
      status: "in-progress",
      nextChapter: "Chapter 7: At the Restaurant - Speaking",
      isFree: false,
      price: 299,
      isPurchased: true,
    },
    {
      id: 3,
      title: "Workplace Communication Skills",
      description: "Luyện nói trong môi trường công việc chuyên nghiệp",
      progress: 0,
      chapters: 12,
      completedChapters: 0,
      totalExercises: 36,
      completedExercises: 0,
      status: "locked",
      isFree: false,
      price: 399,
      isPurchased: false,
    },
    {
      id: 4,
      title: "Advanced Pronunciation Mastery",
      description: "Phát âm nâng cao, giọng điệu và nhấn âm chuẩn",
      progress: 0,
      chapters: 10,
      completedChapters: 0,
      totalExercises: 40,
      completedExercises: 0,
      status: "locked",
      isFree: false,
      price: 449,
      isPurchased: false,
    },
    {
      id: 5,
      title: "Fluency & Natural Speaking",
      description: "Nói trơn tru tự nhiên như người bản xứ",
      progress: 0,
      chapters: 9,
      completedChapters: 0,
      totalExercises: 27,
      completedExercises: 0,
      status: "locked",
      isFree: false,
      price: 499,
      isPurchased: false,
    },
    {
      id: 6,
      title: "Public Speaking & Presentation",
      description: "Kỹ năng thuyết trình và nói trước đám đông",
      progress: 0,
      chapters: 11,
      completedChapters: 0,
      totalExercises: 33,
      completedExercises: 0,
      status: "locked",
      isFree: false,
      price: 599,
      isPurchased: false,
    },
  ];
  const handleBuyCoin = (servicePackageId: string) => {
    // set loading for this package id so the button shows spinner/disabled state
    setLoadingPackageId(servicePackageId);

    // Trigger mutation and clear loading only when mutation finishes (success or error)
    buyCoin(
      { servicePackageId },
      {
        onSuccess: (data) => {
          setQrCodeImage(data.qrBase64);
          setShowCoinModal(false);
          setShowQrModal(true);
          console.log("QR url:", data.qrBase64);
        },

        onSettled: () => {
          // always clear loading state when mutation is settled
          setLoadingPackageId(null);
        },
      }
    );
  };

  // Copy current QR (data URL) to clipboard
  const copyQrToClipboard = async () => {
    if (!qrCodeImage) return;
    try {
      await navigator.clipboard.writeText(qrCodeImage);
      toast.success("Đã sao chép QR vào clipboard");
    } catch (err) {
      console.error(err);
      toast.error("Không thể sao chép QR");
    }
  };

  // Download current QR as an image file
  const downloadQrImage = () => {
    if (!qrCodeImage) return;
    const link = document.createElement("a");
    link.href = qrCodeImage;
    link.download = "speakai_qr.png";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            SpeakAI
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            English Learning Platform
          </p>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4">
          {sidebarMenu.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id)}
              className={`w-full cursor-pointer flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-all duration-200 ${
                activeMenu === item.id
                  ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 shadow-sm"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
              {userData?.fullName.charAt(0)}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">
                {userData?.fullName}
              </p>
              <p className="text-xs text-gray-500">
                Level {userData?.learnerProfile?.level}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Chào mừng trở lại, {userData?.fullName}! 👋
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Tiếp tục hành trình học tiếng Anh của bạn
              </p>
            </div>
            <div className="flex items-center gap-3 bg-gradient-to-r from-yellow-50 to-amber-50 px-4 py-2 rounded-lg border border-yellow-200">
              <Coins className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-xs text-gray-500">Số dư Coin</p>
                <p className="text-lg font-bold text-gray-900">
                  {userData?.coinBalance}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8">
          {/* Level Information Banner */}
          <Card className="mb-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-6 border-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                  <span className="text-4xl font-bold text-indigo-600">
                    {userData?.learnerProfile?.level}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-indigo-100 mb-1">
                    Kết quả Test đầu vào: Level{" "}
                    {userData?.learnerProfile?.level}
                  </p>
                  <h3 className="text-2xl font-bold mb-2">
                    Luyện Speaking & Pronunciation Level{" "}
                    {userData?.learnerProfile?.level}
                  </h3>
                  <p className="text-indigo-100">
                    Hoàn thành 6 khoá luyện nói để lên Level B2
                  </p>
                </div>
              </div>
              <Button
                onClick={() => setShowCoinModal(true)}
                className="bg-white cursor-pointer text-indigo-600 hover:bg-indigo-50 font-semibold"
              >
                <Wallet className="w-4 h-4 mr-2" />
                Nạp Coin
              </Button>
            </div>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, idx) => (
              <Card
                key={idx}
                className="p-6 bg-white border border-gray-200 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium mb-2">
                      {stat.label}
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-gray-900">
                        {stat.value}
                      </span>
                      <span className="text-sm text-gray-500">{stat.unit}</span>
                    </div>
                  </div>
                  <div className={`${stat.bg} p-3 rounded-lg`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Courses Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  🎤 Lộ trình luyện Speaking & Pronunciation Level B1
                </h3>
                <p className="text-gray-500 mt-1">
                  6 khoá học chuyên sâu về phát âm và giao tiếp - Khoá 1 miễn
                  phí
                </p>
              </div>
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {coursesInB1.map((course) => (
                <Card
                  key={course.id}
                  className={`p-6 bg-white border transition-all duration-200 relative overflow-hidden ${
                    course.status === "locked" && !course.isPurchased
                      ? "border-gray-200 opacity-75"
                      : "border-gray-200 hover:shadow-xl hover:border-blue-300"
                  }`}
                >
                  {/* Free/Premium Badge */}
                  <div className="absolute top-4 right-4">
                    {course.isFree ? (
                      <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        MIỄN PHÍ
                      </span>
                    ) : course.isPurchased ? (
                      <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        ĐÃ MUA
                      </span>
                    ) : (
                      <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                        <Coins className="w-3 h-3" />
                        {course.price} COIN
                      </span>
                    )}
                  </div>

                  {/* Course Header */}
                  <div className="flex items-start justify-between mb-4 pr-20">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-lg font-bold text-gray-900">
                          {course.title}
                        </h4>
                        {course.status === "completed" && (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mb-3">
                        {course.description}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {(course.isFree || course.isPurchased) && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600">
                          {course.completedChapters}/{course.chapters} Chapters
                          luyện nói
                        </span>
                        <span className="text-sm font-bold text-blue-600">
                          {course.progress}%
                        </span>
                      </div>
                      <Progress
                        value={course.progress}
                        className={`h-2 ${
                          course.status === "completed"
                            ? "bg-green-100"
                            : "bg-gray-100"
                        }`}
                      />
                    </div>
                  )}

                  {/* Course Stats */}
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <BookMarked className="w-4 h-4" />
                      <span>{course.totalExercises} Bài luyện phát âm</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="w-4 h-4" />
                      <span>{course.chapters} Chapters</span>
                    </div>
                  </div>

                  {/* Next Chapter Info */}
                  {course.status === "in-progress" && course.nextChapter && (
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-4">
                      <p className="text-xs text-blue-600 font-medium mb-1">
                        🎯 Bài luyện nói tiếp theo
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {course.nextChapter}
                      </p>
                    </div>
                  )}

                  {/* Locked Course Info */}
                  {!course.isFree && !course.isPurchased && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                      <p className="text-xs text-amber-700 font-medium mb-1">
                        💎 Khoá học Premium
                      </p>
                      <p className="text-sm text-gray-700">
                        Mở khoá với {course.price} coin để học
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {course.status === "completed" && (
                      <>
                        <Button
                          variant="outline"
                          className="flex-1 border-green-200 text-green-600 hover:bg-green-50"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Đã hoàn thành
                        </Button>
                        <Button variant="outline" className="px-4">
                          <BookOpen className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                    {course.status === "in-progress" && (
                      <>
                        <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                          <PlayCircle className="w-4 h-4 mr-2" />
                          Tiếp tục luyện nói
                        </Button>
                        <Button variant="outline" className="px-4">
                          <BookOpen className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                    {course.status === "locked" && course.isFree && (
                      <Button className="flex-1 bg-green-600 hover:bg-green-700">
                        <PlayCircle className="w-4 h-4 mr-2" />
                        Bắt đầu học miễn phí
                      </Button>
                    )}
                    {course.status === "locked" &&
                      !course.isFree &&
                      !course.isPurchased && (
                        <>
                          <Button className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white">
                            <Coins className="w-4 h-4 mr-2" />
                            Mở khoá {course.price} coin
                          </Button>
                          <Button variant="outline" className="px-4">
                            <BookOpen className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    {course.status === "locked" && course.isPurchased && (
                      <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                        <PlayCircle className="w-4 h-4 mr-2" />
                        Bắt đầu học
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Progress Summary */}
          <Card className="mt-8 p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-1">
                    🎯 Tiến độ luyện Speaking Level B1
                  </h4>
                  <p className="text-gray-600">
                    Đã hoàn thành 1/6 khoá (17%) - Đã mua thêm 1 khoá Premium
                  </p>
                </div>
              </div>
              <Button className="bg-green-600 hover:bg-green-700">
                Xem chi tiết
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </Card>
        </div>
      </main>

      {/* Coin Purchase Modal */}
      <Dialog open={showCoinModal} onOpenChange={setShowCoinModal}>
        <DialogContent className="max-w-[870px] max-h-[100vh] overflow-hidden py-13">
          <VisuallyHidden>
            <DialogTitle>Nạp Coin</DialogTitle>
          </VisuallyHidden>
          {/* Header Section with Gradient */}
          <div className="bg-gradient-to-br from-red-100 via-orange-100 to-pink-200 py-2 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Coins className="w-7 h-7 text-black" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold">Nạp Coin</h2>
                  <p className="text-black/90 text-sm">
                    Mở khóa khóa học Premium và nâng cao kỹ năng
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Packages Section */}
          <div className="p-8 max-h-[calc(90vh-280px)] overflow-y-auto">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Chọn gói Coin phù hợp
              </h3>
              <p className="text-gray-500 text-sm">
                Gói càng lớn, bonus càng nhiều! Tiết kiệm hơn cho bạn
              </p>
            </div>

            {/* Packages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {coinPackages?.data?.map((pkg, index) => {
                const hasBonus = pkg.bonusPercent > 0;

                return (
                  <div key={pkg.servicePackageId} className="relative group">
                    <Card className="relative overflow-hidden transition-all duration-300 cursor-pointer h-full border-2 border-gray-200 hover:border-blue-400 hover:shadow-xl">
                      {/* Bonus Badge */}
                      {hasBonus && (
                        <div className="absolute top-0 right-0 z-10">
                          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-bl-xl">
                            +{pkg.bonusPercent}% BONUS
                          </div>
                        </div>
                      )}

                      <div className="p-6">
                        {/* Package Name */}
                        <div className="mb-4">
                          <h4 className="text-xl font-bold text-gray-900 mb-2">
                            {pkg.name}
                          </h4>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {pkg.description}
                          </p>
                        </div>

                        {/* Coin Display - Large */}
                        <div className="my-6 text-center py-6 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl border-2 border-yellow-200">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <Coins className="w-10 h-10 text-yellow-500" />
                            <span className="text-5xl font-black bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                              {pkg.numberOfCoin}
                            </span>
                          </div>
                          <p className="text-gray-600 font-semibold">Coin</p>

                          {/* {hasBonus && (
                            <div className="mt-3 pt-3 border-t border-yellow-300">
                              <div className="inline-flex items-center gap-2 bg-green-100 px-3 py-1 rounded-full">
                                <span className="text-sm text-gray-700">
                                  {pkg.numberOfCoin.toLocaleString()} coin
                                </span>
                                <span className="text-xs text-green-700 font-bold">
                                  +{" "}
                                  {(
                                    (pkg.numberOfCoin * pkg.bonusPercent) /
                                    100
                                  ).toLocaleString()}{" "}
                                  bonus 🎁
                                </span>
                              </div>
                            </div>
                          )} */}
                        </div>

                        {/* Price Section */}
                        <div className="mb-5 text-center">
                          <div className="flex items-baseline justify-center gap-2 mb-1">
                            <span className="text-3xl font-black text-blue-600">
                              {pkg.price.toLocaleString()}
                            </span>
                            <span className="text-xl text-gray-600 font-semibold">
                              ₫
                            </span>
                          </div>
                        </div>

                        {/* Buy Button */}
                        <Button
                          onClick={() => handleBuyCoin(pkg.servicePackageId)}
                          disabled={loadingPackageId === pkg.servicePackageId}
                          className="w-full h-12 cursor-pointer font-bold text-base transition-all duration-300 shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          {loadingPackageId === pkg.servicePackageId ? (
                            <>
                              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                              Đang xử lý...
                            </>
                          ) : (
                            <>
                              <Wallet className="w-5 h-5 mr-2" />
                              Mua ngay
                              <ChevronRight className="w-5 h-5 ml-1" />
                            </>
                          )}
                        </Button>
                      </div>
                    </Card>
                  </div>
                );
              })}
            </div>

            {/* Loading State */}
            {!coinPackages?.data && (
              <div className="text-center py-12">
                <div className="inline-block w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500 font-medium">
                  Đang tải các gói coin...
                </p>
              </div>
            )}

            {/* No Packages */}
            {coinPackages?.data?.length === 0 && (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Coins className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">
                  Hiện tại chưa có gói coin nào
                </p>
              </div>
            )}

            {/* Payment Info Section */}
            <PaymentInforSection />
          </div>
        </DialogContent>
      </Dialog>

      {/* QR Code Payment Modal */}
      <Dialog open={showQrModal} onOpenChange={setShowQrModal}>
        <DialogContent className="max-w-3xl">
          <VisuallyHidden>
            <DialogTitle>QR Code Thanh Toán</DialogTitle>
          </VisuallyHidden>

          <div className="p-6">
            <div className="flex items-start gap-6">
              {/* LEFT: QR container */}
              <div className="flex-shrink-0">
                <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-200 p-6 flex items-center justify-center">
                  <div className="w-72 h-72 bg-white p-4 rounded-xl flex items-center justify-center">
                    <img
                      src={qrCodeImage || ""}
                      alt="QR Code thanh toán"
                      className="w-full h-full object-contain rounded"
                    />
                  </div>

                  {/* Scanning Line */}
                  <div className="absolute inset-0 pointer-events-none rounded-3xl">
                    <div className="absolute left-4 right-4 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-scan shadow-[0_0_20px_rgba(59,130,246,0.6)] rounded-full" />
                  </div>
                </div>

                {/* small actions */}
                <div className="mt-4 flex gap-3">
                  <Button
                    variant="outline"
                    onClick={downloadQrImage}
                    className="flex-1 cursor-pointer"
                  >
                    Tải xuống
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={copyQrToClipboard}
                    className="flex-1 cursor-pointer"
                  >
                    Sao chép
                  </Button>
                </div>
              </div>

              {/* RIGHT: Payment details / instructions */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                      <Wallet className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        Quét mã QR để thanh toán
                      </h3>
                      <p className="text-sm text-gray-500">
                        Mở ứng dụng ngân hàng, chọn quét mã QR và quét mã phía
                        bên trái.
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600">Số tiền</p>
                      <p className="font-semibold text-gray-900">
                        Xác nhận trong app ngân hàng
                      </p>
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      Giao dịch sẽ được ghi có tự động khi hoàn tất thanh toán.
                    </p>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Hướng dẫn nhanh
                    </p>
                    <ol className="text-sm text-gray-600 list-decimal list-inside space-y-1">
                      <li>Mở app ngân hàng hoặc ví có hỗ trợ quét QR</li>
                      <li>Chọn chức năng Quét QR</li>
                      <li>Hướng camera tới mã QR bên trái</li>
                      <li>Xác nhận thanh toán trong app</li>
                    </ol>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span className="inline-block px-3 py-1 rounded bg-green-50 text-green-800 font-medium">
                      An toàn • mã hóa
                    </span>
                    <span>
                      Hết hạn sau:{" "}
                      <strong className="text-gray-900">15 phút</strong>
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowQrModal(false);
                      setQrCodeImage(null);
                    }}
                    className="flex-1 cursor-pointer"
                  >
                    Đóng
                  </Button>

                  <Button
                    onClick={() => {
                      setShowQrModal(false);
                      setShowCoinModal(true);
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 cursor-pointer"
                  >
                    Chọn gói khác
                  </Button>
                </div>
              </div>
            </div>

            {/* Loading overlay kept so user knows mutation is in progress */}
            {isPending && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg">
                <div className="text-center">
                  <div className="inline-block w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-600 font-medium">Đang xử lý...</p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
